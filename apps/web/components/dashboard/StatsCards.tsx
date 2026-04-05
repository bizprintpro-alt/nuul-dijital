"use client";

import { Globe, Server, ShoppingCart, Bot, TrendingUp, TrendingDown } from "lucide-react";

const stats = [
  {
    label: "Идэвхтэй домэйн",
    value: "12",
    change: "+2",
    trend: "up" as const,
    icon: Globe,
    iconBg: "bg-v/10",
    iconColor: "text-v",
  },
  {
    label: "Хостинг серверүүд",
    value: "5",
    change: "+1",
    trend: "up" as const,
    icon: Server,
    iconBg: "bg-t/10",
    iconColor: "text-t",
  },
  {
    label: "eSeller захиалга",
    value: "847",
    change: "+124",
    trend: "up" as const,
    icon: ShoppingCart,
    iconBg: "bg-[#FFB02E]/10",
    iconColor: "text-[#FFB02E]",
  },
  {
    label: "AI Чатбот хариулт",
    value: "2,341",
    change: "94%",
    trend: "up" as const,
    icon: Bot,
    iconBg: "bg-[#FF6B9D]/10",
    iconColor: "text-[#FF6B9D]",
  },
];

export function StatsCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className="group rounded-2xl border border-white/[0.04] bg-bg-2 p-5 transition-all hover:border-v/10 hover:bg-bg-3"
          >
            <div className="mb-4 flex items-center justify-between">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.iconBg}`}>
                <Icon size={18} className={stat.iconColor} />
              </div>
              <div className="flex items-center gap-1 text-[12px] font-medium text-t">
                <TrendingUp size={12} />
                {stat.change}
              </div>
            </div>
            <div className="font-syne text-2xl font-bold tracking-tight text-txt">
              {stat.value}
            </div>
            <div className="mt-0.5 text-[12px] text-txt-3">{stat.label}</div>
          </div>
        );
      })}
    </div>
  );
}
