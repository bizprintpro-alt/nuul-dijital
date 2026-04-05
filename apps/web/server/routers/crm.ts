import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, protectedProcedure, prisma } from "@/lib/trpc";

export const crmRouter = router({
  getLeads: protectedProcedure.query(async ({ ctx }) => {
    const leads = await prisma.cRMLead.findMany({
      where: { userId: ctx.session.user.id },
      orderBy: { updatedAt: "desc" },
    });

    return leads;
  }),

  createLead: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).max(255),
        email: z.string().email().optional().or(z.literal("")),
        phone: z.string().max(20).optional().or(z.literal("")),
        company: z.string().max(255).optional().or(z.literal("")),
        value: z.number().int().min(0).optional(),
        stage: z
          .enum([
            "NEW",
            "CONTACTED",
            "PROPOSAL",
            "NEGOTIATION",
            "CLOSED_WON",
            "CLOSED_LOST",
          ])
          .default("NEW"),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const lead = await prisma.cRMLead.create({
        data: {
          userId: ctx.session.user.id,
          name: input.name,
          email: input.email || null,
          phone: input.phone || null,
          company: input.company || null,
          value: input.value ?? null,
          stage: input.stage,
          notes: input.notes ?? null,
        },
      });

      return lead;
    }),

  updateStage: protectedProcedure
    .input(
      z.object({
        leadId: z.string(),
        stage: z.enum([
          "NEW",
          "CONTACTED",
          "PROPOSAL",
          "NEGOTIATION",
          "CLOSED_WON",
          "CLOSED_LOST",
        ]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const lead = await prisma.cRMLead.findUnique({
        where: { id: input.leadId },
      });

      if (!lead) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Lead not found" });
      }

      if (lead.userId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You do not own this lead",
        });
      }

      const updated = await prisma.cRMLead.update({
        where: { id: input.leadId },
        data: { stage: input.stage },
      });

      return updated;
    }),

  deleteLead: protectedProcedure
    .input(z.object({ leadId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const lead = await prisma.cRMLead.findUnique({
        where: { id: input.leadId },
      });

      if (!lead) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Lead not found" });
      }

      if (lead.userId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You do not own this lead",
        });
      }

      await prisma.cRMLead.delete({ where: { id: input.leadId } });

      return { success: true };
    }),
});
