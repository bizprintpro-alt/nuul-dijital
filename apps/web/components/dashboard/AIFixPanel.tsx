"use client";

import { Bot, AlertTriangle, CheckCircle, ArrowRight } from "lucide-react";

const fixes = [
  {
    type: "warning" as const,
    title: "SSL сертификат дуусах гэж байна",
    domain: "example.mn",
    suggestion: "Автоматаар сунгах тохируулах",
    status: "pending" as const,
  },
  {
    type: "info" as const,
    title: "Вэбсайт хурд сайжруулах",
    domain: "shop.mn",
    suggestion: "Зургийг WebP формат руу хөрвүүлэх",
    status: "pending" as const,
  },
  {
    type: "success" as const,
    title: "DNS тохиргоо зөв",
    domain: "company.com.mn",
    suggestion: "Бүх тохиргоо хэвийн ажиллаж байна",
    status: "resolved" as const,
  },
];

export function AIFixPanel() {
  return (
    <div className="rounded-2xl border border-white/[0.04] bg-bg-2 p-6">
      <div className="mb-1 flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-v/10">
          <Bot size={14} className="text-v" />
        </div>
        <h3 className="font-syne text-base font-bold text-txt">AI Зөвлөмж</h3>
        <span className="rounded-md bg-v/15 px-1.5 py-0.5 text-[10px] font-bold text-v-soft">
          AI
        </span>
      </div>
      <p className="mb-5 text-[12px] text-txt-3">
        AI таны бүх үйлчилгээг шалгаад дараах засваруудыг санал болгож байна
      </p>

      <div className="space-y-3">
        {fixes.map((fix, i) => (
          <div
            key={i}
            className="flex items-start gap-3 rounded-xl border border-white/[0.04] bg-white/[0.01] p-4 transition-all hover:border-v/10"
          >
            {fix.type === "warning" ? (
              <AlertTriangle size={16} className="mt-0.5 flex-shrink-0 text-[#FFB02E]" />
            ) : fix.type === "success" ? (
              <CheckCircle size={16} className="mt-0.5 flex-shrink-0 text-t" />
            ) : (
              <Bot size={16} className="mt-0.5 flex-shrink-0 text-v" />
            )}
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-semibold text-txt">{fix.title}</div>
              <div className="mt-0.5 text-[11px] text-txt-3">{fix.domain}</div>
              <div className="mt-2 text-[12px] text-txt-2">{fix.suggestion}</div>
            </div>
            {fix.status === "pending" && (
              <button className="flex-shrink-0 rounded-lg bg-v/10 px-3 py-1.5 text-[11px] font-bold text-v-soft transition-all hover:bg-v/20">
                Засах
              </button>
            )}
          </div>
        ))}
      </div>

      <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-v/20 py-2.5 text-[12px] font-semibold text-v-soft transition-all hover:bg-v/5">
        Бүх зөвлөмж харах
        <ArrowRight size={13} />
      </button>
    </div>
  );
}
