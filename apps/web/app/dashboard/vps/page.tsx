"use client";

import { Cloud, Cpu, HardDrive, Zap, Plus, Loader2, Check, Server } from "lucide-react";
import { trpc } from "@/lib/trpc-client";

export default function VPSPage() {
  const { data: plans, isLoading } = trpc.hosting.getVPSPlans.useQuery();

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-syne text-2xl font-bold tracking-tight text-txt">VPS / Cloud</h1>
          <p className="mt-1 text-[13px] text-txt-3">Өндөр хүчин чадалтай виртуал сервер, cloud дэд бүтэц</p>
        </div>
        <button className="flex items-center gap-2 rounded-xl bg-v px-5 py-2.5 text-[13px] font-bold text-white shadow-[0_0_16px_rgba(108,99,255,0.25)]">
          <Plus size={15} />
          Сервер нэмэх
        </button>
      </div>

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
              <div className="mb-4 h-10 w-36 rounded bg-white/[0.04]" />
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

            // Extract CPU/RAM/Storage/Bandwidth from features for display
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
                  className={`w-full rounded-xl py-3 text-[13px] font-bold transition-all ${
                    featured
                      ? "bg-v text-white shadow-[0_0_20px_rgba(108,99,255,0.25)]"
                      : "border border-v/20 text-v-soft hover:bg-v/5"
                  }`}
                >
                  Захиалах
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
