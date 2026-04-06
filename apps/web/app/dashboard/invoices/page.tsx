"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc-client";
import { Receipt, CreditCard, Loader2 } from "lucide-react";
import { PaymentModal } from "@/components/payments/PaymentModal";

interface QPayState {
  invoiceId: string;
  qrImage: string;
  shortUrl?: string;
  deeplinks?: Array<{ name: string; description: string; logo: string; link: string }>;
  amount: number;
}

export default function InvoicesPage() {
  const [qpay, setQpay] = useState<QPayState | null>(null);
  const [creating, setCreating] = useState<string | null>(null);
  const [filter, setFilter] = useState<"ALL" | "PENDING" | "COMPLETED" | "FAILED">("ALL");

  const payments = trpc.payment.getHistory.useQuery();
  const orders = trpc.order.getOrders.useQuery({ limit: 50 });

  const pendingOrders = orders.data?.orders.filter((o) => o.status === "PENDING") ?? [];

  const filteredPayments = payments.data?.filter((p) => {
    if (filter === "ALL") return true;
    return p.status === filter;
  }) ?? [];

  const totalPaid = payments.data?.filter((p) => p.status === "COMPLETED").reduce((s, p) => s + p.amount, 0) ?? 0;
  const totalPending = payments.data?.filter((p) => p.status === "PENDING").reduce((s, p) => s + p.amount, 0) ?? 0;

  async function handleQPay(orderId: string, amount: number, description: string) {
    setCreating(orderId);
    try {
      const res = await fetch("/api/payments/qpay/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, amount, description }),
      });
      const data = await res.json();
      if (data.success) {
        setQpay({
          invoiceId: data.invoiceId,
          qrImage: data.qrImage,
          shortUrl: data.shortUrl,
          deeplinks: data.deeplinks,
          amount,
        });
      } else {
        alert(data.error || "QPay алдаа");
      }
    } catch {
      alert("Сервертэй холбогдоход алдаа");
    } finally {
      setCreating(null);
    }
  }

  const filters = [
    { key: "ALL" as const, label: "Бүгд" },
    { key: "PENDING" as const, label: "Хүлээгдэж буй" },
    { key: "COMPLETED" as const, label: "Төлсөн" },
    { key: "FAILED" as const, label: "Амжилтгүй" },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-syne text-2xl font-bold tracking-tight text-txt">Нэхэмжлэх & Төлбөр</h1>
        <p className="mt-1 text-[13px] text-txt-3">QPay, SocialPay — бүх төлбөрийн түүх</p>
      </div>

      {/* Summary */}
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/[0.04] bg-bg-2 p-5">
          <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-t/10">
            <CreditCard size={16} className="text-t" />
          </div>
          <div className="font-syne text-xl font-bold text-txt">₮{totalPaid.toLocaleString()}</div>
          <div className="text-[11px] text-txt-3">Нийт төлсөн</div>
        </div>
        <div className="rounded-2xl border border-white/[0.04] bg-bg-2 p-5">
          <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-[#FFB02E]/10">
            <Receipt size={16} className="text-[#FFB02E]" />
          </div>
          <div className="font-syne text-xl font-bold text-txt">₮{totalPending.toLocaleString()}</div>
          <div className="text-[11px] text-txt-3">Хүлээгдэж буй</div>
        </div>
        <div className="rounded-2xl border border-white/[0.04] bg-bg-2 p-5">
          <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-v/10">
            <Receipt size={16} className="text-v" />
          </div>
          <div className="font-syne text-xl font-bold text-txt">{payments.data?.length ?? 0}</div>
          <div className="text-[11px] text-txt-3">Нийт төлбөр</div>
        </div>
      </div>

      {/* Pending orders */}
      {pendingOrders.length > 0 && (
        <div className="mb-6 rounded-2xl border border-[#FFB02E]/20 bg-[#FFB02E]/5 p-6">
          <h3 className="mb-3 font-syne text-base font-bold text-txt">Төлбөр хүлээгдэж буй</h3>
          <div className="space-y-2">
            {pendingOrders.map((order) => {
              const desc = order.domain?.name ?? order.subscription?.plan?.name ?? `#${order.id.slice(0, 8)}`;
              return (
                <div key={order.id} className="flex items-center justify-between rounded-xl border border-white/[0.04] bg-bg-2 px-5 py-3">
                  <div>
                    <div className="text-[13px] font-medium text-txt">{desc}</div>
                    <div className="text-[11px] text-txt-3">{order.type}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-syne text-sm font-bold text-txt">₮{order.amount.toLocaleString()}</span>
                    <button
                      onClick={() => handleQPay(order.id, order.amount, desc)}
                      disabled={creating === order.id}
                      className="flex items-center gap-1.5 rounded-lg bg-v px-3.5 py-1.5 text-[11px] font-bold text-white transition hover:bg-v-dark disabled:opacity-50"
                    >
                      {creating === order.id ? <Loader2 size={12} className="animate-spin" /> : <CreditCard size={12} />}
                      QPay төлөх
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Payment history */}
      <div className="rounded-2xl border border-white/[0.04] bg-bg-2 p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-syne text-base font-bold text-txt">Төлбөрийн түүх</h3>
          <div className="flex gap-1">
            {filters.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`rounded-lg px-3 py-1.5 text-[11px] font-medium transition ${
                  filter === f.key ? "bg-v/15 text-v-soft" : "text-txt-3 hover:bg-white/[0.03]"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {payments.isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 animate-pulse rounded-xl bg-bg-3" />
            ))}
          </div>
        ) : filteredPayments.length === 0 ? (
          <p className="py-8 text-center text-[13px] text-txt-3">Төлбөрийн бичлэг байхгүй</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.04] text-left text-[11px] font-semibold uppercase tracking-wider text-txt-3">
                  <th className="pb-3 pr-4">Тайлбар</th>
                  <th className="pb-3 pr-4">Дүн</th>
                  <th className="pb-3 pr-4">Хэрэгсэл</th>
                  <th className="pb-3 pr-4">Төлөв</th>
                  <th className="pb-3">Огноо</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.map((p) => {
                  const desc = p.order?.domain?.name ?? p.order?.subscription?.plan?.name ?? `#${p.orderId.slice(0, 8)}`;
                  return (
                    <tr key={p.id} className="border-b border-white/[0.02] text-[13px]">
                      <td className="py-3 pr-4 text-txt-2">{desc}</td>
                      <td className="py-3 pr-4 font-semibold text-txt">₮{p.amount.toLocaleString()}</td>
                      <td className="py-3 pr-4 text-txt-2">{p.method}</td>
                      <td className="py-3 pr-4">
                        <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                          p.status === "COMPLETED" ? "bg-t/15 text-t" :
                          p.status === "PENDING" ? "bg-[#FFB02E]/15 text-[#FFB02E]" :
                          "bg-red-500/15 text-red-400"
                        }`}>
                          {p.status === "COMPLETED" ? "Төлсөн" : p.status === "PENDING" ? "Хүлээгдэж буй" : "Амжилтгүй"}
                        </span>
                      </td>
                      <td className="py-3 text-txt-3">
                        {new Date(p.paidAt ?? p.createdAt).toLocaleDateString("mn-MN")}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* QPay Modal */}
      {qpay && (
        <PaymentModal
          open={true}
          onClose={() => setQpay(null)}
          onSuccess={() => { setQpay(null); payments.refetch(); orders.refetch(); }}
          invoiceId={qpay.invoiceId}
          qrImage={qpay.qrImage}
          shortUrl={qpay.shortUrl}
          deeplinks={qpay.deeplinks}
          amount={qpay.amount}
        />
      )}
    </div>
  );
}
