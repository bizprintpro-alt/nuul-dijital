"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Bell, CreditCard, Globe, Server, Headphones, DollarSign, Check } from "lucide-react";
import { trpc } from "@/lib/trpc-client";

const typeIcons: Record<string, React.ElementType> = {
  PAYMENT_SUCCESS: CreditCard,
  DOMAIN_EXPIRY: Globe,
  HOSTING_READY: Server,
  SUPPORT_REPLY: Headphones,
  COMMISSION_EARNED: DollarSign,
  SYSTEM: Bell,
};

function timeAgo(date: string | Date) {
  const now = new Date();
  const d = new Date(date);
  const diff = Math.floor((now.getTime() - d.getTime()) / 1000);
  if (diff < 60) return "Саяхан";
  if (diff < 3600) return `${Math.floor(diff / 60)} мин`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} цаг`;
  if (diff < 604800) return `${Math.floor(diff / 86400)} өдөр`;
  return d.toLocaleDateString("mn-MN");
}

export function NotificationBell() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const { data: unreadData } = trpc.notification.getUnreadCount.useQuery(undefined, {
    refetchInterval: 30000,
  });

  const { data: notifData } = trpc.notification.getNotifications.useQuery(
    { page: 1, unreadOnly: false },
    { enabled: open }
  );

  const utils = trpc.useUtils();
  const markAsReadMutation = trpc.notification.markAsRead.useMutation({
    onSuccess: () => {
      utils.notification.getUnreadCount.invalidate();
      utils.notification.getNotifications.invalidate();
    },
  });
  const markAllReadMutation = trpc.notification.markAllRead.useMutation({
    onSuccess: () => {
      utils.notification.getUnreadCount.invalidate();
      utils.notification.getNotifications.invalidate();
    },
  });

  const unreadCount = unreadData?.count ?? 0;
  const notifications = notifData?.notifications?.slice(0, 10) ?? [];

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleClick = (notif: { id: string; isRead: boolean; link?: string | null }) => {
    if (!notif.isRead) {
      markAsReadMutation.mutate({ id: notif.id });
    }
    if (notif.link) {
      router.push(notif.link);
    }
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.06] bg-white/[0.02] transition-all hover:bg-white/[0.04]"
      >
        <Bell size={15} className="text-txt-2" />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-80 overflow-hidden rounded-xl border border-white/[0.06] bg-bg-3 shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/[0.04] px-4 py-3">
            <span className="text-[13px] font-semibold text-txt">Мэдэгдэл</span>
            {unreadCount > 0 && (
              <button
                onClick={() => markAllReadMutation.mutate()}
                className="flex items-center gap-1 text-[11px] text-v hover:text-v-soft"
              >
                <Check size={12} />
                Бүгдийг уншсан
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8">
                <Bell size={24} className="mb-2 text-txt-3" />
                <p className="text-[12px] text-txt-3">Мэдэгдэл байхгүй</p>
              </div>
            ) : (
              notifications.map((notif) => {
                const Icon = typeIcons[notif.type] || Bell;
                return (
                  <button
                    key={notif.id}
                    onClick={() => handleClick(notif)}
                    className={`flex w-full items-start gap-3 px-4 py-3 text-left transition-all hover:bg-white/[0.02] ${
                      !notif.isRead ? "bg-v/[0.05]" : ""
                    }`}
                  >
                    <div className={`mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg ${
                      !notif.isRead ? "bg-v/15 text-v" : "bg-white/[0.04] text-txt-3"
                    }`}>
                      <Icon size={14} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="truncate text-[12px] font-semibold text-txt">{notif.title}</span>
                        {!notif.isRead && (
                          <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-v" />
                        )}
                      </div>
                      <p className="mt-0.5 truncate text-[11px] text-txt-3">{notif.message}</p>
                      <span className="mt-1 block text-[10px] text-txt-3/60">{timeAgo(notif.createdAt)}</span>
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-white/[0.04]">
            <button
              onClick={() => {
                router.push("/dashboard/notifications");
                setOpen(false);
              }}
              className="w-full py-2.5 text-center text-[12px] font-medium text-v transition-all hover:bg-white/[0.02]"
            >
              Бүгд харах &rarr;
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
