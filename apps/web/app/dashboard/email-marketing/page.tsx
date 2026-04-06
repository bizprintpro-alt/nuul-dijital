"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Mail,
  Send,
  Users,
  BarChart3,
  Plus,
  ListChecks,
  Loader2,
  Eye,
  MousePointerClick,
  Clock,
} from "lucide-react";
import { trpc } from "@/lib/trpc-client";

// ── Status badge config ───────────────────────────────────────────
const STATUS_CONFIG: Record<
  string,
  { label: string; className: string; spinning?: boolean }
> = {
  DRAFT: { label: "Ноорог", className: "bg-white/[0.06] text-txt-3" },
  SCHEDULED: { label: "Хуваарьт", className: "bg-[#3B82F6]/15 text-[#3B82F6]" },
  SENDING: {
    label: "Илгээж байна",
    className: "bg-[#FFB02E]/15 text-[#FFB02E]",
    spinning: true,
  },
  SENT: { label: "Илгээсэн", className: "bg-t/15 text-t" },
  PAUSED: { label: "Зогссон", className: "bg-[#F97316]/15 text-[#F97316]" },
};

function StatusBadge({ status }: { status: string }) {
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.DRAFT;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-bold ${config.className}`}
    >
      {config.spinning && <Loader2 size={10} className="animate-spin" />}
      {config.label}
    </span>
  );
}

// ── Skeleton helpers ──────────────────────────────────────────────
function StatSkeleton() {
  return (
    <div className="rounded-2xl border border-white/[0.04] bg-bg-2 p-5">
      <div className="mb-3 h-9 w-9 animate-pulse rounded-lg bg-bg-3" />
      <div className="mb-2 h-6 w-16 animate-pulse rounded bg-bg-3" />
      <div className="h-3 w-24 animate-pulse rounded bg-bg-3" />
    </div>
  );
}

function TableRowSkeleton() {
  return (
    <div className="flex items-center justify-between rounded-xl border border-white/[0.03] bg-white/[0.01] px-5 py-4">
      <div className="space-y-2">
        <div className="h-4 w-48 animate-pulse rounded bg-bg-3" />
        <div className="h-3 w-64 animate-pulse rounded bg-bg-3" />
      </div>
      <div className="h-5 w-16 animate-pulse rounded-md bg-bg-3" />
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────
export default function EmailMarketingPage() {
  const { data: stats, isLoading: statsLoading } =
    trpc.emailMarketing.getOverviewStats.useQuery();
  const { data: campaigns, isLoading: campaignsLoading } =
    trpc.emailMarketing.getCampaigns.useQuery();

  const statCards = [
    {
      icon: ListChecks,
      label: "Нийт жагсаалт",
      value: stats?.totalLists ?? 0,
      color: "text-v",
      bg: "bg-v/10",
    },
    {
      icon: Users,
      label: "Нийт захиалагч",
      value: stats?.totalSubscribers ?? 0,
      color: "text-t",
      bg: "bg-t/10",
    },
    {
      icon: Send,
      label: "Кампани (энэ сард)",
      value: stats?.campaignsThisMonth ?? 0,
      color: "text-[#FFB02E]",
      bg: "bg-[#FFB02E]/10",
    },
    {
      icon: Eye,
      label: "Дундаж нээлт %",
      value: `${(stats?.avgOpenRate ?? 0).toFixed(1)}%`,
      color: "text-[#FF6B9D]",
      bg: "bg-[#FF6B9D]/10",
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-syne text-2xl font-bold tracking-tight text-txt">
            И-мэйл маркетинг
          </h1>
          <p className="mt-1 text-[13px] text-txt-3">
            Кампанит ажил үүсгэж, харилцагчиддаа и-мэйл илгээ
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/email-marketing/lists"
            className="flex items-center gap-2 rounded-xl border border-white/[0.06] bg-bg-2 px-5 py-2.5 text-[13px] font-semibold text-txt-2 transition-colors hover:border-v/30 hover:text-txt"
          >
            <ListChecks size={15} />
            Жагсаалтууд
          </Link>
          <Link
            href="/dashboard/email-marketing/campaigns/new"
            className="flex items-center gap-2 rounded-xl bg-v px-5 py-2.5 text-[13px] font-bold text-white shadow-[0_0_16px_rgba(108,99,255,0.25)] transition-all hover:bg-v/90"
          >
            <Plus size={15} />
            Шинэ кампани
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-6 grid gap-4 sm:grid-cols-4">
        {statsLoading
          ? Array.from({ length: 4 }).map((_, i) => <StatSkeleton key={i} />)
          : statCards.map((s) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.label}
                  className="rounded-2xl border border-white/[0.04] bg-bg-2 p-5"
                >
                  <div
                    className={`mb-3 flex h-9 w-9 items-center justify-center rounded-lg ${s.bg}`}
                  >
                    <Icon size={16} className={s.color} />
                  </div>
                  <div className="font-syne text-xl font-bold text-txt">
                    {typeof s.value === "number"
                      ? s.value.toLocaleString()
                      : s.value}
                  </div>
                  <div className="text-[11px] text-txt-3">{s.label}</div>
                </div>
              );
            })}
      </div>

      {/* Recent Campaigns */}
      <div className="rounded-2xl border border-white/[0.04] bg-bg-2 p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-syne text-base font-bold text-txt">
            Сүүлийн кампанит ажлууд
          </h3>
          <Link
            href="/dashboard/email-marketing/campaigns/new"
            className="text-[12px] font-medium text-v hover:underline"
          >
            Бүгдийг харах →
          </Link>
        </div>

        {/* Table header */}
        <div className="mb-2 hidden items-center gap-4 px-5 text-[10px] font-semibold uppercase tracking-wider text-txt-3 sm:flex">
          <div className="flex-1">Нэр</div>
          <div className="w-20 text-center">Статус</div>
          <div className="w-20 text-right">Илгээсэн</div>
          <div className="w-20 text-right">Нээлт %</div>
          <div className="w-20 text-right">Клик %</div>
          <div className="w-28 text-right">Огноо</div>
        </div>

        <div className="space-y-2">
          {campaignsLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <TableRowSkeleton key={i} />
              ))
            : (campaigns ?? []).map((c: any) => {
                const openRate =
                  c.totalSent > 0
                    ? ((c.opened / c.totalSent) * 100).toFixed(1)
                    : "0.0";
                const clickRate =
                  c.totalSent > 0
                    ? ((c.clicked / c.totalSent) * 100).toFixed(1)
                    : "0.0";

                return (
                  <Link
                    key={c.id}
                    href={`/dashboard/email-marketing/campaigns/${c.id}`}
                    className="flex items-center gap-4 rounded-xl border border-white/[0.03] bg-white/[0.01] px-5 py-4 transition-all hover:border-v/20 hover:bg-white/[0.02]"
                  >
                    <div className="flex-1">
                      <div className="text-[13px] font-semibold text-txt">
                        {c.name}
                      </div>
                      <div className="mt-0.5 text-[11px] text-txt-3">
                        {c.subject}
                      </div>
                    </div>

                    <div className="hidden w-20 justify-center sm:flex">
                      <StatusBadge status={c.status} />
                    </div>

                    <div className="hidden w-20 text-right text-[13px] text-txt-2 sm:block">
                      {(c.totalSent ?? 0).toLocaleString()}
                    </div>

                    <div className="hidden w-20 text-right sm:block">
                      <span className="text-[13px] font-medium text-t">
                        {openRate}%
                      </span>
                    </div>

                    <div className="hidden w-20 text-right sm:block">
                      <span className="text-[13px] text-txt-2">
                        {clickRate}%
                      </span>
                    </div>

                    <div className="hidden w-28 text-right text-[11px] text-txt-3 sm:block">
                      {c.createdAt
                        ? new Date(c.createdAt).toLocaleDateString("mn-MN")
                        : "—"}
                    </div>
                  </Link>
                );
              })}

          {!campaignsLoading && (!campaigns || campaigns.length === 0) && (
            <div className="py-12 text-center">
              <Mail size={32} className="mx-auto mb-3 text-txt-3" />
              <p className="text-[13px] text-txt-3">
                Одоогоор кампани байхгүй байна
              </p>
              <Link
                href="/dashboard/email-marketing/campaigns/new"
                className="mt-3 inline-flex items-center gap-1.5 text-[12px] font-medium text-v hover:underline"
              >
                <Plus size={13} />
                Эхний кампанит ажлаа үүсгэ
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
