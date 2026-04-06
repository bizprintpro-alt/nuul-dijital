"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc-client";
import { Globe, AlertTriangle, Loader2, RefreshCw, Search, List } from "lucide-react";
import { DomainSearch } from "@/components/domains/DomainSearch";
import { PaymentModal } from "@/components/payments/PaymentModal";

interface QPayState {
  invoiceId: string;
  qrImage: string;
  shortUrl?: string;
  deeplinks?: Array<{ name: string; description: string; logo: string; link: string }>;
  amount: number;
}

export default function DomainsPage() {
  const [tab, setTab] = useState<"search" | "my">("search");
  const [renewing, setRenewing] = useState<string | null>(null);
  const [qpay, setQpay] = useState<QPayState | null>(null);

  const userDomains = trpc.domain.getUserDomains.useQuery();
  const renewDomain = trpc.domain.renewDomain.useMutation();

  function getDaysLeft(expiresAt: string | Date | null): number | null {
    if (!expiresAt) return null;
    return Math.ceil((new Date(expiresAt).getTime() - Date.now()) / 86400000);
  }

  function getExpiryColor(days: number | null): string {
    if (days === null) return "text-txt-3";
    if (days <= 0) return "text-red-400";
    if (days <= 30) return "text-red-400";
    if (days <= 90) return "text-[#FFB02E]";
    return "text-t";
  }

  async function handleRenew(domainId: string) {
    setRenewing(domainId);
    try {
      const result = await renewDomain.mutateAsync({ domainId });

      const res = await fetch("/api/payments/qpay/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: result.orderId,
          amount: result.amount,
          description: `${result.domain} домэйн сунгалт`,
        }),
      });
      const data = await res.json();

      if (data.success) {
        setQpay({
          invoiceId: data.invoiceId,
          qrImage: data.qrImage,
          shortUrl: data.shortUrl,
          deeplinks: data.deeplinks,
          amount: result.amount,
        });
      }
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Алдаа гарлаа");
    } finally {
      setRenewing(null);
    }
  }

  const statusLabel: Record<string, { text: string; color: string }> = {
    ACTIVE: { text: "Идэвхтэй", color: "bg-t/15 text-t" },
    PENDING: { text: "Хүлээгдэж буй", color: "bg-[#FFB02E]/15 text-[#FFB02E]" },
    EXPIRED: { text: "Хугацаа дууссан", color: "bg-red-500/15 text-red-400" },
    TRANSFERRING: { text: "Шилжүүлж буй", color: "bg-v/15 text-v-soft" },
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-syne text-2xl font-bold tracking-tight text-txt">Домэйн</h1>
        <p className="mt-1 text-[13px] text-txt-3">Домэйн хайж, захиалж, удирдах</p>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-1 rounded-xl bg-bg-2 p-1 border border-white/[0.04]">
        <button
          onClick={() => setTab("search")}
          className={`flex items-center gap-2 rounded-lg px-5 py-2.5 text-[13px] font-medium transition ${
            tab === "search" ? "bg-v/15 text-v-soft" : "text-txt-3 hover:text-txt-2"
          }`}
        >
          <Search size={15} />
          Домэйн хайх
        </button>
        <button
          onClick={() => setTab("my")}
          className={`flex items-center gap-2 rounded-lg px-5 py-2.5 text-[13px] font-medium transition ${
            tab === "my" ? "bg-v/15 text-v-soft" : "text-txt-3 hover:text-txt-2"
          }`}
        >
          <List size={15} />
          Миний домэйнууд
          {userDomains.data && userDomains.data.length > 0 && (
            <span className="rounded bg-white/[0.06] px-1.5 py-0.5 text-[10px]">{userDomains.data.length}</span>
          )}
        </button>
      </div>

      {/* Search tab */}
      {tab === "search" && (
        <div className="rounded-2xl border border-white/[0.04] bg-bg-2 p-6">
          <DomainSearch />
        </div>
      )}

      {/* My Domains tab */}
      {tab === "my" && (
        <div className="rounded-2xl border border-white/[0.04] bg-bg-2 p-6">
          <h3 className="mb-4 font-syne text-base font-bold text-txt">Миний домэйнууд</h3>

          {userDomains.isLoading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-14 animate-pulse rounded-xl bg-bg-3" />
              ))}
            </div>
          ) : !userDomains.data || userDomains.data.length === 0 ? (
            <div className="py-12 text-center">
              <Globe size={32} className="mx-auto mb-3 text-txt-3" />
              <p className="text-[13px] text-txt-3">Домэйн байхгүй байна</p>
              <button
                onClick={() => setTab("search")}
                className="mt-3 rounded-lg bg-v px-4 py-2 text-[12px] font-bold text-white"
              >
                Домэйн хайх
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/[0.04] text-left text-[11px] font-semibold uppercase tracking-wider text-txt-3">
                    <th className="pb-3 pr-4">Домэйн</th>
                    <th className="pb-3 pr-4">Төлөв</th>
                    <th className="pb-3 pr-4">Дуусах огноо</th>
                    <th className="pb-3">Үйлдэл</th>
                  </tr>
                </thead>
                <tbody>
                  {userDomains.data.map((d) => {
                    const daysLeft = getDaysLeft(d.expiresAt);
                    const expiryColor = getExpiryColor(daysLeft);
                    const st = statusLabel[d.status] ?? { text: d.status, color: "bg-white/[0.06] text-txt-3" };

                    return (
                      <tr key={d.id} className="border-b border-white/[0.02]">
                        <td className="py-3.5 pr-4">
                          <div className="flex items-center gap-2">
                            <Globe size={15} className="text-v" />
                            <span className="text-[13px] font-medium text-txt">{d.name}</span>
                          </div>
                        </td>
                        <td className="py-3.5 pr-4">
                          <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${st.color}`}>{st.text}</span>
                        </td>
                        <td className="py-3.5 pr-4">
                          {d.expiresAt ? (
                            <div className="flex items-center gap-1.5">
                              {daysLeft !== null && daysLeft <= 30 && (
                                <AlertTriangle size={12} className="text-red-400" />
                              )}
                              <span className={`text-[12px] font-medium ${expiryColor}`}>
                                {new Date(d.expiresAt).toLocaleDateString("mn-MN")}
                                {daysLeft !== null && (
                                  <span className="ml-1 text-[11px]">
                                    ({daysLeft <= 0 ? "Дууссан" : `${daysLeft} хоног`})
                                  </span>
                                )}
                              </span>
                            </div>
                          ) : (
                            <span className="text-[12px] text-txt-3">—</span>
                          )}
                        </td>
                        <td className="py-3.5">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleRenew(d.id)}
                              disabled={renewing === d.id}
                              className="flex items-center gap-1 rounded-lg bg-v/10 px-3 py-1.5 text-[11px] font-bold text-v-soft transition hover:bg-v/20 disabled:opacity-50"
                            >
                              {renewing === d.id ? <Loader2 size={11} className="animate-spin" /> : <RefreshCw size={11} />}
                              Сунгах
                            </button>
                            <button className="rounded-lg border border-white/[0.06] px-3 py-1.5 text-[11px] text-txt-3 transition hover:bg-white/[0.03]">
                              DNS
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* QPay Modal for renewal */}
      {qpay && (
        <PaymentModal
          open={true}
          onClose={() => setQpay(null)}
          onSuccess={() => { setQpay(null); userDomains.refetch(); }}
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
