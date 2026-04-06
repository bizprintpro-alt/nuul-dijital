import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, publicProcedure, protectedProcedure, prisma } from "@/lib/trpc";

const adminProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  if (ctx.session.user.role !== "ADMIN") {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Админ эрх шаардлагатай",
    });
  }
  return next({ ctx });
});

export const settingsRouter = router({
  getPublicSettings: publicProcedure.query(async () => {
    const settings = await prisma.siteSetting.findMany({
      where: {
        group: { in: ["general", "contact", "features"] },
      },
    });

    const grouped: Record<string, Record<string, string>> = {};
    for (const s of settings) {
      if (!grouped[s.group]) grouped[s.group] = {};
      grouped[s.group][s.key] = s.value;
    }
    return grouped;
  }),

  getAdminSettings: adminProcedure.query(async () => {
    const settings = await prisma.siteSetting.findMany({
      orderBy: { key: "asc" },
    });

    const grouped: Record<string, Array<{ key: string; value: string; type: string; label: string }>> = {};
    for (const s of settings) {
      if (!grouped[s.group]) grouped[s.group] = [];
      grouped[s.group].push({
        key: s.key,
        value: s.value,
        type: s.type,
        label: s.label,
      });
    }
    return grouped;
  }),

  updateSetting: adminProcedure
    .input(z.object({ key: z.string(), value: z.string() }))
    .mutation(async ({ input }) => {
      await prisma.siteSetting.upsert({
        where: { key: input.key },
        update: { value: input.value },
        create: {
          key: input.key,
          value: input.value,
          type: "text",
          group: "general",
          label: input.key,
        },
      });
      return { success: true };
    }),

  updateSettings: adminProcedure
    .input(
      z.object({
        settings: z.record(z.string(), z.string()),
      })
    )
    .mutation(async ({ input }) => {
      const promises = Object.entries(input.settings).map(([key, value]) =>
        prisma.siteSetting.upsert({
          where: { key },
          update: { value },
          create: {
            key,
            value,
            type: "text",
            group: "general",
            label: key,
          },
        })
      );
      await Promise.all(promises);
      return { success: true };
    }),
});
