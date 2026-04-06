import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, protectedProcedure, prisma } from "@/lib/trpc";

export const notificationRouter = router({
  getNotifications: protectedProcedure
    .input(
      z.object({
        page: z.number().int().min(1).default(1),
        unreadOnly: z.boolean().default(false),
      }).optional()
    )
    .query(async ({ ctx, input }) => {
      const page = input?.page ?? 1;
      const unreadOnly = input?.unreadOnly ?? false;
      const limit = 20;

      const where = {
        userId: ctx.session.user.id,
        ...(unreadOnly && { isRead: false }),
      };

      const [notifications, total] = await Promise.all([
        prisma.notification.findMany({
          where,
          orderBy: { createdAt: "desc" },
          take: limit,
          skip: (page - 1) * limit,
        }),
        prisma.notification.count({ where }),
      ]);

      return {
        notifications,
        total,
        pages: Math.ceil(total / limit),
        page,
      };
    }),

  getUnreadCount: protectedProcedure.query(async ({ ctx }) => {
    const count = await prisma.notification.count({
      where: { userId: ctx.session.user.id, isRead: false },
    });
    return { count };
  }),

  markAsRead: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const notif = await prisma.notification.findUnique({ where: { id: input.id } });
      if (!notif || notif.userId !== ctx.session.user.id) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Мэдэгдэл олдсонгүй" });
      }
      return prisma.notification.update({
        where: { id: input.id },
        data: { isRead: true },
      });
    }),

  markAllRead: protectedProcedure.mutation(async ({ ctx }) => {
    await prisma.notification.updateMany({
      where: { userId: ctx.session.user.id, isRead: false },
      data: { isRead: true },
    });
    return { success: true };
  }),

  deleteNotification: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const notif = await prisma.notification.findUnique({ where: { id: input.id } });
      if (!notif || notif.userId !== ctx.session.user.id) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Мэдэгдэл олдсонгүй" });
      }
      return prisma.notification.delete({ where: { id: input.id } });
    }),
});
