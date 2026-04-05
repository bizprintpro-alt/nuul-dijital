import { Phone, PhoneIncoming, PhoneOff, Clock, Bot } from "lucide-react";

export default function CallCenterPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="font-syne text-2xl font-bold tracking-tight text-txt">Call Center 24/7</h1>
        <p className="mt-1 text-[13px] text-txt-3">Callpro AI технологитой — хоногийн 24 цаг автомат хариулт</p>
      </div>

      {/* Stats */}
      <div className="mb-6 grid gap-4 sm:grid-cols-4">
        {[
          { icon: PhoneIncoming, label: "Өнөөдрийн дуудлага", value: "47", color: "text-v", bg: "bg-v/10" },
          { icon: Bot, label: "AI хариулсан", value: "89%", color: "text-t", bg: "bg-t/10" },
          { icon: Clock, label: "Дундаж хугацаа", value: "1:24", color: "text-[#FFB02E]", bg: "bg-[#FFB02E]/10" },
          { icon: PhoneOff, label: "Хүлээгдэж буй", value: "3", color: "text-[#FF6B9D]", bg: "bg-[#FF6B9D]/10" },
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

      {/* Recent calls */}
      <div className="rounded-2xl border border-white/[0.04] bg-bg-2 p-6">
        <h3 className="mb-4 font-syne text-base font-bold text-txt">Сүүлийн дуудлагууд</h3>
        <div className="space-y-2">
          {[
            { caller: "+976 9911 2233", duration: "2:34", type: "AI хариулсан", time: "10 мин өмнө", ai: true },
            { caller: "+976 8800 1122", duration: "5:12", type: "Оператор шилжсэн", time: "25 мин өмнө", ai: false },
            { caller: "+976 9944 5566", duration: "1:08", type: "AI хариулсан", time: "1 цагийн өмнө", ai: true },
            { caller: "+976 8855 7788", duration: "3:45", type: "AI хариулсан", time: "2 цагийн өмнө", ai: true },
          ].map((call, i) => (
            <div key={i} className="flex items-center justify-between rounded-xl border border-white/[0.03] bg-white/[0.01] px-5 py-3">
              <div className="flex items-center gap-3">
                <Phone size={14} className="text-v" />
                <span className="text-[13px] font-medium text-txt">{call.caller}</span>
              </div>
              <span className="text-[12px] text-txt-2">{call.duration}</span>
              <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                call.ai ? "bg-t/15 text-t" : "bg-[#FFB02E]/15 text-[#FFB02E]"
              }`}>
                {call.type}
              </span>
              <span className="text-[11px] text-txt-3">{call.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
