"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc-client";
import {
  Receipt,
  CreditCard,
  Download,
  X,
  Loader2,
  CheckCircle2,
} from "lucide-react";

function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-white/[0.04] bg-bg-2 p-5">
      <div className="mb-3 h-9 w-9 animate-pulse rounded-lg bg-bg-3" />
      <div className="mb-2 h-6 w-24 animate-pulse rounded bg-bg-3" />
      <div className="h-3 w-16 animate-pulse rounded bg-bg-3" />
    </div>
  );
}

function SkeletonTableRow() {
  return (
    <tr className="border-b border-white/[0.02]">
      {Array.from({ length: 7 }).map((_, i) => (
        <td key={i} className="py-3 pr-4">
          <div className="h-3 w-20 animate-pulse rounded bg-bg-3" />
        </td>
      ))}
    </tr>
  );
}

export default function InvoicesPage() {
  const [qpayModal, setQpayModal] = useState<{
    paymentId: string;
    qrImage: string | null;
    orderId: string;
  } | null>(null);

  const payments = trpc.payment.getHistory.useQuery();

  const createInvoice = trpc.payment.createQPayInvoice.useMutation({
    onSuccess: (data) => {
      setQpayModal({
        paymentId: data.paymentId,
        qrImage: data.qrImage,
        orderId: "",
      });
    },
  });

  // Poll payment status when modal is open
  const paymentStatus = trpc.payment.checkPayment.useQuery(
    { paymentId: qpayModal?.paymentId ?? "" },
    {
      enabled: !!qpayModal?.paymentId,
      refetchInterval: qpayModal ? 5000 : false,
    }
  );

  // Close modal and refetch when payment succeeds
  if (paymentStatus.data?.paid && qpayModal) {
    setTimeout(() => {
      setQpayModal(null);
      payments.refetch();
    }, 1500);
  }

  // Compute summary from real data
  const totalPaid =
    payments.data
      ?.filter((p) => p.status === "COMPLETED")
      .reduce((sum, p) => sum + p.amount, 0) ?? 0;

  const totalPending =
    payments.data
      ?.filter((p) => p.status === "PENDING")
      .reduce((sum, p) => sum + p.amount, 0) ?? 0;

  const totalCount = payments.data?.length ?? 0;

  function handleQPay(orderId: string) {
    createInvoice.mutate({ orderId });
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-syne text-2xl font-bold tracking-tight text-txt">
          Нэхэмжлэх & Төлбөр
        </h1>
        <p className="mt-1 text-[13px] text-txt-3">
          QPay, SocialPay, банкны шилжүүлэг — бүх төлбөрийн түүх
        </p>
      </div>

      {/* Summary */}
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        {payments.isLoading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : (
          <>
            <div className="rounded-2xl border border-white/[0.04] bg-bg-2 p-5">
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-t/10">
                <CreditCard size={16} className="text-t" />
              </div>
              <div className="font-syne text-xl font-bold text-txt">
                ₮{totalPaid.toLocaleString()}
              </div>
              <div className="text-[11px] text-txt-3">Нийт төлсөн</div>
            </div>
            <div className="rounded-2xl border border-white/[0.04] bg-bg-2 p-5">
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-[#FFB02E]/10">
                <Receipt size={16} className="text-[#FFB02E]" />
              </div>
              <div className="font-syne text-xl font-bold text-txt">
                ₮{totalPending.toLocaleString()}
              </div>
              <div className="text-[11px] text-txt-3">Хүлээгдэж буй</div>
            </div>
            <div className="rounded-2xl border border-white/[0.04] bg-bg-2 p-5">
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-v/10">
                <Receipt size={16} className="text-v" />
              </div>
              <div className="font-syne text-xl font-bold text-txt">
                {totalCount}
              </div>
              <div className="text-[11px] text-txt-3">Нийт нэхэмжлэх</div>
            </div>
          </>
        )}
      </div>

      {/* Invoices table */}
      <div className="rounded-2xl border border-white/[0.04] bg-bg-2 p-6">
        <h3 className="mb-4 font-syne text-base font-bold text-txt">
          Нэхэмжлэхүүд
        </h3>
        {payments.isLoading ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.04] text-left text-[11px] font-semibold uppercase tracking-wider text-txt-3">
                  <th className="pb-3 pr-4">Дугаар</th>
                  <th className="pb-3 pr-4">Тайлбар</th>
                  <th className="pb-3 pr-4">Дүн</th>
                  <th className="pb-3 pr-4">Төлбөрийн хэрэгсэл</th>
                  <th className="pb-3 pr-4">Төлөв</th>
                  <th className="pb-3 pr-4">Огноо</th>
                  <th className="pb-3"></th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 4 }).map((_, i) => (
                  <SkeletonTableRow key={i} />
                ))}
              </tbody>
            </table>
          </div>
        ) : payments.isError ? (
          <p className="text-[13px] text-red-400">Ачааллахад алдаа гарлаа</p>
        ) : !payments.data || payments.data.length === 0 ? (
          <p className="text-[13px] text-txt-3">Төлбөрийн түүх байхгүй</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.04] text-left text-[11px] font-semibold uppercase tracking-wider text-txt-3">
                  <th className="pb-3 pr-4">Дугаар</th>
                  <th className="pb-3 pr-4">Тайлбар</th>
                  <th className="pb-3 pr-4">Дүн</th>
                  <th className="pb-3 pr-4">Төлбөрийн хэрэгсэл</th>
                  <th className="pb-3 pr-4">Төлөв</th>
                  <th className="pb-3 pr-4">Огноо</th>
                  <th className="pb-3"></th>
                </tr>
              </thead>
              <tbody>
                {payments.data.map((payment) => {
                  const desc =
                    payment.order.domain?.name ??
                    payment.order.subscription?.plan?.name ??
                    `Захиалга #${payment.order.id.slice(0, 8)}`;
                  const isPaid = payment.status === "COMPLETED";
                  const isPending = payment.status === "PENDING";

                  return (
                    <tr
                      key={payment.id}
                      className="border-b border-white/[0.02] text-[13px]"
                    >
                      <td className="py-3 pr-4 font-medium text-v-soft">
                        {payment.id.slice(0, 12)}
                      </td>
                      <td className="py-3 pr-4 text-txt-2">{desc}</td>
                      <td className="py-3 pr-4 font-semibold text-txt">
                        ₮{payment.amount.toLocaleString()}
                      </td>
                      <td className="py-3 pr-4 text-txt-2">{payment.method}</td>
                      <td className="py-3 pr-4">
                        <span
                          className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                            isPaid
                              ? "bg-t/15 text-t"
                              : isPending
                                ? "bg-[#FFB02E]/15 text-[#FFB02E]"
                                : "bg-red-500/15 text-red-400"
                          }`}
                        >
                          {isPaid
                            ? "Төлсөн"
                            : isPending
                              ? "Хүлээгдэж буй"
                              : payment.status}
                        </span>
                      </td>
                      <td className="py-3 pr-4 text-txt-3">
                        {new Date(payment.createdAt).toLocaleDateString("mn-MN")}
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-1">
                          {isPending && (
                            <button
                              onClick={() => handleQPay(payment.orderId)}
                              disabled={createInvoice.isPending}
                              className="rounded-lg bg-v/10 px-2.5 py-1 text-[10px] font-bold text-v transition-all hover:bg-v/20 disabled:opacity-50"
                            >
                              {createInvoice.isPending ? (
                                <Loader2 size={12} className="animate-spin" />
                              ) : (
                                "QPay"
                              )}
                            </button>
                          )}
                          <button className="rounded-lg p-1.5 text-txt-3 transition-all hover:bg-white/[0.04] hover:text-txt-2">
                            <Download size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* QPay QR Modal */}
      {qpayModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-sm rounded-2xl border border-white/[0.06] bg-bg-2 p-8">
            <button
              onClick={() => setQpayModal(null)}
              className="absolute right-4 top-4 rounded-lg p-1 text-txt-3 transition-all hover:bg-white/[0.04] hover:text-txt"
            >
              <X size={18} />
            </button>

            <h3 className="mb-1 font-syne text-lg font-bold text-txt">
              QPay Төлбөр
            </h3>
            <p className="mb-6 text-[12px] text-txt-3">
              QR кодыг уншуулж төлбөрөө хийнэ үү
            </p>

            {paymentStatus.data?.paid ? (
              <div className="flex flex-col items-center gap-3 py-8">
                <CheckCircle2 size={48} className="text-t" />
                <p className="font-syne text-base font-bold text-t">
                  Төлбөр амжилттай!
                </p>
              </div>
            ) : (
              <>
                {qpayModal.qrImage ? (
                  <div className="mx-auto mb-4 flex h-56 w-56 items-center justify-center overflow-hidden rounded-xl bg-white p-3">
                    <img
                      src={`data:image/png;base64,${qpayModal.qrImage}`}
                      alt="QPay QR Code"
                      className="h-full w-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="mx-auto mb-4 flex h-56 w-56 items-center justify-center rounded-xl bg-bg-3">
                    <Loader2 size={24} className="animate-spin text-v" />
                  </div>
                )}

                <div className="flex items-center justify-center gap-2 text-[12px] text-txt-3">
                  <Loader2 size={12} className="animate-spin" />
                  Төлбөр хүлээж байна...
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {createInvoice.isError && (
        <div className="fixed bottom-6 right-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-[13px] text-red-400">
          QPay нэхэмжлэх үүсгэхэд алдаа гарлаа
        </div>
      )}
    </div>
  );
}
