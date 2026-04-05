import { NextRequest, NextResponse } from "next/server";
import { createQPayInvoice, checkQPayPayment } from "@/lib/qpay";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body;

    // ── Create invoice ───────────────────────────────────────────
    if (action === "create") {
      const { orderId, amount, description } = body;

      if (!orderId || !amount) {
        return NextResponse.json(
          { success: false, error: "orderId болон amount шаардлагатай" },
          { status: 400 }
        );
      }

      const callbackUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/payments/qpay`;

      const invoice = await createQPayInvoice({
        orderId,
        amount,
        description: description || `nuul.mn захиалга #${orderId}`,
        callbackUrl,
      });

      // Save QPay invoice info to payment record
      await prisma.payment.upsert({
        where: { orderId },
        update: {
          qpayInvoiceId: invoice.invoice_id,
          qpayQrCode: invoice.qr_image,
          method: "QPAY",
        },
        create: {
          orderId,
          method: "QPAY",
          amount,
          status: "PENDING",
          qpayInvoiceId: invoice.invoice_id,
          qpayQrCode: invoice.qr_image,
        },
      });

      return NextResponse.json({
        success: true,
        invoiceId: invoice.invoice_id,
        qrImage: invoice.qr_image,
        qrText: invoice.qr_text,
        urls: invoice.urls,
      });
    }

    // ── Check payment status ─────────────────────────────────────
    if (action === "check") {
      const { invoiceId } = body;

      if (!invoiceId) {
        return NextResponse.json(
          { success: false, error: "invoiceId шаардлагатай" },
          { status: 400 }
        );
      }

      const result = await checkQPayPayment(invoiceId);

      if (result.count > 0 && result.paid_amount > 0) {
        // Find and update the payment + order
        const payment = await prisma.payment.findFirst({
          where: { qpayInvoiceId: invoiceId },
        });

        if (payment) {
          const firstRow = result.rows[0];

          await prisma.payment.update({
            where: { id: payment.id },
            data: {
              status: "COMPLETED",
              transactionId: firstRow?.transaction_id ?? null,
              paidAt: new Date(),
            },
          });

          await prisma.order.update({
            where: { id: payment.orderId },
            data: { status: "PAID" },
          });
        }

        return NextResponse.json({
          success: true,
          paid: true,
          paidAmount: result.paid_amount,
        });
      }

      return NextResponse.json({ success: true, paid: false });
    }

    // ── QPay callback (webhook) ──────────────────────────────────
    if (action === "callback") {
      // QPay sends callback with invoice info after successful payment
      const { invoice_id } = body;

      if (!invoice_id) {
        return NextResponse.json(
          { success: false, error: "invoice_id шаардлагатай" },
          { status: 400 }
        );
      }

      // Verify payment with QPay to prevent spoofed callbacks
      const result = await checkQPayPayment(invoice_id);

      if (result.count > 0 && result.paid_amount > 0) {
        const payment = await prisma.payment.findFirst({
          where: { qpayInvoiceId: invoice_id },
        });

        if (payment && payment.status !== "COMPLETED") {
          const firstRow = result.rows[0];

          await prisma.payment.update({
            where: { id: payment.id },
            data: {
              status: "COMPLETED",
              transactionId: firstRow?.transaction_id ?? null,
              paidAt: new Date(),
            },
          });

          await prisma.order.update({
            where: { id: payment.orderId },
            data: { status: "PAID" },
          });
        }

        return NextResponse.json({ success: true });
      }

      // Payment not confirmed by QPay
      return NextResponse.json(
        { success: false, error: "Төлбөр баталгаажаагүй" },
        { status: 400 }
      );
    }

    // ── Unknown action ───────────────────────────────────────────
    return NextResponse.json(
      {
        success: false,
        error: "Тодорхойгүй action. create | check | callback ашиглана уу",
      },
      { status: 400 }
    );
  } catch (error) {
    console.error("QPay API error:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "QPay үйлдэл гүйцэтгэхэд алдаа гарлаа",
      },
      { status: 500 }
    );
  }
}
