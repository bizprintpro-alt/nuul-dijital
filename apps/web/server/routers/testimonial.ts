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

const COLORS = ["violet", "teal", "amber", "pink", "blue"] as const;

export const testimonialRouter = router({
  // ── Public ──────────────────────────────────────────────────────
  list: publicProcedure.query(async () => {
    return prisma.testimonial.findMany({
      where: { isActive: true },
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
    });
  }),

  // ── Admin ───────────────────────────────────────────────────────
  adminList: adminProcedure.query(async () => {
    return prisma.testimonial.findMany({
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
    });
  }),

  adminCreate: adminProcedure
    .input(
      z.object({
        text: z.string().min(1),
        name: z.string().min(1),
        role: z.string().min(1),
        avatar: z.string().default(""),
        color: z.enum(COLORS).default("violet"),
        rating: z.number().int().min(1).max(5).default(5),
        order: z.number().int().default(0),
        isActive: z.boolean().default(true),
      })
    )
    .mutation(async ({ input }) => {
      return prisma.testimonial.create({ data: input });
    }),

  adminUpdate: adminProcedure
    .input(
      z.object({
        id: z.string(),
        text: z.string().min(1).optional(),
        name: z.string().min(1).optional(),
        role: z.string().min(1).optional(),
        avatar: z.string().optional(),
        color: z.enum(COLORS).optional(),
        rating: z.number().int().min(1).max(5).optional(),
        order: z.number().int().optional(),
        isActive: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      return prisma.testimonial.update({ where: { id }, data });
    }),

  adminDelete: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      return prisma.testimonial.delete({ where: { id: input.id } });
    }),

  adminSeedDefaults: adminProcedure.mutation(async () => {
    const count = await prisma.testimonial.count();
    if (count > 0) {
      throw new TRPCError({
        code: "PRECONDITION_FAILED",
        message: "Сэтгэгдэл аль хэдийн бүртгэгдсэн байна",
      });
    }
    await prisma.testimonial.createMany({
      data: [
        {
          text: "10 минутад вэбсайтаа бэлэн болголоо. Домэйноосоо чатбот хүртэл нэг дороос шийдсэн нь маш хялбар байлаа. Өмнө нь ингэж хялбар байх юм гэж бодоогүй.",
          name: "Батбаяр Д.",
          role: "Кофе шоп эзэн",
          avatar: "Б",
          color: "violet",
          order: 1,
        },
        {
          text: "Өмнө нь 3 компанид төлж байсан. Nuul нэг төлбөрт бүгдийг оруулж өгсөн. Сарын зардал 40% буурсан. Хамгийн сайн шийдвэрүүдийн нэг болсон.",
          name: "Номин Г.",
          role: "Онлайн дэлгүүр",
          avatar: "Н",
          color: "teal",
          order: 2,
        },
        {
          text: "AI чатбот маань 24/7 хариулж байна. Ажилтангүйгээр хоногт 50+ хэрэглэгчтэй харилцдаг болсон. Орлого 30% өссөн.",
          name: "Энхбаяр С.",
          role: "Маркетинг агентлаг",
          avatar: "Э",
          color: "amber",
          order: 3,
        },
      ],
    });
    return { ok: true };
  }),
});
