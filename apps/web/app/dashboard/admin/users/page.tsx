"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc-client";
import { Search, Users, ChevronLeft, ChevronRight } from "lucide-react";

type Role = "ADMIN" | "CLIENT" | "RESELLER";

const roleColors: Record<Role, string> = {
  ADMIN: "bg-v/15 text-v",
  CLIENT: "bg-t/15 text-t",
  RESELLER: "bg-[#FFB02E]/15 text-[#FFB02E]",
};

const roleTabs: { label: string; value: Role | undefined }[] = [
  { label: "Бүгд", value: undefined },
  { label: "CLIENT", value: "CLIENT" },
  { label: "RESELLER", value: "RESELLER" },
  { label: "ADMIN", value: "ADMIN" },
];

function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-xl bg-bg-3 ${className}`} />;
}

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<Role | undefined>(undefined);
  const [page, setPage] = useState(1);
  const limit = 20;

  const utils = trpc.useUtils();

  // Debounce search
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

  const { data, isLoading } = trpc.admin.getUsers.useQuery({
    page,
    limit,
    search: debouncedSearch || undefined,
    role: roleFilter,
  });

  const updateRole = trpc.admin.updateUserRole.useMutation({
    onSuccess: () => {
      utils.admin.getUsers.invalidate();
    },
  });

  const users = data?.users ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.pages ?? 1;

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-syne text-2xl font-bold tracking-tight text-txt">
          Хэрэглэгчдийн удирдлага
        </h1>
        <p className="mt-1 text-[13px] text-txt-3">
          Бүх хэрэглэгчдийн жагсаалт, эрхийн удирдлага
        </p>
      </div>

      {/* Role Filter Tabs */}
      <div className="mb-4 flex items-center gap-2">
        {roleTabs.map((tab) => (
          <button
            key={tab.label}
            onClick={() => {
              setRoleFilter(tab.value);
              setPage(1);
            }}
            className={`rounded-lg px-4 py-2 text-[13px] font-medium transition-colors ${
              roleFilter === tab.value
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
            placeholder="Нэр эсвэл имэйлээр хайх..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full rounded-xl border border-white/[0.06] bg-bg-2 py-2.5 pl-9 pr-4 text-[13px] text-txt placeholder:text-txt-3 outline-none transition-colors focus:border-v/30"
          />
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-white/[0.06] bg-bg-2 px-4 py-2.5">
          <Users size={15} className="text-txt-3" />
          <span className="text-[13px] text-txt-2">{total} хэрэглэгч</span>
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
                  <th className="pb-3 pr-4 font-medium">Нэр</th>
                  <th className="pb-3 pr-4 font-medium">Имэйл</th>
                  <th className="pb-3 pr-4 font-medium">Эрх</th>
                  <th className="pb-3 pr-4 font-medium">Домэйн</th>
                  <th className="pb-3 pr-4 font-medium">Захиалга</th>
                  <th className="pb-3 pr-4 font-medium">Бүртгүүлсэн</th>
                  <th className="pb-3 font-medium">Үйлдэл</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b border-white/[0.02]">
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-v/20 text-[11px] font-bold text-v-soft">
                          {(u.name ?? u.email).charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-txt">
                          {u.name ?? "—"}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 pr-4 text-txt-2">{u.email}</td>
                    <td className="py-3 pr-4">
                      <span
                        className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${roleColors[u.role as Role]}`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-txt-2">
                      {u._count.domains}
                    </td>
                    <td className="py-3 pr-4 text-txt-2">
                      {u._count.orders}
                    </td>
                    <td className="py-3 pr-4 text-txt-3">
                      {new Date(u.createdAt).toLocaleDateString("mn-MN")}
                    </td>
                    <td className="py-3">
                      <select
                        value={u.role}
                        onChange={(e) =>
                          updateRole.mutate({
                            userId: u.id,
                            role: e.target.value as Role,
                          })
                        }
                        disabled={updateRole.isPending}
                        className="rounded-lg border border-white/[0.06] bg-bg px-2 py-1 text-[12px] text-txt outline-none transition-colors focus:border-v/30 disabled:opacity-50"
                      >
                        <option value="ADMIN">ADMIN</option>
                        <option value="CLIENT">CLIENT</option>
                        <option value="RESELLER">RESELLER</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!isLoading && users.length === 0 && (
          <div className="py-12 text-center text-[13px] text-txt-3">
            Хэрэглэгч олдсонгүй
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
