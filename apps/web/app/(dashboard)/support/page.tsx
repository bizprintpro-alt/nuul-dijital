"use client";

import { useState } from "react";
import { Headphones, Bot, Send, CheckCircle, Clock, AlertCircle } from "lucide-react";

const tickets = [
  { id: "#T-001", subject: "SSL сертификат шинэчлэх", status: "resolved" as const, aiResolved: true, date: "2024-01-20" },
  { id: "#T-002", subject: "DNS тохиргоо тусламж", status: "in_progress" as const, aiResolved: false, date: "2024-01-19" },
  { id: "#T-003", subject: "И-мэйл илгээх алдаа", status: "open" as const, aiResolved: false, date: "2024-01-18" },
  { id: "#T-004", subject: "Чатбот тохиргоо", status: "resolved" as const, aiResolved: true, date: "2024-01-17" },
  { id: "#T-005", subject: "QPay интеграц асуулт", status: "resolved" as const, aiResolved: true, date: "2024-01-16" },
];

export default function SupportPage() {
  const [message, setMessage] = useState("");

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-2">
          <h1 className="font-syne text-2xl font-bold tracking-tight text-txt">AI Дэмжлэг</h1>
          <span className="rounded-md bg-[#FF6B9D]/15 px-2 py-0.5 text-[10px] font-bold text-[#FF6B9D]">8</span>
        </div>
        <p className="mt-1 text-[13px] text-txt-3">AI-тай чатлах эсвэл тикет үүсгэх</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* AI Chat */}
        <div className="lg:col-span-3">
          <div className="flex h-[500px] flex-col rounded-2xl border border-white/[0.04] bg-bg-2">
            <div className="flex items-center gap-3 border-b border-white/[0.04] p-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-v/10">
                <Bot size={16} className="text-v" />
              </div>
              <div>
                <div className="text-[13px] font-semibold text-txt">Nuul AI Туслах</div>
                <div className="flex items-center gap-1 text-[11px] text-t">
                  <span className="h-1.5 w-1.5 rounded-full bg-t" /> Онлайн
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 space-y-4 overflow-y-auto p-4">
              <div className="flex gap-3">
                <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-v/10 text-xs font-bold text-v">
                  AI
                </div>
                <div className="rounded-2xl rounded-tl-md bg-bg-3 px-4 py-3 text-[13px] text-txt-2">
                  Сайн байна уу! Bi Nuul AI туслах. Танд хэрхэн тусалж чадах вэ?
                  Домэйн, хостинг, чатбот, төлбөр — ямар ч асуулт байсан асуугаарай!
                </div>
              </div>
            </div>

            {/* Input */}
            <div className="border-t border-white/[0.04] p-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Асуултаа бичнэ үү..."
                  className="flex-1 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-2.5 text-[13px] text-txt outline-none placeholder:text-txt-3 focus:border-v/30"
                />
                <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-v text-white transition-all hover:shadow-[0_0_16px_rgba(108,99,255,0.3)]">
                  <Send size={15} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tickets */}
        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-white/[0.04] bg-bg-2 p-5">
            <h3 className="mb-4 font-syne text-base font-bold text-txt">Тикетүүд</h3>
            <div className="space-y-2">
              {tickets.map((t) => (
                <div key={t.id} className="cursor-pointer rounded-xl border border-white/[0.03] bg-white/[0.01] p-3 transition-all hover:border-v/10">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-v-soft">{t.id}</span>
                    {t.status === "resolved" ? (
                      <CheckCircle size={12} className="text-t" />
                    ) : t.status === "in_progress" ? (
                      <Clock size={12} className="text-[#FFB02E]" />
                    ) : (
                      <AlertCircle size={12} className="text-[#FF6B9D]" />
                    )}
                  </div>
                  <div className="mt-1 text-[12px] font-medium text-txt">{t.subject}</div>
                  <div className="mt-1 flex items-center gap-2 text-[10px] text-txt-3">
                    {t.aiResolved && (
                      <span className="rounded bg-v/10 px-1 py-0.5 text-v-soft">AI шийдсэн</span>
                    )}
                    <span>{t.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
