"use client";

import { Users, Plus, DollarSign } from "lucide-react";

const stages = [
  {
    name: "Шинэ",
    color: "border-v/30 bg-v/5",
    dotColor: "bg-v",
    leads: [
      { name: "Батаа ХХК", value: 2500000, contact: "bataa@company.mn" },
      { name: "Номин Трейд", value: 1800000, contact: "nomin@trade.mn" },
    ],
  },
  {
    name: "Холбогдсон",
    color: "border-[#FFB02E]/30 bg-[#FFB02E]/5",
    dotColor: "bg-[#FFB02E]",
    leads: [
      { name: "Голомт Банк", value: 5000000, contact: "info@golomt.mn" },
    ],
  },
  {
    name: "Санал илгээсэн",
    color: "border-t/30 bg-t/5",
    dotColor: "bg-t",
    leads: [
      { name: "СГС Групп", value: 8500000, contact: "sales@sgs.mn" },
      { name: "Монос Групп", value: 3200000, contact: "digital@monos.mn" },
    ],
  },
  {
    name: "Хаагдсан",
    color: "border-[#FF6B9D]/30 bg-[#FF6B9D]/5",
    dotColor: "bg-[#FF6B9D]",
    leads: [
      { name: "Тэнгэр ХХК", value: 4100000, contact: "tenger@corp.mn" },
    ],
  },
];

export default function CRMPage() {
  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-syne text-2xl font-bold tracking-tight text-txt">CRM & Борлуулалт</h1>
          <p className="mt-1 text-[13px] text-txt-3">Харилцагчийн pipeline — Kanban хэлбэрээр</p>
        </div>
        <button className="flex items-center gap-2 rounded-xl bg-v px-5 py-2.5 text-[13px] font-bold text-white shadow-[0_0_16px_rgba(108,99,255,0.25)]">
          <Plus size={15} />
          Шинэ lead
        </button>
      </div>

      {/* Pipeline total */}
      <div className="mb-6 flex items-center gap-2 rounded-xl border border-white/[0.04] bg-bg-2 px-5 py-3">
        <DollarSign size={16} className="text-t" />
        <span className="text-[13px] text-txt-2">Pipeline нийт дүн:</span>
        <span className="font-syne text-lg font-bold text-t">₮25,100,000</span>
        <span className="text-[12px] text-txt-3">· 7 lead</span>
      </div>

      {/* Kanban board */}
      <div className="grid gap-4 md:grid-cols-4">
        {stages.map((stage) => (
          <div key={stage.name}>
            <div className="mb-3 flex items-center gap-2">
              <div className={`h-2 w-2 rounded-full ${stage.dotColor}`} />
              <span className="text-[12px] font-semibold text-txt">{stage.name}</span>
              <span className="rounded-md bg-white/[0.04] px-1.5 py-0.5 text-[10px] text-txt-3">
                {stage.leads.length}
              </span>
            </div>
            <div className="space-y-2">
              {stage.leads.map((lead) => (
                <div
                  key={lead.name}
                  className={`cursor-pointer rounded-xl border p-4 transition-all hover:-translate-y-0.5 ${stage.color}`}
                >
                  <div className="text-[13px] font-semibold text-txt">{lead.name}</div>
                  <div className="mt-1 text-[11px] text-txt-3">{lead.contact}</div>
                  <div className="mt-2 font-syne text-sm font-bold text-txt">
                    ₮{lead.value.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
