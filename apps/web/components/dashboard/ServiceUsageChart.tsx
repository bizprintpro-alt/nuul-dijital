"use client";

const bars = [
  { label: "Домэйн", value: 85, color: "bg-v" },
  { label: "Хостинг", value: 72, color: "bg-t" },
  { label: "eSeller", value: 94, color: "bg-[#FFB02E]" },
  { label: "Чатбот", value: 68, color: "bg-[#FF6B9D]" },
  { label: "CRM", value: 45, color: "bg-v-soft" },
  { label: "И-мэйл", value: 58, color: "bg-t-dark" },
];

export function ServiceUsageChart() {
  return (
    <div className="rounded-2xl border border-white/[0.04] bg-bg-2 p-6">
      <div className="mb-1 flex items-center justify-between">
        <h3 className="font-syne text-base font-bold text-txt">Үйлчилгээний ашиглалт</h3>
        <select className="rounded-md border border-white/[0.06] bg-white/[0.02] px-2 py-1 text-[11px] text-txt-2 outline-none">
          <option>Энэ сар</option>
          <option>Өнгөрсөн сар</option>
          <option>3 сар</option>
        </select>
      </div>
      <p className="mb-6 text-[12px] text-txt-3">Идэвхтэй үйлчилгээнүүдийн хэрэглээний хувь</p>

      <div className="space-y-4">
        {bars.map((bar) => (
          <div key={bar.label}>
            <div className="mb-1.5 flex items-center justify-between text-[12px]">
              <span className="text-txt-2">{bar.label}</span>
              <span className="font-semibold text-txt">{bar.value}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/[0.04]">
              <div
                className={`h-full rounded-full ${bar.color} transition-all duration-700`}
                style={{ width: `${bar.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
