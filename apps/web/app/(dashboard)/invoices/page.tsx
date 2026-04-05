import { Receipt, CreditCard, Download } from "lucide-react";

const invoices = [
  { id: "INV-2024-001", desc: "Business план — 1 сар", amount: 249000, status: "paid", method: "QPay", date: "2024-01-15" },
  { id: "INV-2024-002", desc: "miniishop.mn домэйн — 1 жил", amount: 165000, status: "paid", method: "SocialPay", date: "2024-01-15" },
  { id: "INV-2024-003", desc: "Business план — 2 сар", amount: 249000, status: "pending", method: "—", date: "2024-02-15" },
  { id: "INV-2024-004", desc: "AI Чатбот нэмэлт", amount: 49000, status: "paid", method: "QPay", date: "2024-01-20" },
];

export default function InvoicesPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="font-syne text-2xl font-bold tracking-tight text-txt">Нэхэмжлэх & Төлбөр</h1>
        <p className="mt-1 text-[13px] text-txt-3">QPay, SocialPay, банкны шилжүүлэг — бүх төлбөрийн түүх</p>
      </div>

      {/* Summary */}
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/[0.04] bg-bg-2 p-5">
          <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-t/10">
            <CreditCard size={16} className="text-t" />
          </div>
          <div className="font-syne text-xl font-bold text-txt">₮712,000</div>
          <div className="text-[11px] text-txt-3">Нийт төлсөн</div>
        </div>
        <div className="rounded-2xl border border-white/[0.04] bg-bg-2 p-5">
          <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-[#FFB02E]/10">
            <Receipt size={16} className="text-[#FFB02E]" />
          </div>
          <div className="font-syne text-xl font-bold text-txt">₮249,000</div>
          <div className="text-[11px] text-txt-3">Хүлээгдэж буй</div>
        </div>
        <div className="rounded-2xl border border-white/[0.04] bg-bg-2 p-5">
          <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-v/10">
            <Receipt size={16} className="text-v" />
          </div>
          <div className="font-syne text-xl font-bold text-txt">4</div>
          <div className="text-[11px] text-txt-3">Нийт нэхэмжлэх</div>
        </div>
      </div>

      {/* Invoices table */}
      <div className="rounded-2xl border border-white/[0.04] bg-bg-2 p-6">
        <h3 className="mb-4 font-syne text-base font-bold text-txt">Нэхэмжлэхүүд</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.04] text-left text-[11px] font-semibold uppercase tracking-wider text-txt-3">
                <th className="pb-3 pr-4">Дугаар</th>
                <th className="pb-3 pr-4">Тайлбар</th>
                <th className="pb-3 pr-4">Дүн</th>
                <th className="pb-3 pr-4">Төлбөрийн хэрэгсэл</th>
                <th className="pb-3 pr-4">Төлөв</th>
                <th className="pb-3 pr-4">Огноо</th>
                <th className="pb-3"></th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv.id} className="border-b border-white/[0.02] text-[13px]">
                  <td className="py-3 pr-4 font-medium text-v-soft">{inv.id}</td>
                  <td className="py-3 pr-4 text-txt-2">{inv.desc}</td>
                  <td className="py-3 pr-4 font-semibold text-txt">₮{inv.amount.toLocaleString()}</td>
                  <td className="py-3 pr-4 text-txt-2">{inv.method}</td>
                  <td className="py-3 pr-4">
                    <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                      inv.status === "paid" ? "bg-t/15 text-t" : "bg-[#FFB02E]/15 text-[#FFB02E]"
                    }`}>
                      {inv.status === "paid" ? "Төлсөн" : "Хүлээгдэж буй"}
                    </span>
                  </td>
                  <td className="py-3 pr-4 text-txt-3">{inv.date}</td>
                  <td className="py-3">
                    <button className="rounded-lg p-1.5 text-txt-3 transition-all hover:bg-white/[0.04] hover:text-txt-2">
                      <Download size={13} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
