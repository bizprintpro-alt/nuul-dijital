import { Mail, Send, Users, BarChart3, Plus } from "lucide-react";

export default function EmailMarketingPage() {
  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-syne text-2xl font-bold tracking-tight text-txt">И-мэйл маркетинг</h1>
          <p className="mt-1 text-[13px] text-txt-3">Кампанит ажил үүсгэж, харилцагчиддаа и-мэйл илгээ</p>
        </div>
        <button className="flex items-center gap-2 rounded-xl bg-v px-5 py-2.5 text-[13px] font-bold text-white shadow-[0_0_16px_rgba(108,99,255,0.25)]">
          <Plus size={15} />
          Шинэ кампанит
        </button>
      </div>

      {/* Stats */}
      <div className="mb-6 grid gap-4 sm:grid-cols-4">
        {[
          { icon: Send, label: "Илгээсэн", value: "4,521", color: "text-v", bg: "bg-v/10" },
          { icon: Mail, label: "Нээсэн", value: "67%", color: "text-t", bg: "bg-t/10" },
          { icon: Users, label: "Бүртгэгчид", value: "1,284", color: "text-[#FFB02E]", bg: "bg-[#FFB02E]/10" },
          { icon: BarChart3, label: "Click rate", value: "12.4%", color: "text-[#FF6B9D]", bg: "bg-[#FF6B9D]/10" },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="rounded-2xl border border-white/[0.04] bg-bg-2 p-5">
              <div className={`mb-3 flex h-9 w-9 items-center justify-center rounded-lg ${s.bg}`}>
                <Icon size={16} className={s.color} />
              </div>
              <div className="font-syne text-xl font-bold text-txt">{s.value}</div>
              <div className="text-[11px] text-txt-3">{s.label}</div>
            </div>
          );
        })}
      </div>

      {/* Campaigns */}
      <div className="rounded-2xl border border-white/[0.04] bg-bg-2 p-6">
        <h3 className="mb-4 font-syne text-base font-bold text-txt">Кампанит ажлууд</h3>
        <div className="space-y-2">
          {[
            { name: "Шинэ жилийн урамшуулал", sent: 1284, opened: 856, clicked: 124, status: "sent" },
            { name: "Business план хямдрал", sent: 967, opened: 645, clicked: 89, status: "sent" },
            { name: "AI чатбот танилцуулга", sent: 0, opened: 0, clicked: 0, status: "draft" },
          ].map((c) => (
            <div key={c.name} className="flex items-center justify-between rounded-xl border border-white/[0.03] bg-white/[0.01] px-5 py-4">
              <div>
                <div className="text-[13px] font-semibold text-txt">{c.name}</div>
                <div className="mt-0.5 text-[11px] text-txt-3">
                  {c.status === "sent"
                    ? `${c.sent} илгээсэн · ${c.opened} нээсэн · ${c.clicked} дарсан`
                    : "Ноорог"}
                </div>
              </div>
              <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                c.status === "sent" ? "bg-t/15 text-t" : "bg-white/[0.06] text-txt-3"
              }`}>
                {c.status === "sent" ? "Илгээсэн" : "Ноорог"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
