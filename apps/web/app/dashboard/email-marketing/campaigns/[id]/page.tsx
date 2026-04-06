"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Send,
  CheckCircle,
  Eye,
  MousePointerClick,
  RotateCcw,
  XCircle,
  Pencil,
  Copy,
  Loader2,
  Clock,
  Mail,
} from "lucide-react";
import { trpc } from "@/lib/trpc-client";

// ── Status badge ──────────────────────────────────────────────────
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
      className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1 text-[12px] font-bold ${config.className}`}
    >
      {config.spinning && <Loader2 size={12} className="animate-spin" />}
      {config.label}
    </span>
  );
}

// ── Stat Card ─────────────────────────────────────────────────────
function StatCard({
  icon: Icon,
  label,
  value,
  subtitle,
  color,
  bg,
}: {
  icon: typeof Send;
  label: string;
  value: string | number;
  subtitle?: string;
  color: string;
  bg: string;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.04] bg-bg-2 p-5">
      <div className={`mb-3 flex h-9 w-9 items-center justify-center rounded-lg ${bg}`}>
        <Icon size={16} className={color} />
      </div>
      <div className="font-syne text-xl font-bold text-txt">{value}</div>
      <div className="text-[11px] text-txt-3">{label}</div>
      {subtitle && (
        <div className="mt-0.5 text-[10px] text-txt-3/60">{subtitle}</div>
      )}
    </div>
  );
}

// ── Skeleton ──────────────────────────────────────────────────────
function StatSkeleton() {
  return (
    <div className="rounded-2xl border border-white/[0.04] bg-bg-2 p-5">
      <div className="mb-3 h-9 w-9 animate-pulse rounded-lg bg-bg-3" />
      <div className="mb-2 h-6 w-16 animate-pulse rounded bg-bg-3" />
      <div className="h-3 w-24 animate-pulse rounded bg-bg-3" />
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="h-8 w-64 animate-pulse rounded bg-bg-3" />
        <div className="h-6 w-20 animate-pulse rounded-lg bg-bg-3" />
      </div>
      <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <StatSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────
export default function CampaignDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data: campaign, isLoading } =
    trpc.emailMarketing.getCampaign.useQuery({ id });

  const createCampaign = trpc.emailMarketing.createCampaign.useMutation({
    onSuccess: (data: any) => {
      router.push(`/dashboard/email-marketing/campaigns/new`);
    },
  });

  if (isLoading) {
    return (
      <div>
        <div className="mb-6 flex items-center gap-4">
          <Link
            href="/dashboard/email-marketing"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.06] text-txt-3 transition-colors hover:text-txt"
          >
            <ArrowLeft size={16} />
          </Link>
          <div className="h-8 w-48 animate-pulse rounded bg-bg-3" />
        </div>
        <DetailSkeleton />
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="py-20 text-center">
        <Mail size={32} className="mx-auto mb-3 text-txt-3" />
        <p className="text-[13px] text-txt-3">Кампани олдсонгүй</p>
        <Link
          href="/dashboard/email-marketing"
          className="mt-3 inline-block text-[12px] font-medium text-v hover:underline"
        >
          Буцах
        </Link>
      </div>
    );
  }

  const c = campaign as any;
  const totalSent = c.totalSent ?? 0;
  const delivered = c.delivered ?? totalSent;
  const opened = c.opened ?? 0;
  const clicked = c.clicked ?? 0;
  const bounced = c.bounced ?? 0;
  const unsubscribed = c.unsubscribed ?? 0;

  const openRate = totalSent > 0 ? ((opened / totalSent) * 100).toFixed(1) : "0.0";
  const clickRate = totalSent > 0 ? ((clicked / totalSent) * 100).toFixed(1) : "0.0";
  const bounceRate = totalSent > 0 ? ((bounced / totalSent) * 100).toFixed(1) : "0.0";
  const unsubRate = totalSent > 0 ? ((unsubscribed / totalSent) * 100).toFixed(1) : "0.0";

  const stats = [
    {
      icon: Send,
      label: "Илгээсэн",
      value: totalSent.toLocaleString(),
      subtitle: "нийт",
      color: "text-v",
      bg: "bg-v/10",
    },
    {
      icon: CheckCircle,
      label: "Хүргэгдсэн",
      value: delivered.toLocaleString(),
      subtitle: totalSent > 0 ? `${((delivered / totalSent) * 100).toFixed(1)}%` : "0%",
      color: "text-t",
      bg: "bg-t/10",
    },
    {
      icon: Eye,
      label: "Нээлт",
      value: opened.toLocaleString(),
      subtitle: `${openRate}%`,
      color: "text-[#3B82F6]",
      bg: "bg-[#3B82F6]/10",
    },
    {
      icon: MousePointerClick,
      label: "Клик",
      value: clicked.toLocaleString(),
      subtitle: `${clickRate}%`,
      color: "text-[#FFB02E]",
      bg: "bg-[#FFB02E]/10",
    },
    {
      icon: RotateCcw,
      label: "Буцаасан",
      value: bounced.toLocaleString(),
      subtitle: `${bounceRate}%`,
      color: "text-[#EF4444]",
      bg: "bg-[#EF4444]/10",
    },
    {
      icon: XCircle,
      label: "Цуцлалт",
      value: unsubscribed.toLocaleString(),
      subtitle: `${unsubRate}%`,
      color: "text-[#F97316]",
      bg: "bg-[#F97316]/10",
    },
  ];

  const handleDuplicate = () => {
    createCampaign.mutate({
      name: `${c.name} (хуулбар)`,
      subject: c.subject,
      previewText: c.previewText ?? "",
      listId: c.listId ?? undefined,
      htmlContent: c.htmlContent ?? "",
    });
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center gap-4">
        <Link
          href="/dashboard/email-marketing"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.06] text-txt-3 transition-colors hover:text-txt"
        >
          <ArrowLeft size={16} />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="font-syne text-2xl font-bold tracking-tight text-txt">
              {c.name}
            </h1>
            <StatusBadge status={c.status} />
          </div>
          <p className="mt-1 text-[13px] text-txt-3">
            Кампанит ажлын дэлгэрэнгүй
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleDuplicate}
            disabled={createCampaign.isPending}
            className="flex items-center gap-2 rounded-xl border border-white/[0.06] bg-bg-2 px-4 py-2.5 text-[13px] font-semibold text-txt-2 transition-colors hover:border-v/30 hover:text-txt disabled:opacity-50"
          >
            <Copy size={14} />
            Давтах
          </button>
          {c.status === "DRAFT" && (
            <Link
              href="/dashboard/email-marketing/campaigns/new"
              className="flex items-center gap-2 rounded-xl bg-v px-5 py-2.5 text-[13px] font-bold text-white shadow-[0_0_16px_rgba(108,99,255,0.25)] transition-all hover:bg-v/90"
            >
              <Pencil size={14} />
              Засах
            </Link>
          )}
        </div>
      </div>

      {/* Stats grid */}
      <div className="mb-6 grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      {/* Campaign details */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Info */}
        <div className="rounded-2xl border border-white/[0.04] bg-bg-2 p-6">
          <h3 className="mb-4 font-syne text-base font-bold text-txt">
            Мэдээлэл
          </h3>
          <div className="space-y-4">
            <div>
              <div className="text-[11px] font-medium text-txt-3">
                Гарчиг (Subject)
              </div>
              <div className="mt-1 text-[14px] font-medium text-txt">
                {c.subject}
              </div>
            </div>

            {c.previewText && (
              <div>
                <div className="text-[11px] font-medium text-txt-3">
                  Товч тайлбар (Preview text)
                </div>
                <div className="mt-1 text-[13px] text-txt-2">
                  {c.previewText}
                </div>
              </div>
            )}

            <div>
              <div className="text-[11px] font-medium text-txt-3">
                Илгээсэн огноо
              </div>
              <div className="mt-1 flex items-center gap-2 text-[13px] text-txt-2">
                <Clock size={13} className="text-txt-3" />
                {c.sentAt
                  ? new Date(c.sentAt).toLocaleString("mn-MN")
                  : c.scheduledAt
                  ? `Хуваарьт: ${new Date(c.scheduledAt).toLocaleString("mn-MN")}`
                  : c.createdAt
                  ? new Date(c.createdAt).toLocaleString("mn-MN")
                  : "—"}
              </div>
            </div>

            {c.list && (
              <div>
                <div className="text-[11px] font-medium text-txt-3">
                  Жагсаалт
                </div>
                <div className="mt-1 text-[13px] text-txt-2">
                  {c.list.name}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Performance visualization */}
        <div className="rounded-2xl border border-white/[0.04] bg-bg-2 p-6">
          <h3 className="mb-4 font-syne text-base font-bold text-txt">
            Гүйцэтгэл
          </h3>

          <div className="space-y-4">
            {/* Open rate bar */}
            <div>
              <div className="mb-1.5 flex justify-between text-[12px]">
                <span className="text-txt-2">Нээлтийн хувь</span>
                <span className="font-bold text-[#3B82F6]">{openRate}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-bg-3">
                <div
                  className="h-full rounded-full bg-[#3B82F6] transition-all"
                  style={{ width: `${Math.min(parseFloat(openRate), 100)}%` }}
                />
              </div>
            </div>

            {/* Click rate bar */}
            <div>
              <div className="mb-1.5 flex justify-between text-[12px]">
                <span className="text-txt-2">Кликийн хувь</span>
                <span className="font-bold text-[#FFB02E]">{clickRate}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-bg-3">
                <div
                  className="h-full rounded-full bg-[#FFB02E] transition-all"
                  style={{ width: `${Math.min(parseFloat(clickRate), 100)}%` }}
                />
              </div>
            </div>

            {/* Bounce rate bar */}
            <div>
              <div className="mb-1.5 flex justify-between text-[12px]">
                <span className="text-txt-2">Буцаалтын хувь</span>
                <span className="font-bold text-[#EF4444]">{bounceRate}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-bg-3">
                <div
                  className="h-full rounded-full bg-[#EF4444] transition-all"
                  style={{ width: `${Math.min(parseFloat(bounceRate), 100)}%` }}
                />
              </div>
            </div>

            {/* Unsubscribe rate bar */}
            <div>
              <div className="mb-1.5 flex justify-between text-[12px]">
                <span className="text-txt-2">Цуцлалтын хувь</span>
                <span className="font-bold text-[#F97316]">{unsubRate}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-bg-3">
                <div
                  className="h-full rounded-full bg-[#F97316] transition-all"
                  style={{ width: `${Math.min(parseFloat(unsubRate), 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Funnel summary */}
          <div className="mt-6 flex items-center justify-center gap-2 text-[11px] text-txt-3">
            <span>{totalSent.toLocaleString()} илгээсэн</span>
            <span>→</span>
            <span className="text-[#3B82F6]">{opened.toLocaleString()} нээсэн</span>
            <span>→</span>
            <span className="text-[#FFB02E]">{clicked.toLocaleString()} дарсан</span>
          </div>
        </div>
      </div>
    </div>
  );
}
