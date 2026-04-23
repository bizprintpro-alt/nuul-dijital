"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc-client";
import { ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react";

type Status = "PENDING" | "PAID" | "FAILED" | "CANCELLED" | "REFUNDED";

const tabs: { label: string; value: Status | undefined }[] = [
  { label: "Бүгд", value: undefined },
  { label: "Хүлээгдэж буй", value: "PENDING" },
  { label: "Төлсөн", value: "PAID" },
  { label: "Амжилтгүй", value: "FAILED" },
  { label: "Цуцлагдсан", value: "CANCELLED" },
];

const statusLabels: Record<string, string> = {
  PAID: "Төлсөн",
  PENDING: "Хүлээгдэж буй",
  CANCELLED: "Цуцлагдсан",
  FAILED: "Амжилтгүй",
  REFUNDED: "Буцаагдсан",
};

const statusColors: Record<string, string> = {
  PAID: "bg-t/15 text-t",
  PENDING: "bg-[#FFB02E]/15 text-[#FFB02E]",
  CANCELLED: "bg-[#FF4D6A]/15 text-[#FF4D6A]",
  FAILED: "bg-[#FF4D6A]/15 text-[#FF4D6A]",
  REFUNDED: "bg-v/15 text-v",
};

const typeLabels: Record<string, string> = {
  DOMAIN: "Домэйн",
  HOSTING: "Хостинг",
  CHATBOT: "AI Чатбот",
  CRM: "CRM",
  DOMAIN_AND_HOSTING: "Домэйн+Хостинг",
};

const methodLabels: Record<string, string> = {
  QPAY: "QPay",
  SOCIALPAY: "SocialPay",
  CARD: "Карт",
  BANK_TRANSFER: "Шилжүүлэг",
};

function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-xl bg-bg-3 ${className}`} />;
}

export default function AdminOrdersPage() {
  const [statusFilter, setStatusFilter] = useState<Status | undefined>(
    undefined
  );
  const [page, setPage] = useState(1);
  const limit = 20;

  const utils = trpc.useUtils();

  const { data, isLoading } = trpc.admin.getOrders.useQuery({
    page,
    limit,
    status: statusFilter,
  });

  const updateStatus = trpc.admin.updateOrderStatus.useMutation({
    onSuccess: () => {
      utils.admin.getOrders.invalidate();
    },
  });

  const orders = data?.orders ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.pages ?? 1;

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-syne text-2xl font-bold tracking-tight text-txt">
          Бүх захиалгууд
        </h1>
        <p className="mt-1 text-[13px] text-txt-3">
          Захиалгын удирдлага, төлөв өөрчлөх
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="mb-6 flex items-center gap-2">
        {tabs.map((tab) => (
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
        <div className="ml-auto flex items-center gap-2 rounded-xl border border-white/[0.06] bg-bg-2 px-4 py-2">
          <ShoppingCart size={15} className="text-txt-3" />
          <span className="text-[13px] text-txt-2">{total} захиалга</span>
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
                  <th className="pb-3 pr-4 font-medium">Дугаар</th>
                  <th className="pb-3 pr-4 font-medium">Харилцагч</th>
                  <th className="pb-3 pr-4 font-medium">Төрөл</th>
                  <th className="pb-3 pr-4 font-medium">Дүн</th>
                  <th className="pb-3 pr-4 font-medium">Төлбөр</th>
                  <th className="pb-3 pr-4 font-medium">Төлөв</th>
                  <th className="pb-3 pr-4 font-medium">Огноо</th>
                  <th className="pb-3 font-medium">Үйлдэл</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id} className="border-b border-white/[0.02]">
                    <td className="py-3 pr-4 font-medium text-v">
                      #{o.id.slice(-6)}
                    </td>
                    <td className="py-3 pr-4 text-txt">
                      {o.user.name ?? o.user.email}
                    </td>
                    <td className="py-3 pr-4 text-txt-2">
                      {typeLabels[o.type] ?? o.type}
                    </td>
                    <td className="py-3 pr-4 font-medium text-txt">
                      ₮{o.amount.toLocaleString()}
                    </td>
                    <td className="py-3 pr-4 text-txt-3">
                      {o.payment
                        ? methodLabels[o.payment.method] ?? o.payment.method
                        : "—"}
                    </td>
                    <td className="py-3 pr-4">
                      <span
                        className={`rounded-md px-2 py-0.5 text-[11px] font-semibold ${statusColors[o.status] ?? "bg-white/[0.06] text-txt-3"}`}
                      >
                        {statusLabels[o.status] ?? o.status}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-txt-3">
                      {new Date(o.createdAt).toLocaleDateString("mn-MN")}
                    </td>
                    <td className="py-3">
                      <select
                        value={o.status}
                        onChange={(e) =>
                          updateStatus.mutate({
                            orderId: o.id,
                            status: e.target.value as Status,
                          })
                        }
                        disabled={updateStatus.isPending}
                        className="rounded-lg border border-white/[0.06] bg-bg px-2 py-1 text-[12px] text-txt outline-none transition-colors focus:border-v/30 disabled:opacity-50"
                      >
                        <option value="PENDING">Хүлээгдэж буй</option>
                        <option value="PAID">Төлсөн</option>
                        <option value="FAILED">Амжилтгүй</option>
                        <option value="CANCELLED">Цуцлагдсан</option>
                        <option value="REFUNDED">Буцаагдсан</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!isLoading && orders.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/[0.04]">
              <ShoppingCart size={20} className="text-txt-3" />
            </div>
            <div>
              <div className="text-[14px] font-medium text-white/80">
                Захиалга олдсонгүй
              </div>
              <div className="mt-1 text-[12px] text-txt-3">
                Энэ төлөвтэй захиалга байхгүй байна
              </div>
            </div>
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
