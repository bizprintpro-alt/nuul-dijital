import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, protectedProcedure, prisma } from "@/lib/trpc";

export const ticketRouter = router({
  getTickets: protectedProcedure.query(async ({ ctx }) => {
    const isAdmin = ctx.session.user.role === "ADMIN";

    const tickets = await prisma.ticket.findMany({
      where: isAdmin ? {} : { userId: ctx.session.user.id },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return tickets;
  }),

  createTicket: protectedProcedure
    .input(
      z.object({
        subject: z.string().min(1).max(255),
        message: z.string().min(1).max(5000),
        priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).default("MEDIUM"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const ticket = await prisma.ticket.create({
        data: {
          userId: ctx.session.user.id,
          subject: input.subject,
          message: input.message,
          priority: input.priority,
          status: "OPEN",
        },
      });

      return ticket;
    }),

  updateStatus: protectedProcedure
    .input(
      z.object({
        ticketId: z.string(),
        status: z.enum(["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const ticket = await prisma.ticket.findUnique({
        where: { id: input.ticketId },
      });

      if (!ticket) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Ticket not found",
        });
      }

      const isAdmin = ctx.session.user.role === "ADMIN";
      const isOwner = ticket.userId === ctx.session.user.id;

      if (!isAdmin && !isOwner) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Access denied",
        });
      }

      const updated = await prisma.ticket.update({
        where: { id: input.ticketId },
        data: { status: input.status },
      });

      return updated;
    }),
});
