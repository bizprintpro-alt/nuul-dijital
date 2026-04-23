"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Search, Plus, Menu, Globe, Server, ShoppingCart, Bot, Mail, X } from "lucide-react";
import { NotificationBell } from "./NotificationBell";
import { useSidebar } from "./SidebarContext";

const quickActions = [
  { label: "Домэйн захиалах", href: "/dashboard/domains", icon: Globe, color: "text-v" },
  { label: "Хостинг захиалах", href: "/dashboard/hosting", icon: Server, color: "text-t" },
  { label: "VPS захиалах", href: "/dashboard/vps", icon: Server, color: "text-[#FFB02E]" },
  { label: "Чатбот үүсгэх", href: "/dashboard/chatbot", icon: Bot, color: "text-[#FF6B9D]" },
  { label: "И-мэйл кампани", href: "/dashboard/email-marketing", icon: Mail, color: "text-v-soft" },
  { label: "Үйлчилгээ захиалах", href: "/services", icon: ShoppingCart, color: "text-t" },
];

export function Topbar() {
  const { toggle } = useSidebar();
  const router = useRouter();
  const { data: session } = useSession();
  const [showActions, setShowActions] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const userRole = (session?.user as { role?: string })?.role ?? "CLIENT";

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = searchValue.trim();
    if (!q) return;
    const target = userRole === "ADMIN"
      ? `/dashboard/admin/users?q=${encodeURIComponent(q)}`
      : `/dashboard/domains`;
    router.push(target);
    setSearchValue("");
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-white/[0.04] bg-bg/80 px-4 backdrop-blur-xl lg:px-8">
      {/* Left side */}
      <div className="flex items-center gap-3">
        {/* Hamburger - mobile only */}
        <button
          onClick={toggle}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.06] bg-white/[0.02] transition-all hover:bg-white/[0.04] lg:hidden"
        >
          <Menu size={18} className="text-txt-2" />
        </button>

        {/* Search */}
        <form onSubmit={handleSearch} className="relative hidden flex-1 sm:block sm:max-w-md">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-txt-3" />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder={userRole === "ADMIN" ? "Хэрэглэгч хайх..." : "Домэйн хайх..."}
            className="h-9 w-full rounded-lg border border-white/[0.06] bg-white/[0.02] pl-9 pr-12 text-[13px] text-txt outline-none transition-all placeholder:text-txt-3 focus:border-v/30 focus:bg-white/[0.04]"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 rounded border border-white/[0.06] bg-white/[0.03] px-1.5 py-0.5 text-[10px] text-txt-3">
            ↵
          </kbd>
        </form>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <button
            onClick={() => setShowActions(!showActions)}
            className="hidden items-center gap-2 rounded-lg bg-v px-3.5 py-2 text-[12px] font-bold text-white shadow-[0_0_16px_rgba(108,99,255,0.25)] transition-all hover:-translate-y-0.5 hover:shadow-[0_0_24px_rgba(108,99,255,0.4)] sm:flex"
          >
            <Plus size={14} />
            Шинэ захиалга
          </button>
          {showActions && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowActions(false)} />
              <div className="absolute right-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-xl border border-white/[0.06] bg-bg-2 shadow-xl">
                <div className="flex items-center justify-between border-b border-white/[0.04] px-4 py-2.5">
                  <span className="text-[12px] font-semibold text-txt">Шинэ захиалга</span>
                  <button onClick={() => setShowActions(false)} className="text-txt-3 hover:text-txt"><X size={14} /></button>
                </div>
                {quickActions.map((action) => (
                  <button
                    key={action.href}
                    onClick={() => { setShowActions(false); router.push(action.href); }}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-[12px] text-txt-2 transition hover:bg-white/[0.03] hover:text-txt"
                  >
                    <action.icon size={15} className={action.color} />
                    {action.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        <NotificationBell />

        <div className="ml-2 flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-v to-t text-xs font-bold text-white">
            А
          </div>
        </div>
      </div>
    </header>
  );
}
