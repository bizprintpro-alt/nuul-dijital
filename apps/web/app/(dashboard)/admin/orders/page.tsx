"use client";

import { useState } from "react";
import { ShoppingCart, Eye } from "lucide-react";

type Status = "PAID" | "PENDING" | "CANCELLED";

interface Order {
  id: string;
  customer: string;
  type: string;
  amount: string;
  status: Status;
  date: string;
}

const mockOrders: Order[] = [
  { id: "#1892", customer: "Б. Болд", type: "Домэйн", amount: "₮25,000", status: "PAID", date: "2026-04-05" },
  { id: "#1891", customer: "Д. Сарнай", type: "Хостинг", amount: "₮149,000", status: "PENDING", date: "2026-04-04" },
  { id: "#1890", customer: "М. Ганбат", type: "eSeller", amount: "₮89,000", status: "PAID", date: "2026-04-04" },
  { id: "#1889", customer: "Э. Оюунцэцэг", type: "VPS", amount: "₮299,000", status: "PAID", date: "2026-04-03" },
  { id: "#1888", customer: "Т. Батбаяр", type: "Домэйн", amount: "₮15,000", status: "CANCELLED", date: "2026-04-03" },
  { id: "#1887", customer: "С. Нармандах", type: "Хостинг", amount: "₮249,000", status: "PAID", date: "2026-04-02" },
  { id: "#1886", customer: "Г. Тэмүүлэн", type: "AI Чатбот", amount: "₮59,000", status: "PENDING", date: "2026-04-01" },
  { id: "#1885", customer: "Л. Золзаяа", type: "eSeller", amount: "₮89,000", status: "PAID", date: "2026-03-31" },
  { id: "#1884", customer: "Н. Эрдэнэ", type: "Домэйн", amount: "₮25,000", status: "CANCELLED", date: "2026-03-30" },
  { id: "#1883", customer: "Х. Мөнхбат", type: "VPS", amount: "₮499,000", status: "PAID", date: "2026-03-29" },
];

const tabs = [
  { label: "Бүгд", value: "ALL" },
  { label: "Хүлээгдэж буй", value: "PENDING" },
  { label: "Төлсөн", value: "PAID" },
  { label: "Цуцлагдсан", value: "CANCELLED" },
] as const;

const statusLabels: Record<Status, string> = {
  PAID: "Төлсөн",
  PENDING: "Хүлээгдэж буй",
  CANCELLED: "Цуцлагдсан",
};

const statusColors: Record<Status, string> = {
  PAID: "bg-t/15 text-t",
  PENDING: "bg-[#FFB02E]/15 text-[#FFB02E]",
  CANCELLED: "bg-[#FF4D6A]/15 text-[#FF4D6A]",
};

export default function AdminOrdersPage() {
  const [activeTab, setActiveTab] = useState<string>("ALL");
  const [orders, setOrders] = useState<Order[]>(mockOrders);

  const filtered =
    activeTab === "ALL" ? orders : orders.filter((o) => o.status === activeTab);

  function changeStatus(orderId: string, newStatus: Status) {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-syne text-2xl font-bold tracking-tight text-txt">Бүх захиалгууд</h1>
        <p className="mt-1 text-[13px] text-txt-3">Захиалгын удирдлага, төлөв өөрчлөх</p>
      </div>

      {/* Filter Tabs */}
      <div className="mb-6 flex items-center gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`rounded-lg px-4 py-2 text-[13px] font-medium transition-colors ${
              activeTab === tab.value
                ? "bg-v/15 text-v"
                : "border border-white/[0.06] bg-bg-2 text-txt-3 hover:bg-white/[0.03] hover:text-txt-2"
            }`}
          >
            {tab.label}
            {tab.value !== "ALL" && (
              <span className="ml-1.5 text-[11px] opacity-70">
                ({orders.filter((o) => o.status === tab.value).length})
              </span>
            )}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-2 rounded-xl border border-white/[0.06] bg-bg-2 px-4 py-2">
          <ShoppingCart size={15} className="text-txt-3" />
          <span className="text-[13px] text-txt-2">{filtered.length} захиалга</span>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-white/[0.04] bg-bg-2 p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead>
              <tr className="border-b border-white/[0.04] text-txt-3">
                <th className="pb-3 pr-4 font-medium">Дугаар</th>
                <th className="pb-3 pr-4 font-medium">Харилцагч</th>
                <th className="pb-3 pr-4 font-medium">Төрөл</th>
                <th className="pb-3 pr-4 font-medium">Дүн</th>
                <th className="pb-3 pr-4 font-medium">Төлөв</th>
                <th className="pb-3 pr-4 font-medium">Огноо</th>
                <th className="pb-3 font-medium">Үйлдэл</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((o) => (
                <tr key={o.id} className="border-b border-white/[0.02]">
                  <td className="py-3 pr-4 font-medium text-v">{o.id}</td>
                  <td className="py-3 pr-4 text-txt">{o.customer}</td>
                  <td className="py-3 pr-4 text-txt-2">{o.type}</td>
                  <td className="py-3 pr-4 font-medium text-txt">{o.amount}</td>
                  <td className="py-3 pr-4">
                    <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${statusColors[o.status]}`}>
                      {statusLabels[o.status]}
                    </span>
                  </td>
                  <td className="py-3 pr-4 text-txt-3">{o.date}</td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <select
                        value={o.status}
                        onChange={(e) => changeStatus(o.id, e.target.value as Status)}
                        className="rounded-lg border border-white/[0.06] bg-bg px-2 py-1 text-[12px] text-txt outline-none cursor-pointer focus:border-v/30 transition-colors"
                      >
                        <option value="PAID">Төлсөн</option>
                        <option value="PENDING">Хүлээгдэж буй</option>
                        <option value="CANCELLED">Цуцлагдсан</option>
                      </select>
                      <button className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/[0.06] bg-bg text-txt-3 transition-colors hover:bg-white/[0.03]">
                        <Eye size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="py-12 text-center text-[13px] text-txt-3">
            Энэ төлөвтэй захиалга олдсонгүй
          </div>
        )}
      </div>
    </div>
  );
}
