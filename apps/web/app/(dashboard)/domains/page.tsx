import { DomainSearch } from "@/components/domains/DomainSearch";
import { Globe } from "lucide-react";

export default function DomainsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="font-syne text-2xl font-bold tracking-tight text-txt">Домэйн захиалах</h1>
        <p className="mt-1 text-[13px] text-txt-3">Бизнесийн нэрээ онлайнд бүртгүүлээрэй</p>
      </div>

      <div className="rounded-2xl border border-white/[0.04] bg-bg-2 p-6">
        <DomainSearch />
      </div>

      {/* My Domains */}
      <div className="mt-6 rounded-2xl border border-white/[0.04] bg-bg-2 p-6">
        <h3 className="mb-4 font-syne text-base font-bold text-txt">Миний домэйнууд</h3>
        <div className="space-y-2">
          {[
            { name: "miniishop.mn", status: "ACTIVE", expires: "2025-12-15" },
            { name: "company.com.mn", status: "ACTIVE", expires: "2025-08-22" },
            { name: "blog.org", status: "PENDING", expires: "—" },
          ].map((d) => (
            <div key={d.name} className="flex items-center justify-between rounded-xl border border-white/[0.03] bg-white/[0.01] px-5 py-3">
              <div className="flex items-center gap-3">
                <Globe size={16} className="text-v" />
                <span className="text-[13px] font-medium text-txt">{d.name}</span>
              </div>
              <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                d.status === "ACTIVE" ? "bg-t/15 text-t" : "bg-[#FFB02E]/15 text-[#FFB02E]"
              }`}>
                {d.status === "ACTIVE" ? "Идэвхтэй" : "Хүлээгдэж буй"}
              </span>
              <span className="text-[12px] text-txt-3">Дуусах: {d.expires}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
