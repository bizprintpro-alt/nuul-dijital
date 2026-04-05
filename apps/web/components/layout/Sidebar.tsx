"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Globe, Server, Cloud, PanelsTopLeft, ShoppingCart,
  Mail, Bot, Users, Phone, BarChart3, Receipt, Headphones, ChevronLeft,
  Shield,
} from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  LayoutDashboard, Globe, Server, Cloud, PanelsTopLeft, ShoppingCart,
  Mail, Bot, Users, Phone, BarChart3, Receipt, Headphones, Shield,
};

const navGroups = [
  {
    group: "ҮНДСЭН",
    items: [{ label: "Хянах самбар", href: "/dashboard", icon: "LayoutDashboard" }],
  },
  {
    group: "ДОМЭЙН & ХОСТ",
    items: [
      { label: "Домэйн захиалах", href: "/dashboard/domains", icon: "Globe" },
      { label: "Хостинг", href: "/dashboard/hosting", icon: "Server", badge: "Шинэ" },
      { label: "VPS/Cloud", href: "/dashboard/vps", icon: "Cloud" },
    ],
  },
  {
    group: "БИЗНЕСИЙН ХЭРЭГСЭЛ",
    items: [
      { label: "Вэбсайт Builder", href: "/dashboard/website-builder", icon: "PanelsTopLeft" },
      { label: "eSeller дэлгүүр", href: "/dashboard/eseller", icon: "ShoppingCart", badge: "4" },
      { label: "И-мэйл маркетинг", href: "/dashboard/email-marketing", icon: "Mail" },
    ],
  },
  {
    group: "AI ҮЙЛЧИЛГЭЭ",
    items: [
      { label: "AI Чатбот Builder", href: "/dashboard/chatbot", icon: "Bot", badge: "AI" },
      { label: "CRM & Борлуулалт", href: "/dashboard/crm", icon: "Users" },
      { label: "Call Center 24/7", href: "/dashboard/call-center", icon: "Phone" },
    ],
  },
  {
    group: "АДМИН",
    items: [
      { label: "Админ панел", href: "/dashboard/admin", icon: "Shield" },
      { label: "Хэрэглэгчид", href: "/dashboard/admin/users", icon: "Users" },
      { label: "Захиалгууд", href: "/dashboard/admin/orders", icon: "ShoppingCart" },
      { label: "Домэйнууд", href: "/dashboard/admin/domains", icon: "Globe" },
    ],
  },
  {
    group: "ТАЙЛАН",
    items: [
      { label: "Аналитик", href: "/dashboard/analytics", icon: "BarChart3" },
      { label: "Нэхэмжлэх & Төлбөр", href: "/dashboard/invoices", icon: "Receipt" },
      { label: "AI Дэмжлэг", href: "/dashboard/support", icon: "Headphones", badge: "8" },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-[260px] flex-col border-r border-white/[0.04] bg-bg-2">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2.5 px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-v to-v-dark shadow-[0_0_16px_rgba(108,99,255,0.3)]">
          <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
            <path d="M9 2L16 14H2Z" stroke="#fff" strokeWidth="1.8" strokeLinejoin="round" />
            <path d="M9 7L12.5 13H5.5Z" fill="#fff" opacity=".45" />
            <circle cx="9" cy="9" r="1.6" fill="#fff" />
          </svg>
        </div>
        <span className="font-syne text-[17px] font-bold tracking-tight">
          nuul<span className="text-v-soft">.mn</span>
        </span>
      </div>

      {/* Navigation */}
      <nav className="sidebar-scroll flex-1 overflow-y-auto px-3 pb-4">
        {navGroups.map((group) => (
          <div key={group.group} className="mb-2">
            <div className="mb-1.5 mt-5 px-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-txt-3">
              {group.group}
            </div>
            {group.items.map((item) => {
              const Icon = iconMap[item.icon] || LayoutDashboard;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group mb-0.5 flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium transition-all ${
                    isActive
                      ? "bg-v/10 text-v-soft"
                      : "text-txt-2 hover:bg-white/[0.03] hover:text-txt"
                  }`}
                >
                  <Icon
                    size={17}
                    className={isActive ? "text-v" : "text-txt-3 group-hover:text-txt-2"}
                  />
                  <span className="flex-1">{item.label}</span>
                  {"badge" in item && item.badge && (
                    <span
                      className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold ${
                        item.badge === "AI"
                          ? "bg-v/15 text-v-soft"
                          : item.badge === "Шинэ"
                            ? "bg-t/15 text-t"
                            : "bg-white/[0.06] text-txt-3"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Bottom section */}
      <div className="border-t border-white/[0.04] p-4">
        <div className="flex items-center gap-3 rounded-lg bg-v/[0.06] p-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-v/20 text-xs font-bold text-v-soft">
            А
          </div>
          <div className="flex-1 min-w-0">
            <div className="truncate text-[12px] font-semibold text-txt">Admin</div>
            <div className="truncate text-[11px] text-txt-3">admin@nuul.mn</div>
          </div>
          <ChevronLeft size={14} className="rotate-[270deg] text-txt-3" />
        </div>
      </div>
    </aside>
  );
}
