"use client";

import { trpc } from "@/lib/trpc-client";
import {
  Users,
  ShoppingCart,
  Banknote,
  Globe,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  UserPlus,
  Package,
} from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const tooltipStyle = {
  contentStyle: {
    background: "#0C0C1E",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: 8,
    fontSize: 12,
    color: "#E4E4F0",
  },
  itemStyle: { color: "#E4E4F0" },
  labelStyle: { color: "#9999BB" },
};

const PIE_COLORS = ["#6C63FF", "#00D4AA", "#FFB02E"];

function formatMNT(val: number) {
  if (val >= 1_000_000) return `${(val / 1_000_000).toFixed(1)}сая`;
  if (val >= 1000) return `${(val / 1000).toFixed(0)}мян`;
  return String(val);
}

function formatMonth(m: string) {
  const parts = m.split("-");
  const months = [
    "1-р сар",
    "2-р сар",
    "3-р сар",
    "4-р сар",
    "5-р сар",
    "6-р сар",
    "7-р сар",
    "8-р сар",
    "9-р сар",
    "10-р сар",
    "11-р сар",
    "12-р сар",
  ];
  return months[parseInt(parts[1], 10) - 1] ?? m;
}

function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-xl bg-bg-3 ${className}`} />;
}

function statusColor(status: string) {
  switch (status) {
    case "PAID":
      return "bg-t/15 text-t";
    case "PENDING":
      return "bg-[#FFB02E]/15 text-[#FFB02E]";
    case "CANCELLED":
    case "FAILED":
      return "bg-[#FF4D6A]/15 text-[#FF4D6A]";
    default:
      return "bg-white/[0.06] text-txt-3";
  }
}

const statusLabels: Record<string, string> = {
  PAID: "Төлсөн",
  PENDING: "Хүлээгдэж буй",
  CANCELLED: "Цуцлагдсан",
  FAILED: "Амжилтгүй",
  REFUNDED: "Буцаагдсан",
};

function roleColor(role: string) {
  switch (role) {
    case "ADMIN":
      return "bg-v/15 text-v";
    case "RESELLER":
      return "bg-[#FFB02E]/15 text-[#FFB02E]";
    default:
      return "bg-t/15 text-t";
  }
}

const typeLabels: Record<string, string> = {
  DOMAIN: "Домэйн",
  HOSTING: "Хостинг",
  CHATBOT: "AI Чатбот",
  CRM: "CRM",
  DOMAIN_AND_HOSTING: "Домэйн+Хостинг",
};

export default function AdminPage() {
  const stats = trpc.admin.getStats.useQuery();
  const revenue = trpc.admin.getMonthlyRevenue.useQuery();
  const growth = trpc.admin.getUserGrowth.useQuery();
  const distribution = trpc.admin.getServiceDistribution.useQuery();
  const activity = trpc.admin.getRecentActivity.useQuery();

  const s = stats.data;
  const revenueChange =
    s && s.prevMonthRevenue > 0
      ? (((s.monthlyRevenue - s.prevMonthRevenue) / s.prevMonthRevenue) * 100).toFixed(1)
      : null;

  const statCards = s
    ? [
        {
          label: "Нийт хэрэглэгч",
          value: s.totalUsers.toLocaleString(),
          sub: `Өнөөдөр +${s.newUsersToday}`,
          icon: Users,
          color: "text-v",
          bgColor: "bg-v/15",
        },
        {
          label: "Нийт захиалга",
          value: s.totalOrders.toLocaleString(),
          sub: `${s.pendingOrders} хүлээгдэж буй`,
          icon: ShoppingCart,
          color: "text-t",
          bgColor: "bg-t/15",
        },
        {
          label: "Энэ сарын орлого",
          value: `₮${s.monthlyRevenue.toLocaleString()}`,
          sub: revenueChange ? `${Number(revenueChange) >= 0 ? "+" : ""}${revenueChange}%` : "—",
          up: revenueChange ? Number(revenueChange) >= 0 : true,
          icon: Banknote,
          color: "text-[#FFB02E]",
          bgColor: "bg-[#FFB02E]/15",
        },
        {
          label: "Идэвхтэй домэйн",
          value: s.activeDomains.toLocaleString(),
          sub: "бүртгэлтэй",
          icon: Globe,
          color: "text-[#FF6B9D]",
          bgColor: "bg-[#FF6B9D]/15",
        },
      ]
    : null;

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-syne text-2xl font-bold tracking-tight text-txt">
          Админ панел
        </h1>
        <p className="mt-1 text-[13px] text-txt-3">
          Системийн ерөнхий тойм мэдээлэл
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards
          ? statCards.map((c) => (
              <div
                key={c.label}
                className="rounded-2xl border border-white/[0.04] bg-bg-2 p-5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-medium text-txt-3">
                    {c.label}
                  </span>
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-lg ${c.bgColor}`}
                  >
                    <c.icon size={16} className={c.color} />
                  </div>
                </div>
                <div className="mt-3 text-[22px] font-bold text-txt">
                  {c.value}
                </div>
                <div className="mt-1 flex items-center gap-1">
                  {"up" in c ? (
                    c.up ? (
                      <ArrowUpRight size={13} className="text-t" />
                    ) : (
                      <ArrowDownRight size={13} className="text-[#FF4D6A]" />
                    )
                  ) : null}
                  <span className="text-[11px] text-txt-3">{c.sub}</span>
                </div>
              </div>
            ))
          : Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-[120px]" />
            ))}
      </div>

      {/* Charts Row */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Monthly Revenue */}
        <div className="rounded-2xl border border-white/[0.04] bg-bg-2 p-6">
          <h3 className="mb-4 font-syne text-base font-bold text-txt">
            Сарын орлого
          </h3>
          {revenue.data ? (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={revenue.data}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.04)"
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  tickFormatter={formatMonth}
                  tick={{ fill: "#9999BB", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tickFormatter={formatMNT}
                  tick={{ fill: "#9999BB", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  {...tooltipStyle}
                  formatter={(v) => [`₮${Number(v).toLocaleString()}`, "Орлого"]}
                  labelFormatter={(label) => formatMonth(String(label))}
                />
                <Bar dataKey="revenue" fill="#6C63FF" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <Skeleton className="h-[260px]" />
          )}
        </div>

        {/* User Growth */}
        <div className="rounded-2xl border border-white/[0.04] bg-bg-2 p-6">
          <h3 className="mb-4 font-syne text-base font-bold text-txt">
            Хэрэглэгчийн өсөлт
          </h3>
          {growth.data ? (
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={growth.data}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.04)"
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  tickFormatter={formatMonth}
                  tick={{ fill: "#9999BB", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "#9999BB", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  {...tooltipStyle}
                  formatter={(v) => [v, "Шинэ хэрэглэгч"]}
                  labelFormatter={(label) => formatMonth(String(label))}
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#00D4AA"
                  strokeWidth={2}
                  dot={{ fill: "#00D4AA", r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <Skeleton className="h-[260px]" />
          )}
        </div>
      </div>

      {/* Service Distribution + Recent Activity */}
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Pie Chart */}
        <div className="rounded-2xl border border-white/[0.04] bg-bg-2 p-6">
          <h3 className="mb-4 font-syne text-base font-bold text-txt">
            Үйлчилгээний хуваарилалт
          </h3>
          {distribution.data ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={distribution.data}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  dataKey="value"
                  paddingAngle={3}
                  stroke="none"
                >
                  {distribution.data.map((_, i) => (
                    <Cell
                      key={i}
                      fill={PIE_COLORS[i % PIE_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  {...tooltipStyle}
                  formatter={(v, name) => [v, name]}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <Skeleton className="h-[220px]" />
          )}
          {distribution.data && (
            <div className="mt-2 flex justify-center gap-4">
              {distribution.data.map((d, i) => (
                <div key={d.name} className="flex items-center gap-1.5">
                  <div
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: PIE_COLORS[i] }}
                  />
                  <span className="text-[11px] text-txt-3">
                    {d.name} ({d.value})
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="rounded-2xl border border-white/[0.04] bg-bg-2 p-6 lg:col-span-2">
          <h3 className="mb-4 font-syne text-base font-bold text-txt">
            Сүүлийн үйл ажиллагаа
          </h3>
          {activity.data ? (
            <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
              {activity.data.map((a) => (
                <div
                  key={`${a.kind}-${a.id}`}
                  className="flex items-center justify-between rounded-xl border border-white/[0.03] bg-white/[0.01] px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full ${
                        a.kind === "order"
                          ? "bg-v/20 text-v"
                          : "bg-t/20 text-t"
                      }`}
                    >
                      {a.kind === "order" ? (
                        <Package size={14} />
                      ) : (
                        <UserPlus size={14} />
                      )}
                    </div>
                    <div>
                      <div className="text-[13px] font-medium text-txt">
                        {a.userName}
                      </div>
                      <div className="text-[11px] text-txt-3">
                        {a.kind === "order"
                          ? `${typeLabels[a.type] ?? a.type} — ₮${a.amount.toLocaleString()}`
                          : `Шинэ хэрэглэгч бүртгүүлсэн`}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {a.kind === "order" && (
                      <span
                        className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${statusColor(a.status)}`}
                      >
                        {statusLabels[a.status] ?? a.status}
                      </span>
                    )}
                    {a.kind === "user" && (
                      <span
                        className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${roleColor(a.role)}`}
                      >
                        {a.role}
                      </span>
                    )}
                    <span className="text-[11px] text-txt-3">
                      <Clock size={10} className="mr-1 inline-block" />
                      {new Date(a.date).toLocaleDateString("mn-MN")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-[56px]" />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
