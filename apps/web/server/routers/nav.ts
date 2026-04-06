import { z } from "zod";
import { TRPCError } from "@trpc/server";
import {
  router,
  publicProcedure,
  protectedProcedure,
  prisma,
} from "@/lib/trpc";

/* ── Admin guard ── */
const adminProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  if (ctx.session.user.role !== "ADMIN") {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Админ эрх шаардлагатай",
    });
  }
  return next({ ctx });
});

export const navRouter = router({
  /* ═══════════ PUBLIC ═══════════ */

  getNavItems: publicProcedure.query(async () => {
    return prisma.navItem.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    });
  }),

  /* ═══════════ ADMIN ═══════════ */

  adminGetNavItems: adminProcedure.query(async () => {
    return prisma.navItem.findMany({
      orderBy: { order: "asc" },
    });
  }),

  adminCreateNavItem: adminProcedure
    .input(
      z.object({
        label: z.string().min(1),
        labelEn: z.string().optional(),
        href: z.string().min(1),
        openInNew: z.boolean().optional().default(false),
        isActive: z.boolean().optional().default(true),
      })
    )
    .mutation(async ({ input }) => {
      const maxOrder = await prisma.navItem.aggregate({
        _max: { order: true },
      });
      const nextOrder = (maxOrder._max.order ?? 0) + 1;

      return prisma.navItem.create({
        data: {
          label: input.label,
          labelEn: input.labelEn,
          href: input.href,
          openInNew: input.openInNew,
          isActive: input.isActive,
          order: nextOrder,
        },
      });
    }),

  adminUpdateNavItem: adminProcedure
    .input(
      z.object({
        id: z.string(),
        label: z.string().min(1).optional(),
        labelEn: z.string().optional(),
        href: z.string().min(1).optional(),
        openInNew: z.boolean().optional(),
        isActive: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      return prisma.navItem.update({ where: { id }, data });
    }),

  adminDeleteNavItem: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      return prisma.navItem.delete({ where: { id: input.id } });
    }),

  adminReorderNavItems: adminProcedure
    .input(z.object({ ids: z.array(z.string()) }))
    .mutation(async ({ input }) => {
      const updates = input.ids.map((id, index) =>
        prisma.navItem.update({
          where: { id },
          data: { order: index },
        })
      );
      await prisma.$transaction(updates);
      return { success: true };
    }),

  adminToggleNavItem: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const item = await prisma.navItem.findUnique({
        where: { id: input.id },
      });
      if (!item) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Меню олдсонгүй" });
      }
      return prisma.navItem.update({
        where: { id: input.id },
        data: { isActive: !item.isActive },
      });
    }),
});
