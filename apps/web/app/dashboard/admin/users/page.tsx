"use client";

import { useState } from "react";
import { Search, Users, ChevronLeft, ChevronRight } from "lucide-react";

type Role = "ADMIN" | "CLIENT" | "RESELLER";

interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  registered: string;
}

const mockUsers: User[] = [
  { id: 1, name: "А. Админбат", email: "admin@nuul.mn", role: "ADMIN", registered: "2025-01-15" },
  { id: 2, name: "Б. Болд", email: "bold@example.mn", role: "CLIENT", registered: "2026-04-05" },
  { id: 3, name: "Д. Сарнай", email: "sarnai@company.mn", role: "RESELLER", registered: "2026-04-04" },
  { id: 4, name: "М. Ганбат", email: "ganbat@shop.mn", role: "CLIENT", registered: "2026-04-04" },
  { id: 5, name: "Э. Оюунцэцэг", email: "oyuntsetseg@biz.mn", role: "CLIENT", registered: "2026-04-03" },
  { id: 6, name: "Т. Батбаяр", email: "batbayar@web.mn", role: "CLIENT", registered: "2026-04-02" },
  { id: 7, name: "С. Нармандах", email: "narmandakh@store.mn", role: "RESELLER", registered: "2026-03-28" },
  { id: 8, name: "Г. Тэмүүлэн", email: "temuulen@dev.mn", role: "CLIENT", registered: "2026-03-25" },
  { id: 9, name: "Л. Золзаяа", email: "zolzaya@design.mn", role: "CLIENT", registered: "2026-03-20" },
  { id: 10, name: "Н. Эрдэнэ", email: "erdene@tech.mn", role: "RESELLER", registered: "2026-03-18" },
];

const roleColors: Record<Role, string> = {
  ADMIN: "bg-v/15 text-v",
  CLIENT: "bg-t/15 text-t",
  RESELLER: "bg-[#FFB02E]/15 text-[#FFB02E]",
};

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [page, setPage] = useState(1);
  const perPage = 5;

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  function changeRole(userId: number, newRole: Role) {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-syne text-2xl font-bold tracking-tight text-txt">
          Хэрэглэгчдийн удирдлага
        </h1>
        <p className="mt-1 text-[13px] text-txt-3">Бүх хэрэглэгчдийн жагсаалт, эрхийн удирдлага</p>
      </div>

      {/* Search */}
      <div className="mb-6 flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-txt-3" />
          <input
            type="text"
            placeholder="Нэр эсвэл имэйлээр хайх..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full rounded-xl border border-white/[0.06] bg-bg-2 py-2.5 pl-9 pr-4 text-[13px] text-txt placeholder:text-txt-3 outline-none focus:border-v/30 transition-colors"
          />
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-white/[0.06] bg-bg-2 px-4 py-2.5">
          <Users size={15} className="text-txt-3" />
          <span className="text-[13px] text-txt-2">{filtered.length} хэрэглэгч</span>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-white/[0.04] bg-bg-2 p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead>
              <tr className="border-b border-white/[0.04] text-txt-3">
                <th className="pb-3 pr-4 font-medium">Нэр</th>
                <th className="pb-3 pr-4 font-medium">Имэйл</th>
                <th className="pb-3 pr-4 font-medium">Role</th>
                <th className="pb-3 pr-4 font-medium">Бүртгүүлсэн огноо</th>
                <th className="pb-3 font-medium">Үйлдэл</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((u) => (
                <tr key={u.id} className="border-b border-white/[0.02]">
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-v/20 text-[11px] font-bold text-v-soft">
                        {u.name.charAt(0)}
                      </div>
                      <span className="font-medium text-txt">{u.name}</span>
                    </div>
                  </td>
                  <td className="py-3 pr-4 text-txt-2">{u.email}</td>
                  <td className="py-3 pr-4">
                    <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${roleColors[u.role]}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3 pr-4 text-txt-3">{u.registered}</td>
                  <td className="py-3">
                    <select
                      value={u.role}
                      onChange={(e) => changeRole(u.id, e.target.value as Role)}
                      className="rounded-lg border border-white/[0.06] bg-bg px-2 py-1 text-[12px] text-txt outline-none cursor-pointer focus:border-v/30 transition-colors"
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-4 flex items-center justify-between border-t border-white/[0.04] pt-4">
            <span className="text-[12px] text-txt-3">
              {(page - 1) * perPage + 1}–{Math.min(page * perPage, filtered.length)} / {filtered.length}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.06] bg-bg text-txt-3 transition-colors hover:bg-white/[0.03] disabled:opacity-30"
              >
                <ChevronLeft size={14} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
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
              ))}
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
