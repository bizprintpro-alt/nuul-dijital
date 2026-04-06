"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Plus,
  X,
  Trash2,
  Search,
  Users,
  Upload,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { trpc } from "@/lib/trpc-client";

// ── Shared styles ─────────────────────────────────────────────────
const inputClass =
  "w-full rounded-xl border border-white/[0.06] bg-bg-3 px-4 py-2.5 text-[13px] text-txt placeholder:text-txt-3 outline-none focus:border-v/50 transition-colors";
const btnPrimary =
  "rounded-xl bg-v px-5 py-2.5 text-[13px] font-bold text-white shadow-[0_0_16px_rgba(108,99,255,0.25)] transition-all hover:bg-v/90 disabled:opacity-50";
const btnSecondary =
  "rounded-xl border border-white/[0.06] bg-bg-2 px-4 py-2.5 text-[13px] font-semibold text-txt-2 transition-colors hover:border-v/30 hover:text-txt";

const PAGE_SIZE = 10;

// ── Subscriber status badges ──────────────────────────────────────
function SubscriberStatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    ACTIVE: { label: "Идэвхтэй", cls: "bg-t/15 text-t" },
    UNSUBSCRIBED: { label: "Цуцалсан", cls: "bg-[#F97316]/15 text-[#F97316]" },
    BOUNCED: { label: "Буцсан", cls: "bg-[#EF4444]/15 text-[#EF4444]" },
  };
  const config = map[status] ?? { label: status, cls: "bg-white/[0.06] text-txt-3" };
  return (
    <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${config.cls}`}>
      {config.label}
    </span>
  );
}

// ── Skeleton ──────────────────────────────────────────────────────
function ListCardSkeleton() {
  return (
    <div className="rounded-2xl border border-white/[0.04] bg-bg-2 p-5">
      <div className="mb-3 h-5 w-40 animate-pulse rounded bg-bg-3" />
      <div className="mb-2 h-3 w-24 animate-pulse rounded bg-bg-3" />
      <div className="h-3 w-56 animate-pulse rounded bg-bg-3" />
    </div>
  );
}

// ── Create List Modal ─────────────────────────────────────────────
function CreateListModal({
  open,
  onClose,
  onSubmit,
  isLoading,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; description: string }) => void;
  isLoading: boolean;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, description });
    setName("");
    setDescription("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-white/[0.06] bg-bg-2 p-6 shadow-xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-syne text-lg font-bold text-txt">
            Шинэ жагсаалт
          </h2>
          <button onClick={onClose} className="text-txt-3 hover:text-txt">
            <X size={18} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="mb-1 block text-[11px] font-medium text-txt-2">
              Нэр *
            </label>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Жагсаалтын нэр"
              className={inputClass}
            />
          </div>
          <div>
            <label className="mb-1 block text-[11px] font-medium text-txt-2">
              Тайлбар
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Тайлбар (заавал биш)"
              rows={3}
              className={inputClass}
            />
          </div>
          <button type="submit" disabled={isLoading || !name} className={`mt-2 w-full ${btnPrimary}`}>
            {isLoading ? "Хадгалж байна..." : "Үүсгэх"}
          </button>
        </form>
      </div>
    </div>
  );
}

// ── Add Subscriber Modal ──────────────────────────────────────────
function AddSubscriberModal({
  open,
  onClose,
  onSubmit,
  isLoading,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { email: string; name: string }) => void;
  isLoading: boolean;
}) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ email, name });
    setEmail("");
    setName("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-white/[0.06] bg-bg-2 p-6 shadow-xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-syne text-lg font-bold text-txt">
            Захиалагч нэмэх
          </h2>
          <button onClick={onClose} className="text-txt-3 hover:text-txt">
            <X size={18} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="mb-1 block text-[11px] font-medium text-txt-2">
              И-мэйл *
            </label>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className={inputClass}
            />
          </div>
          <div>
            <label className="mb-1 block text-[11px] font-medium text-txt-2">
              Нэр
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Захиалагчийн нэр"
              className={inputClass}
            />
          </div>
          <button type="submit" disabled={isLoading || !email} className={`mt-2 w-full ${btnPrimary}`}>
            {isLoading ? "Нэмж байна..." : "Нэмэх"}
          </button>
        </form>
      </div>
    </div>
  );
}

// ── CSV Import Modal ──────────────────────────────────────────────
function CSVImportModal({
  open,
  onClose,
  onSubmit,
  isLoading,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (csv: string) => void;
  isLoading: boolean;
}) {
  const [csv, setCsv] = useState("");

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(csv);
    setCsv("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl border border-white/[0.06] bg-bg-2 p-6 shadow-xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-syne text-lg font-bold text-txt">CSV импорт</h2>
          <button onClick={onClose} className="text-txt-3 hover:text-txt">
            <X size={18} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="mb-1 block text-[11px] font-medium text-txt-2">
              CSV өгөгдөл (email,name форматаар)
            </label>
            <textarea
              required
              value={csv}
              onChange={(e) => setCsv(e.target.value)}
              placeholder={"email,name\njohn@example.com,John\njane@example.com,Jane"}
              rows={8}
              className={`${inputClass} font-mono text-[12px]`}
            />
          </div>
          <p className="text-[11px] text-txt-3">
            Мөр тус бүрд email,name гэж бичнэ. Эхний мөр header байж болно.
          </p>
          <button type="submit" disabled={isLoading || !csv.trim()} className={`mt-2 w-full ${btnPrimary}`}>
            {isLoading ? "Импортлож байна..." : "Импортлох"}
          </button>
        </form>
      </div>
    </div>
  );
}

// ── Subscribers Table ─────────────────────────────────────────────
function SubscribersTable({ listId }: { listId: string }) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [addModal, setAddModal] = useState(false);
  const [csvModal, setCsvModal] = useState(false);

  const utils = trpc.useUtils();

  const { data: subscribersData, isLoading } =
    trpc.emailMarketing.getSubscribers.useQuery({ listId });

  const addSubscriber = trpc.emailMarketing.addSubscriber.useMutation({
    onSuccess: () => {
      utils.emailMarketing.getSubscribers.invalidate({ listId });
      setAddModal(false);
    },
  });

  const removeSubscriber = trpc.emailMarketing.removeSubscriber.useMutation({
    onSuccess: () => {
      utils.emailMarketing.getSubscribers.invalidate({ listId });
    },
  });

  const importCSV = trpc.emailMarketing.importCSV.useMutation({
    onSuccess: () => {
      utils.emailMarketing.getSubscribers.invalidate({ listId });
      setCsvModal(false);
    },
  });

  const subscribers = subscribersData ?? [];

  const filtered = useMemo(() => {
    if (!search.trim()) return subscribers as any[];
    const q = search.toLowerCase();
    return (subscribers as any[]).filter(
      (s: any) =>
        s.email?.toLowerCase().includes(q) ||
        s.name?.toLowerCase().includes(q)
    );
  }, [subscribers, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  return (
    <div className="mt-4 rounded-xl border border-white/[0.04] bg-bg p-4">
      {/* Toolbar */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-txt-3" />
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0);
            }}
            placeholder="Захиалагч хайх..."
            className={`${inputClass} pl-9`}
          />
        </div>
        <button onClick={() => setAddModal(true)} className={btnSecondary}>
          <span className="flex items-center gap-1.5">
            <Plus size={14} />
            Захиалагч нэмэх
          </span>
        </button>
        <button onClick={() => setCsvModal(true)} className={btnSecondary}>
          <span className="flex items-center gap-1.5">
            <Upload size={14} />
            CSV импорт
          </span>
        </button>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-12 animate-pulse rounded-lg bg-bg-3" />
          ))}
        </div>
      ) : paged.length === 0 ? (
        <div className="py-8 text-center text-[13px] text-txt-3">
          {search ? "Илэрц олдсонгүй" : "Захиалагч байхгүй"}
        </div>
      ) : (
        <>
          {/* Header */}
          <div className="mb-1 flex items-center gap-4 px-4 text-[10px] font-semibold uppercase tracking-wider text-txt-3">
            <div className="flex-1">И-мэйл</div>
            <div className="w-36">Нэр</div>
            <div className="w-24 text-center">Статус</div>
            <div className="w-28 text-right">Огноо</div>
            <div className="w-10" />
          </div>

          <div className="space-y-1">
            {paged.map((s: any) => (
              <div
                key={s.id}
                className="flex items-center gap-4 rounded-lg border border-white/[0.03] bg-white/[0.01] px-4 py-3"
              >
                <div className="flex-1 truncate text-[13px] text-txt">
                  {s.email}
                </div>
                <div className="w-36 truncate text-[13px] text-txt-2">
                  {s.name || "—"}
                </div>
                <div className="flex w-24 justify-center">
                  <SubscriberStatusBadge status={s.status ?? "ACTIVE"} />
                </div>
                <div className="w-28 text-right text-[11px] text-txt-3">
                  {s.subscribedAt
                    ? new Date(s.subscribedAt).toLocaleDateString("mn-MN")
                    : s.createdAt
                    ? new Date(s.createdAt).toLocaleDateString("mn-MN")
                    : "—"}
                </div>
                <div className="flex w-10 justify-end">
                  <button
                    onClick={() => {
                      if (confirm("Энэ захиалагчийг устгах уу?")) {
                        removeSubscriber.mutate({
                          subscriberId: s.id,
                        });
                      }
                    }}
                    className="text-txt-3 transition-colors hover:text-[#EF4444]"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-4 flex items-center justify-between">
              <span className="text-[11px] text-txt-3">
                Нийт {filtered.length} захиалагч
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className="rounded-lg border border-white/[0.06] p-1.5 text-txt-3 transition-colors hover:text-txt disabled:opacity-30"
                >
                  <ChevronLeft size={14} />
                </button>
                <span className="text-[12px] text-txt-2">
                  {page + 1} / {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                  disabled={page >= totalPages - 1}
                  className="rounded-lg border border-white/[0.06] p-1.5 text-txt-3 transition-colors hover:text-txt disabled:opacity-30"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Modals */}
      <AddSubscriberModal
        open={addModal}
        onClose={() => setAddModal(false)}
        onSubmit={(data) => addSubscriber.mutate({ listId, ...data })}
        isLoading={addSubscriber.isPending}
      />
      <CSVImportModal
        open={csvModal}
        onClose={() => setCsvModal(false)}
        onSubmit={(csv) => importCSV.mutate({ listId, csvContent: csv })}
        isLoading={importCSV.isPending}
      />
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────
export default function ListsPage() {
  const [createModal, setCreateModal] = useState(false);
  const [expandedListId, setExpandedListId] = useState<string | null>(null);

  const utils = trpc.useUtils();

  const { data: lists, isLoading } = trpc.emailMarketing.getLists.useQuery();

  const createList = trpc.emailMarketing.createList.useMutation({
    onSuccess: () => {
      utils.emailMarketing.getLists.invalidate();
      setCreateModal(false);
    },
  });

  const deleteList = trpc.emailMarketing.deleteList.useMutation({
    onSuccess: () => {
      utils.emailMarketing.getLists.invalidate();
      setExpandedListId(null);
    },
  });

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/email-marketing"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.06] text-txt-3 transition-colors hover:text-txt"
          >
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h1 className="font-syne text-2xl font-bold tracking-tight text-txt">
              Жагсаалтууд
            </h1>
            <p className="mt-1 text-[13px] text-txt-3">
              Захиалагчдын жагсаалтуудаа удирдах
            </p>
          </div>
        </div>
        <button
          onClick={() => setCreateModal(true)}
          className={`flex items-center gap-2 ${btnPrimary}`}
        >
          <Plus size={15} />
          Шинэ жагсаалт
        </button>
      </div>

      {/* Lists */}
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <ListCardSkeleton key={i} />
          ))}
        </div>
      ) : !lists || lists.length === 0 ? (
        <div className="py-20 text-center">
          <Users size={32} className="mx-auto mb-3 text-txt-3" />
          <p className="text-[13px] text-txt-3">Жагсаалт байхгүй байна</p>
          <button
            onClick={() => setCreateModal(true)}
            className="mt-3 inline-flex items-center gap-1.5 text-[12px] font-medium text-v hover:underline"
          >
            <Plus size={13} />
            Эхний жагсаалтаа үүсгэ
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {(lists as any[]).map((list: any) => {
            const isExpanded = expandedListId === list.id;
            return (
              <div
                key={list.id}
                className="rounded-2xl border border-white/[0.04] bg-bg-2 transition-colors"
              >
                {/* List header */}
                <div
                  className="flex cursor-pointer items-center gap-4 p-5"
                  onClick={() =>
                    setExpandedListId(isExpanded ? null : list.id)
                  }
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-v/10">
                    <Users size={16} className="text-v" />
                  </div>
                  <div className="flex-1">
                    <div className="text-[14px] font-semibold text-txt">
                      {list.name}
                    </div>
                    <div className="mt-0.5 flex items-center gap-3 text-[11px] text-txt-3">
                      <span>
                        {(list.subscriberCount ?? list._count?.subscribers ?? 0).toLocaleString()}{" "}
                        захиалагч
                      </span>
                      {list.description && (
                        <>
                          <span className="text-txt-3/40">|</span>
                          <span>{list.description}</span>
                        </>
                      )}
                      {list.createdAt && (
                        <>
                          <span className="text-txt-3/40">|</span>
                          <span>
                            {new Date(list.createdAt).toLocaleDateString("mn-MN")}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm(`"${list.name}" жагсаалтыг устгах уу?`)) {
                        deleteList.mutate({ listId: list.id });
                      }
                    }}
                    className="mr-2 text-txt-3 transition-colors hover:text-[#EF4444]"
                  >
                    <Trash2 size={15} />
                  </button>
                  {isExpanded ? (
                    <ChevronUp size={16} className="text-txt-3" />
                  ) : (
                    <ChevronDown size={16} className="text-txt-3" />
                  )}
                </div>

                {/* Expanded subscribers */}
                {isExpanded && (
                  <div className="border-t border-white/[0.04] px-5 pb-5">
                    <SubscribersTable listId={list.id} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Create List Modal */}
      <CreateListModal
        open={createModal}
        onClose={() => setCreateModal(false)}
        onSubmit={(data) => createList.mutate(data)}
        isLoading={createList.isPending}
      />
    </div>
  );
}
