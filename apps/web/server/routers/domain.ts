import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "@/lib/trpc";

const domainPricing: Record<string, number> = {
  ".mn": 165000,
  ".com": 62500,
  ".org": 75000,
  ".net": 94600,
  ".shop": 88000,
};

export const domainRouter = router({
  search: publicProcedure
    .input(z.object({ query: z.string().min(1).max(63) }))
    .query(async ({ input }) => {
      const base = input.query
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, "")
        .replace(/\.[^.]+$/, "");

      const results = Object.entries(domainPricing).map(([tld, price]) => ({
        domain: `${base}${tld}`,
        tld,
        price,
        available: Math.random() > 0.35, // TODO: Real WHOIS check
      }));

      return results;
    }),

  myDomains: protectedProcedure.query(async ({ ctx }) => {
    // TODO: Fetch from database
    return [
      { name: "miniishop.mn", status: "ACTIVE", expiresAt: "2025-12-15" },
      { name: "company.com.mn", status: "ACTIVE", expiresAt: "2025-08-22" },
    ];
  }),
});
