"use client";

import { useSession } from "next-auth/react";
import { trpc } from "@/lib/trpc-client";
import {
  Globe,
  ShoppingCart,
  Banknote,
  Bot,
  Server,
  AlertCircle,
} from "lucide-react";

function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-white/[0.04] bg-bg-2 p-5">
      <div className="mb-3 h-9 w-9 animate-pulse rounded-lg bg-bg-3" />
      <div className="mb-2 h-6 w-24 animate-pulse rounded bg-bg-3" />
      <div className="h-3 w-16 animate-pulse rounded bg-bg-3" />
    </div>
  );
}

function SkeletonRow() {
  return (
    <div className="flex items-center gap-3 rounded-lg p-2">
      <div className="h-2 w-2 animate-pulse rounded-full bg-bg-3" />
      <div className="flex-1">
        <div className="h-3 w-48 animate-pulse rounded bg-bg-3" />
      </div>
      <div className="h-3 w-20 animate-pulse rounded bg-bg-3" />
    </div>
  );
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const stats = trpc.analytics.getDashboardStats.useQuery();
  const orders = trpc.order.getOrders.useQuery({ limit: 5 });
  const tickets = trpc.ticket.getTickets.useQuery();

  const userName = session?.user?.name ?? "Хэрэглэгч";

  const statCards = stats.data
    ? [
        {
          label: "Нийт домэйн",
          value: stats.data.totalDomains,
          icon: Globe,
          color: "bg-v/10",
          iconColor: "text-v",
        },
        {
          label: "Нийт захиалга",
          value: stats.data.totalOrders,
          icon: ShoppingCart,
          color: "bg-t/10",
          iconColor: "text-t",
        },
        {
          label: "Нийт орлого",
          value: `₮${stats.data.totalRevenue.toLocaleString()}`,
          icon: Banknote,
          color: "bg-[#FFB02E]/10",
          iconColor: "text-[#FFB02E]",
        },
        {
          label: "AI шийдвэрлэсэн",
          value: `${stats.data.aiResolvedPercent}%`,
          icon: Bot,
          color: "bg-[#FF6B9D]/10",
          iconColor: "text-[#FF6B9D]",
        },
        {
          label: "Идэвхтэй захиалга",
          value: stats.data.activeSubscriptions,
          icon: Server,
          color: "bg-v/10",
          iconColor: "text-v",
        },
      ]
    : [];

  return (
    <div>
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="font-syne text-2xl font-bold tracking-tight text-txt">
          Сайн байна уу, {userName}
        </h1>
        <p className="mt-1 text-[13px] text-txt-3">
          Таны бүх үйлчилгээний ерөнхий мэдээлэл
        </p>
      </div>

      {/* Stats cards */}
      {stats.isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : stats.isError ? (
        <div className="flex items-center gap-2 rounded-2xl border border-red-500/20 bg-red-500/5 p-4 text-[13px] text-red-400">
          <AlertCircle size={16} />
          Мэдээлэл ачааллахад алдаа гарлаа
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {statCards.map((card) => (
            <div
              key={card.label}
              className="rounded-2xl border border-white/[0.04] bg-bg-2 p-5"
            >
              <div
                className={`mb-3 flex h-9 w-9 items-center justify-center rounded-lg ${card.color}`}
              >
                <card.icon size={16} className={card.iconColor} />
              </div>
              <div className="font-syne text-xl font-bold text-txt">
                {card.value}
              </div>
              <div className="text-[11px] text-txt-3">{card.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Recent Orders */}
      <div className="mt-6 rounded-2xl border border-white/[0.04] bg-bg-2 p-6">
        <h3 className="mb-4 font-syne text-base font-bold text-txt">
          Сүүлийн захиалгууд
        </h3>
        {orders.isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <SkeletonRow key={i} />
            ))}
          </div>
        ) : orders.isError ? (
          <p className="text-[13px] text-red-400">Ачааллахад алдаа гарлаа</p>
        ) : !orders.data || orders.data.orders.length === 0 ? (
          <p className="text-[13px] text-txt-3">Захиалга байхгүй байна</p>
        ) : (
          <div className="space-y-3">
            {orders.data!.orders.map((order) => {
              const statusColors: Record<string, string> = {
                PAID: "bg-t",
                PENDING: "bg-[#FFB02E]",
                FAILED: "bg-red-500",
                CANCELLED: "bg-txt-3",
                REFUNDED: "bg-v",
              };
              const statusLabels: Record<string, string> = {
                PAID: "Төлсөн",
                PENDING: "Хүлээгдэж буй",
                FAILED: "Амжилтгүй",
                CANCELLED: "Цуцлагдсан",
                REFUNDED: "Буцаагдсан",
              };
              const detail =
                order.domain?.name ??
                order.subscription?.plan?.name ??
                `#${order.id.slice(0, 8)}`;
              return (
                <div
                  key={order.id}
                  className="flex items-center gap-3 rounded-lg p-2 transition-all hover:bg-white/[0.02]"
                >
                  <div
                    className={`h-2 w-2 rounded-full ${statusColors[order.status] ?? "bg-txt-3"}`}
                  />
                  <div className="flex-1">
                    <span className="text-[13px] font-medium text-txt">
                      {order.type === "DOMAIN" ? "Домэйн захиалга" : "Захиалга"}
                    </span>
                    <span className="mx-2 text-txt-4">·</span>
                    <span className="text-[13px] text-txt-2">{detail}</span>
                    <span className="mx-2 text-txt-4">·</span>
                    <span className="text-[13px] font-semibold text-txt">
                      ₮{order.amount.toLocaleString()}
                    </span>
                  </div>
                  <span
                    className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                      order.status === "PAID"
                        ? "bg-t/15 text-t"
                        : order.status === "PENDING"
                          ? "bg-[#FFB02E]/15 text-[#FFB02E]"
                          : "bg-red-500/15 text-red-400"
                    }`}
                  >
                    {statusLabels[order.status] ?? order.status}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* AI Fix Panel - Tickets */}
      <div className="mt-6 rounded-2xl border border-white/[0.04] bg-bg-2 p-6">
        <h3 className="mb-4 font-syne text-base font-bold text-txt">
          AI тусламж & Тикетүүд
        </h3>
        {tickets.isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <SkeletonRow key={i} />
            ))}
          </div>
        ) : tickets.isError ? (
          <p className="text-[13px] text-red-400">Ачааллахад алдаа гарлаа</p>
        ) : !tickets.data || tickets.data.length === 0 ? (
          <p className="text-[13px] text-txt-3">Тикет байхгүй байна</p>
        ) : (
          <div className="space-y-3">
            {tickets.data!.slice(0, 5).map((ticket) => {
              const priorityColors: Record<string, string> = {
                LOW: "bg-txt-3",
                MEDIUM: "bg-[#FFB02E]",
                HIGH: "bg-[#FF6B9D]",
                URGENT: "bg-red-500",
              };
              const statusLabels: Record<string, string> = {
                OPEN: "Нээлттэй",
                IN_PROGRESS: "Шийдвэрлэж буй",
                RESOLVED: "Шийдвэрлэсэн",
                CLOSED: "Хаагдсан",
              };
              return (
                <div
                  key={ticket.id}
                  className="flex items-center gap-3 rounded-lg p-2 transition-all hover:bg-white/[0.02]"
                >
                  <div
                    className={`h-2 w-2 rounded-full ${priorityColors[ticket.priority] ?? "bg-txt-3"}`}
                  />
                  <div className="flex-1">
                    <span className="text-[13px] font-medium text-txt">
                      {ticket.subject}
                    </span>
                  </div>
                  <span
                    className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                      ticket.status === "RESOLVED" || ticket.status === "CLOSED"
                        ? "bg-t/15 text-t"
                        : ticket.status === "IN_PROGRESS"
                          ? "bg-[#FFB02E]/15 text-[#FFB02E]"
                          : "bg-v/15 text-v"
                    }`}
                  >
                    {statusLabels[ticket.status] ?? ticket.status}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
