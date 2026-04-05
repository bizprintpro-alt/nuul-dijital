import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, publicProcedure, protectedProcedure, prisma } from "@/lib/trpc";

const DOMAIN_PRICES: Record<string, number> = {
  ".mn": 165000,
  ".com": 62500,
  ".org": 75000,
  ".net": 94600,
  ".shop": 88000,
};

const TLDS = [".mn", ".com", ".org", ".net", ".shop"] as const;

export const domainRouter = router({
  search: publicProcedure
    .input(z.object({ query: z.string().min(1).max(63) }))
    .query(async ({ input }) => {
      const base = input.query
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, "")
        .replace(/\.[^.]+$/, "");

      if (!base) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid domain name",
        });
      }

      const domainNames = TLDS.map((tld) => `${base}${tld}`);

      const existingDomains = await prisma.domain.findMany({
        where: { name: { in: domainNames } },
        select: { name: true, status: true },
      });

      const registeredSet = new Set(existingDomains.map((d) => d.name));

      return TLDS.map((tld) => {
        const fullDomain = `${base}${tld}`;
        return {
          domain: fullDomain,
          tld,
          price: DOMAIN_PRICES[tld],
          available: !registeredSet.has(fullDomain),
        };
      });
    }),

  getUserDomains: protectedProcedure.query(async ({ ctx }) => {
    const domains = await prisma.domain.findMany({
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

    return domains;
  }),

  orderDomain: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).max(63),
        tld: z.enum([".mn", ".com", ".org", ".net", ".shop"]),
        years: z.number().int().min(1).max(10).default(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const fullDomain = `${input.name.toLowerCase().replace(/[^a-z0-9-]/g, "")}${input.tld}`;
      const price = DOMAIN_PRICES[input.tld];

      if (!price) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Unsupported TLD",
        });
      }

      const existing = await prisma.domain.findUnique({
        where: { name: fullDomain },
      });

      if (existing) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Domain is already registered",
        });
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

        return { orderId: order.id, domain: domain.name };
      });

      return result;
    }),

  renewDomain: protectedProcedure
    .input(z.object({ domainId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const domain = await prisma.domain.findUnique({
        where: { id: input.domainId },
      });

      if (!domain) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Domain not found" });
      }

      if (domain.userId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You do not own this domain",
        });
      }

      const price = DOMAIN_PRICES[domain.tld] ?? domain.price;
      const currentExpiry = domain.expiresAt ?? new Date();
      const newExpiry = new Date(currentExpiry);
      newExpiry.setFullYear(newExpiry.getFullYear() + 1);

      const result = await prisma.$transaction(async (tx) => {
        await tx.domain.update({
          where: { id: domain.id },
          data: { expiresAt: newExpiry },
        });

        const order = await tx.order.create({
          data: {
            userId: ctx.session.user.id,
            type: "DOMAIN",
            amount: price,
            status: "PENDING",
          },
        });

        return { orderId: order.id, domain: domain.name, newExpiresAt: newExpiry };
      });

      return result;
    }),
});
