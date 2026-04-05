import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkPayment } from "@/lib/qpay";

// QPay webhook — called by QPay after successful payment
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const invoiceId = body.invoice_id;

    if (!invoiceId) {
      return NextResponse.json({ error: "invoice_id шаардлагатай" }, { status: 400 });
    }

    // Verify with QPay API (prevent spoofed callbacks)
    const result = await checkPayment(invoiceId);

    if (result.count > 0 && result.paid_amount > 0) {
      const payment = await prisma.payment.findFirst({
        where: { qpayInvoiceId: invoiceId },
      });

      if (payment && payment.status !== "COMPLETED") {
        const firstRow = result.rows[0];

        await prisma.$transaction([
          prisma.payment.update({
            where: { id: payment.id },
            data: {
              status: "COMPLETED",
              transactionId: firstRow?.transaction_id ?? null,
              paidAt: new Date(),
            },
          }),
          prisma.order.update({
            where: { id: payment.orderId },
            data: { status: "PAID" },
          }),
        ]);

        // If domain order, activate domain
        const order = await prisma.order.findUnique({
          where: { id: payment.orderId },
          select: { domainId: true },
        });

        if (order?.domainId) {
          const now = new Date();
          const expiresAt = new Date(now);
          expiresAt.setFullYear(expiresAt.getFullYear() + 1);

          await prisma.domain.update({
            where: { id: order.domainId },
            data: { status: "ACTIVE", expiresAt },
          });
        }
      }

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Төлбөр баталгаажаагүй" }, { status: 400 });
  } catch (error) {
    console.error("[QPAY_CALLBACK]", error);
    return NextResponse.json({ error: "Webhook алдаа" }, { status: 500 });
  }
}

// QPay may also send GET for verification
export async function GET() {
  return NextResponse.json({ status: "ok" });
}
