/**
 * QPay Payment Integration
 * Documentation: https://developer.qpay.mn
 *
 * TODO: QPay API credentials тохируулах
 * - QPAY_MERCHANT_ID
 * - QPAY_CLIENT_ID
 * - QPAY_CLIENT_SECRET
 * - QPAY_INVOICE_CODE
 */

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

interface QPayInvoiceResponse {
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

interface QPayPaymentCheckResponse {
  count: number;
  paid_amount: number;
  rows: Array<{
    payment_id: string;
    payment_status: string;
    payment_amount: number;
  }>;
}

const QPAY_BASE_URL =
  process.env.QPAY_ENV === "production"
    ? "https://merchant.qpay.mn/v2"
    : "https://merchant-sandbox.qpay.mn/v2";

let cachedToken: { token: string; expiresAt: number } | null = null;

export async function getQPayToken(): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expiresAt) {
    return cachedToken.token;
  }

  const response = await fetch(`${QPAY_BASE_URL}/auth/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${Buffer.from(
        `${process.env.QPAY_CLIENT_ID}:${process.env.QPAY_CLIENT_SECRET}`
      ).toString("base64")}`,
    },
  });

  if (!response.ok) {
    throw new Error(`QPay auth failed: ${response.statusText}`);
  }

  const data: QPayAuthResponse = await response.json();
  cachedToken = {
    token: data.access_token,
    expiresAt: Date.now() + data.expires_in * 1000 - 60000,
  };

  return data.access_token;
}

export async function createQPayInvoice(params: {
  orderId: string;
  amount: number;
  description: string;
  callbackUrl: string;
}): Promise<QPayInvoiceResponse> {
  const token = await getQPayToken();

  const body: QPayInvoiceRequest = {
    invoice_code: process.env.QPAY_INVOICE_CODE!,
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
    throw new Error(`QPay invoice creation failed: ${response.statusText}`);
  }

  return response.json();
}

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
    throw new Error(`QPay payment check failed: ${response.statusText}`);
  }

  return response.json();
}
