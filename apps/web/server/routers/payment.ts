import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, protectedProcedure, prisma } from "@/lib/trpc";
import { createInvoice, checkPayment as qpayCheck } from "@/lib/qpay";

export const paymentRouter = router({
  createQPayInvoice: protectedProcedure
    .input(z.object({ orderId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const order = await prisma.order.findUnique({
        where: { id: input.orderId },
        include: { payment: true, domain: true },
      });

      if (!order) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Order not found" });
      }

      if (order.userId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You do not own this order",
        });
      }

      if (order.status === "PAID") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Order is already paid",
        });
      }

      // If a payment already exists with a QPay invoice, return it
      if (order.payment?.qpayInvoiceId && order.payment.status === "PENDING") {
        return {
          paymentId: order.payment.id,
          invoiceId: order.payment.qpayInvoiceId,
          qrImage: order.payment.qpayQrCode,
        };
      }

      const description = order.domain
        ? `${order.domain.name} домэйн захиалга`
        : `Захиалга #${order.id}`;

      const callbackUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/qpay/callback?orderId=${order.id}`;

      const qpayResponse = await createInvoice({
        orderId: order.id,
        amount: order.amount,
        description,
        callbackUrl,
      });

      const payment = await prisma.payment.create({
        data: {
          orderId: order.id,
          method: "QPAY",
          amount: order.amount,
          status: "PENDING",
          qpayInvoiceId: qpayResponse.invoice_id,
          qpayQrCode: qpayResponse.qr_image,
        },
      });

      return {
        paymentId: payment.id,
        invoiceId: qpayResponse.invoice_id,
        qrImage: qpayResponse.qr_image,
        qrText: qpayResponse.qr_text,
      };
    }),

  checkPayment: protectedProcedure
    .input(z.object({ paymentId: z.string() }))
    .query(async ({ ctx, input }) => {
      const payment = await prisma.payment.findUnique({
        where: { id: input.paymentId },
        include: { order: true },
      });

      if (!payment) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Payment not found",
        });
      }

      if (payment.order.userId !== ctx.session.user.id && ctx.session.user.role !== "ADMIN") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Access denied",
        });
      }

      // Already completed
      if (payment.status === "COMPLETED") {
        return { paid: true, status: payment.status };
      }

      // Check QPay if we have an invoice ID
      if (payment.qpayInvoiceId) {
        const qpayResult = await qpayCheck(payment.qpayInvoiceId);

        if (qpayResult.count > 0 && qpayResult.paid_amount >= payment.amount) {
          const transactionId = qpayResult.rows[0]?.payment_id ?? null;

          await prisma.$transaction(async (tx) => {
            await tx.payment.update({
              where: { id: payment.id },
              data: {
                status: "COMPLETED",
                transactionId,
                paidAt: new Date(),
              },
            });

            await tx.order.update({
              where: { id: payment.orderId },
              data: { status: "PAID" },
            });

            // If the order has a domain, activate it
            if (payment.order.domainId) {
              const expiresAt = new Date();
              expiresAt.setFullYear(expiresAt.getFullYear() + 1);

              await tx.domain.update({
                where: { id: payment.order.domainId },
                data: { status: "ACTIVE", expiresAt },
              });
            }
          });

          return { paid: true, status: "COMPLETED" as const };
        }
      }

      return { paid: false, status: payment.status };
    }),

  getHistory: protectedProcedure.query(async ({ ctx }) => {
    const payments = await prisma.payment.findMany({
      where: {
        order: { userId: ctx.session.user.id },
      },
      include: {
        order: {
          select: {
            id: true,
            type: true,
            amount: true,
            status: true,
            domain: { select: { name: true } },
            subscription: { select: { plan: { select: { name: true } } } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return payments;
  }),
});
