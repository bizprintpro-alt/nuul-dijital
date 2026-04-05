import { NextRequest, NextResponse } from "next/server";
import { createQPayInvoice, checkQPayPayment } from "@/lib/qpay";

// Create QPay invoice
export async function POST(req: NextRequest) {
  try {
    const { orderId, amount, description } = await req.json();

    const callbackUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/payments/qpay/callback?orderId=${orderId}`;

    const invoice = await createQPayInvoice({
      orderId,
      amount,
      description,
      callbackUrl,
    });

    // TODO: Save invoice ID to database (payment record)

    return NextResponse.json({
      success: true,
      invoiceId: invoice.invoice_id,
      qrImage: invoice.qr_image,
      qrText: invoice.qr_text,
      urls: invoice.urls,
    });
  } catch (error) {
    console.error("QPay invoice error:", error);
    return NextResponse.json(
      { success: false, error: "Төлбөр үүсгэхэд алдаа гарлаа" },
      { status: 500 }
    );
  }
}

// QPay callback - payment verification
export async function GET(req: NextRequest) {
  const orderId = req.nextUrl.searchParams.get("orderId");
  const invoiceId = req.nextUrl.searchParams.get("invoiceId");

  if (!orderId || !invoiceId) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  try {
    const result = await checkQPayPayment(invoiceId);

    if (result.count > 0 && result.paid_amount > 0) {
      // TODO: Update order status to PAID in database
      // TODO: Update payment record with transaction details
      return NextResponse.json({ success: true, paid: true });
    }

    return NextResponse.json({ success: true, paid: false });
  } catch (error) {
    console.error("QPay callback error:", error);
    return NextResponse.json(
      { success: false, error: "Төлбөр шалгахад алдаа гарлаа" },
      { status: 500 }
    );
  }
}
