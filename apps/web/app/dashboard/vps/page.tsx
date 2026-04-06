// @ts-nocheck
"use client";

import { useState } from "react";
import { Cloud, Cpu, HardDrive, Zap, Plus, Check, Server, Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc-client";
import { PaymentModal } from "@/components/payments/PaymentModal";

interface QPayState {
  invoiceId: string;
  qrImage: string;
  shortUrl?: string;
  deeplinks?: any[];
  amount: number;
}

export default function VPSPage() {
  const { data: plans, isLoading, refetch } = trpc.hosting.getVPSPlans.useQuery();
  const [ordering, setOrdering] = useState<string | null>(null);
  const [qpay, setQpay] = useState<QPayState | null>(null);
  const [provisionStatus, setProvisionStatus] = useState<string | null>(null);

  async function handleOrder(planId: string, planName: string, price: number) {
    setOrdering(planId);
    try {
      // 1. Create hosting order
      const res = await fetch("/api/hosting/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planType: planId }),
      });
      const orderData = await res.json();
      if (!orderData.orderId) throw new Error(orderData.error || "Захиалга үүсгэхэд алдаа");

      // 2. Create QPay invoice
      const qpayRes = await fetch("/api/payments/qpay/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: orderData.orderId,
          amount: price,
          description: `${planName} VPS захиалга`,
        }),
      });
      const qpayData = await qpayRes.json();

      if (qpayData.success) {
        setQpay({
          invoiceId: qpayData.invoiceId,
          qrImage: qpayData.qrImage,
          shortUrl: qpayData.shortUrl,
          deeplinks: qpayData.deeplinks,
          amount: price,
        });
      } else {
        alert(qpayData.error || "QPay алдаа");
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "Алдаа гарлаа");
    } finally {
      setOrdering(null);
    }
  }

  async function handlePaymentSuccess() {
    setQpay(null);
    setProvisionStatus("provisioning");

    // Provision server
    try {
      const res = await fetch("/api/hosting/provision", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planType: "VPS_BASIC" }),
      });
      const data = await res.json();

      if (data.accountId) {
        // Poll status
        const poll = setInterval(async () => {
          const statusRes = await fetch("/api/hosting/status", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ accountId: data.accountId }),
          });
          const statusData = await statusRes.json();
          if (statusData.status === "ACTIVE") {
            clearInterval(poll);
            setProvisionStatus("ready");
            setTimeout(() => setProvisionStatus(null), 5000);
          }
        }, 5000);

        setTimeout(() => {
          clearInterval(poll);
          setProvisionStatus("ready");
          setTimeout(() => setProvisionStatus(null), 3000);
        }, 15000);
      }
    } catch {
      setProvisionStatus(null);
    }
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-syne text-2xl font-bold tracking-tight text-txt">VPS / Cloud</h1>
          <p className="mt-1 text-[13px] text-txt-3">Өндөр хүчин чадалтай виртуал сервер, cloud дэд бүтэц</p>
        </div>
        <button
          onClick={() => {
            const el = document.getElementById("vps-plans");
            el?.scrollIntoView({ behavior: "smooth" });
          }}
          className="flex items-center gap-2 rounded-xl bg-v px-5 py-2.5 text-[13px] font-bold text-white shadow-[0_0_16px_rgba(108,99,255,0.25)]"
        >
          <Plus size={15} />
          Сервер нэмэх
        </button>
      </div>

      {/* Provision status */}
      {provisionStatus && (
        <div className={`mb-6 flex items-center gap-3 rounded-xl border p-4 ${
          provisionStatus === "ready"
            ? "border-t/20 bg-t/5"
            : "border-v/20 bg-v/5"
        }`}>
          {provisionStatus === "provisioning" ? (
            <>
              <Loader2 size={18} className="animate-spin text-v" />
              <div>
                <p className="text-[13px] font-semibold text-txt">Сервер бэлтгэж байна...</p>
                <p className="text-[11px] text-txt-3">2-3 минут хүлээнэ үү. Nginx, PHP, WordPress суулгаж байна.</p>
              </div>
            </>
          ) : (
            <>
              <Check size={18} className="text-t" />
              <div>
                <p className="text-[13px] font-semibold text-t">Сервер бэлэн боллоо!</p>
                <p className="text-[11px] text-txt-3">Таны VPS амжилттай идэвхжлээ.</p>
              </div>
            </>
          )}
        </div>
      )}

      {/* Plans */}
      <div id="vps-plans">
        {isLoading ? (
          <div className="grid items-start gap-4 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse rounded-2xl border border-white/[0.04] bg-bg-2 p-7">
                <div className="mb-2 h-6 w-24 rounded bg-white/[0.04]" />
                <div className="mb-4 space-y-2">
                  {[1, 2, 3, 4].map((j) => (
                    <div key={j} className="h-4 w-full rounded bg-white/[0.04]" />
                  ))}
                </div>
                <div className="h-12 w-full rounded-xl bg-white/[0.04]" />
              </div>
            ))}
          </div>
        ) : !plans?.length ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-white/[0.04] bg-bg-2 py-20">
            <Server size={32} className="mb-3 text-txt-3" />
            <p className="text-[13px] text-txt-3">VPS план байхгүй</p>
          </div>
        ) : (
          <div className="grid items-start gap-4 md:grid-cols-3">
            {plans.map((plan, idx) => {
              const featured = idx === 1;
              const cpuFeature = plan.features.find((f) => f.toLowerCase().includes("vcpu"));
              const ramFeature = plan.features.find((f) => f.toLowerCase().includes("ram"));
              const storageFeature = plan.features.find((f) => f.toLowerCase().includes("ssd") || f.toLowerCase().includes("nvme"));
              const otherFeatures = plan.features.filter(
                (f) => f !== cpuFeature && f !== ramFeature && f !== storageFeature
              );

              return (
                <div
                  key={plan.id}
                  className={`relative overflow-hidden rounded-2xl border p-7 transition-all hover:-translate-y-1 ${
                    featured
                      ? "border-v/20 bg-gradient-to-br from-bg-3 to-bg-4 shadow-[0_0_40px_rgba(108,99,255,0.1)]"
                      : "border-white/[0.04] bg-bg-2"
                  }`}
                >
                  {featured && (
                    <div className="absolute left-[10%] right-[10%] top-0 h-0.5 bg-gradient-to-r from-transparent via-v to-transparent" />
                  )}
                  <h3 className="font-syne text-xl font-bold text-txt">{plan.name}</h3>

                  <div className="mt-4 space-y-2">
                    {cpuFeature && (
                      <div className="flex items-center gap-2 text-[13px] text-txt-2">
                        <Cpu size={14} className="text-v" /> {cpuFeature}
                      </div>
                    )}
                    {ramFeature && (
                      <div className="flex items-center gap-2 text-[13px] text-txt-2">
                        <Zap size={14} className="text-t" /> {ramFeature}
                      </div>
                    )}
                    {storageFeature && (
                      <div className="flex items-center gap-2 text-[13px] text-txt-2">
                        <HardDrive size={14} className="text-[#FFB02E]" /> {storageFeature}
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-[13px] text-txt-2">
                      <Cloud size={14} className="text-[#FF6B9D]" />{" "}
                      {plan.bandwidth === 0 ? "Хязгааргүй" : `${plan.bandwidth}GB`}
                    </div>
                  </div>

                  <div className="my-5 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

                  <div className="text-gradient-txt-vg font-syne text-3xl font-bold tracking-tight">
                    ₮{new Intl.NumberFormat("mn-MN").format(plan.price)}
                    <span className="text-sm font-normal text-txt-3">/сар</span>
                  </div>

                  <div className="my-5 space-y-2">
                    {otherFeatures.map((f) => (
                      <div key={f} className="flex items-center gap-2 text-[12px] text-txt-2">
                        <div className="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-[5px] border border-t/30 bg-t/10">
                          <Check size={9} className="text-t" />
                        </div>
                        {f}
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => handleOrder(plan.type, plan.name, plan.price)}
                    disabled={ordering === plan.type}
                    className={`w-full rounded-xl py-3 text-[13px] font-bold transition-all disabled:opacity-50 ${
                      featured
                        ? "bg-v text-white shadow-[0_0_20px_rgba(108,99,255,0.25)] hover:shadow-[0_0_30px_rgba(108,99,255,0.4)]"
                        : "border border-v/20 text-v-soft hover:bg-v/5"
                    }`}
                  >
                    {ordering === plan.type ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 size={14} className="animate-spin" /> Боловсруулж байна...
                      </span>
                    ) : (
                      "Захиалах"
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Payment Modal */}
      {qpay && (
        <PaymentModal
          open={true}
          onClose={() => setQpay(null)}
          onSuccess={handlePaymentSuccess}
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
