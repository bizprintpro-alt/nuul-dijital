import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, publicProcedure, protectedProcedure, prisma } from "@/lib/trpc";
import { checkDomainAvailability, DOMAIN_PRICES } from "@/lib/domain-checker";

export const domainRouter = router({
  search: publicProcedure
    .input(z.object({ query: z.string().min(2).max(63) }))
    .query(async ({ input }) => {
      const clean = input.query
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, "")
        .replace(/\.[^.]+$/, "");

      if (!clean) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Домэйн нэр буруу байна" });
      }

      // Real RDAP availability check
      const results = await checkDomainAvailability(clean);

      // Also check our DB for domains we've registered
      const ourDomains = await prisma.domain.findMany({
        where: { name: { in: results.map((r) => r.domain) } },
        select: { name: true },
      });
      const ourSet = new Set(ourDomains.map((d) => d.name));

      return results.map((r) => ({
        ...r,
        available: r.available && !ourSet.has(r.domain),
      }));
    }),

  getUserDomains: protectedProcedure.query(async ({ ctx }) => {
    return prisma.domain.findMany({
      where: { userId: ctx.session.user.id },
      select: {
        id: true,
        name: true,
        tld: true,
        status: true,
        price: true,
        expiresAt: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }),

  orderDomain: protectedProcedure
    .input(
      z.object({
        name: z.string().min(2).max(63),
        tld: z.enum([".mn", ".com", ".org", ".net", ".shop"]),
        years: z.number().int().min(1).max(10).default(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const fullDomain = `${input.name.toLowerCase().replace(/[^a-z0-9-]/g, "")}${input.tld}`;
      const price = DOMAIN_PRICES[input.tld];

      if (!price) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "TLD дэмжигдэхгүй" });
      }

      // Check if already registered in our DB
      const existing = await prisma.domain.findUnique({ where: { name: fullDomain } });
      if (existing) {
        throw new TRPCError({ code: "CONFLICT", message: "Домэйн бүртгэлтэй байна" });
      }

      // Double-check availability via RDAP
      const results = await checkDomainAvailability(input.name);
      const check = results.find((r) => r.tld === input.tld);
      if (check && !check.available) {
        throw new TRPCError({ code: "CONFLICT", message: "Домэйн аль хэдийн авагдсан" });
      }

      const totalAmount = price * input.years;

      const result = await prisma.$transaction(async (tx) => {
        const domain = await tx.domain.create({
          data: {
            name: fullDomain,
            tld: input.tld,
            userId: ctx.session.user.id,
            status: "PENDING",
            price,
          },
        });

        const order = await tx.order.create({
          data: {
            userId: ctx.session.user.id,
            domainId: domain.id,
            type: "DOMAIN",
            amount: totalAmount,
            status: "PENDING",
          },
        });

        return { orderId: order.id, domain: domain.name, amount: totalAmount };
      });

      return result;
    }),

  renewDomain: protectedProcedure
    .input(z.object({ domainId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const domain = await prisma.domain.findUnique({ where: { id: input.domainId } });

      if (!domain || domain.userId !== ctx.session.user.id) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Домэйн олдсонгүй" });
      }

      const price = DOMAIN_PRICES[domain.tld] ?? domain.price;

      const order = await prisma.order.create({
        data: {
          userId: ctx.session.user.id,
          domainId: domain.id,
          type: "DOMAIN",
          amount: price,
          status: "PENDING",
        },
      });

      return { orderId: order.id, domain: domain.name, amount: price };
    }),
});
