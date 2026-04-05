/**
 * QPay Payment Integration for nuul.mn
 * Documentation: https://developer.qpay.mn
 *
 * Env vars:
 *   QPAY_USERNAME       - QPay merchant username
 *   QPAY_PASSWORD       - QPay merchant password
 *   QPAY_INVOICE_CODE   - QPay invoice template code
 *   QPAY_ENV            - "production" | "sandbox" (default: sandbox)
 */

// ── Types ──────────────────────────────────────────────────────────

interface QPayAuthResponse {
  token_type: string;
  refresh_expires_in: number;
  refresh_token: string;
  access_token: string;
  expires_in: number;
}

interface QPayInvoiceRequest {
  invoice_code: string;
  sender_invoice_no: string;
  invoice_receiver_code: string;
  invoice_description: string;
  amount: number;
  callback_url: string;
}

export interface QPayInvoiceResponse {
  invoice_id: string;
  qr_text: string;
  qr_image: string;
  qPay_shortUrl: string;
  urls: Array<{
    name: string;
    description: string;
    logo: string;
    link: string;
  }>;
}

export interface QPayPaymentCheckResponse {
  count: number;
  paid_amount: number;
  rows: Array<{
    payment_id: string;
    payment_status: string;
    payment_amount: number;
    payment_currency: string;
    payment_wallet: string;
    transaction_id: string;
  }>;
}

// ── Base URL ───────────────────────────────────────────────────────

const QPAY_BASE_URL =
  process.env.QPAY_ENV === "production"
    ? "https://merchant.qpay.mn/v2"
    : "https://merchant-sandbox.qpay.mn/v2";

// ── Token cache ────────────────────────────────────────────────────

let cachedToken: { token: string; expiresAt: number } | null = null;

/**
 * Authenticate with QPay using Basic auth (username:password).
 * Caches the token until 60s before expiry.
 */
export async function getQPayToken(): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expiresAt) {
    return cachedToken.token;
  }

  const username = process.env.QPAY_USERNAME;
  const password = process.env.QPAY_PASSWORD;

  if (!username || !password) {
    throw new Error(
      "QPay credentials not configured (QPAY_USERNAME / QPAY_PASSWORD)"
    );
  }

  const credentials = Buffer.from(`${username}:${password}`).toString("base64");

  const response = await fetch(`${QPAY_BASE_URL}/auth/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${credentials}`,
    },
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(
      `QPay auth failed: ${response.status} ${response.statusText} — ${text}`
    );
  }

  const data: QPayAuthResponse = await response.json();

  cachedToken = {
    token: data.access_token,
    // Expire 60 seconds early to avoid edge-case token expiry during requests
    expiresAt: Date.now() + data.expires_in * 1000 - 60_000,
  };

  return data.access_token;
}

/**
 * Create a QPay invoice.
 * Returns invoice_id, qr_text, qr_image, and bank deep-link urls.
 */
export async function createQPayInvoice(params: {
  orderId: string;
  amount: number;
  description: string;
  callbackUrl: string;
}): Promise<QPayInvoiceResponse> {
  const token = await getQPayToken();

  const invoiceCode = process.env.QPAY_INVOICE_CODE;
  if (!invoiceCode) {
    throw new Error("QPAY_INVOICE_CODE is not configured");
  }

  const body: QPayInvoiceRequest = {
    invoice_code: invoiceCode,
    sender_invoice_no: params.orderId,
    invoice_receiver_code: "terminal",
    invoice_description: params.description,
    amount: params.amount,
    callback_url: params.callbackUrl,
  };

  const response = await fetch(`${QPAY_BASE_URL}/invoice`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(
      `QPay invoice creation failed: ${response.status} ${response.statusText} — ${text}`
    );
  }

  return response.json();
}

/**
 * Check payment status for a QPay invoice.
 * Returns count of payments, total paid_amount, and individual payment rows.
 */
export async function checkQPayPayment(
  invoiceId: string
): Promise<QPayPaymentCheckResponse> {
  const token = await getQPayToken();

  const response = await fetch(`${QPAY_BASE_URL}/payment/check`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      object_type: "INVOICE",
      object_id: invoiceId,
    }),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(
      `QPay payment check failed: ${response.status} ${response.statusText} — ${text}`
    );
  }

  return response.json();
}
