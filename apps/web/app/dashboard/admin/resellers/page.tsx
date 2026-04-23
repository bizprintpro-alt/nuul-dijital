// @ts-nocheck
"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc-client";
import {
  Crown, CheckCircle, XCircle, Loader2, Users, DollarSign,
  Banknote, Clock,
} from "lucide-react";

export default function AdminResellersPage() {
  const [tab, setTab] = useState<"pending" | "active" | "withdrawals">("pending");

  const pendingResellers = trpc.reseller.getPendingResellers.useQuery();
  const activeResellers = trpc.reseller.getAllResellers.useQuery();
  const withdrawals = trpc.reseller.getWithdrawals.useQuery();

  const approveReseller = trpc.reseller.approveReseller.useMutation();
  const rejectReseller = trpc.reseller.rejectReseller.useMutation();
  const processWithdrawal = trpc.reseller.processWithdrawal.useMutation();

  const [processing, setProcessing] = useState<string | null>(null);

  async function handleApprove(id: string) {
    setProcessing(id);
    try {
      await approveReseller.mutateAsync({ id });
      pendingResellers.refetch();
      activeResellers.refetch();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Алдаа");
    } finally {
      setProcessing(null);
    }
  }

  async function handleReject(id: string) {
    setProcessing(id);
    try {
      await rejectReseller.mutateAsync({ id });
      pendingResellers.refetch();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Алдаа");
    } finally {
      setProcessing(null);
    }
  }

  async function handleProcessWithdrawal(id: string, status: "PAID" | "REJECTED") {
    setProcessing(id);
    try {
      await processWithdrawal.mutateAsync({ id, status });
      withdrawals.refetch();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Алдаа");
    } finally {
      setProcessing(null);
    }
  }

  const tabs = [
    { key: "pending" as const, label: "Хүсэлтүүд", count: pendingResellers.data?.length ?? 0 },
    { key: "active" as const, label: "Идэвхтэй" },
    { key: "withdrawals" as const, label: "Зарлага", count: withdrawals.data?.length ?? 0 },
  ];

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-2">
          <Crown size={20} className="text-v" />
          <h1 className="font-syne text-2xl font-bold tracking-tight text-txt">Reseller удирдлага</h1>
        </div>
        <p className="mt-1 text-[13px] text-txt-3">Reseller хүсэлт, зарлага удирдах</p>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-1 rounded-xl border border-white/[0.04] bg-bg-2 p-1">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-2 rounded-lg px-5 py-2.5 text-[13px] font-medium transition ${
              tab === t.key ? "bg-v/15 text-v-soft" : "text-txt-3 hover:text-txt-2"
            }`}
          >
            {t.label}
            {t.count !== undefined && t.count > 0 && (
              <span className="rounded bg-v/20 px-1.5 py-0.5 text-[10px] font-bold text-v-soft">
                {t.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── Pending Applications ── */}
      {tab === "pending" && (
        <div className="rounded-2xl border border-white/[0.04] bg-bg-2 p-6">
          <h3 className="mb-4 font-syne text-base font-bold text-txt">Хүлээгдэж буй хүсэлтүүд</h3>

          {pendingResellers.isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 size={24} className="animate-spin text-v" />
            </div>
          ) : !pendingResellers.data || pendingResellers.data.length === 0 ? (
            <p className="py-8 text-center text-[13px] text-txt-3">Хүлээгдэж буй хүсэлт байхгүй</p>
          ) : (
            <div className="space-y-3">
              {pendingResellers.data.map((r) => (
                <div
                  key={r.id}
                  className="flex items-center justify-between rounded-xl border border-white/[0.04] bg-white/[0.01] px-5 py-4"
                >
                  <div>
                    <div className="text-[13px] font-medium text-txt">{r.companyName}</div>
                    <div className="text-[11px] text-txt-3">
                      {r.user.name ?? r.user.email} &middot;{" "}
                      {new Date(r.createdAt).toLocaleDateString("mn-MN")}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApprove(r.id)}
                      disabled={processing === r.id}
                      className="flex items-center gap-1.5 rounded-lg bg-t/10 px-3.5 py-1.5 text-[11px] font-bold text-t transition hover:bg-t/20 disabled:opacity-50"
                    >
                      {processing === r.id ? (
                        <Loader2 size={12} className="animate-spin" />
                      ) : (
                        <CheckCircle size={12} />
                      )}
                      Зөвшөөрөх
                    </button>
                    <button
                      onClick={() => handleReject(r.id)}
                      disabled={processing === r.id}
                      className="flex items-center gap-1.5 rounded-lg bg-red-500/10 px-3.5 py-1.5 text-[11px] font-bold text-red-400 transition hover:bg-red-500/20 disabled:opacity-50"
                    >
                      <XCircle size={12} />
                      Татгалзах
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Active Resellers ── */}
      {tab === "active" && (
        <div className="rounded-2xl border border-white/[0.04] bg-bg-2 p-6">
          <h3 className="mb-4 font-syne text-base font-bold text-txt">Идэвхтэй reseller-үүд</h3>

          {activeResellers.isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 size={24} className="animate-spin text-v" />
            </div>
          ) : !activeResellers.data || activeResellers.data.length === 0 ? (
            <p className="py-8 text-center text-[13px] text-txt-3">Идэвхтэй reseller байхгүй</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/[0.04] text-left text-[11px] font-semibold uppercase tracking-wider text-txt-3">
                    <th className="pb-3 pr-4">Нэр</th>
                    <th className="pb-3 pr-4">Компани</th>
                    <th className="pb-3 pr-4">Харилцагч</th>
                    <th className="pb-3 pr-4">Нийт орлого</th>
                    <th className="pb-3">Шимтгэл</th>
                  </tr>
                </thead>
                <tbody>
                  {activeResellers.data.map((r) => (
                    <tr key={r.id} className="border-b border-white/[0.02] text-[13px]">
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-2">
                          <Crown size={14} className="text-[#FFB02E]" />
                          <span className="text-txt">{r.user.name ?? r.user.email}</span>
                        </div>
                      </td>
                      <td className="py-3 pr-4 text-txt-2">{r.companyName}</td>
                      <td className="py-3 pr-4 text-txt-2">{r._count.clients}</td>
                      <td className="py-3 pr-4 font-semibold text-t">₮{r.totalEarned.toLocaleString()}</td>
                      <td className="py-3 text-txt-2">{(r.commissionRate * 100).toFixed(0)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ── Withdrawal Requests ── */}
      {tab === "withdrawals" && (
        <div className="rounded-2xl border border-white/[0.04] bg-bg-2 p-6">
          <h3 className="mb-4 font-syne text-base font-bold text-txt">Зарлагын хүсэлтүүд</h3>

          {withdrawals.isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 size={24} className="animate-spin text-v" />
            </div>
          ) : !withdrawals.data || withdrawals.data.length === 0 ? (
            <p className="py-8 text-center text-[13px] text-txt-3">Хүлээгдэж буй зарлагын хүсэлт байхгүй</p>
          ) : (
            <div className="space-y-3">
              {withdrawals.data.map((w) => (
                <div
                  key={w.id}
                  className="flex items-center justify-between rounded-xl border border-white/[0.04] bg-white/[0.01] px-5 py-4"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-syne text-base font-bold text-txt">
                        ₮{w.amount.toLocaleString()}
                      </span>
                      <span
                        className={`rounded-md px-2 py-0.5 text-[11px] font-semibold ${
                          w.status === "PENDING"
                            ? "bg-[#FFB02E]/15 text-[#FFB02E]"
                            : "bg-v/15 text-v-soft"
                        }`}
                      >
                        {w.status === "PENDING" ? "Хүлээгдэж буй" : "Боловсруулж буй"}
                      </span>
                    </div>
                    <div className="mt-1 text-[11px] text-txt-3">
                      {w.reseller.user.name ?? w.reseller.user.email} &middot; {w.bankName} &middot; {w.accountNo}
                    </div>
                    <div className="text-[10px] text-txt-3">
                      {new Date(w.createdAt).toLocaleDateString("mn-MN")}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleProcessWithdrawal(w.id, "PAID")}
                      disabled={processing === w.id}
                      className="flex items-center gap-1.5 rounded-lg bg-t/10 px-3.5 py-1.5 text-[11px] font-bold text-t transition hover:bg-t/20 disabled:opacity-50"
                    >
                      {processing === w.id ? (
                        <Loader2 size={12} className="animate-spin" />
                      ) : (
                        <Banknote size={12} />
                      )}
                      Шилжүүлсэн
                    </button>
                    <button
                      onClick={() => handleProcessWithdrawal(w.id, "REJECTED")}
                      disabled={processing === w.id}
                      className="flex items-center gap-1.5 rounded-lg bg-red-500/10 px-3.5 py-1.5 text-[11px] font-bold text-red-400 transition hover:bg-red-500/20 disabled:opacity-50"
                    >
                      <XCircle size={12} />
                      Цуцлах
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
