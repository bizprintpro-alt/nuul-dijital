import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { revalidatePath } from "next/cache";
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

export const marketingRouter = router({
  // ── Public ──────────────────────────────────────────────────────
  getPlans: publicProcedure.query(async () => {
    return prisma.marketingPlan.findMany({
      where: { isActive: true },
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
    });
  }),

  // ── Admin ───────────────────────────────────────────────────────
  adminList: adminProcedure.query(async () => {
    return prisma.marketingPlan.findMany({
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
    });
  }),

  adminCreate: adminProcedure
    .input(
      z.object({
        name: z.string().min(1),
        price: z.string().min(1),
        priceSmall: z.boolean().default(false),
        description: z.string().min(1),
        features: z.array(z.string()),
        featured: z.boolean().default(false),
        btnText: z.string().default("Санал авах"),
        btnLink: z.string().default("/contact"),
        order: z.number().int().default(0),
        isActive: z.boolean().default(true),
      })
    )
    .mutation(async ({ input }) => {
      const result = await prisma.marketingPlan.create({ data: input });
      revalidatePath("/");
      return result;
    }),

  adminUpdate: adminProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1).optional(),
        price: z.string().min(1).optional(),
        priceSmall: z.boolean().optional(),
        description: z.string().min(1).optional(),
        features: z.array(z.string()).optional(),
        featured: z.boolean().optional(),
        btnText: z.string().optional(),
        btnLink: z.string().optional(),
        order: z.number().int().optional(),
        isActive: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      const result = await prisma.marketingPlan.update({ where: { id }, data });
      revalidatePath("/");
      return result;
    }),

  adminDelete: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const result = await prisma.marketingPlan.delete({ where: { id: input.id } });
      revalidatePath("/");
      return result;
    }),

  adminSeedDefaults: adminProcedure.mutation(async () => {
    const count = await prisma.marketingPlan.count();
    if (count > 0) {
      throw new TRPCError({
        code: "PRECONDITION_FAILED",
        message: "Plan аль хэдийн бүртгэгдсэн байна",
      });
    }
    await prisma.marketingPlan.createMany({
      data: [
        {
          name: "Starter",
          price: "₮490,000",
          description: "Шинээр эхэлж буй бизнест",
          features: [
            "Сарын 8 FB контент",
            "Facebook page удирдлага",
            "1 рекламын кампанит ажил",
            "Сар бүр тайлан",
            "Имэйл дэмжлэг",
          ],
          featured: false,
          order: 1,
        },
        {
          name: "Growth",
          price: "₮1,200,000",
          description: "Өсөлтөд бэлтгэж буй бизнест",
          features: [
            "Сарын 16 FB + IG контент",
            "Google + Meta Ads удирдлага",
            "AI чатбот суулгах & тохируулах",
            "Сар бүр дэлгэрэнгүй тайлан",
            "Чат + утсаар дэмжлэг",
          ],
          featured: true,
          order: 2,
        },
        {
          name: "Enterprise",
          price: "Тохиролцоно",
          priceSmall: true,
          description: "Том брэнд, байгууллагад",
          features: [
            "Бүтэн маркетинг багаар",
            "Вэбсайт + Landing page хийх",
            "Call center + CRM суурилуулах",
            "Стратеги & brand identity",
            "Dedicated account manager",
          ],
          featured: false,
          btnText: "Холбоо барих",
          order: 3,
        },
      ],
    });
    revalidatePath("/");
    return { ok: true };
  }),
});
