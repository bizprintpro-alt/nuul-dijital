import {
  Users, ShoppingCart, Banknote, BotMessageSquare,
  ArrowUpRight, ArrowDownRight,
} from "lucide-react";

const stats = [
  {
    label: "Нийт хэрэглэгч",
    value: "2,847",
    change: "+12.5%",
    up: true,
    icon: Users,
    color: "text-v",
    bgColor: "bg-v/15",
  },
  {
    label: "Нийт захиалга",
    value: "1,234",
    change: "+8.2%",
    up: true,
    icon: ShoppingCart,
    color: "text-t",
    bgColor: "bg-t/15",
  },
  {
    label: "Нийт орлого (₮)",
    value: "48,250,000",
    change: "+23.1%",
    up: true,
    icon: Banknote,
    color: "text-[#FFB02E]",
    bgColor: "bg-[#FFB02E]/15",
  },
  {
    label: "AI шийдсэн тикет %",
    value: "87.3%",
    change: "-2.1%",
    up: false,
    icon: BotMessageSquare,
    color: "text-[#FF6B9D]",
    bgColor: "bg-[#FF6B9D]/15",
  },
];

const recentOrders = [
  { id: "#1892", customer: "Б. Болд", type: "Домэйн", amount: "₮25,000", status: "Төлсөн", date: "2026-04-05" },
  { id: "#1891", customer: "Д. Сарнай", type: "Хостинг", amount: "₮149,000", status: "Хүлээгдэж буй", date: "2026-04-04" },
  { id: "#1890", customer: "М. Ганбат", type: "eSeller", amount: "₮89,000", status: "Төлсөн", date: "2026-04-04" },
  { id: "#1889", customer: "Э. Оюунцэцэг", type: "VPS", amount: "₮299,000", status: "Төлсөн", date: "2026-04-03" },
  { id: "#1888", customer: "Т. Батбаяр", type: "Домэйн", amount: "₮15,000", status: "Цуцлагдсан", date: "2026-04-03" },
];

const newUsers = [
  { name: "Б. Болд", email: "bold@example.mn", date: "2026-04-05", role: "CLIENT" },
  { name: "Д. Сарнай", email: "sarnai@company.mn", date: "2026-04-04", role: "RESELLER" },
  { name: "М. Ганбат", email: "ganbat@shop.mn", date: "2026-04-04", role: "CLIENT" },
  { name: "Э. Оюунцэцэг", email: "oyuntsetseg@biz.mn", date: "2026-04-03", role: "CLIENT" },
  { name: "Т. Батбаяр", email: "batbayar@web.mn", date: "2026-04-02", role: "CLIENT" },
];

function statusColor(status: string) {
  switch (status) {
    case "Төлсөн":
      return "bg-t/15 text-t";
    case "Хүлээгдэж буй":
      return "bg-[#FFB02E]/15 text-[#FFB02E]";
    case "Цуцлагдсан":
      return "bg-[#FF4D6A]/15 text-[#FF4D6A]";
    default:
      return "bg-white/[0.06] text-txt-3";
  }
}

function roleColor(role: string) {
  switch (role) {
    case "ADMIN":
      return "bg-v/15 text-v";
    case "RESELLER":
      return "bg-[#FFB02E]/15 text-[#FFB02E]";
    default:
      return "bg-t/15 text-t";
  }
}

export default function AdminPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="font-syne text-2xl font-bold tracking-tight text-txt">Админ панел</h1>
        <p className="mt-1 text-[13px] text-txt-3">Системийн ерөнхий тойм мэдээлэл</p>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border border-white/[0.04] bg-bg-2 p-5"
          >
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-medium text-txt-3">{s.label}</span>
              <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${s.bgColor}`}>
                <s.icon size={16} className={s.color} />
              </div>
            </div>
            <div className="mt-3 text-[22px] font-bold text-txt">{s.value}</div>
            <div className="mt-1 flex items-center gap-1">
              {s.up ? (
                <ArrowUpRight size={13} className="text-t" />
              ) : (
                <ArrowDownRight size={13} className="text-[#FF4D6A]" />
              )}
              <span className={`text-[11px] font-medium ${s.up ? "text-t" : "text-[#FF4D6A]"}`}>
                {s.change}
              </span>
              <span className="text-[11px] text-txt-3">сүүлийн 30 хоног</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Recent Orders */}
        <div className="rounded-2xl border border-white/[0.04] bg-bg-2 p-6">
          <h3 className="mb-4 font-syne text-base font-bold text-txt">Сүүлийн захиалгууд</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[13px]">
              <thead>
                <tr className="border-b border-white/[0.04] text-txt-3">
                  <th className="pb-3 pr-4 font-medium">Дугаар</th>
                  <th className="pb-3 pr-4 font-medium">Харилцагч</th>
                  <th className="pb-3 pr-4 font-medium">Дүн</th>
                  <th className="pb-3 font-medium">Төлөв</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((o) => (
                  <tr key={o.id} className="border-b border-white/[0.02]">
                    <td className="py-2.5 pr-4 font-medium text-v">{o.id}</td>
                    <td className="py-2.5 pr-4 text-txt">{o.customer}</td>
                    <td className="py-2.5 pr-4 text-txt-2">{o.amount}</td>
                    <td className="py-2.5">
                      <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${statusColor(o.status)}`}>
                        {o.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* New Users */}
        <div className="rounded-2xl border border-white/[0.04] bg-bg-2 p-6">
          <h3 className="mb-4 font-syne text-base font-bold text-txt">Шинэ хэрэглэгчид</h3>
          <div className="space-y-2">
            {newUsers.map((u) => (
              <div
                key={u.email}
                className="flex items-center justify-between rounded-xl border border-white/[0.03] bg-white/[0.01] px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-v/20 text-[11px] font-bold text-v-soft">
                    {u.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-[13px] font-medium text-txt">{u.name}</div>
                    <div className="text-[11px] text-txt-3">{u.email}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${roleColor(u.role)}`}>
                    {u.role}
                  </span>
                  <span className="text-[11px] text-txt-3">{u.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
