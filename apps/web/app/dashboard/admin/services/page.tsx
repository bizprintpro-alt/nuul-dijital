// @ts-nocheck
"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc-client";
import {
  Briefcase,
  FileText,
  ChevronLeft,
  ChevronRight,
  Printer,
  Sparkles,
  Loader2,
  X,
  Eye,
} from "lucide-react";

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-500/15 text-yellow-400",
  REVIEWING: "bg-blue-500/15 text-blue-400",
  QUOTED: "bg-purple-500/15 text-purple-400",
  ACCEPTED: "bg-green-500/15 text-green-400",
  IN_PROGRESS: "bg-cyan-500/15 text-cyan-400",
  COMPLETED: "bg-emerald-500/15 text-emerald-400",
  CANCELLED: "bg-red-500/15 text-red-400",
};

const statusLabels: Record<string, string> = {
  PENDING: "Хүлээгдэж буй",
  REVIEWING: "Хянаж байна",
  QUOTED: "Үнэ илгээсэн",
  ACCEPTED: "Зөвшөөрсөн",
  IN_PROGRESS: "Хийгдэж буй",
  COMPLETED: "Дууссан",
  CANCELLED: "Цуцалсан",
};

const allStatuses = [
  "PENDING",
  "REVIEWING",
  "QUOTED",
  "ACCEPTED",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED",
];

export default function AdminServicesPage() {
  const [tab, setTab] = useState<"services" | "quotes">("services");
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const [page, setPage] = useState(1);
  const [selectedQuote, setSelectedQuote] = useState<any>(null);
  const [docPreview, setDocPreview] = useState<"proposal" | "contract" | null>(null);

  const servicesQuery = trpc.services.adminGetServices.useQuery();
  const quotesQuery = trpc.services.adminGetQuotes.useQuery(
    { status: statusFilter as any, page, limit: 20 },
    { enabled: tab === "quotes" }
  );

  const updateQuote = trpc.services.adminUpdateQuote.useMutation({
    onSuccess: () => {
      quotesQuery.refetch();
      if (selectedQuote) {
        // Refresh selected quote data
        const updated = quotesQuery.data?.quotes?.find(
          (q: any) => q.id === selectedQuote.id
        );
        if (updated) setSelectedQuote(updated);
      }
    },
  });

  const generateDocs = trpc.services.adminGenerateDocs.useMutation({
    onSuccess: (data) => {
      setSelectedQuote(data);
      quotesQuery.refetch();
    },
  });

  function handlePrint() {
    window.print();
  }

  return (
    <div className="min-h-screen p-6">
      <div className="mb-6">
        <h1 className="font-syne text-2xl font-bold text-white">
          Үйлчилгээний удирдлага
        </h1>
        <p className="mt-1 text-[13px] text-white/40">
          Үйлчилгээ, үнийн саналуудыг удирдах
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-1 rounded-xl border border-white/[0.06] bg-white/[0.02] p-1 w-fit">
        <button
          onClick={() => setTab("services")}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-[13px] font-medium transition-all ${
            tab === "services"
              ? "bg-[#7B6FFF] text-white"
              : "text-white/50 hover:text-white/70"
          }`}
        >
          <Briefcase size={14} />
          Үйлчилгээ
        </button>
        <button
          onClick={() => {
            setTab("quotes");
            setSelectedQuote(null);
          }}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-[13px] font-medium transition-all ${
            tab === "quotes"
              ? "bg-[#7B6FFF] text-white"
              : "text-white/50 hover:text-white/70"
          }`}
        >
          <FileText size={14} />
          Үнийн саналууд
          {quotesQuery.data?.total ? (
            <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px]">
              {quotesQuery.data.total}
            </span>
          ) : null}
        </button>
      </div>

      {/* ═══ Services Tab ═══ */}
      {tab === "services" && (
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-white/40">
                    Үйлчилгээ
                  </th>
                  <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-white/40">
                    Ангилал
                  </th>
                  <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-white/40">
                    Үнэ
                  </th>
                  <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-white/40">
                    Саналууд
                  </th>
                  <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-white/40">
                    Төлөв
                  </th>
                </tr>
              </thead>
              <tbody>
                {servicesQuery.isLoading &&
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="border-b border-white/[0.04]">
                      <td colSpan={5} className="px-5 py-4">
                        <div className="h-4 w-48 animate-pulse rounded bg-white/[0.04]" />
                      </td>
                    </tr>
                  ))}
                {servicesQuery.data?.map((svc: any) => (
                  <tr
                    key={svc.id}
                    className="border-b border-white/[0.04] transition-all hover:bg-white/[0.02]"
                  >
                    <td className="px-5 py-4">
                      <div className="text-[13px] font-medium text-white">
                        {svc.name}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="rounded-full bg-[#7B6FFF12] px-2.5 py-0.5 text-[11px] text-[#9F98FF]">
                        {svc.category?.name ?? "—"}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-[13px] text-white/60">
                      {svc.price
                        ? `₮${svc.price.toLocaleString()}`
                        : svc.priceLabel ?? "—"}
                    </td>
                    <td className="px-5 py-4 text-[13px] text-white/60">
                      {svc._count?.quotes ?? 0}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
                          svc.isComingSoon
                            ? "bg-yellow-500/15 text-yellow-400"
                            : svc.isActive
                              ? "bg-emerald-500/15 text-emerald-400"
                              : "bg-red-500/15 text-red-400"
                        }`}
                      >
                        {svc.isComingSoon
                          ? "Coming Soon"
                          : svc.isActive
                            ? "Active"
                            : "Inactive"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ═══ Quotes Tab ═══ */}
      {tab === "quotes" && !selectedQuote && (
        <>
          {/* Status filter */}
          <div className="mb-4 flex flex-wrap gap-1.5">
            <button
              onClick={() => {
                setStatusFilter(undefined);
                setPage(1);
              }}
              className={`rounded-lg px-3 py-1.5 text-[12px] font-medium transition-all ${
                !statusFilter
                  ? "bg-[#7B6FFF20] text-[#9F98FF]"
                  : "text-white/40 hover:text-white/60"
              }`}
            >
              Бүгд
            </button>
            {allStatuses.map((s) => (
              <button
                key={s}
                onClick={() => {
                  setStatusFilter(s);
                  setPage(1);
                }}
                className={`rounded-lg px-3 py-1.5 text-[12px] font-medium transition-all ${
                  statusFilter === s
                    ? "bg-[#7B6FFF20] text-[#9F98FF]"
                    : "text-white/40 hover:text-white/60"
                }`}
              >
                {statusLabels[s]}
              </button>
            ))}
          </div>

          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/[0.06]">
                    <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-white/40">
                      Захиалагч
                    </th>
                    <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-white/40">
                      Үйлчилгээ
                    </th>
                    <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-white/40">
                      Төлөв
                    </th>
                    <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-white/40">
                      Огноо
                    </th>
                    <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-white/40" />
                  </tr>
                </thead>
                <tbody>
                  {quotesQuery.isLoading &&
                    Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i} className="border-b border-white/[0.04]">
                        <td colSpan={5} className="px-5 py-4">
                          <div className="h-4 w-48 animate-pulse rounded bg-white/[0.04]" />
                        </td>
                      </tr>
                    ))}
                  {quotesQuery.data?.quotes?.map((q: any) => (
                    <tr
                      key={q.id}
                      className="cursor-pointer border-b border-white/[0.04] transition-all hover:bg-white/[0.02]"
                      onClick={() => setSelectedQuote(q)}
                    >
                      <td className="px-5 py-4">
                        <div className="text-[13px] font-medium text-white">
                          {q.name}
                        </div>
                        <div className="text-[11px] text-white/35">{q.email}</div>
                      </td>
                      <td className="px-5 py-4 text-[13px] text-white/60">
                        {q.service?.name}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
                            statusColors[q.status] ?? ""
                          }`}
                        >
                          {statusLabels[q.status] ?? q.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-[12px] text-white/40">
                        {new Date(q.createdAt).toLocaleDateString("mn-MN")}
                      </td>
                      <td className="px-5 py-4">
                        <Eye size={14} className="text-white/30" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {quotesQuery.data && quotesQuery.data.totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-white/[0.06] px-5 py-3">
                <span className="text-[12px] text-white/40">
                  {quotesQuery.data.total} үнийн санал
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="rounded-lg p-1.5 text-white/40 transition-all hover:bg-white/[0.06] disabled:opacity-30"
                  >
                    <ChevronLeft size={14} />
                  </button>
                  <span className="text-[12px] text-white/60">
                    {page} / {quotesQuery.data.totalPages}
                  </span>
                  <button
                    onClick={() =>
                      setPage((p) =>
                        Math.min(quotesQuery.data!.totalPages, p + 1)
                      )
                    }
                    disabled={page === quotesQuery.data.totalPages}
                    className="rounded-lg p-1.5 text-white/40 transition-all hover:bg-white/[0.06] disabled:opacity-30"
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* ═══ Quote Detail ═══ */}
      {tab === "quotes" && selectedQuote && (
        <div>
          <button
            onClick={() => {
              setSelectedQuote(null);
              setDocPreview(null);
            }}
            className="mb-4 flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[13px] text-white/50 transition-all hover:bg-white/[0.04] hover:text-white"
          >
            <ChevronLeft size={14} />
            Буцах
          </button>

          <div className="grid gap-5 lg:grid-cols-3">
            {/* Left: Client info */}
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 lg:col-span-1">
              <h3 className="mb-4 font-syne text-[15px] font-bold text-white">
                Захиалагчийн мэдээлэл
              </h3>
              <div className="space-y-3">
                {[
                  { label: "Нэр", value: selectedQuote.name },
                  { label: "И-мэйл", value: selectedQuote.email },
                  { label: "Утас", value: selectedQuote.phone },
                  { label: "Компани", value: selectedQuote.company || "—" },
                  { label: "Үйлчилгээ", value: selectedQuote.service?.name },
                  { label: "Төрөл", value: selectedQuote.projectType },
                  { label: "Төсөв", value: selectedQuote.budget || "—" },
                  { label: "Хугацаа", value: selectedQuote.deadline || "—" },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="text-[11px] text-white/35">{item.label}</div>
                    <div className="text-[13px] text-white/80">{item.value}</div>
                  </div>
                ))}
                <div>
                  <div className="text-[11px] text-white/35">Тайлбар</div>
                  <div className="text-[13px] text-white/80 whitespace-pre-wrap">
                    {selectedQuote.description}
                  </div>
                </div>
              </div>

              {/* Status change */}
              <div className="mt-5 border-t border-white/[0.06] pt-4">
                <label className="mb-2 block text-[11px] font-medium text-white/40">
                  Төлөв өөрчлөх
                </label>
                <select
                  value={selectedQuote.status}
                  onChange={(e) => {
                    updateQuote.mutate({
                      id: selectedQuote.id,
                      status: e.target.value as any,
                    });
                    setSelectedQuote({
                      ...selectedQuote,
                      status: e.target.value,
                    });
                  }}
                  className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-2.5 text-[13px] text-white outline-none"
                >
                  {allStatuses.map((s) => (
                    <option key={s} value={s} className="bg-[#0a0a1a]">
                      {statusLabels[s]}
                    </option>
                  ))}
                </select>
              </div>

              {/* Agreed price */}
              <div className="mt-4">
                <label className="mb-2 block text-[11px] font-medium text-white/40">
                  Тохирсон үнэ (₮)
                </label>
                <input
                  type="number"
                  defaultValue={selectedQuote.agreedPrice ?? ""}
                  onBlur={(e) => {
                    const val = parseFloat(e.target.value);
                    if (!isNaN(val)) {
                      updateQuote.mutate({
                        id: selectedQuote.id,
                        agreedPrice: val,
                      });
                    }
                  }}
                  className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-2.5 text-[13px] text-white outline-none"
                  placeholder="0"
                />
              </div>
            </div>

            {/* Right: Documents */}
            <div className="lg:col-span-2">
              <div className="mb-4 flex items-center gap-3">
                <button
                  onClick={() => generateDocs.mutate({ quoteId: selectedQuote.id })}
                  disabled={generateDocs.isPending}
                  className="flex items-center gap-2 rounded-xl bg-[#7B6FFF] px-5 py-2.5 text-[13px] font-bold text-white shadow-[0_0_16px_#7B6FFF40] transition-all hover:bg-[#6B5FEF] disabled:opacity-50"
                >
                  {generateDocs.isPending ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Sparkles size={14} />
                  )}
                  AI баримт бичиг
                </button>

                {(selectedQuote.proposalDoc || selectedQuote.contractDoc) && (
                  <>
                    <button
                      onClick={() => setDocPreview("proposal")}
                      className={`rounded-xl border px-4 py-2.5 text-[13px] font-medium transition-all ${
                        docPreview === "proposal"
                          ? "border-[#7B6FFF40] bg-[#7B6FFF15] text-[#9F98FF]"
                          : "border-white/[0.08] text-white/50 hover:text-white/70"
                      }`}
                    >
                      Санал
                    </button>
                    <button
                      onClick={() => setDocPreview("contract")}
                      className={`rounded-xl border px-4 py-2.5 text-[13px] font-medium transition-all ${
                        docPreview === "contract"
                          ? "border-[#7B6FFF40] bg-[#7B6FFF15] text-[#9F98FF]"
                          : "border-white/[0.08] text-white/50 hover:text-white/70"
                      }`}
                    >
                      Гэрээ
                    </button>
                    <button
                      onClick={handlePrint}
                      className="flex items-center gap-1.5 rounded-xl border border-white/[0.08] px-4 py-2.5 text-[13px] text-white/50 transition-all hover:text-white/70"
                    >
                      <Printer size={14} />
                      Хэвлэх
                    </button>
                  </>
                )}
              </div>

              {docPreview && (
                <div className="rounded-2xl border border-white/[0.06] bg-white p-6 print:border-0 print:p-0 print:shadow-none">
                  <div
                    className="prose prose-sm max-w-none text-black"
                    dangerouslySetInnerHTML={{
                      __html:
                        docPreview === "proposal"
                          ? selectedQuote.proposalDoc ?? ""
                          : selectedQuote.contractDoc ?? "",
                    }}
                  />
                </div>
              )}

              {!docPreview &&
                !selectedQuote.proposalDoc &&
                !selectedQuote.contractDoc && (
                  <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/[0.08] py-20 text-center">
                    <Sparkles
                      size={32}
                      className="mb-3 text-white/15"
                    />
                    <p className="text-[13px] text-white/30">
                      &quot;AI баримт бичиг&quot; товч дарж санал болон гэрээг
                      автоматаар үүсгэнэ.
                    </p>
                  </div>
                )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
