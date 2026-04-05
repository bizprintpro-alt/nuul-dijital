import { Cloud, Cpu, HardDrive, Zap, Plus } from "lucide-react";

const plans = [
  {
    name: "VPS Basic",
    cpu: "2 vCPU",
    ram: "4GB RAM",
    storage: "80GB SSD",
    bandwidth: "2TB",
    price: "₮199,000",
    features: ["Ubuntu/CentOS", "Root access", "99.9% uptime", "Snapshot backup"],
  },
  {
    name: "VPS Pro",
    cpu: "4 vCPU",
    ram: "8GB RAM",
    storage: "160GB SSD",
    bandwidth: "4TB",
    price: "₮399,000",
    featured: true,
    features: ["Ubuntu/CentOS/Windows", "Root access", "99.99% uptime", "Auto backup", "DDoS хамгаалалт"],
  },
  {
    name: "Cloud Server",
    cpu: "8 vCPU",
    ram: "16GB RAM",
    storage: "320GB NVMe",
    bandwidth: "Хязгааргүй",
    price: "₮799,000",
    features: ["Бүх OS", "Dedicated IP", "99.99% uptime", "Auto scaling", "Load balancer", "24/7 дэмжлэг"],
  },
];

export default function VPSPage() {
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
              <div className="absolute left-[10%] right-[10%] top-0 h-0.5 bg-gradient-to-r from-transparent via-v to-transparent" />
            )}
            <h3 className="font-syne text-xl font-bold text-txt">{plan.name}</h3>

            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2 text-[13px] text-txt-2">
                <Cpu size={14} className="text-v" /> {plan.cpu}
              </div>
              <div className="flex items-center gap-2 text-[13px] text-txt-2">
                <Zap size={14} className="text-t" /> {plan.ram}
              </div>
              <div className="flex items-center gap-2 text-[13px] text-txt-2">
                <HardDrive size={14} className="text-[#FFB02E]" /> {plan.storage}
              </div>
              <div className="flex items-center gap-2 text-[13px] text-txt-2">
                <Cloud size={14} className="text-[#FF6B9D]" /> {plan.bandwidth}
              </div>
            </div>

            <div className="my-5 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

            <div className="text-gradient-txt-vg font-syne text-3xl font-bold tracking-tight">
              {plan.price}<span className="text-sm font-normal text-txt-3">/сар</span>
            </div>

            <div className="my-5 space-y-2">
              {plan.features.map((f) => (
                <div key={f} className="flex items-center gap-2 text-[12px] text-txt-2">
                  <div className="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-[5px] border border-t/30 bg-t/10">
                    <svg width="9" height="9" viewBox="0 0 8 8"><polyline points="1,4 3,6 7,2" fill="none" stroke="#00D4AA" strokeWidth="1.5" /></svg>
                  </div>
                  {f}
                </div>
              ))}
            </div>

            <button className={`w-full rounded-xl py-3 text-[13px] font-bold transition-all ${
              plan.featured
                ? "bg-v text-white shadow-[0_0_20px_rgba(108,99,255,0.25)]"
                : "border border-v/20 text-v-soft hover:bg-v/5"
            }`}>
              Захиалах
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
