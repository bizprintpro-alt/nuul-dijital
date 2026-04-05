import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, protectedProcedure, prisma } from "@/lib/trpc";

export const orderRouter = router({
  getOrders: protectedProcedure
    .input(
      z.object({
        status: z
          .enum(["PENDING", "PAID", "FAILED", "CANCELLED", "REFUNDED"])
          .optional(),
        page: z.number().int().min(1).default(1),
        limit: z.number().int().min(1).max(100).default(10),
      })
    )
    .query(async ({ ctx, input }) => {
      const isAdmin = ctx.session.user.role === "ADMIN";
      const where = {
        ...(isAdmin ? {} : { userId: ctx.session.user.id }),
        ...(input.status ? { status: input.status } : {}),
      };

      const [orders, total] = await Promise.all([
        prisma.order.findMany({
          where,
          include: {
            payment: true,
            domain: { select: { id: true, name: true, tld: true, status: true } },
            subscription: {
              select: { id: true, status: true, startAt: true, endAt: true, plan: true },
            },
            user: { select: { id: true, name: true, email: true } },
          },
          orderBy: { createdAt: "desc" },
          skip: (input.page - 1) * input.limit,
          take: input.limit,
        }),
        prisma.order.count({ where }),
      ]);

      return {
        orders,
        total,
        pages: Math.ceil(total / input.limit),
        page: input.page,
      };
    }),

  getOrder: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const order = await prisma.order.findUnique({
        where: { id: input.id },
        include: {
          payment: true,
          domain: true,
          subscription: { include: { plan: true } },
          user: { select: { id: true, name: true, email: true } },
        },
      });

      if (!order) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Order not found" });
      }

      const isAdmin = ctx.session.user.role === "ADMIN";
      if (!isAdmin && order.userId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Access denied",
        });
      }

      return order;
    }),

  updateStatus: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        status: z.enum(["PENDING", "PAID", "FAILED", "CANCELLED", "REFUNDED"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.session.user.role !== "ADMIN") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Admin access required",
        });
      }

      const order = await prisma.order.findUnique({
        where: { id: input.id },
      });

      if (!order) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Order not found" });
      }

      const updated = await prisma.order.update({
        where: { id: input.id },
        data: { status: input.status },
      });

      return updated;
    }),
});
