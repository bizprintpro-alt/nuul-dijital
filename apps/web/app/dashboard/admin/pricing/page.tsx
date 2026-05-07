// @ts-nocheck
"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc-client";
import {
  DollarSign, Plus, Pencil, Trash2, Loader2, X, Check,
  ToggleLeft, ToggleRight, AlertTriangle, Star, Sparkles,
} from "lucide-react";

const emptyForm = {
  name: "",
  price: "",
  priceSmall: false,
  description: "",
  features: "",
  featured: false,
  btnText: "Санал авах",
  btnLink: "/contact",
  order: 0,
  isActive: true,
};

export default function AdminPricingPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  const utils = trpc.useUtils();
  const { data: plans, isLoading } = trpc.marketing.adminList.useQuery();
  const createMutation = trpc.marketing.adminCreate.useMutation({
    onSuccess: () => { utils.marketing.adminList.invalidate(); closeModal(); },
  });
  const updateMutation = trpc.marketing.adminUpdate.useMutation({
    onSuccess: () => { utils.marketing.adminList.invalidate(); closeModal(); },
  });
  const deleteMutation = trpc.marketing.adminDelete.useMutation({
    onSuccess: () => { utils.marketing.adminList.invalidate(); setDeleteTarget(null); },
  });
  const seedMutation = trpc.marketing.adminSeedDefaults.useMutation({
    onSuccess: () => { utils.marketing.adminList.invalidate(); },
  });

  function closeModal() {
    setModalOpen(false);
    setEditingId(null);
    setForm({ ...emptyForm });
  }

  function openCreate() {
    setForm({ ...emptyForm });
    setEditingId(null);
    setModalOpen(true);
  }

  function openEdit(plan: any) {
    setForm({
      name: plan.name,
      price: plan.price,
      priceSmall: plan.priceSmall,
      description: plan.description,
      features: plan.features.join("\n"),
      featured: plan.featured,
      btnText: plan.btnText,
      btnLink: plan.btnLink,
      order: plan.order,
      isActive: plan.isActive,
    });
    setEditingId(plan.id);
    setModalOpen(true);
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const features = form.features
      .split("\n")
      .map((f) => f.trim())
      .filter(Boolean);
    const data = {
      name: form.name,
      price: form.price,
      priceSmall: form.priceSmall,
      description: form.description,
      features,
      featured: form.featured,
      btnText: form.btnText,
      btnLink: form.btnLink,
      order: Number(form.order) || 0,
      isActive: form.isActive,
    };
    if (editingId) {
      updateMutation.mutate({ id: editingId, ...data });
    } else {
      createMutation.mutate(data);
    }
  }

  return (
    <div className="mx-auto max-w-6xl">
      {/* Header */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="mb-1 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.12em] text-v">
            <DollarSign className="h-3.5 w-3.5" />
            Үнэ
          </div>
          <h1 className="font-clash text-3xl font-bold tracking-tight">
            Маркетингийн багцууд
          </h1>
          <p className="mt-1 text-sm text-txt-2">
            Landing хуудсанд харагдах үнийн багцуудыг удирдах
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-br from-v to-v-dark px-5 py-2.5 text-sm font-semibold text-white shadow-[0_0_20px_#7B6FFF30] transition-all hover:-translate-y-0.5 hover:shadow-[0_0_30px_#7B6FFF50]"
        >
          <Plus className="h-4 w-4" />
          Шинэ багц
        </button>
      </div>

      {/* List */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-v" />
        </div>
      ) : !plans || plans.length === 0 ? (
        <div className="rounded-2xl border border-[--bd] bg-bg-2 p-10 text-center">
          <Sparkles className="mx-auto mb-3 h-10 w-10 text-v opacity-50" />
          <h3 className="mb-1.5 font-clash text-lg font-semibold">
            Багц алга байна
          </h3>
          <p className="mb-5 text-sm text-txt-2">
            Анхдагч 3 багцыг автоматаар үүсгэж эхэлж болно
          </p>
          <button
            onClick={() => seedMutation.mutate()}
            disabled={seedMutation.isPending}
            className="inline-flex items-center gap-2 rounded-xl border border-[--bdv] bg-bg-3 px-5 py-2.5 text-sm font-medium text-v-soft transition-all hover:border-v hover:bg-bg-4"
          >
            {seedMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
            Анхдагч багцыг үүсгэх
          </button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative overflow-hidden rounded-2xl border p-6 transition-all ${
                plan.featured
                  ? "border-[--bdv] bg-gradient-to-br from-bg-3 to-bg-4 shadow-[0_0_30px_#7B6FFF15]"
                  : "border-[--bd] bg-bg-2"
              } ${!plan.isActive ? "opacity-50" : ""}`}
            >
              {plan.featured && (
                <div className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full border border-[#7B6FFF25] bg-[#7B6FFF18] px-2 py-0.5 text-[10px] font-semibold text-v-soft">
                  <Star className="h-2.5 w-2.5" />
                  Featured
                </div>
              )}
              <div className="mb-1 font-clash text-lg font-semibold">{plan.name}</div>
              <div className="mb-1 font-clash text-2xl font-bold text-v-soft">
                {plan.price}
              </div>
              <div className="mb-4 text-xs text-txt-3">{plan.description}</div>
              <div className="mb-4 space-y-1.5">
                {plan.features.slice(0, 3).map((f) => (
                  <div key={f} className="flex items-center gap-1.5 text-xs text-txt-2">
                    <Check className="h-3 w-3 flex-shrink-0 text-t" />
                    <span className="truncate">{f}</span>
                  </div>
                ))}
                {plan.features.length > 3 && (
                  <div className="text-xs text-txt-3">
                    +{plan.features.length - 3} илүү
                  </div>
                )}
              </div>
              <div className="mb-4 flex items-center gap-2 text-[11px] text-txt-3">
                <span>Дараалал: {plan.order}</span>
                <span>•</span>
                <span>{plan.isActive ? "Идэвхтэй" : "Идэвхгүй"}</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => openEdit(plan)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg border border-[--bd] bg-bg-3 px-3 py-2 text-xs font-medium text-txt-2 transition-all hover:border-v hover:text-txt"
                >
                  <Pencil className="h-3 w-3" />
                  Засах
                </button>
                <button
                  onClick={() => setDeleteTarget({ id: plan.id, name: plan.name })}
                  className="inline-flex items-center justify-center rounded-lg border border-[--bd] bg-bg-3 px-3 py-2 text-xs font-medium text-txt-3 transition-all hover:border-red-500/40 hover:text-red-400"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit/Create Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onClick={closeModal}
        >
          <form
            onSubmit={submit}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-[--bd] bg-bg-2 p-6"
          >
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-clash text-xl font-semibold">
                {editingId ? "Багц засах" : "Шинэ багц"}
              </h2>
              <button
                type="button"
                onClick={closeModal}
                className="text-txt-3 hover:text-txt"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Нэр" required>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Starter"
                  className={inputCls}
                />
              </Field>
              <Field label="Үнэ" required>
                <input
                  required
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  placeholder="₮490,000"
                  className={inputCls}
                />
              </Field>
              <Field label="Тайлбар" required full>
                <input
                  required
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Шинээр эхэлж буй бизнест"
                  className={inputCls}
                />
              </Field>
              <Field
                label="Боломжууд (мөр бүрт нэг)"
                hint={`${form.features.split("\n").filter(Boolean).length} ширхэг`}
                full
              >
                <textarea
                  required
                  rows={6}
                  value={form.features}
                  onChange={(e) => setForm({ ...form, features: e.target.value })}
                  placeholder={"Сарын 8 FB контент\nFacebook page удирдлага\n1 рекламын кампанит ажил"}
                  className={inputCls}
                />
              </Field>
              <Field label="Товчлуурын текст">
                <input
                  value={form.btnText}
                  onChange={(e) => setForm({ ...form, btnText: e.target.value })}
                  placeholder="Санал авах"
                  className={inputCls}
                />
              </Field>
              <Field label="Товчлуурын линк">
                <input
                  value={form.btnLink}
                  onChange={(e) => setForm({ ...form, btnLink: e.target.value })}
                  placeholder="/contact"
                  className={inputCls}
                />
              </Field>
              <Field label="Дараалал" hint="Бага = эхэнд">
                <input
                  type="number"
                  value={form.order}
                  onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
                  className={inputCls}
                />
              </Field>
              <Field label="Үнийн жижиг хувилбар" hint="“Тохиролцоно” г.м">
                <Toggle
                  checked={form.priceSmall}
                  onChange={(v) => setForm({ ...form, priceSmall: v })}
                  label={form.priceSmall ? "Жижиг текст" : "Том үнэ /сар"}
                />
              </Field>
              <Field label="Онцолсон багц" hint="Дунд гэрэлтсэн карт">
                <Toggle
                  checked={form.featured}
                  onChange={(v) => setForm({ ...form, featured: v })}
                  label={form.featured ? "Тийм" : "Үгүй"}
                />
              </Field>
              <Field label="Идэвхтэй" hint="Landing-д харагдах эсэх">
                <Toggle
                  checked={form.isActive}
                  onChange={(v) => setForm({ ...form, isActive: v })}
                  label={form.isActive ? "Тийм" : "Үгүй"}
                />
              </Field>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={closeModal}
                className="rounded-xl border border-[--bd] bg-bg-3 px-5 py-2.5 text-sm font-medium text-txt-2 hover:border-v hover:text-txt"
              >
                Цуцлах
              </button>
              <button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-br from-v to-v-dark px-5 py-2.5 text-sm font-semibold text-white shadow-[0_0_20px_#7B6FFF30] disabled:opacity-50"
              >
                {(createMutation.isPending || updateMutation.isPending) && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
                {editingId ? "Хадгалах" : "Үүсгэх"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Delete confirm */}
      {deleteTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onClick={() => setDeleteTarget(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-2xl border border-[--bd] bg-bg-2 p-6"
          >
            <div className="mb-3 flex items-center gap-2 text-red-400">
              <AlertTriangle className="h-5 w-5" />
              <span className="font-semibold">Устгах уу?</span>
            </div>
            <p className="mb-6 text-sm text-txt-2">
              <strong className="text-txt">{deleteTarget.name}</strong> багцыг
              устгана. Энэ үйлдлийг буцаах боломжгүй.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeleteTarget(null)}
                className="rounded-xl border border-[--bd] bg-bg-3 px-4 py-2 text-sm font-medium text-txt-2 hover:border-v hover:text-txt"
              >
                Цуцлах
              </button>
              <button
                onClick={() => deleteMutation.mutate({ id: deleteTarget.id })}
                disabled={deleteMutation.isPending}
                className="inline-flex items-center gap-2 rounded-xl bg-red-500/20 px-4 py-2 text-sm font-semibold text-red-400 ring-1 ring-red-500/40 hover:bg-red-500/30 disabled:opacity-50"
              >
                {deleteMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                Устгах
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const inputCls =
  "w-full rounded-lg border border-[--bd] bg-bg-3 px-3 py-2 text-sm text-txt outline-none focus:border-v";

function Field({
  label,
  hint,
  required,
  full,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  full?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={full ? "md:col-span-2" : ""}>
      <label className="mb-1.5 flex items-center justify-between text-xs font-medium text-txt-2">
        <span>
          {label}
          {required && <span className="ml-1 text-v">*</span>}
        </span>
        {hint && <span className="text-txt-3">{hint}</span>}
      </label>
      {children}
    </div>
  );
}

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex w-full items-center gap-2 rounded-lg border border-[--bd] bg-bg-3 px-3 py-2 text-sm text-txt-2 hover:border-v"
    >
      {checked ? (
        <ToggleRight className="h-5 w-5 text-v" />
      ) : (
        <ToggleLeft className="h-5 w-5 text-txt-3" />
      )}
      <span>{label}</span>
    </button>
  );
}
