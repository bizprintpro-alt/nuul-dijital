import { TRPCError } from "@trpc/server";
import { router, protectedProcedure, prisma } from "@/lib/trpc";

export const analyticsRouter = router({
  getDashboardStats: protectedProcedure.query(async ({ ctx }) => {
    const isAdmin = ctx.session.user.role === "ADMIN";
    const userFilter = isAdmin ? {} : { userId: ctx.session.user.id };

    const [
      totalDomains,
      totalOrders,
      revenueResult,
      totalTickets,
      aiResolvedTickets,
      activeSubscriptions,
    ] = await Promise.all([
      prisma.domain.count({ where: userFilter }),
      prisma.order.count({ where: userFilter }),
      prisma.order.aggregate({
        where: { ...userFilter, status: "PAID" },
        _sum: { amount: true },
      }),
      prisma.ticket.count({ where: userFilter }),
      prisma.ticket.count({ where: { ...userFilter, aiResolved: true } }),
      prisma.subscription.count({
        where: { ...userFilter, status: "ACTIVE" },
      }),
    ]);

    const totalRevenue = revenueResult._sum.amount ?? 0;
    const aiResolvedPercent =
      totalTickets > 0
        ? Math.round((aiResolvedTickets / totalTickets) * 100)
        : 0;

    return {
      totalDomains,
      totalOrders,
      totalRevenue,
      aiResolvedPercent,
      activeSubscriptions,
    };
  }),

  getMonthlyRevenue: protectedProcedure.query(async ({ ctx }) => {
    const isAdmin = ctx.session.user.role === "ADMIN";
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

    const userCondition = isAdmin ? "" : `AND o."userId" = '${ctx.session.user.id}'`;

    const result = await prisma.$queryRawUnsafe<
      Array<{ month: string; revenue: bigint }>
    >(
      `SELECT
        TO_CHAR(o."createdAt", 'YYYY-MM') AS month,
        COALESCE(SUM(o."amount"), 0) AS revenue
      FROM orders o
      WHERE o."status" = 'PAID'
        AND o."createdAt" >= $1
        ${userCondition}
      GROUP BY TO_CHAR(o."createdAt", 'YYYY-MM')
      ORDER BY month ASC`,
      twelveMonthsAgo
    );

    return result.map((r) => ({
      month: r.month,
      revenue: Number(r.revenue),
    }));
  }),

  getServiceUsage: protectedProcedure.query(async ({ ctx }) => {
    const isAdmin = ctx.session.user.role === "ADMIN";
    const userFilter = isAdmin ? {} : { userId: ctx.session.user.id };

    const [domains, hosting, chatbots, crm, tickets] = await Promise.all([
      prisma.domain.count({ where: userFilter }),
      prisma.subscription.count({ where: { ...userFilter, status: "ACTIVE" } }),
      prisma.chatBot.count({ where: userFilter }),
      prisma.cRMLead.count({ where: userFilter }),
      prisma.ticket.count({ where: userFilter }),
    ]);

    return { domains, hosting, chatbots, crm, tickets };
  }),
});
