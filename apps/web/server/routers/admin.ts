import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, protectedProcedure, prisma } from "@/lib/trpc";

const adminProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  if (ctx.session.user.role !== "ADMIN") {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Админ эрх шаардлагатай",
    });
  }
  return next({ ctx });
});

export const adminRouter = router({
  getStats: adminProcedure.query(async () => {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const prevMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);

    const [
      totalUsers,
      newUsersToday,
      monthlyRevenueAgg,
      prevMonthRevenueAgg,
      activeDomains,
      pendingOrders,
      totalOrders,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { createdAt: { gte: todayStart } } }),
      prisma.order.aggregate({
        _sum: { amount: true },
        where: { status: "PAID", createdAt: { gte: monthStart } },
      }),
      prisma.order.aggregate({
        _sum: { amount: true },
        where: {
          status: "PAID",
          createdAt: { gte: prevMonthStart, lte: prevMonthEnd },
        },
      }),
      prisma.domain.count({ where: { status: "ACTIVE" } }),
      prisma.order.count({ where: { status: "PENDING" } }),
      prisma.order.count(),
    ]);

    return {
      totalUsers,
      newUsersToday,
      monthlyRevenue: monthlyRevenueAgg._sum.amount ?? 0,
      prevMonthRevenue: prevMonthRevenueAgg._sum.amount ?? 0,
      activeDomains,
      pendingOrders,
      totalOrders,
    };
  }),

  getMonthlyRevenue: adminProcedure.query(async () => {
    const now = new Date();
    const twelveMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 11, 1);

    const orders = await prisma.order.findMany({
      where: {
        status: "PAID",
        createdAt: { gte: twelveMonthsAgo },
      },
      select: { amount: true, createdAt: true },
    });

    const monthMap = new Map<string, number>();
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      monthMap.set(key, 0);
    }

    for (const order of orders) {
      const d = order.createdAt;
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      if (monthMap.has(key)) {
        monthMap.set(key, monthMap.get(key)! + order.amount);
      }
    }

    return Array.from(monthMap.entries()).map(([month, revenue]) => ({
      month,
      revenue,
    }));
  }),

  getUserGrowth: adminProcedure.query(async () => {
    const now = new Date();
    const twelveMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 11, 1);

    const users = await prisma.user.findMany({
      where: { createdAt: { gte: twelveMonthsAgo } },
      select: { createdAt: true },
    });

    const monthMap = new Map<string, number>();
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      monthMap.set(key, 0);
    }

    for (const user of users) {
      const d = user.createdAt;
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      if (monthMap.has(key)) {
        monthMap.set(key, monthMap.get(key)! + 1);
      }
    }

    return Array.from(monthMap.entries()).map(([month, count]) => ({
      month,
      count,
    }));
  }),

  getServiceDistribution: adminProcedure.query(async () => {
    const [domains, subscriptions, chatbots] = await Promise.all([
      prisma.domain.count(),
      prisma.subscription.count(),
      prisma.chatBot.count(),
    ]);

    return [
      { name: "Домэйн", value: domains },
      { name: "Хостинг", value: subscriptions },
      { name: "AI Чатбот", value: chatbots },
    ];
  }),

  getUsers: adminProcedure
    .input(
      z.object({
        page: z.number().int().min(1).default(1),
        limit: z.number().int().min(1).max(100).default(20),
        search: z.string().optional(),
        role: z.enum(["ADMIN", "CLIENT", "RESELLER"]).optional(),
      })
    )
    .query(async ({ input }) => {
      const where: any = {};
      if (input.role) where.role = input.role;
      if (input.search) {
        where.OR = [
          { name: { contains: input.search, mode: "insensitive" } },
          { email: { contains: input.search, mode: "insensitive" } },
        ];
      }

      const [users, total] = await Promise.all([
        prisma.user.findMany({
          where,
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
            _count: { select: { domains: true, orders: true } },
          },
          orderBy: { createdAt: "desc" },
          skip: (input.page - 1) * input.limit,
          take: input.limit,
        }),
        prisma.user.count({ where }),
      ]);

      return {
        users,
        total,
        pages: Math.ceil(total / input.limit),
      };
    }),

  updateUserRole: adminProcedure
    .input(
      z.object({
        userId: z.string(),
        role: z.enum(["ADMIN", "CLIENT", "RESELLER"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (input.userId === ctx.session.user.id) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Өөрийнхөө эрхийг өөрчлөх боломжгүй",
        });
      }

      return prisma.user.update({
        where: { id: input.userId },
        data: { role: input.role },
        select: { id: true, role: true },
      });
    }),

  getOrders: adminProcedure
    .input(
      z.object({
        page: z.number().int().min(1).default(1),
        limit: z.number().int().min(1).max(100).default(20),
        status: z
          .enum(["PENDING", "PAID", "FAILED", "CANCELLED", "REFUNDED"])
          .optional(),
        type: z
          .enum(["DOMAIN", "HOSTING", "CHATBOT", "CRM", "DOMAIN_AND_HOSTING"])
          .optional(),
      })
    )
    .query(async ({ input }) => {
      const where: any = {};
      if (input.status) where.status = input.status;
      if (input.type) where.type = input.type;

      const [orders, total] = await Promise.all([
        prisma.order.findMany({
          where,
          include: {
            user: { select: { id: true, name: true, email: true } },
            domain: { select: { name: true, tld: true } },
            payment: {
              select: { method: true, status: true, paidAt: true },
            },
          },
          orderBy: { createdAt: "desc" },
          skip: (input.page - 1) * input.limit,
          take: input.limit,
        }),
        prisma.order.count({ where }),
      ]);

      return {
        orders,
        total,
        pages: Math.ceil(total / input.limit),
      };
    }),

  updateOrderStatus: adminProcedure
    .input(
      z.object({
        orderId: z.string(),
        status: z.enum(["PENDING", "PAID", "FAILED", "CANCELLED", "REFUNDED"]),
      })
    )
    .mutation(async ({ input }) => {
      return prisma.order.update({
        where: { id: input.orderId },
        data: { status: input.status },
        select: { id: true, status: true },
      });
    }),

  getAllDomains: adminProcedure
    .input(
      z.object({
        page: z.number().int().min(1).default(1),
        limit: z.number().int().min(1).max(100).default(20),
        search: z.string().optional(),
        status: z
          .enum(["AVAILABLE", "PENDING", "ACTIVE", "EXPIRED", "TRANSFERRING"])
          .optional(),
      })
    )
    .query(async ({ input }) => {
      const where: any = {};
      if (input.status) where.status = input.status;
      if (input.search) {
        where.OR = [
          { name: { contains: input.search, mode: "insensitive" } },
          { tld: { contains: input.search, mode: "insensitive" } },
        ];
      }

      const [domains, total] = await Promise.all([
        prisma.domain.findMany({
          where,
          include: {
            user: { select: { id: true, name: true, email: true } },
          },
          orderBy: { createdAt: "desc" },
          skip: (input.page - 1) * input.limit,
          take: input.limit,
        }),
        prisma.domain.count({ where }),
      ]);

      return {
        domains,
        total,
        pages: Math.ceil(total / input.limit),
      };
    }),

  getRecentActivity: adminProcedure.query(async () => {
    const [recentOrders, recentUsers] = await Promise.all([
      prisma.order.findMany({
        take: 20,
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { name: true, email: true } },
          domain: { select: { name: true, tld: true } },
        },
      }),
      prisma.user.findMany({
        take: 10,
        orderBy: { createdAt: "desc" },
        select: { id: true, name: true, email: true, role: true, createdAt: true },
      }),
    ]);

    const activities = [
      ...recentOrders.map((o) => ({
        kind: "order" as const,
        id: o.id,
        date: o.createdAt,
        userName: o.user.name ?? o.user.email,
        type: o.type,
        amount: o.amount,
        status: o.status,
        domain: o.domain ? `${o.domain.name}${o.domain.tld}` : null,
      })),
      ...recentUsers.map((u) => ({
        kind: "user" as const,
        id: u.id,
        date: u.createdAt,
        userName: u.name ?? u.email,
        email: u.email,
        role: u.role,
      })),
    ];

    activities.sort((a, b) => b.date.getTime() - a.date.getTime());
    return activities.slice(0, 20);
  }),
});
