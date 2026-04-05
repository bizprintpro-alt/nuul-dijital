"use client";

import { Search, Bell, Plus } from "lucide-react";

export function Topbar() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-white/[0.04] bg-bg/80 px-8 backdrop-blur-xl">
      {/* Search */}
      <div className="relative max-w-md flex-1">
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

      {/* Right side */}
      <div className="flex items-center gap-3">
        <button className="flex items-center gap-2 rounded-lg bg-v px-3.5 py-2 text-[12px] font-bold text-white shadow-[0_0_16px_rgba(108,99,255,0.25)] transition-all hover:-translate-y-0.5 hover:shadow-[0_0_24px_rgba(108,99,255,0.4)]">
          <Plus size={14} />
          Шинэ захиалга
        </button>

        <button className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.06] bg-white/[0.02] transition-all hover:bg-white/[0.04]">
          <Bell size={15} className="text-txt-2" />
          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-v text-[9px] font-bold text-white">
            3
          </span>
        </button>

        <div className="ml-2 flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-v to-t text-xs font-bold text-white">
            А
          </div>
        </div>
      </div>
    </header>
  );
}
