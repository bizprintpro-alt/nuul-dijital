import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifySocialPayCallback } from "@/lib/socialpay";
import type { SocialPayCallbackData } from "@/lib/socialpay";

// SocialPay webhook — called after payment
export async function POST(req: NextRequest) {
  try {
    const body: SocialPayCallbackData = await req.json();

    if (!body.invoice || !body.checksum) {
      return NextResponse.json({ error: "invoice, checksum шаардлагатай" }, { status: 400 });
    }

    // Verify checksum
    const isValid = verifySocialPayCallback(body);
    if (!isValid) {
      console.error("[SOCIALPAY_CALLBACK] Checksum таарахгүй байна:", body.invoice);
      return NextResponse.json({ error: "Checksum буруу" }, { status: 403 });
    }

    if (body.status !== "SUCCESS") {
      return NextResponse.json({ error: "Төлбөр амжилтгүй" }, { status: 400 });
    }

    // Find payment by SocialPay invoice number (stored in transactionId)
    const payment = await prisma.payment.findFirst({
      where: { transactionId: body.invoice },
      include: { order: true },
    });

    if (!payment) {
      console.error("[SOCIALPAY_CALLBACK] Төлбөр олдсонгүй:", body.invoice);
      return NextResponse.json({ error: "Төлбөр олдсонгүй" }, { status: 404 });
    }

    if (payment.status === "COMPLETED") {
      return NextResponse.json({ success: true });
    }

    // Update payment and order status
    await prisma.$transaction([
      prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: "COMPLETED",
          transactionId: body.transactionId ?? body.invoice,
          paidAt: new Date(),
        },
      }),
      prisma.order.update({
        where: { id: payment.orderId },
        data: { status: "PAID" },
      }),
    ]);

    // If domain order, activate domain
    if (payment.order.domainId) {
      const now = new Date();
      const expiresAt = new Date(now);
      expiresAt.setFullYear(expiresAt.getFullYear() + 1);

      await prisma.domain.update({
        where: { id: payment.order.domainId },
        data: { status: "ACTIVE", expiresAt },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[SOCIALPAY_CALLBACK]", error);
    return NextResponse.json({ error: "Webhook алдаа" }, { status: 500 });
  }
}

// SocialPay may also send GET for verification
export async function GET() {
  return NextResponse.json({ status: "ok" });
}
