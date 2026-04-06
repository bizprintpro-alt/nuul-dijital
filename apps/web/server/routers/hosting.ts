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

const HOSTING_TYPES = ["STARTER", "BUSINESS", "ENTERPRISE"] as const;
const VPS_TYPES = ["VPS_BASIC", "VPS_PRO", "VPS_CLOUD"] as const;

export const hostingRouter = router({
  // ── Public ──────────────────────────────────────────────────────
  getHostingPlans: publicProcedure.query(async () => {
    return prisma.hostingPlan.findMany({
      where: { isActive: true, type: { in: [...HOSTING_TYPES] } },
      orderBy: { price: "asc" },
    });
  }),

  getVPSPlans: publicProcedure.query(async () => {
    return prisma.hostingPlan.findMany({
      where: { isActive: true, type: { in: [...VPS_TYPES] } },
      orderBy: { price: "asc" },
    });
  }),

  // ── Admin ───────────────────────────────────────────────────────
  adminGetAllPlans: adminProcedure.query(async () => {
    return prisma.hostingPlan.findMany({
      orderBy: [{ type: "asc" }, { price: "asc" }],
      include: { _count: { select: { subscriptions: true } } },
    });
  }),

  adminCreatePlan: adminProcedure
    .input(
      z.object({
        name: z.string().min(1),
        slug: z.string().min(1),
        type: z.enum([...HOSTING_TYPES, ...VPS_TYPES]),
        description: z.string().optional(),
        price: z.number().int().min(0),
        priceYearly: z.number().int().min(0).optional().nullable(),
        storage: z.number().int().min(0),
        bandwidth: z.number().int().min(0),
        websites: z.number().int().min(0),
        emails: z.number().int().min(0),
        features: z.array(z.string()),
        isActive: z.boolean().default(true),
      })
    )
    .mutation(async ({ input }) => {
      const existing = await prisma.hostingPlan.findUnique({
        where: { slug: input.slug },
      });
      if (existing) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Энэ slug аль хэдийн бүртгэгдсэн байна",
        });
      }
      return prisma.hostingPlan.create({ data: input });
    }),

  adminUpdatePlan: adminProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1).optional(),
        slug: z.string().min(1).optional(),
        type: z.enum([...HOSTING_TYPES, ...VPS_TYPES]).optional(),
        description: z.string().optional().nullable(),
        price: z.number().int().min(0).optional(),
        priceYearly: z.number().int().min(0).optional().nullable(),
        storage: z.number().int().min(0).optional(),
        bandwidth: z.number().int().min(0).optional(),
        websites: z.number().int().min(0).optional(),
        emails: z.number().int().min(0).optional(),
        features: z.array(z.string()).optional(),
        isActive: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      if (data.slug) {
        const existing = await prisma.hostingPlan.findFirst({
          where: { slug: data.slug, NOT: { id } },
        });
        if (existing) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "Энэ slug аль хэдийн бүртгэгдсэн байна",
          });
        }
      }
      return prisma.hostingPlan.update({ where: { id }, data });
    }),

  adminDeletePlan: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const plan = await prisma.hostingPlan.findUnique({
        where: { id: input.id },
        include: {
          _count: {
            select: { subscriptions: { where: { status: "ACTIVE" } } },
          },
        },
      });
      if (!plan) {
        throw new TRPCError({ code: "NOT_FOUND", message: "План олдсонгүй" });
      }
      if (plan._count.subscriptions > 0) {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: "Идэвхтэй захиалагчтай план устгах боломжгүй",
        });
      }
      return prisma.hostingPlan.delete({ where: { id: input.id } });
    }),

  adminTogglePlan: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const plan = await prisma.hostingPlan.findUnique({
        where: { id: input.id },
      });
      if (!plan) {
        throw new TRPCError({ code: "NOT_FOUND", message: "План олдсонгүй" });
      }
      return prisma.hostingPlan.update({
        where: { id: input.id },
        data: { isActive: !plan.isActive },
      });
    }),
});
