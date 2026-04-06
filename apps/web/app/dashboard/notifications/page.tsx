// @ts-nocheck
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, CreditCard, Globe, Server, Headphones, DollarSign, Trash2, Check, Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc-client";

const typeIcons: Record<string, React.ElementType> = {
  PAYMENT_SUCCESS: CreditCard,
  DOMAIN_EXPIRY: Globe,
  HOSTING_READY: Server,
  SUPPORT_REPLY: Headphones,
  COMMISSION_EARNED: DollarSign,
  SYSTEM: Bell,
};

const typeLabels: Record<string, string> = {
  PAYMENT_SUCCESS: "Төлбөр",
  DOMAIN_EXPIRY: "Домэйн",
  HOSTING_READY: "Хостинг",
  SUPPORT_REPLY: "Дэмжлэг",
  COMMISSION_EARNED: "Комисс",
  SYSTEM: "Систем",
};

function timeAgo(date: string | Date) {
  const now = new Date();
  const d = new Date(date);
  const diff = Math.floor((now.getTime() - d.getTime()) / 1000);
  if (diff < 60) return "Саяхан";
  if (diff < 3600) return `${Math.floor(diff / 60)} минутын өмнө`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} цагийн өмнө`;
  if (diff < 604800) return `${Math.floor(diff / 86400)} өдрийн өмнө`;
  return d.toLocaleDateString("mn-MN");
}

export default function NotificationsPage() {
  const router = useRouter();
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [page, setPage] = useState(1);

  const { data, isLoading } = trpc.notification.getNotifications.useQuery({
    page,
    unreadOnly: filter === "unread",
  });

  const utils = trpc.useUtils();
  const markAsReadMutation = trpc.notification.markAsRead.useMutation({
    onSuccess: () => {
      utils.notification.getNotifications.invalidate();
      utils.notification.getUnreadCount.invalidate();
    },
  });
  const markAllReadMutation = trpc.notification.markAllRead.useMutation({
    onSuccess: () => {
      utils.notification.getNotifications.invalidate();
      utils.notification.getUnreadCount.invalidate();
    },
  });
  const deleteMutation = trpc.notification.deleteNotification.useMutation({
    onSuccess: () => {
      utils.notification.getNotifications.invalidate();
      utils.notification.getUnreadCount.invalidate();
    },
  });

  const notifications = data?.notifications ?? [];
  const totalPages = data?.pages ?? 1;

  const handleClick = (notif: { id: string; isRead: boolean; link?: string | null }) => {
    if (!notif.isRead) {
      markAsReadMutation.mutate({ id: notif.id });
    }
    if (notif.link) {
      router.push(notif.link);
    }
  };

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-syne text-2xl font-bold tracking-tight text-txt">Мэдэгдэл</h1>
          <p className="mt-1 text-[13px] text-txt-3">Бүх мэдэгдлүүдийг энд харна</p>
        </div>
        <button
          onClick={() => markAllReadMutation.mutate()}
          disabled={markAllReadMutation.isPending}
          className="flex items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-2 text-[12px] font-medium text-txt-2 transition-all hover:bg-white/[0.04]"
        >
          <Check size={14} />
          Бүгдийг уншсан
        </button>
      </div>

      {/* Filter tabs */}
      <div className="mb-6 flex gap-1 rounded-lg bg-white/[0.02] p-1">
        {[
          { key: "all" as const, label: "Бүгд" },
          { key: "unread" as const, label: "Уншаагүй" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => {
              setFilter(tab.key);
              setPage(1);
            }}
            className={`rounded-md px-4 py-2 text-[12px] font-medium transition-all ${
              filter === tab.key
                ? "bg-v/10 text-v-soft"
                : "text-txt-3 hover:text-txt-2"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notifications list */}
      <div className="rounded-2xl border border-white/[0.04] bg-bg-2">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 size={24} className="animate-spin text-v" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Bell size={36} className="mb-3 text-txt-3" />
            <p className="text-[13px] text-txt-3">Мэдэгдэл байхгүй</p>
          </div>
        ) : (
          <div className="divide-y divide-white/[0.04]">
            {notifications.map((notif) => {
              const Icon = typeIcons[notif.type] || Bell;
              return (
                <div
                  key={notif.id}
                  className={`flex items-start gap-4 px-6 py-4 transition-all hover:bg-white/[0.01] ${
                    !notif.isRead ? "bg-v/[0.03]" : ""
                  }`}
                >
                  <div className={`mt-0.5 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ${
                    !notif.isRead ? "bg-v/15 text-v" : "bg-white/[0.04] text-txt-3"
                  }`}>
                    <Icon size={18} />
                  </div>

                  <button
                    onClick={() => handleClick(notif)}
                    className="min-w-0 flex-1 text-left"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-semibold text-txt">{notif.title}</span>
                      {!notif.isRead && (
                        <span className="h-2 w-2 flex-shrink-0 rounded-full bg-v" />
                      )}
                      <span className={`ml-1 rounded-md px-1.5 py-0.5 text-[9px] font-bold ${
                        !notif.isRead ? "bg-v/10 text-v-soft" : "bg-white/[0.04] text-txt-3"
                      }`}>
                        {typeLabels[notif.type] || "Систем"}
                      </span>
                    </div>
                    <p className="mt-1 text-[12px] text-txt-2">{notif.message}</p>
                    <span className="mt-1 block text-[11px] text-txt-3/60">{timeAgo(notif.createdAt)}</span>
                  </button>

                  <div className="flex items-center gap-1">
                    {!notif.isRead && (
                      <button
                        onClick={() => markAsReadMutation.mutate({ id: notif.id })}
                        className="rounded-lg p-2 text-txt-3 transition-all hover:bg-white/[0.04] hover:text-t"
                        title="Уншсан"
                      >
                        <Check size={14} />
                      </button>
                    )}
                    <button
                      onClick={() => deleteMutation.mutate({ id: notif.id })}
                      className="rounded-lg p-2 text-txt-3 transition-all hover:bg-red-500/10 hover:text-red-400"
                      title="Устгах"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 border-t border-white/[0.04] px-6 py-4">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`h-8 w-8 rounded-lg text-[12px] font-medium transition-all ${
                  page === p
                    ? "bg-v/15 text-v-soft"
                    : "text-txt-3 hover:bg-white/[0.04]"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
