"use client";

import { useState } from "react";
import { Search, Globe } from "lucide-react";

type DomainStatus = "ACTIVE" | "PENDING" | "EXPIRED";

interface Domain {
  id: number;
  name: string;
  tld: string;
  owner: string;
  status: DomainStatus;
  expires: string;
}

const mockDomains: Domain[] = [
  { id: 1, name: "miniishop", tld: ".mn", owner: "Б. Болд", status: "ACTIVE", expires: "2027-12-15" },
  { id: 2, name: "company", tld: ".com.mn", owner: "Д. Сарнай", status: "ACTIVE", expires: "2027-08-22" },
  { id: 3, name: "techstore", tld: ".mn", owner: "М. Ганбат", status: "ACTIVE", expires: "2027-06-10" },
  { id: 4, name: "fooddelivery", tld: ".mn", owner: "Э. Оюунцэцэг", status: "PENDING", expires: "—" },
  { id: 5, name: "myblog", tld: ".org", owner: "Т. Батбаяр", status: "EXPIRED", expires: "2026-01-05" },
  { id: 6, name: "fashion", tld: ".mn", owner: "С. Нармандах", status: "ACTIVE", expires: "2027-04-18" },
  { id: 7, name: "devtools", tld: ".com", owner: "Г. Тэмүүлэн", status: "ACTIVE", expires: "2027-09-30" },
  { id: 8, name: "startup", tld: ".mn", owner: "Л. Золзаяа", status: "PENDING", expires: "—" },
  { id: 9, name: "oldsite", tld: ".com.mn", owner: "Н. Эрдэнэ", status: "EXPIRED", expires: "2025-11-20" },
  { id: 10, name: "ecommerce", tld: ".mn", owner: "Х. Мөнхбат", status: "ACTIVE", expires: "2027-07-14" },
];

const statusLabels: Record<DomainStatus, string> = {
  ACTIVE: "Идэвхтэй",
  PENDING: "Хүлээгдэж буй",
  EXPIRED: "Хугацаа дууссан",
};

const statusColors: Record<DomainStatus, string> = {
  ACTIVE: "bg-t/15 text-t",
  PENDING: "bg-[#FFB02E]/15 text-[#FFB02E]",
  EXPIRED: "bg-[#FF4D6A]/15 text-[#FF4D6A]",
};

export default function AdminDomainsPage() {
  const [search, setSearch] = useState("");

  const filtered = mockDomains.filter(
    (d) =>
      `${d.name}${d.tld}`.toLowerCase().includes(search.toLowerCase()) ||
      d.owner.toLowerCase().includes(search.toLowerCase())
  );

  const countByStatus = (s: DomainStatus) => mockDomains.filter((d) => d.status === s).length;

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-syne text-2xl font-bold tracking-tight text-txt">Бүх домэйнууд</h1>
        <p className="mt-1 text-[13px] text-txt-3">Бүртгэлтэй домэйнуудын жагсаалт, удирдлага</p>
      </div>

      {/* Stats Row */}
      <div className="mb-6 grid grid-cols-3 gap-4">
        {(
          [
            { label: "Идэвхтэй", status: "ACTIVE" as DomainStatus, color: "text-t", bg: "bg-t/15" },
            { label: "Хүлээгдэж буй", status: "PENDING" as DomainStatus, color: "text-[#FFB02E]", bg: "bg-[#FFB02E]/15" },
            { label: "Хугацаа дууссан", status: "EXPIRED" as DomainStatus, color: "text-[#FF4D6A]", bg: "bg-[#FF4D6A]/15" },
          ] as const
        ).map((s) => (
          <div key={s.status} className="rounded-2xl border border-white/[0.04] bg-bg-2 p-4">
            <span className="text-[12px] text-txt-3">{s.label}</span>
            <div className="mt-1 flex items-center gap-2">
              <span className={`text-[20px] font-bold ${s.color}`}>{countByStatus(s.status)}</span>
              <span className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold ${s.bg} ${s.color}`}>
                домэйн
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="mb-6 flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-txt-3" />
          <input
            type="text"
            placeholder="Домэйн нэр эсвэл эзэмшигчээр хайх..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-white/[0.06] bg-bg-2 py-2.5 pl-9 pr-4 text-[13px] text-txt placeholder:text-txt-3 outline-none focus:border-v/30 transition-colors"
          />
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-white/[0.06] bg-bg-2 px-4 py-2.5">
          <Globe size={15} className="text-txt-3" />
          <span className="text-[13px] text-txt-2">{filtered.length} домэйн</span>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-white/[0.04] bg-bg-2 p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead>
              <tr className="border-b border-white/[0.04] text-txt-3">
                <th className="pb-3 pr-4 font-medium">Домэйн</th>
                <th className="pb-3 pr-4 font-medium">TLD</th>
                <th className="pb-3 pr-4 font-medium">Эзэмшигч</th>
                <th className="pb-3 pr-4 font-medium">Төлөв</th>
                <th className="pb-3 font-medium">Дуусах огноо</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((d) => (
                <tr key={d.id} className="border-b border-white/[0.02]">
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2">
                      <Globe size={14} className="text-v" />
                      <span className="font-medium text-txt">
                        {d.name}<span className="text-txt-3">{d.tld}</span>
                      </span>
                    </div>
                  </td>
                  <td className="py-3 pr-4 text-txt-2">{d.tld}</td>
                  <td className="py-3 pr-4 text-txt-2">{d.owner}</td>
                  <td className="py-3 pr-4">
                    <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${statusColors[d.status]}`}>
                      {statusLabels[d.status]}
                    </span>
                  </td>
                  <td className="py-3 text-txt-3">{d.expires}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="py-12 text-center text-[13px] text-txt-3">
            Хайлтад тохирох домэйн олдсонгүй
          </div>
        )}
      </div>
    </div>
  );
}
