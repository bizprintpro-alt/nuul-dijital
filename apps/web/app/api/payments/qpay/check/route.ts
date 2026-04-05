import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { checkPayment } from "@/lib/qpay";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Нэвтрэх шаардлагатай" }, { status: 401 });
    }

    const { invoiceId, orderId } = await req.json();

    if (!invoiceId) {
      return NextResponse.json({ error: "invoiceId шаардлагатай" }, { status: 400 });
    }

    const result = await checkPayment(invoiceId);

    if (result.count > 0 && result.paid_amount > 0) {
      const firstRow = result.rows[0];

      // Find payment and update
      const payment = await prisma.payment.findFirst({
        where: { qpayInvoiceId: invoiceId },
      });

      if (payment && payment.status !== "COMPLETED") {
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
      }

      return NextResponse.json({
        success: true,
        paid: true,
        amount: result.paid_amount,
        transactionId: firstRow?.transaction_id,
      });
    }

    return NextResponse.json({ success: true, paid: false });
  } catch (error) {
    console.error("[QPAY_CHECK]", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Төлбөр шалгахад алдаа" },
      { status: 500 },
    );
  }
}
