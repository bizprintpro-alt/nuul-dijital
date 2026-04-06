"use client";

import { Search, Plus, Menu } from "lucide-react";
import { NotificationBell } from "./NotificationBell";
import { useSidebar } from "./SidebarContext";

export function Topbar() {
  const { toggle } = useSidebar();

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
        <div className="relative hidden flex-1 sm:block sm:max-w-md">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-txt-3" />
          <input
            type="text"
            placeholder="Хайх... (домэйн, захиалга, харилцагч)"
            className="h-9 w-full rounded-lg border border-white/[0.06] bg-white/[0.02] pl-9 pr-4 text-[13px] text-txt outline-none transition-all placeholder:text-txt-3 focus:border-v/30 focus:bg-white/[0.04]"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 rounded border border-white/[0.06] bg-white/[0.03] px-1.5 py-0.5 text-[10px] text-txt-3">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        <button className="hidden items-center gap-2 rounded-lg bg-v px-3.5 py-2 text-[12px] font-bold text-white shadow-[0_0_16px_rgba(108,99,255,0.25)] transition-all hover:-translate-y-0.5 hover:shadow-[0_0_24px_rgba(108,99,255,0.4)] sm:flex">
          <Plus size={14} />
          Шинэ захиалга
        </button>

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
