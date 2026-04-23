// @ts-nocheck
"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc-client";
import {
  X,
  ChevronRight,
  ChevronLeft,
  Check,
  Clock,
  Sparkles,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { PublicNav } from "@/components/layout/PublicNav";
import { PublicFooter } from "@/components/layout/PublicFooter";

const statusBadge: Record<string, { label: string; color: string }> = {
  PENDING: { label: "Хүлээгдэж буй", color: "bg-yellow-500/15 text-yellow-400" },
  REVIEWING: { label: "Хянаж байна", color: "bg-blue-500/15 text-blue-400" },
  QUOTED: { label: "Үнэ илгээсэн", color: "bg-purple-500/15 text-purple-400" },
  ACCEPTED: { label: "Зөвшөөрсөн", color: "bg-green-500/15 text-green-400" },
  IN_PROGRESS: { label: "Хийгдэж буй", color: "bg-cyan-500/15 text-cyan-400" },
  COMPLETED: { label: "Дууссан", color: "bg-emerald-500/15 text-emerald-400" },
  CANCELLED: { label: "Цуцалсан", color: "bg-red-500/15 text-red-400" },
};

function formatPrice(service: any) {
  if (service.price) return `₮${service.price.toLocaleString()}`;
  if (service.priceFrom && service.priceTo)
    return `₮${service.priceFrom.toLocaleString()} - ₮${service.priceTo.toLocaleString()}`;
  if (service.priceFrom) return `₮${service.priceFrom.toLocaleString()}-с`;
  return service.priceLabel || "Тохиролцоно";
}

export default function ServicesPage() {
  const [activeCategory, setActiveCategory] = useState<string | undefined>(undefined);
  const [quoteModal, setQuoteModal] = useState(false);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [step, setStep] = useState(1);
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    projectType: "",
    description: "",
    budget: "",
    deadline: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validateStep1() {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Нэрээ оруулна уу";
    if (!form.email.trim()) e.email = "И-мэйл хаягаа оруулна уу";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Зөв и-мэйл формат оруулна уу";
    if (!form.phone.trim()) e.phone = "Утасны дугаараа оруулна уу";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function validateStep2() {
    const e: Record<string, string> = {};
    if (!form.projectType.trim()) e.projectType = "Төслийн төрлийг оруулна уу";
    if (!form.description.trim()) e.description = "Төслийн тайлбар оруулна уу";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  const categories = trpc.services.getCategories.useQuery();
  const services = trpc.services.getServices.useQuery(
    activeCategory ? { categorySlug: activeCategory } : undefined
  );

  const submitQuote = trpc.services.submitQuote.useMutation({
    onSuccess: () => {
      setSuccess(true);
      setStep(1);
      setForm({
        name: "",
        email: "",
        phone: "",
        company: "",
        projectType: "",
        description: "",
        budget: "",
        deadline: "",
      });
    },
  });

  function openQuoteModal(service: any) {
    setSelectedService(service);
    setQuoteModal(true);
    setSuccess(false);
    setStep(1);
    setErrors({});
  }

  function handleSubmit() {
    if (!selectedService) return;
    if (!validateStep2()) return;
    submitQuote.mutate({
      serviceId: selectedService.id,
      ...form,
    });
  }

  return (
    <div className="min-h-screen bg-[#030310] text-white">
      <PublicNav />

      {/* ── Hero ── */}
      <section className="relative flex flex-col items-center px-6 pb-12 pt-[130px] text-center">
        <div className="absolute -left-[200px] -top-[100px] h-[600px] w-[600px] rounded-full bg-[radial-gradient(circle,#7B6FFF15_0%,transparent_65%)]" />
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#7B6FFF30] bg-[#7B6FFF10] px-4 py-1.5 text-[11.5px] font-medium text-[#9F98FF]">
          <Sparkles size={13} />
          Мэргэжлийн шийдэл
        </div>
        <h1 className="mb-4 font-syne text-[clamp(36px,5vw,64px)] font-bold leading-tight tracking-[-2px]">
          Мэргэжлийн{" "}
          <span className="bg-gradient-to-r from-[#7B6FFF] to-[#00E5B8] bg-clip-text text-transparent">
            үйлчилгээ
          </span>
        </h1>
        <p className="max-w-lg text-base leading-relaxed text-white/50">
          Вэб хөгжүүлэлт, дизайн, маркетинг болон бизнесийн дижитал шийдлүүд.
          Мэргэжлийн баг, найдвартай үр дүн.
        </p>
      </section>

      {/* ── Category tabs ── */}
      <div className="mx-auto mb-10 flex max-w-5xl flex-wrap justify-center gap-2 px-6">
        <button
          onClick={() => setActiveCategory(undefined)}
          className={`rounded-full px-5 py-2 text-[13px] font-medium transition-all ${
            !activeCategory
              ? "bg-[#7B6FFF] text-white shadow-[0_0_20px_#7B6FFF40]"
              : "bg-white/[0.04] text-white/50 hover:bg-white/[0.08] hover:text-white/70"
          }`}
        >
          Бүгд
        </button>
        {categories.data?.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.slug)}
            className={`rounded-full px-5 py-2 text-[13px] font-medium transition-all ${
              activeCategory === cat.slug
                ? "bg-[#7B6FFF] text-white shadow-[0_0_20px_#7B6FFF40]"
                : "bg-white/[0.04] text-white/50 hover:bg-white/[0.08] hover:text-white/70"
            }`}
          >
            {cat.name}
            <span className="ml-1.5 text-[11px] opacity-60">
              {cat._count.services}
            </span>
          </button>
        ))}
      </div>

      {/* ── Services Grid ── */}
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-5 px-6 pb-24 sm:grid-cols-2 lg:grid-cols-3">
        {services.isLoading &&
          Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-[340px] animate-pulse rounded-2xl border border-white/[0.04] bg-white/[0.02]"
            />
          ))}

        {services.data?.map((svc) => (
          <div
            key={svc.id}
            className="group relative flex flex-col rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 transition-all hover:border-[#7B6FFF30] hover:bg-white/[0.04] hover:shadow-[0_0_40px_#7B6FFF10]"
          >
            {svc.isComingSoon && (
              <div className="absolute right-4 top-4 rounded-full bg-yellow-500/15 px-2.5 py-0.5 text-[10px] font-bold text-yellow-400">
                Тун удахгүй
              </div>
            )}

            {svc.category && (
              <span className="mb-3 w-fit rounded-full bg-[#7B6FFF12] px-3 py-1 text-[11px] font-medium text-[#9F98FF]">
                {svc.category.name}
              </span>
            )}

            <h3 className="mb-2 font-syne text-lg font-bold">{svc.name}</h3>
            <p className="mb-4 line-clamp-2 flex-1 text-[13px] leading-relaxed text-white/45">
              {svc.description}
            </p>

            {svc.features && svc.features.length > 0 && (
              <ul className="mb-5 space-y-1.5">
                {svc.features.slice(0, 4).map((f, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-2 text-[12px] text-white/55"
                  >
                    <Check size={12} className="text-[#00E5B8]" />
                    {f}
                  </li>
                ))}
                {svc.features.length > 4 && (
                  <li
                    className="group/more relative cursor-help text-[11px] text-white/40 hover:text-white/60"
                    title={svc.features.slice(4).join("\n")}
                  >
                    +{svc.features.length - 4} бусад боломжууд
                    <div className="pointer-events-none absolute bottom-full left-0 z-20 mb-2 hidden w-max max-w-[260px] rounded-lg border border-white/[0.1] bg-[#0a0a1a] p-3 shadow-xl group-hover/more:block">
                      <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-white/40">
                        Бусад боломжууд
                      </div>
                      <ul className="space-y-1">
                        {svc.features.slice(4).map((f, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-1.5 text-[12px] text-white/70"
                          >
                            <Check size={11} className="mt-0.5 flex-shrink-0 text-[#00E5B8]" />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </li>
                )}
              </ul>
            )}

            <div className="mt-auto flex items-end justify-between">
              <div>
                <div className="font-syne text-xl font-bold text-[#7B6FFF]">
                  {formatPrice(svc)}
                </div>
                {svc.deliveryDays && (
                  <div className="mt-0.5 flex items-center gap-1 text-[11px] text-white/35">
                    <Clock size={11} />
                    {svc.deliveryDays} хоног
                  </div>
                )}
              </div>
              <button
                onClick={() => openQuoteModal(svc)}
                disabled={svc.isComingSoon}
                className="flex items-center gap-1.5 rounded-xl bg-[#7B6FFF] px-4 py-2.5 text-[12px] font-bold text-white shadow-[0_0_16px_#7B6FFF40] transition-all hover:-translate-y-0.5 hover:shadow-[0_0_28px_#7B6FFF60] disabled:opacity-40 disabled:hover:translate-y-0"
              >
                Үнийн санал авах
                <ArrowRight size={13} />
              </button>
            </div>
          </div>
        ))}

        {services.data?.length === 0 && (
          <div className="col-span-full py-20 text-center text-white/30">
            Энэ ангилалд одоогоор үйлчилгээ байхгүй байна.
          </div>
        )}
      </div>

      <PublicFooter />

      {/* ── Quote Modal ── */}
      {quoteModal && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setQuoteModal(false)}
          />
          <div className="relative w-full max-w-lg rounded-2xl border border-white/[0.08] bg-[#0a0a1a] p-6 shadow-2xl sm:p-8">
            <button
              onClick={() => setQuoteModal(false)}
              className="absolute right-4 top-4 rounded-lg p-1.5 text-white/40 transition-all hover:bg-white/[0.06] hover:text-white"
            >
              <X size={18} />
            </button>

            {success ? (
              <div className="flex flex-col items-center py-8 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#00E5B820]">
                  <Check size={32} className="text-[#00E5B8]" />
                </div>
                <h3 className="mb-2 font-syne text-xl font-bold">
                  Амжилттай илгээгдлээ!
                </h3>
                <p className="mb-6 text-[13px] text-white/50">
                  Таны үнийн саналын хүсэлтийг хүлээн авлаа. Бид 24 цагийн дотор
                  тантай холбогдох болно.
                </p>
                <button
                  onClick={() => setQuoteModal(false)}
                  className="rounded-xl bg-[#7B6FFF] px-6 py-2.5 text-[13px] font-bold text-white"
                >
                  Хаах
                </button>
              </div>
            ) : (
              <>
                <h3 className="mb-1 font-syne text-lg font-bold">
                  Үнийн санал авах
                </h3>
                <p className="mb-6 text-[13px] text-white/40">
                  {selectedService?.name} — {step === 1 ? "Холбоо барих мэдээлэл" : "Төслийн дэлгэрэнгүй"}
                </p>

                {/* Steps indicator */}
                <div className="mb-6 flex gap-2">
                  <div
                    className={`h-1 flex-1 rounded-full ${
                      step >= 1 ? "bg-[#7B6FFF]" : "bg-white/10"
                    }`}
                  />
                  <div
                    className={`h-1 flex-1 rounded-full ${
                      step >= 2 ? "bg-[#7B6FFF]" : "bg-white/10"
                    }`}
                  />
                </div>

                {step === 1 && (
                  <div className="space-y-4">
                    <div>
                      <label className="mb-1.5 block text-[12px] font-medium text-white/60">
                        Нэр *
                      </label>
                      <input
                        value={form.name}
                        onChange={(e) => {
                          setForm({ ...form, name: e.target.value });
                          if (errors.name) setErrors({ ...errors, name: "" });
                        }}
                        className={`w-full rounded-xl border bg-white/[0.03] px-4 py-3 text-[13px] text-white outline-none transition-all focus:bg-white/[0.05] ${
                          errors.name ? "border-red-500/60" : "border-white/[0.08] focus:border-[#7B6FFF40]"
                        }`}
                        placeholder="Таны бүтэн нэр"
                      />
                      {errors.name && <p className="mt-1 text-[11px] text-red-400">{errors.name}</p>}
                    </div>
                    <div>
                      <label className="mb-1.5 block text-[12px] font-medium text-white/60">
                        И-мэйл *
                      </label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => {
                          setForm({ ...form, email: e.target.value });
                          if (errors.email) setErrors({ ...errors, email: "" });
                        }}
                        className={`w-full rounded-xl border bg-white/[0.03] px-4 py-3 text-[13px] text-white outline-none transition-all focus:bg-white/[0.05] ${
                          errors.email ? "border-red-500/60" : "border-white/[0.08] focus:border-[#7B6FFF40]"
                        }`}
                        placeholder="email@example.com"
                      />
                      {errors.email && <p className="mt-1 text-[11px] text-red-400">{errors.email}</p>}
                    </div>
                    <div>
                      <label className="mb-1.5 block text-[12px] font-medium text-white/60">
                        Утас *
                      </label>
                      <input
                        value={form.phone}
                        onChange={(e) => {
                          setForm({ ...form, phone: e.target.value });
                          if (errors.phone) setErrors({ ...errors, phone: "" });
                        }}
                        className={`w-full rounded-xl border bg-white/[0.03] px-4 py-3 text-[13px] text-white outline-none transition-all focus:bg-white/[0.05] ${
                          errors.phone ? "border-red-500/60" : "border-white/[0.08] focus:border-[#7B6FFF40]"
                        }`}
                        placeholder="9900 0000"
                      />
                      {errors.phone && <p className="mt-1 text-[11px] text-red-400">{errors.phone}</p>}
                    </div>
                    <div>
                      <label className="mb-1.5 block text-[12px] font-medium text-white/60">
                        Компани
                      </label>
                      <input
                        value={form.company}
                        onChange={(e) =>
                          setForm({ ...form, company: e.target.value })
                        }
                        className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-[13px] text-white outline-none transition-all focus:border-[#7B6FFF40] focus:bg-white/[0.05]"
                        placeholder="Компанийн нэр (заавал биш)"
                      />
                    </div>
                    <button
                      onClick={() => {
                        if (validateStep1()) setStep(2);
                      }}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#7B6FFF] py-3 text-[13px] font-bold text-white transition-all hover:bg-[#6B5FEF]"
                    >
                      Үргэлжлүүлэх
                      <ChevronRight size={15} />
                    </button>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-4">
                    <div>
                      <label className="mb-1.5 block text-[12px] font-medium text-white/60">
                        Төслийн төрөл *
                      </label>
                      <input
                        value={form.projectType}
                        onChange={(e) => {
                          setForm({ ...form, projectType: e.target.value });
                          if (errors.projectType) setErrors({ ...errors, projectType: "" });
                        }}
                        className={`w-full rounded-xl border bg-white/[0.03] px-4 py-3 text-[13px] text-white outline-none transition-all focus:bg-white/[0.05] ${
                          errors.projectType ? "border-red-500/60" : "border-white/[0.08] focus:border-[#7B6FFF40]"
                        }`}
                        placeholder="Жишээ: Вэбсайт хөгжүүлэлт"
                      />
                      {errors.projectType && <p className="mt-1 text-[11px] text-red-400">{errors.projectType}</p>}
                    </div>
                    <div>
                      <label className="mb-1.5 block text-[12px] font-medium text-white/60">
                        Тайлбар *
                      </label>
                      <textarea
                        value={form.description}
                        onChange={(e) => {
                          setForm({ ...form, description: e.target.value });
                          if (errors.description) setErrors({ ...errors, description: "" });
                        }}
                        rows={3}
                        className={`w-full rounded-xl border bg-white/[0.03] px-4 py-3 text-[13px] text-white outline-none transition-all focus:bg-white/[0.05] ${
                          errors.description ? "border-red-500/60" : "border-white/[0.08] focus:border-[#7B6FFF40]"
                        }`}
                        placeholder="Төслийн дэлгэрэнгүй тайлбар..."
                      />
                      {errors.description && <p className="mt-1 text-[11px] text-red-400">{errors.description}</p>}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="mb-1.5 block text-[12px] font-medium text-white/60">
                          Төсөв
                        </label>
                        <input
                          value={form.budget}
                          onChange={(e) =>
                            setForm({ ...form, budget: e.target.value })
                          }
                          className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-[13px] text-white outline-none transition-all focus:border-[#7B6FFF40] focus:bg-white/[0.05]"
                          placeholder="₮1,000,000"
                        />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-[12px] font-medium text-white/60">
                          Хугацаа
                        </label>
                        <input
                          value={form.deadline}
                          onChange={(e) =>
                            setForm({ ...form, deadline: e.target.value })
                          }
                          className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-[13px] text-white outline-none transition-all focus:border-[#7B6FFF40] focus:bg-white/[0.05]"
                          placeholder="2 долоо хоног"
                        />
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setStep(1)}
                        className="flex items-center gap-1 rounded-xl border border-white/[0.08] px-5 py-3 text-[13px] font-medium text-white/60 transition-all hover:bg-white/[0.04]"
                      >
                        <ChevronLeft size={15} />
                        Буцах
                      </button>
                      <button
                        onClick={handleSubmit}
                        disabled={submitQuote.isPending}
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#7B6FFF] py-3 text-[13px] font-bold text-white transition-all hover:bg-[#6B5FEF] disabled:opacity-40"
                      >
                        {submitQuote.isPending ? (
                          <Loader2 size={15} className="animate-spin" />
                        ) : null}
                        Илгээх
                      </button>
                    </div>
                    {submitQuote.isError && (
                      <p className="text-center text-[12px] text-red-400">
                        {submitQuote.error?.message ??
                          "Алдаа гарлаа. Нэвтэрсэн эсэхээ шалгана уу."}
                      </p>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
