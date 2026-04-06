"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc-client";
import { Search, Globe, ChevronLeft, ChevronRight } from "lucide-react";

type DomainStatus = "AVAILABLE" | "PENDING" | "ACTIVE" | "EXPIRED" | "TRANSFERRING";

const statusTabs: { label: string; value: DomainStatus | undefined }[] = [
  { label: "Бүгд", value: undefined },
  { label: "Идэвхтэй", value: "ACTIVE" },
  { label: "Хүлээгдэж буй", value: "PENDING" },
  { label: "Хугацаа дууссан", value: "EXPIRED" },
  { label: "Шилжүүлж буй", value: "TRANSFERRING" },
];

const statusLabels: Record<string, string> = {
  AVAILABLE: "Сул",
  PENDING: "Хүлээгдэж буй",
  ACTIVE: "Идэвхтэй",
  EXPIRED: "Хугацаа дууссан",
  TRANSFERRING: "Шилжүүлж буй",
};

const statusColors: Record<string, string> = {
  ACTIVE: "bg-t/15 text-t",
  PENDING: "bg-[#FFB02E]/15 text-[#FFB02E]",
  EXPIRED: "bg-[#FF4D6A]/15 text-[#FF4D6A]",
  AVAILABLE: "bg-v/15 text-v",
  TRANSFERRING: "bg-[#9999BB]/15 text-[#9999BB]",
};

function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-xl bg-bg-3 ${className}`} />;
}

export default function AdminDomainsPage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<DomainStatus | undefined>(
    undefined
  );
  const [page, setPage] = useState(1);
  const limit = 20;

  const [timer, setTimer] = useState<ReturnType<typeof setTimeout> | null>(null);
  function handleSearch(val: string) {
    setSearch(val);
    if (timer) clearTimeout(timer);
    const t = setTimeout(() => {
      setDebouncedSearch(val);
      setPage(1);
    }, 400);
    setTimer(t);
  }

  const { data, isLoading } = trpc.admin.getAllDomains.useQuery({
    page,
    limit,
    search: debouncedSearch || undefined,
    status: statusFilter,
  });

  const domains = data?.domains ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.pages ?? 1;

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-syne text-2xl font-bold tracking-tight text-txt">
          Бүх домэйнууд
        </h1>
        <p className="mt-1 text-[13px] text-txt-3">
          Бүртгэлтэй домэйнуудын жагсаалт, удирдлага
        </p>
      </div>

      {/* Status Filter Tabs */}
      <div className="mb-4 flex items-center gap-2">
        {statusTabs.map((tab) => (
          <button
            key={tab.label}
            onClick={() => {
              setStatusFilter(tab.value);
              setPage(1);
            }}
            className={`rounded-lg px-4 py-2 text-[13px] font-medium transition-colors ${
              statusFilter === tab.value
                ? "bg-v/15 text-v"
                : "border border-white/[0.06] bg-bg-2 text-txt-3 hover:bg-white/[0.03] hover:text-txt-2"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="mb-6 flex items-center gap-3">
        <div className="relative max-w-md flex-1">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-txt-3"
          />
          <input
            type="text"
            placeholder="Домэйн нэр эсвэл TLD-ээр хайх..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full rounded-xl border border-white/[0.06] bg-bg-2 py-2.5 pl-9 pr-4 text-[13px] text-txt placeholder:text-txt-3 outline-none transition-colors focus:border-v/30"
          />
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-white/[0.06] bg-bg-2 px-4 py-2.5">
          <Globe size={15} className="text-txt-3" />
          <span className="text-[13px] text-txt-2">{total} домэйн</span>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-white/[0.04] bg-bg-2 p-6">
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-[48px]" />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[13px]">
              <thead>
                <tr className="border-b border-white/[0.04] text-txt-3">
                  <th className="pb-3 pr-4 font-medium">Домэйн</th>
                  <th className="pb-3 pr-4 font-medium">TLD</th>
                  <th className="pb-3 pr-4 font-medium">Эзэмшигч</th>
                  <th className="pb-3 pr-4 font-medium">Төлөв</th>
                  <th className="pb-3 pr-4 font-medium">Үнэ</th>
                  <th className="pb-3 font-medium">Дуусах огноо</th>
                </tr>
              </thead>
              <tbody>
                {domains.map((d) => (
                  <tr key={d.id} className="border-b border-white/[0.02]">
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2">
                        <Globe size={14} className="text-v" />
                        <span className="font-medium text-txt">
                          {d.name}
                          <span className="text-txt-3">{d.tld}</span>
                        </span>
                      </div>
                    </td>
                    <td className="py-3 pr-4 text-txt-2">{d.tld}</td>
                    <td className="py-3 pr-4 text-txt-2">
                      {d.user?.name ?? d.user?.email ?? "—"}
                    </td>
                    <td className="py-3 pr-4">
                      <span
                        className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${statusColors[d.status] ?? "bg-white/[0.06] text-txt-3"}`}
                      >
                        {statusLabels[d.status] ?? d.status}
                      </span>
                    </td>
                    <td className="py-3 pr-4 font-medium text-txt">
                      ₮{d.price.toLocaleString()}
                    </td>
                    <td className="py-3 text-txt-3">
                      {d.expiresAt
                        ? new Date(d.expiresAt).toLocaleDateString("mn-MN")
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!isLoading && domains.length === 0 && (
          <div className="py-12 text-center text-[13px] text-txt-3">
            Хайлтад тохирох домэйн олдсонгүй
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-4 flex items-center justify-between border-t border-white/[0.04] pt-4">
            <span className="text-[12px] text-txt-3">
              {(page - 1) * limit + 1}–{Math.min(page * limit, total)} /{" "}
              {total}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.06] bg-bg text-txt-3 transition-colors hover:bg-white/[0.03] disabled:opacity-30"
              >
                <ChevronLeft size={14} />
              </button>
              {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                let p: number;
                if (totalPages <= 7) {
                  p = i + 1;
                } else if (page <= 4) {
                  p = i + 1;
                } else if (page >= totalPages - 3) {
                  p = totalPages - 6 + i;
                } else {
                  p = page - 3 + i;
                }
                return (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`flex h-8 w-8 items-center justify-center rounded-lg text-[12px] font-medium transition-colors ${
                      p === page
                        ? "bg-v/15 text-v"
                        : "border border-white/[0.06] bg-bg text-txt-3 hover:bg-white/[0.03]"
                    }`}
                  >
                    {p}
                  </button>
                );
              })}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.06] bg-bg text-txt-3 transition-colors hover:bg-white/[0.03] disabled:opacity-30"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
