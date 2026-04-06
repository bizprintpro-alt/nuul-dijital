"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Clock,
  Send,
  Eye,
  EyeOff,
  FileText,
  Gift,
  Bell,
  Calendar,
  Zap,
  Loader2,
  X,
} from "lucide-react";
import { trpc } from "@/lib/trpc-client";

// ── Shared styles ─────────────────────────────────────────────────
const inputClass =
  "w-full rounded-xl border border-white/[0.06] bg-bg-3 px-4 py-2.5 text-[13px] text-txt placeholder:text-txt-3 outline-none focus:border-v/50 transition-colors";
const btnPrimary =
  "rounded-xl bg-v px-5 py-2.5 text-[13px] font-bold text-white shadow-[0_0_16px_rgba(108,99,255,0.25)] transition-all hover:bg-v/90 disabled:opacity-50";
const btnSecondary =
  "rounded-xl border border-white/[0.06] bg-bg-2 px-4 py-2.5 text-[13px] font-semibold text-txt-2 transition-colors hover:border-v/30 hover:text-txt disabled:opacity-50";
const btnSuccess =
  "rounded-xl bg-t px-5 py-2.5 text-[13px] font-bold text-white shadow-[0_0_16px_rgba(0,212,170,0.25)] transition-all hover:bg-t/90 disabled:opacity-50";

// ── Template presets ──────────────────────────────────────────────
const TEMPLATES: {
  key: string;
  label: string;
  icon: typeof FileText;
  html: string;
}[] = [
  {
    key: "blank",
    label: "Хоосон",
    icon: FileText,
    html: `<div style="max-width:600px;margin:0 auto;font-family:sans-serif;color:#333;padding:40px 20px;">
  <h1 style="font-size:24px;">Гарчиг</h1>
  <p>Агуулга энд бичнэ...</p>
</div>`,
  },
  {
    key: "greeting",
    label: "Мэндчилгээ",
    icon: Zap,
    html: `<div style="max-width:600px;margin:0 auto;font-family:sans-serif;padding:40px 20px;background:#f9f9f9;">
  <div style="background:#fff;border-radius:12px;padding:40px;text-align:center;">
    <h1 style="color:#6C63FF;font-size:28px;margin-bottom:16px;">Сайн байна уу! &#128075;</h1>
    <p style="color:#666;font-size:16px;line-height:1.6;">Бид танд мэндчилгээгээ илгээж байна. Манай үйлчилгээг сонирхож буйд баярлалаа!</p>
    <a href="#" style="display:inline-block;margin-top:24px;padding:12px 32px;background:#6C63FF;color:#fff;border-radius:8px;text-decoration:none;font-weight:bold;">Дэлгэрэнгүй</a>
  </div>
</div>`,
  },
  {
    key: "promo",
    label: "Урамшуулал",
    icon: Gift,
    html: `<div style="max-width:600px;margin:0 auto;font-family:sans-serif;padding:40px 20px;background:linear-gradient(135deg,#6C63FF 0%,#00D4AA 100%);">
  <div style="background:#fff;border-radius:16px;padding:40px;text-align:center;">
    <div style="font-size:48px;margin-bottom:16px;">&#127873;</div>
    <h1 style="color:#333;font-size:28px;margin-bottom:8px;">Тусгай урамшуулал!</h1>
    <p style="color:#666;font-size:18px;margin-bottom:24px;">Зөвхөн энэ 7 хоногт</p>
    <div style="background:#f0f0ff;border-radius:12px;padding:20px;margin-bottom:24px;">
      <span style="font-size:36px;font-weight:bold;color:#6C63FF;">30% хямдрал</span>
    </div>
    <a href="#" style="display:inline-block;padding:14px 40px;background:#6C63FF;color:#fff;border-radius:8px;text-decoration:none;font-weight:bold;font-size:16px;">Захиалах</a>
  </div>
</div>`,
  },
  {
    key: "notification",
    label: "Мэдэгдэл",
    icon: Bell,
    html: `<div style="max-width:600px;margin:0 auto;font-family:sans-serif;padding:40px 20px;">
  <div style="border-left:4px solid #6C63FF;padding-left:20px;margin-bottom:24px;">
    <h1 style="color:#333;font-size:22px;margin-bottom:8px;">&#128276; Чухал мэдэгдэл</h1>
    <p style="color:#888;font-size:13px;">Танд мэдэгдэл ирлээ</p>
  </div>
  <div style="background:#f9f9f9;border-radius:12px;padding:24px;color:#555;font-size:15px;line-height:1.7;">
    <p>Мэдэгдлийн агуулга энд бичигдэнэ. Шаардлагатай мэдээллийг оруулна уу.</p>
  </div>
  <div style="margin-top:24px;text-align:center;">
    <a href="#" style="display:inline-block;padding:12px 32px;background:#6C63FF;color:#fff;border-radius:8px;text-decoration:none;font-weight:bold;">Дэлгэрэнгүй</a>
  </div>
</div>`,
  },
  {
    key: "monthly",
    label: "Сарын хүргэлт",
    icon: Calendar,
    html: `<div style="max-width:600px;margin:0 auto;font-family:sans-serif;padding:40px 20px;background:#f4f4f8;">
  <div style="text-align:center;margin-bottom:24px;">
    <h1 style="color:#6C63FF;font-size:26px;">&#128197; Сарын мэдээлэл</h1>
    <p style="color:#888;">2026 оны 4 сарын товчоон</p>
  </div>
  <div style="background:#fff;border-radius:12px;padding:24px;margin-bottom:16px;">
    <h2 style="color:#333;font-size:18px;margin-bottom:12px;">&#128640; Шинэ боломжууд</h2>
    <p style="color:#666;line-height:1.6;">Энэ сарын шинэ боломжууд болон шинэчлэлтүүдийн тухай.</p>
  </div>
  <div style="background:#fff;border-radius:12px;padding:24px;margin-bottom:16px;">
    <h2 style="color:#333;font-size:18px;margin-bottom:12px;">&#128200; Статистик</h2>
    <p style="color:#666;line-height:1.6;">Сарын гүйцэтгэлийн тоон үзүүлэлтүүд.</p>
  </div>
  <div style="text-align:center;margin-top:24px;">
    <a href="#" style="display:inline-block;padding:12px 32px;background:#6C63FF;color:#fff;border-radius:8px;text-decoration:none;font-weight:bold;">Вэбсайт руу</a>
  </div>
</div>`,
  },
];

// ── Step Indicator ────────────────────────────────────────────────
function StepIndicator({ current }: { current: number }) {
  const steps = [
    { num: 1, label: "Мэдээлэл" },
    { num: 2, label: "Агуулга" },
    { num: 3, label: "Илгээх" },
  ];

  return (
    <div className="mb-8 flex items-center justify-center gap-2">
      {steps.map((step, i) => (
        <div key={step.num} className="flex items-center gap-2">
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-full text-[12px] font-bold transition-colors ${
              current === step.num
                ? "bg-v text-white shadow-[0_0_12px_rgba(108,99,255,0.4)]"
                : current > step.num
                ? "bg-t/20 text-t"
                : "bg-bg-3 text-txt-3"
            }`}
          >
            {current > step.num ? <Check size={14} /> : step.num}
          </div>
          <span
            className={`text-[12px] font-medium ${
              current === step.num ? "text-txt" : "text-txt-3"
            }`}
          >
            {step.label}
          </span>
          {i < steps.length - 1 && (
            <div className="mx-2 h-[1px] w-8 bg-white/[0.06]" />
          )}
        </div>
      ))}
    </div>
  );
}

// ── Confirm Modal ─────────────────────────────────────────────────
function ConfirmSendModal({
  open,
  onClose,
  onConfirm,
  isLoading,
  isScheduled,
  scheduledDate,
  listName,
  subject,
  subscriberCount,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
  isScheduled: boolean;
  scheduledDate: string;
  listName: string;
  subject: string;
  subscriberCount: number;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-white/[0.06] bg-bg-2 p-6 shadow-xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-syne text-lg font-bold text-txt">
            {isScheduled ? "Хуваарьт илгээх" : "Кампани илгээх"}
          </h2>
          <button onClick={onClose} className="text-txt-3 hover:text-txt">
            <X size={18} />
          </button>
        </div>

        <div className="mb-6 space-y-3 rounded-xl border border-white/[0.04] bg-bg p-4 text-[13px]">
          <div className="flex justify-between">
            <span className="text-txt-3">Гарчиг:</span>
            <span className="font-medium text-txt">{subject}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-txt-3">Жагсаалт:</span>
            <span className="font-medium text-txt">{listName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-txt-3">Хүлээн авагчид:</span>
            <span className="font-medium text-t">
              {subscriberCount.toLocaleString()} захиалагч
            </span>
          </div>
          {isScheduled && scheduledDate && (
            <div className="flex justify-between">
              <span className="text-txt-3">Хуваарь:</span>
              <span className="font-medium text-[#3B82F6]">
                {new Date(scheduledDate).toLocaleString("mn-MN")}
              </span>
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <button onClick={onClose} className={`flex-1 ${btnSecondary}`}>
            Цуцлах
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex-1 ${isScheduled ? btnPrimary : btnSuccess}`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 size={14} className="animate-spin" />
                Илгээж байна...
              </span>
            ) : isScheduled ? (
              <span className="flex items-center justify-center gap-2">
                <Clock size={14} />
                Хуваарьт оруулах
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <Send size={14} />
                Илгээх
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────
export default function NewCampaignPage() {
  const router = useRouter();
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Step state
  const [step, setStep] = useState(1);

  // Step 1 fields
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [previewText, setPreviewText] = useState("");
  const [listId, setListId] = useState("");

  // Step 2 fields
  const [htmlContent, setHtmlContent] = useState(TEMPLATES[0].html);
  const [showPreview, setShowPreview] = useState(false);
  const [testEmail, setTestEmail] = useState("");
  const [testSending, setTestSending] = useState(false);

  // Step 3 fields
  const [sendMode, setSendMode] = useState<"now" | "scheduled">("now");
  const [scheduledDate, setScheduledDate] = useState("");
  const [confirmModal, setConfirmModal] = useState(false);

  // Queries
  const { data: lists } = trpc.emailMarketing.getLists.useQuery();

  const utils = trpc.useUtils();

  // Mutations
  const createCampaign = trpc.emailMarketing.createCampaign.useMutation({
    onSuccess: () => {
      router.push("/dashboard/email-marketing");
    },
  });

  const sendCampaign = trpc.emailMarketing.sendCampaign.useMutation({
    onSuccess: () => {
      router.push("/dashboard/email-marketing");
    },
  });

  const scheduleCampaign = trpc.emailMarketing.scheduleCampaign.useMutation({
    onSuccess: () => {
      router.push("/dashboard/email-marketing");
    },
  });

  const sendTestEmailMutation = trpc.emailMarketing.sendTestEmail.useMutation({
    onSuccess: () => {
      setTestSending(false);
      setTestEmail("");
    },
    onError: () => {
      setTestSending(false);
    },
  });

  const selectedList = (lists as any[] | undefined)?.find(
    (l: any) => l.id === listId
  );
  const subscriberCount =
    selectedList?.subscriberCount ?? selectedList?._count?.subscribers ?? 0;

  // Step 1 validation
  const step1Valid = name.trim() && subject.trim() && listId;

  // Handle send / schedule
  const handleConfirmSend = async () => {
    if (sendMode === "now") {
      // Create then send
      createCampaign.mutate(
        {
          name,
          subject,
          previewText,
          listId,
          htmlContent,
        },
        {
          onSuccess: (data: any) => {
            sendCampaign.mutate({ id: data.id });
          },
        }
      );
    } else {
      createCampaign.mutate(
        {
          name,
          subject,
          previewText,
          listId,
          htmlContent,
        },
        {
          onSuccess: (data: any) => {
            scheduleCampaign.mutate({
              id: data.id,
              scheduledAt: scheduledDate,
            });
          },
        }
      );
    }
  };

  const handleSaveDraft = () => {
    createCampaign.mutate({
      name: name || "Ноорог кампани",
      subject: subject || "(гарчиггүй)",
      previewText,
      listId: listId || undefined,
      htmlContent,
    });
  };

  const handleSendTest = async () => {
    if (!name || !subject || !htmlContent) return;
    setTestSending(true);
    // Save as draft first, then send test
    createCampaign.mutate(
      { name, subject, previewText, listId, htmlContent },
      {
        onSuccess: (data: any) => {
          sendTestEmailMutation.mutate({ id: data.id }, {
            onSettled: () => setTestSending(false),
          });
        },
        onError: () => setTestSending(false),
      }
    );
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center gap-4">
        <Link
          href="/dashboard/email-marketing"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.06] text-txt-3 transition-colors hover:text-txt"
        >
          <ArrowLeft size={16} />
        </Link>
        <div>
          <h1 className="font-syne text-2xl font-bold tracking-tight text-txt">
            Шинэ кампани
          </h1>
          <p className="mt-1 text-[13px] text-txt-3">
            Кампанит ажил үүсгэж, илгээх
          </p>
        </div>
      </div>

      {/* Step indicator */}
      <StepIndicator current={step} />

      {/* ── STEP 1: Үндсэн мэдээлэл ────────────────────────────── */}
      {step === 1 && (
        <div className="mx-auto max-w-2xl rounded-2xl border border-white/[0.04] bg-bg-2 p-6">
          <h2 className="mb-6 font-syne text-lg font-bold text-txt">
            Үндсэн мэдээлэл
          </h2>

          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-[11px] font-medium text-txt-2">
                Кампанийн нэр *
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Жнь: Шинэ жилийн урамшуулал"
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-1 block text-[11px] font-medium text-txt-2">
                Гарчиг (subject) *
              </label>
              <input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="И-мэйлийн гарчиг"
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-1 block text-[11px] font-medium text-txt-2">
                Товч тайлбар (preview text)
              </label>
              <input
                value={previewText}
                onChange={(e) => setPreviewText(e.target.value)}
                placeholder="Inbox дээр харагдах товч текст"
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-1 block text-[11px] font-medium text-txt-2">
                Жагсаалт сонгох *
              </label>
              <select
                value={listId}
                onChange={(e) => setListId(e.target.value)}
                className={inputClass}
              >
                <option value="">-- Жагсаалт сонгоно уу --</option>
                {(lists as any[] | undefined)?.map((list: any) => (
                  <option key={list.id} value={list.id}>
                    {list.name} (
                    {(
                      list.subscriberCount ??
                      list._count?.subscribers ??
                      0
                    ).toLocaleString()}{" "}
                    захиалагч)
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={() => setStep(2)}
              disabled={!step1Valid}
              className={`flex items-center gap-2 ${btnPrimary}`}
            >
              Үргэлжлүүлэх
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 2: Агуулга засах ───────────────────────────────── */}
      {step === 2 && (
        <div className="mx-auto max-w-4xl space-y-4">
          {/* Template selector */}
          <div className="rounded-2xl border border-white/[0.04] bg-bg-2 p-6">
            <h2 className="mb-4 font-syne text-lg font-bold text-txt">
              Загвар сонгох
            </h2>
            <div className="flex flex-wrap gap-2">
              {TEMPLATES.map((tpl) => {
                const Icon = tpl.icon;
                return (
                  <button
                    key={tpl.key}
                    onClick={() => setHtmlContent(tpl.html)}
                    className="flex items-center gap-2 rounded-lg border border-white/[0.06] bg-bg-3 px-4 py-2.5 text-[12px] font-medium text-txt-2 transition-all hover:border-v/30 hover:text-txt"
                  >
                    <Icon size={14} />
                    {tpl.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Editor / Preview */}
          <div className="rounded-2xl border border-white/[0.04] bg-bg-2 p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-syne text-lg font-bold text-txt">
                {showPreview ? "Урьдчилж харах" : "HTML агуулга"}
              </h2>
              <button
                onClick={() => setShowPreview(!showPreview)}
                className={`flex items-center gap-2 ${btnSecondary}`}
              >
                {showPreview ? (
                  <>
                    <EyeOff size={14} />
                    Засварлах
                  </>
                ) : (
                  <>
                    <Eye size={14} />
                    Урьдчилж харах
                  </>
                )}
              </button>
            </div>

            {showPreview ? (
              <div className="overflow-hidden rounded-xl border border-white/[0.06] bg-white">
                <iframe
                  ref={iframeRef}
                  srcDoc={htmlContent}
                  className="h-[500px] w-full"
                  sandbox="allow-same-origin"
                  title="Preview"
                />
              </div>
            ) : (
              <textarea
                value={htmlContent}
                onChange={(e) => setHtmlContent(e.target.value)}
                rows={20}
                className={`${inputClass} font-mono text-[12px] leading-relaxed`}
              />
            )}
          </div>

          {/* Test email */}
          <div className="rounded-2xl border border-white/[0.04] bg-bg-2 p-6">
            <h3 className="mb-3 text-[13px] font-semibold text-txt">
              Тест и-мэйл илгээх
            </h3>
            <div className="flex items-center gap-3">
              <input
                type="email"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                placeholder="test@example.com"
                className={`flex-1 ${inputClass}`}
              />
              <button
                onClick={handleSendTest}
                disabled={!testEmail || testSending}
                className={btnSecondary}
              >
                {testSending ? (
                  <span className="flex items-center gap-2">
                    <Loader2 size={14} className="animate-spin" />
                    Илгээж байна...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Send size={14} />
                    Тест илгээх
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <button
              onClick={() => setStep(1)}
              className={`flex items-center gap-2 ${btnSecondary}`}
            >
              <ArrowLeft size={14} />
              Буцах
            </button>
            <button
              onClick={() => setStep(3)}
              className={`flex items-center gap-2 ${btnPrimary}`}
            >
              Үргэлжлүүлэх
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 3: Илгээх тохиргоо ─────────────────────────────── */}
      {step === 3 && (
        <div className="mx-auto max-w-2xl space-y-4">
          {/* Send mode */}
          <div className="rounded-2xl border border-white/[0.04] bg-bg-2 p-6">
            <h2 className="mb-4 font-syne text-lg font-bold text-txt">
              Илгээх тохиргоо
            </h2>

            <div className="space-y-3">
              <label
                className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition-colors ${
                  sendMode === "now"
                    ? "border-v/40 bg-v/5"
                    : "border-white/[0.06] bg-bg-3"
                }`}
              >
                <input
                  type="radio"
                  name="sendMode"
                  value="now"
                  checked={sendMode === "now"}
                  onChange={() => setSendMode("now")}
                  className="sr-only"
                />
                <div
                  className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                    sendMode === "now" ? "border-v" : "border-white/20"
                  }`}
                >
                  {sendMode === "now" && (
                    <div className="h-2.5 w-2.5 rounded-full bg-v" />
                  )}
                </div>
                <div>
                  <div className="text-[13px] font-semibold text-txt">
                    Одоо илгээх
                  </div>
                  <div className="text-[11px] text-txt-3">
                    Шууд бүх захиалагчид илгээнэ
                  </div>
                </div>
              </label>

              <label
                className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition-colors ${
                  sendMode === "scheduled"
                    ? "border-[#3B82F6]/40 bg-[#3B82F6]/5"
                    : "border-white/[0.06] bg-bg-3"
                }`}
              >
                <input
                  type="radio"
                  name="sendMode"
                  value="scheduled"
                  checked={sendMode === "scheduled"}
                  onChange={() => setSendMode("scheduled")}
                  className="sr-only"
                />
                <div
                  className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                    sendMode === "scheduled"
                      ? "border-[#3B82F6]"
                      : "border-white/20"
                  }`}
                >
                  {sendMode === "scheduled" && (
                    <div className="h-2.5 w-2.5 rounded-full bg-[#3B82F6]" />
                  )}
                </div>
                <div>
                  <div className="text-[13px] font-semibold text-txt">
                    Хуваарьт илгээх
                  </div>
                  <div className="text-[11px] text-txt-3">
                    Тодорхой огноо, цагт автоматаар илгээнэ
                  </div>
                </div>
              </label>

              {sendMode === "scheduled" && (
                <div className="ml-8">
                  <label className="mb-1 block text-[11px] font-medium text-txt-2">
                    Огноо, цаг
                  </label>
                  <input
                    type="datetime-local"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className={inputClass}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Summary */}
          <div className="rounded-2xl border border-white/[0.04] bg-bg-2 p-6">
            <h3 className="mb-4 font-syne text-base font-bold text-txt">
              Товчлол
            </h3>
            <div className="space-y-3 text-[13px]">
              <div className="flex justify-between">
                <span className="text-txt-3">Кампанийн нэр:</span>
                <span className="font-medium text-txt">{name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-txt-3">Гарчиг:</span>
                <span className="font-medium text-txt">{subject}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-txt-3">Жагсаалт:</span>
                <span className="font-medium text-txt">
                  {selectedList?.name ?? "—"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-txt-3">Хүлээн авагчид:</span>
                <span className="font-bold text-t">
                  {subscriberCount.toLocaleString()} захиалагчид илгээнэ
                </span>
              </div>
              {sendMode === "scheduled" && scheduledDate && (
                <div className="flex justify-between">
                  <span className="text-txt-3">Хуваарь:</span>
                  <span className="font-medium text-[#3B82F6]">
                    {new Date(scheduledDate).toLocaleString("mn-MN")}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setStep(2)}
              className={`flex items-center gap-2 ${btnSecondary}`}
            >
              <ArrowLeft size={14} />
              Буцах
            </button>

            <div className="flex items-center gap-3">
              <button
                onClick={handleSaveDraft}
                disabled={createCampaign.isPending}
                className={btnSecondary}
              >
                {createCampaign.isPending ? (
                  <span className="flex items-center gap-2">
                    <Loader2 size={14} className="animate-spin" />
                    Хадгалж байна...
                  </span>
                ) : (
                  "Ноорог хадгалах"
                )}
              </button>
              <button
                onClick={() => setConfirmModal(true)}
                disabled={
                  sendMode === "scheduled" && !scheduledDate
                }
                className={`flex items-center gap-2 ${btnSuccess}`}
              >
                <Send size={14} />
                Кампани илгээх
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Modal */}
      <ConfirmSendModal
        open={confirmModal}
        onClose={() => setConfirmModal(false)}
        onConfirm={handleConfirmSend}
        isLoading={
          createCampaign.isPending ||
          sendCampaign.isPending ||
          scheduleCampaign.isPending
        }
        isScheduled={sendMode === "scheduled"}
        scheduledDate={scheduledDate}
        listName={selectedList?.name ?? "—"}
        subject={subject}
        subscriberCount={subscriberCount}
      />
    </div>
  );
}
