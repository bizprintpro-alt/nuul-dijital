import { Server, Check } from "lucide-react";
import Link from "next/link";

const plans = [
  {
    name: "Starter",
    price: "₮99,000",
    desc: "Эхлэгч бизнест тохирсон",
    features: ["1 домэйн + хост", "5GB SSD", "SSL + 5 имэйл", "Дэмжлэг 9–18 цаг"],
    featured: false,
  },
  {
    name: "Business",
    price: "₮249,000",
    desc: "Өсөн дэвших бизнест",
    features: ["5 домэйн + cloud хост", "25GB SSD", "CRM + имэйл маркетинг", "AI чатбот", "QPay / SocialPay", "AI дэмжлэг 24/7"],
    featured: true,
  },
  {
    name: "Enterprise",
    price: "Тохиролцоно",
    desc: "Том байгууллагад",
    features: ["Хязгааргүй домэйн & хост", "100GB+ SSD", "ERP / Odoo", "Call center + Callpro", "Dedicated manager"],
    featured: false,
    custom: true,
  },
];

export default function HostingPage() {
  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-2">
          <h1 className="font-syne text-2xl font-bold tracking-tight text-txt">Хостинг</h1>
          <span className="rounded-md bg-t/15 px-2 py-0.5 text-[10px] font-bold text-t">Шинэ</span>
        </div>
        <p className="mt-1 text-[13px] text-txt-3">Өндөр хурд, найдвартай cloud хостинг үйлчилгээ</p>
      </div>

      <div className="grid items-start gap-4 md:grid-cols-3">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`relative overflow-hidden rounded-2xl border p-7 transition-all hover:-translate-y-1 ${
              plan.featured
                ? "border-v/20 bg-gradient-to-br from-bg-3 to-bg-4 shadow-[0_0_40px_rgba(108,99,255,0.1)]"
                : "border-white/[0.04] bg-bg-2"
            }`}
          >
            {plan.featured && (
              <>
                <div className="absolute left-[10%] right-[10%] top-0 h-0.5 bg-gradient-to-r from-transparent via-v to-transparent" />
                <span className="mb-3 inline-block rounded-md border border-v/20 bg-v/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-v-soft">
                  Хамгийн их сонгогддог
                </span>
              </>
            )}
            <h3 className="font-syne text-xl font-bold text-txt">{plan.name}</h3>
            <div className={`mt-2 font-syne font-bold tracking-tight ${plan.custom ? "text-lg" : "text-3xl"} text-gradient-txt-vg`}>
              {plan.price}
              {!plan.custom && <span className="text-sm font-normal text-txt-3">/сар</span>}
            </div>
            <p className="mt-1 text-[12px] text-txt-3">{plan.desc}</p>
            <div className="my-5 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
            <div className="mb-6 space-y-2.5">
              {plan.features.map((f) => (
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
                plan.featured
                  ? "bg-v text-white shadow-[0_0_20px_rgba(108,99,255,0.25)] hover:shadow-[0_0_30px_rgba(108,99,255,0.4)]"
                  : "border border-v/20 text-v-soft hover:bg-v/5"
              }`}
            >
              {plan.custom ? "Холбоо барих" : "Сонгох"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
