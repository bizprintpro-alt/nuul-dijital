"use client";

import { useState, useEffect, useCallback } from "react";
import { X, CheckCircle, Loader2, Clock, Smartphone, ExternalLink, CreditCard } from "lucide-react";

interface Deeplink {
  name: string;
  description: string;
  logo: string;
  link: string;
}

interface PaymentModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  invoiceId: string;
  qrImage: string; // base64
  qrText?: string;
  shortUrl?: string;
  deeplinks?: Deeplink[];
  amount: number;
  onSocialPay?: () => void;
}

type PaymentTab = "qpay" | "socialpay";

export function PaymentModal({
  open,
  onClose,
  onSuccess,
  invoiceId,
  qrImage,
  qrText,
  shortUrl,
  deeplinks,
  amount,
  onSocialPay,
}: PaymentModalProps) {
  const [tab, setTab] = useState<PaymentTab>("qpay");
  const [status, setStatus] = useState<"pending" | "checking" | "paid" | "expired">("pending");
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes
  const [socialPayLoading, setSocialPayLoading] = useState(false);

  // Poll payment status every 3 seconds
  const checkStatus = useCallback(async () => {
    if (status === "paid" || status === "expired") return;

    try {
      setStatus("checking");
      const res = await fetch("/api/payments/qpay/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invoiceId }),
      });
      const data = await res.json();

      if (data.paid) {
        setStatus("paid");
        setTimeout(() => onSuccess(), 2000);
      } else {
        setStatus("pending");
      }
    } catch {
      setStatus("pending");
    }
  }, [invoiceId, status, onSuccess]);

  useEffect(() => {
    if (!open || status === "paid" || status === "expired") return;

    const interval = setInterval(checkStatus, 3000);
    return () => clearInterval(interval);
  }, [open, checkStatus, status]);

  // Countdown timer
  useEffect(() => {
    if (!open || status === "paid") return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setStatus("expired");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [open, status]);

  if (!open) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const handleSocialPay = async () => {
    if (!onSocialPay) return;
    setSocialPayLoading(true);
    try {
      onSocialPay();
    } finally {
      setSocialPayLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-white/[0.06] bg-bg-2 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.04] px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-v/10">
              <CreditCard size={16} className="text-v" />
            </div>
            <div>
              <h3 className="font-syne text-base font-bold text-txt">Төлбөр төлөх</h3>
              <p className="text-[11px] text-txt-3">Төлбөрийн хэрэгсэл сонгоно уу</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-txt-3 transition hover:bg-white/[0.04] hover:text-txt">
            <X size={18} />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-white/[0.04] px-6">
          <button
            onClick={() => setTab("qpay")}
            className={`relative flex items-center gap-2 px-4 py-3 text-[13px] font-medium transition ${
              tab === "qpay" ? "text-v-soft" : "text-txt-3 hover:text-txt-2"
            }`}
          >
            <Smartphone size={14} />
            QPay
            {tab === "qpay" && (
              <div className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full bg-v" />
            )}
          </button>
          <button
            onClick={() => setTab("socialpay")}
            className={`relative flex items-center gap-2 px-4 py-3 text-[13px] font-medium transition ${
              tab === "socialpay" ? "text-v-soft" : "text-txt-3 hover:text-txt-2"
            }`}
          >
            <CreditCard size={14} />
            SocialPay
            {tab === "socialpay" && (
              <div className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full bg-v" />
            )}
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-5">
          {status === "paid" ? (
            /* ── Success ── */
            <div className="flex flex-col items-center py-8">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-t/20">
                <CheckCircle size={32} className="text-t" />
              </div>
              <h4 className="font-syne text-xl font-bold text-t">Төлбөр амжилттай!</h4>
              <p className="mt-2 text-[13px] text-txt-2">₮{amount.toLocaleString()} төлөгдлөө</p>
            </div>
          ) : status === "expired" ? (
            /* ── Expired ── */
            <div className="flex flex-col items-center py-8">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/20">
                <Clock size={32} className="text-red-400" />
              </div>
              <h4 className="font-syne text-xl font-bold text-red-400">Хугацаа дууссан</h4>
              <p className="mt-2 text-[13px] text-txt-3">Дахин нэхэмжлэх үүсгэнэ үү</p>
            </div>
          ) : tab === "qpay" ? (
            /* ── QPay Tab ── */
            <>
              {/* Amount */}
              <div className="mb-4 rounded-xl bg-v/5 p-3 text-center">
                <span className="text-[12px] text-txt-3">Төлөх дүн</span>
                <div className="font-syne text-2xl font-bold text-txt">₮{amount.toLocaleString()}</div>
              </div>

              {/* QR Image */}
              <div className="mb-4 flex justify-center">
                <div className="rounded-xl border border-white/[0.06] bg-white p-3">
                  <img
                    src={qrImage.startsWith("data:") ? qrImage : `data:image/png;base64,${qrImage}`}
                    alt="QPay QR Code"
                    width={200}
                    height={200}
                    className="h-[200px] w-[200px]"
                  />
                </div>
              </div>

              {/* Timer */}
              <div className="mb-4 flex items-center justify-center gap-2 text-[12px] text-txt-3">
                <Clock size={13} />
                <span>Хугацаа: {minutes}:{seconds.toString().padStart(2, "0")}</span>
                {status === "checking" && <Loader2 size={12} className="animate-spin text-v" />}
              </div>

              {/* QPay App button */}
              {shortUrl && (
                <a
                  href={shortUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mb-3 flex w-full items-center justify-center gap-2 rounded-xl bg-v py-3 text-[13px] font-bold text-white shadow-[0_0_20px_rgba(108,99,255,0.25)] transition hover:shadow-[0_0_30px_rgba(108,99,255,0.4)]"
                >
                  <Smartphone size={15} />
                  QPay апп нээх
                </a>
              )}

              {/* Bank deeplinks */}
              {deeplinks && deeplinks.length > 0 && (
                <div>
                  <p className="mb-2 text-center text-[11px] text-txt-3">Банкны апп-аар төлөх</p>
                  <div className="grid grid-cols-4 gap-2">
                    {deeplinks.slice(0, 8).map((link) => (
                      <a
                        key={link.name}
                        href={link.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-col items-center gap-1 rounded-lg border border-white/[0.04] bg-white/[0.02] p-2 transition hover:border-v/20 hover:bg-white/[0.04]"
                      >
                        {link.logo ? (
                          <img src={link.logo} alt={link.name} className="h-6 w-6 rounded" />
                        ) : (
                          <ExternalLink size={16} className="text-txt-3" />
                        )}
                        <span className="text-[9px] text-txt-3 line-clamp-1">{link.description || link.name}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            /* ── SocialPay Tab ── */
            <>
              {/* Amount */}
              <div className="mb-6 rounded-xl bg-v/5 p-3 text-center">
                <span className="text-[12px] text-txt-3">Төлөх дүн</span>
                <div className="font-syne text-2xl font-bold text-txt">₮{amount.toLocaleString()}</div>
              </div>

              {/* Timer */}
              <div className="mb-6 flex items-center justify-center gap-2 text-[12px] text-txt-3">
                <Clock size={13} />
                <span>Хугацаа: {minutes}:{seconds.toString().padStart(2, "0")}</span>
              </div>

              {/* SocialPay info */}
              <div className="mb-6 rounded-xl border border-white/[0.04] bg-white/[0.02] p-4">
                <p className="text-[13px] text-txt-2">
                  SocialPay-ээр төлөх товч дарсны дараа Голомт банкны SocialPay системрүү шилжинэ.
                  Төлбөр амжилттай хийгдсэний дараа автоматаар буцаж ирнэ.
                </p>
              </div>

              {/* SocialPay button */}
              <button
                onClick={handleSocialPay}
                disabled={socialPayLoading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#00D4AA] py-3.5 text-[14px] font-bold text-white shadow-[0_0_20px_rgba(0,212,170,0.25)] transition hover:shadow-[0_0_30px_rgba(0,212,170,0.4)] disabled:opacity-50"
              >
                {socialPayLoading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <CreditCard size={16} />
                )}
                SocialPay-ээр төлөх
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
