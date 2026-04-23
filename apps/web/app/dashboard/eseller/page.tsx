"use client";

import { ShoppingCart, Package, TrendingUp, DollarSign, Sparkles } from "lucide-react";

export default function ESellerPage() {
  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-2">
          <h1 className="font-syne text-2xl font-bold tracking-tight text-txt">eSeller дэлгүүр</h1>
          <span className="rounded-md bg-[#FFB02E]/15 px-2 py-0.5 text-[11px] font-semibold text-[#FFB02E]">
            Тун удахгүй
          </span>
        </div>
        <p className="mt-1 text-[13px] text-txt-3">QPay & SocialPay интегратэй автомат захиалгын систем</p>
      </div>

      {/* Stats (all zeroed until module launches) */}
      <div className="mb-6 grid gap-4 sm:grid-cols-4">
        {[
          { icon: ShoppingCart, label: "Нийт захиалга", color: "text-v", bg: "bg-v/10" },
          { icon: Package, label: "Хүргэгдсэн", color: "text-t", bg: "bg-t/10" },
          { icon: TrendingUp, label: "Энэ сар", color: "text-[#FFB02E]", bg: "bg-[#FFB02E]/10" },
          { icon: DollarSign, label: "Орлого", color: "text-[#FF6B9D]", bg: "bg-[#FF6B9D]/10" },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="rounded-2xl border border-white/[0.04] bg-bg-2 p-5 opacity-60">
              <div className={`mb-3 flex h-9 w-9 items-center justify-center rounded-lg ${s.bg}`}>
                <Icon size={16} className={s.color} />
              </div>
              <div className="font-syne text-xl font-bold text-txt-3">—</div>
              <div className="text-[11px] text-txt-3">{s.label}</div>
            </div>
          );
        })}
      </div>

      {/* Coming soon panel */}
      <div className="rounded-2xl border border-white/[0.04] bg-bg-2 p-12">
        <div className="mx-auto max-w-md text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-v/10">
            <Sparkles size={22} className="text-v" />
          </div>
          <h3 className="mb-2 font-syne text-xl font-bold text-txt">
            eSeller модуль удахгүй нээгдэнэ
          </h3>
          <p className="mb-6 text-[13px] leading-relaxed text-txt-2">
            Автомат захиалга хүлээн авах, QPay/SocialPay-аар төлбөр цуглуулах,
            хүргэлт хянах бүрэн e-commerce систем бид үүн дээр ажиллаж байна.
          </p>
          <div className="flex flex-col gap-2 text-left text-[13px]">
            {[
              "QPay / SocialPay автомат интеграц",
              "Бүтээгдэхүүний каталог, хөнгөлөлтийн код",
              "Захиалгын статус, хүргэлтийн хяналт",
              "Сарын тайлан, орлогын аналитик",
            ].map((f) => (
              <div
                key={f}
                className="flex items-center gap-2 rounded-lg border border-white/[0.04] bg-white/[0.02] px-3 py-2.5 text-txt-2"
              >
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-v/15 text-[10px] font-bold text-v">
                  ·
                </span>
                {f}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
