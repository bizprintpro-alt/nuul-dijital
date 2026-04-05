"use client";

import { ShoppingCart, Package, TrendingUp, DollarSign } from "lucide-react";

const orders = [
  { id: "#1847", customer: "Болд Б.", product: "Premium хостинг", amount: 249000, status: "paid" as const, date: "2024-01-20" },
  { id: "#1846", customer: "Сараа М.", product: ".mn домэйн", amount: 165000, status: "paid" as const, date: "2024-01-20" },
  { id: "#1845", customer: "Ганаа Т.", product: "Starter хостинг", amount: 99000, status: "pending" as const, date: "2024-01-19" },
  { id: "#1844", customer: "Нараа Д.", product: "AI Чатбот", amount: 149000, status: "paid" as const, date: "2024-01-19" },
  { id: "#1843", customer: "Батаа О.", product: ".com домэйн", amount: 62500, status: "failed" as const, date: "2024-01-18" },
];

export default function ESellerPage() {
  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-2">
          <h1 className="font-syne text-2xl font-bold tracking-tight text-txt">eSeller дэлгүүр</h1>
          <span className="rounded-md bg-[#FFB02E]/15 px-2 py-0.5 text-[10px] font-bold text-[#FFB02E]">4 шинэ</span>
        </div>
        <p className="mt-1 text-[13px] text-txt-3">QPay & SocialPay интегратэй автомат захиалгын систем</p>
      </div>

      {/* Stats */}
      <div className="mb-6 grid gap-4 sm:grid-cols-4">
        {[
          { icon: ShoppingCart, label: "Нийт захиалга", value: "847", color: "text-v", bg: "bg-v/10" },
          { icon: Package, label: "Хүргэгдсэн", value: "812", color: "text-t", bg: "bg-t/10" },
          { icon: TrendingUp, label: "Энэ сар", value: "+124", color: "text-[#FFB02E]", bg: "bg-[#FFB02E]/10" },
          { icon: DollarSign, label: "Орлого", value: "₮12.4M", color: "text-[#FF6B9D]", bg: "bg-[#FF6B9D]/10" },
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

      {/* Orders table */}
      <div className="rounded-2xl border border-white/[0.04] bg-bg-2 p-6">
        <h3 className="mb-4 font-syne text-base font-bold text-txt">Сүүлийн захиалгууд</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.04] text-left text-[11px] font-semibold uppercase tracking-wider text-txt-3">
                <th className="pb-3 pr-4">Захиалга</th>
                <th className="pb-3 pr-4">Харилцагч</th>
                <th className="pb-3 pr-4">Бүтээгдэхүүн</th>
                <th className="pb-3 pr-4">Дүн</th>
                <th className="pb-3 pr-4">Төлөв</th>
                <th className="pb-3">Огноо</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-b border-white/[0.02] text-[13px] transition-all hover:bg-white/[0.01]">
                  <td className="py-3 pr-4 font-medium text-txt">{o.id}</td>
                  <td className="py-3 pr-4 text-txt-2">{o.customer}</td>
                  <td className="py-3 pr-4 text-txt-2">{o.product}</td>
                  <td className="py-3 pr-4 font-semibold text-txt">₮{o.amount.toLocaleString()}</td>
                  <td className="py-3 pr-4">
                    <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                      o.status === "paid" ? "bg-t/15 text-t" :
                      o.status === "pending" ? "bg-[#FFB02E]/15 text-[#FFB02E]" :
                      "bg-red-500/15 text-red-400"
                    }`}>
                      {o.status === "paid" ? "Төлсөн" : o.status === "pending" ? "Хүлээгдэж буй" : "Амжилтгүй"}
                    </span>
                  </td>
                  <td className="py-3 text-txt-3">{o.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
