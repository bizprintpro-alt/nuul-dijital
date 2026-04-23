"use client";

import { BarChart3, TrendingUp, Eye, Users, Globe, Server, Bot, ChartNoAxesColumn } from "lucide-react";
import { trpc } from "@/lib/trpc-client";

function formatCurrency(n: number) {
  if (n >= 1_000_000) return `₮${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `₮${(n / 1_000).toFixed(0)}K`;
  return `₮${n.toLocaleString()}`;
}

const monthLabels = [
  "1-р", "2-р", "3-р", "4-р", "5-р", "6-р",
  "7-р", "8-р", "9-р", "10-р", "11-р", "12-р",
];

function getLast12Months() {
  const now = new Date();
  const months: Array<{ key: string; label: string }> = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    months.push({ key, label: monthLabels[d.getMonth()] });
  }
  return months;
}

export default function AnalyticsPage() {
  const statsQuery = trpc.analytics.getDashboardStats.useQuery();
  const revenueQuery = trpc.analytics.getMonthlyRevenue.useQuery();
  const usageQuery = trpc.analytics.getServiceUsage.useQuery();

  const stats = statsQuery.data;
  const revenue = revenueQuery.data ?? [];
  const usage = usageQuery.data;

  // Build 12-month aligned revenue series
  const months = getLast12Months();
  const revenueMap = new Map(revenue.map((r) => [r.month, r.revenue]));
  const revenueSeries = months.map((m) => ({
    label: m.label,
    value: revenueMap.get(m.key) ?? 0,
  }));
  const maxRevenue = Math.max(1, ...revenueSeries.map((r) => r.value));

  // Service usage distribution
  const totalUsage = usage
    ? usage.domains + usage.hosting + usage.chatbots + usage.crm + usage.tickets
    : 0;
  const usageItems = usage
    ? [
        { name: "Домэйн", count: usage.domains, color: "bg-v" },
        { name: "Хостинг", count: usage.hosting, color: "bg-t" },
        { name: "AI Чатбот", count: usage.chatbots, color: "bg-[#FFB02E]" },
        { name: "CRM", count: usage.crm, color: "bg-[#FF6B9D]" },
        { name: "Тикет", count: usage.tickets, color: "bg-v-soft" },
      ]
    : [];

  const isLoading = statsQuery.isLoading || revenueQuery.isLoading || usageQuery.isLoading;

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-syne text-2xl font-bold tracking-tight text-txt">Аналитик</h1>
        <p className="mt-1 text-[13px] text-txt-3">Бүх үйлчилгээний нэгдсэн тайлан ба статистик</p>
      </div>

      {/* Overview stats */}
      <div className="mb-6 grid gap-4 sm:grid-cols-4">
        {[
          {
            icon: Globe,
            label: "Нийт домэйн",
            value: stats ? stats.totalDomains.toLocaleString() : "—",
            color: "text-v",
            bg: "bg-v/10",
          },
          {
            icon: Users,
            label: "Нийт захиалга",
            value: stats ? stats.totalOrders.toLocaleString() : "—",
            color: "text-t",
            bg: "bg-t/10",
          },
          {
            icon: TrendingUp,
            label: "Нийт орлого",
            value: stats ? formatCurrency(stats.totalRevenue) : "—",
            color: "text-[#FFB02E]",
            bg: "bg-[#FFB02E]/10",
          },
          {
            icon: BarChart3,
            label: "AI шийдвэрлэсэн",
            value: stats ? `${stats.aiResolvedPercent}%` : "—",
            color: "text-[#FF6B9D]",
            bg: "bg-[#FF6B9D]/10",
          },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="rounded-2xl border border-white/[0.04] bg-bg-2 p-5">
              <div className="mb-3 flex items-center justify-between">
                <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${s.bg}`}>
                  <Icon size={16} className={s.color} />
                </div>
                {isLoading && (
                  <div className="h-4 w-10 animate-pulse rounded bg-white/[0.06]" />
                )}
              </div>
              <div className="font-syne text-xl font-bold text-txt">{s.value}</div>
              <div className="text-[11px] text-txt-3">{s.label}</div>
            </div>
          );
        })}
      </div>

      {/* Chart + Distribution */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Revenue chart */}
        <div className="rounded-2xl border border-white/[0.04] bg-bg-2 p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-syne text-base font-bold text-txt">Орлогын график (12 сар)</h3>
          </div>
          {revenueQuery.isLoading ? (
            <div className="h-48 animate-pulse rounded-xl bg-white/[0.03]" />
          ) : revenueSeries.every((r) => r.value === 0) ? (
            <div className="flex h-48 flex-col items-center justify-center gap-2 text-center">
              <ChartNoAxesColumn size={24} className="text-txt-3" />
              <p className="text-[12px] text-txt-3">Орлогын өгөгдөл хараахан байхгүй байна</p>
            </div>
          ) : (
            <>
              <div className="flex h-48 items-end gap-2">
                {revenueSeries.map((r, i) => (
                  <div
                    key={i}
                    className="group relative flex-1 rounded-t-md bg-gradient-to-t from-v/20 to-v/60 transition-all hover:from-v/30 hover:to-v/80"
                    style={{
                      height: r.value > 0 ? `${Math.max(4, (r.value / maxRevenue) * 100)}%` : "2%",
                    }}
                    title={`${r.label} сар: ${formatCurrency(r.value)}`}
                  >
                    <div className="pointer-events-none absolute -top-8 left-1/2 hidden -translate-x-1/2 whitespace-nowrap rounded-md bg-bg-3 px-2 py-1 text-[10px] text-txt shadow-lg group-hover:block">
                      {formatCurrency(r.value)}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex justify-between text-[10px] text-txt-3">
                {revenueSeries.filter((_, i) => i % 3 === 0 || i === revenueSeries.length - 1).map((r) => (
                  <span key={r.label}>{r.label}</span>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Service usage distribution */}
        <div className="rounded-2xl border border-white/[0.04] bg-bg-2 p-6">
          <h3 className="mb-4 font-syne text-base font-bold text-txt">Үйлчилгээний хуваарилалт</h3>
          {usageQuery.isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-6 animate-pulse rounded-lg bg-white/[0.03]" />
              ))}
            </div>
          ) : totalUsage === 0 ? (
            <div className="flex h-48 flex-col items-center justify-center gap-2 text-center">
              <Server size={24} className="text-txt-3" />
              <p className="text-[12px] text-txt-3">Идэвхтэй үйлчилгээ байхгүй байна</p>
            </div>
          ) : (
            <div className="space-y-4">
              {usageItems.map((s) => {
                const pct = totalUsage > 0 ? Math.round((s.count / totalUsage) * 100) : 0;
                return (
                  <div key={s.name}>
                    <div className="mb-1 flex justify-between text-[12px]">
                      <span className="text-txt-2">{s.name}</span>
                      <span className="font-semibold text-txt">
                        {s.count} <span className="text-txt-3">({pct}%)</span>
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-white/[0.04]">
                      <div
                        className={`h-full rounded-full ${s.color} transition-all`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
