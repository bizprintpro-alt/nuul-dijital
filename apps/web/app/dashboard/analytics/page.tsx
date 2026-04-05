import { BarChart3, TrendingUp, Eye, Users } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="font-syne text-2xl font-bold tracking-tight text-txt">Аналитик</h1>
        <p className="mt-1 text-[13px] text-txt-3">Бүх үйлчилгээний нэгдсэн тайлан ба статистик</p>
      </div>

      {/* Overview stats */}
      <div className="mb-6 grid gap-4 sm:grid-cols-4">
        {[
          { icon: Eye, label: "Нийт зочилсон", value: "24,521", change: "+18%", color: "text-v", bg: "bg-v/10" },
          { icon: Users, label: "Шинэ хэрэглэгч", value: "342", change: "+24%", color: "text-t", bg: "bg-t/10" },
          { icon: TrendingUp, label: "Орлого (сар)", value: "₮4.2M", change: "+31%", color: "text-[#FFB02E]", bg: "bg-[#FFB02E]/10" },
          { icon: BarChart3, label: "Conversion rate", value: "3.8%", change: "+0.5%", color: "text-[#FF6B9D]", bg: "bg-[#FF6B9D]/10" },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="rounded-2xl border border-white/[0.04] bg-bg-2 p-5">
              <div className="mb-3 flex items-center justify-between">
                <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${s.bg}`}>
                  <Icon size={16} className={s.color} />
                </div>
                <span className="text-[11px] font-bold text-t">{s.change}</span>
              </div>
              <div className="font-syne text-xl font-bold text-txt">{s.value}</div>
              <div className="text-[11px] text-txt-3">{s.label}</div>
            </div>
          );
        })}
      </div>

      {/* Chart placeholder */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/[0.04] bg-bg-2 p-6">
          <h3 className="mb-4 font-syne text-base font-bold text-txt">Орлогын график</h3>
          <div className="flex h-48 items-end gap-2">
            {[35, 48, 42, 65, 58, 72, 68, 85, 78, 92, 88, 95].map((h, i) => (
              <div key={i} className="flex-1 rounded-t-md bg-gradient-to-t from-v/20 to-v/60" style={{ height: `${h}%` }} />
            ))}
          </div>
          <div className="mt-2 flex justify-between text-[10px] text-txt-3">
            <span>1-р сар</span><span>6-р сар</span><span>12-р сар</span>
          </div>
        </div>
        <div className="rounded-2xl border border-white/[0.04] bg-bg-2 p-6">
          <h3 className="mb-4 font-syne text-base font-bold text-txt">Үйлчилгээний хуваарилалт</h3>
          <div className="space-y-4">
            {[
              { name: "Домэйн & Хостинг", value: 45, color: "bg-v" },
              { name: "eSeller", value: 25, color: "bg-t" },
              { name: "AI Чатбот", value: 18, color: "bg-[#FFB02E]" },
              { name: "CRM & И-мэйл", value: 12, color: "bg-[#FF6B9D]" },
            ].map((s) => (
              <div key={s.name}>
                <div className="mb-1 flex justify-between text-[12px]">
                  <span className="text-txt-2">{s.name}</span>
                  <span className="font-semibold text-txt">{s.value}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-white/[0.04]">
                  <div className={`h-full rounded-full ${s.color}`} style={{ width: `${s.value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
