import { StatsCards } from "@/components/dashboard/StatsCards";
import { ServiceUsageChart } from "@/components/dashboard/ServiceUsageChart";
import { AIFixPanel } from "@/components/dashboard/AIFixPanel";

export default function DashboardPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="font-syne text-2xl font-bold tracking-tight text-txt">Хянах самбар</h1>
        <p className="mt-1 text-[13px] text-txt-3">Таны бүх үйлчилгээний ерөнхий мэдээлэл</p>
      </div>

      <StatsCards />

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <ServiceUsageChart />
        <AIFixPanel />
      </div>

      {/* Recent Activity */}
      <div className="mt-6 rounded-2xl border border-white/[0.04] bg-bg-2 p-6">
        <h3 className="mb-4 font-syne text-base font-bold text-txt">Сүүлийн үйл ажиллагаа</h3>
        <div className="space-y-3">
          {[
            { action: "Домэйн бүртгэгдсэн", detail: "miniishop.mn", time: "2 цагийн өмнө", color: "bg-v" },
            { action: "Хостинг идэвхжсэн", detail: "Business план", time: "5 цагийн өмнө", color: "bg-t" },
            { action: "eSeller захиалга", detail: "#1847 — ₮45,000", time: "1 өдрийн өмнө", color: "bg-[#FFB02E]" },
            { action: "AI чатбот хариулт", detail: "94% автомат хариулт", time: "1 өдрийн өмнө", color: "bg-[#FF6B9D]" },
            { action: "QPay төлбөр", detail: "₮249,000 — Business план", time: "2 өдрийн өмнө", color: "bg-t" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 rounded-lg p-2 transition-all hover:bg-white/[0.02]">
              <div className={`h-2 w-2 rounded-full ${item.color}`} />
              <div className="flex-1">
                <span className="text-[13px] font-medium text-txt">{item.action}</span>
                <span className="mx-2 text-txt-4">·</span>
                <span className="text-[13px] text-txt-2">{item.detail}</span>
              </div>
              <span className="text-[11px] text-txt-3">{item.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
