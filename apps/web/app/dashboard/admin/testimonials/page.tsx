"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc-client";
import {
  MessageSquareQuote, Plus, Pencil, Trash2, Loader2, X, Star, Sparkles,
  ToggleLeft, ToggleRight, AlertTriangle,
} from "lucide-react";

const COLORS = [
  { value: "violet", label: "Ягаан", swatch: "#A89FFF" },
  { value: "teal",   label: "Ногоон", swatch: "#00E5B8" },
  { value: "amber",  label: "Шар",    swatch: "#FFB02E" },
  { value: "pink",   label: "Ягаавтар", swatch: "#FF6B9D" },
  { value: "blue",   label: "Цэнхэр", swatch: "#5BA5FF" },
];

const COLOR_BG: Record<string, string> = {
  violet: "#7B6FFF22",
  teal:   "#00E5B815",
  amber:  "#FFB02E18",
  pink:   "#FF6B9D18",
  blue:   "#5BA5FF18",
};

const emptyForm = {
  text: "",
  name: "",
  role: "",
  avatar: "",
  color: "violet",
  rating: 5,
  order: 0,
  isActive: true,
};

export default function AdminTestimonialsPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  const utils = trpc.useUtils();
  const { data: items, isLoading } = trpc.testimonial.adminList.useQuery();
  const createMutation = trpc.testimonial.adminCreate.useMutation({
    onSuccess: () => { utils.testimonial.adminList.invalidate(); closeModal(); },
  });
  const updateMutation = trpc.testimonial.adminUpdate.useMutation({
    onSuccess: () => { utils.testimonial.adminList.invalidate(); closeModal(); },
  });
  const deleteMutation = trpc.testimonial.adminDelete.useMutation({
    onSuccess: () => { utils.testimonial.adminList.invalidate(); setDeleteTarget(null); },
  });
  const seedMutation = trpc.testimonial.adminSeedDefaults.useMutation({
    onSuccess: () => { utils.testimonial.adminList.invalidate(); },
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

  function openEdit(t: any) {
    setForm({
      text: t.text,
      name: t.name,
      role: t.role,
      avatar: t.avatar,
      color: t.color,
      rating: t.rating,
      order: t.order,
      isActive: t.isActive,
    });
    setEditingId(t.id);
    setModalOpen(true);
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const data = {
      text: form.text,
      name: form.name,
      role: form.role,
      avatar: form.avatar || form.name.trim().charAt(0).toUpperCase(),
      color: form.color as any,
      rating: Number(form.rating) || 5,
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
            <MessageSquareQuote className="h-3.5 w-3.5" />
            Сэтгэгдэл
          </div>
          <h1 className="font-clash text-3xl font-bold tracking-tight">
            Харилцагчдын сэтгэгдэл
          </h1>
          <p className="mt-1 text-sm text-txt-2">
            Landing хуудсанд харагдах сэтгэгдлүүдийг удирдах
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-br from-v to-v-dark px-5 py-2.5 text-sm font-semibold text-white shadow-[0_0_20px_#7B6FFF30] transition-all hover:-translate-y-0.5 hover:shadow-[0_0_30px_#7B6FFF50]"
        >
          <Plus className="h-4 w-4" />
          Шинэ сэтгэгдэл
        </button>
      </div>

      {/* List */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-v" />
        </div>
      ) : !items || items.length === 0 ? (
        <div className="rounded-2xl border border-[--bd] bg-bg-2 p-10 text-center">
          <Sparkles className="mx-auto mb-3 h-10 w-10 text-v opacity-50" />
          <h3 className="mb-1.5 font-clash text-lg font-semibold">
            Сэтгэгдэл алга байна
          </h3>
          <p className="mb-5 text-sm text-txt-2">
            Анхдагч 3 жишээ сэтгэгдлийг автоматаар үүсгэж эхэлж болно
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
            Анхдагч сэтгэгдэл үүсгэх
          </button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {items.map((t) => (
            <div
              key={t.id}
              className={`relative overflow-hidden rounded-2xl border border-[--bd] bg-bg-2 p-6 ${
                !t.isActive ? "opacity-50" : ""
              }`}
            >
              <div className="mb-3 flex gap-1">
                {Array(t.rating)
                  .fill(0)
                  .map((_, i) => (
                    <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
                  ))}
              </div>
              <p className="mb-4 line-clamp-4 text-[13px] leading-relaxed text-txt-2">
                {t.text}
              </p>
              <div className="mb-4 flex items-center gap-3">
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold"
                  style={{
                    background: COLOR_BG[t.color] || COLOR_BG.violet,
                    color: COLORS.find((c) => c.value === t.color)?.swatch,
                  }}
                >
                  {t.avatar || t.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold">{t.name}</div>
                  <div className="truncate text-xs text-txt-3">{t.role}</div>
                </div>
              </div>
              <div className="mb-4 flex items-center gap-2 text-[11px] text-txt-3">
                <span>Дараалал: {t.order}</span>
                <span>•</span>
                <span>{t.isActive ? "Идэвхтэй" : "Идэвхгүй"}</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => openEdit(t)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg border border-[--bd] bg-bg-3 px-3 py-2 text-xs font-medium text-txt-2 transition-all hover:border-v hover:text-txt"
                >
                  <Pencil className="h-3 w-3" />
                  Засах
                </button>
                <button
                  onClick={() => setDeleteTarget({ id: t.id, name: t.name })}
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
                {editingId ? "Сэтгэгдэл засах" : "Шинэ сэтгэгдэл"}
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
              <Field label="Сэтгэгдлийн текст" required full>
                <textarea
                  required
                  rows={5}
                  value={form.text}
                  onChange={(e) => setForm({ ...form, text: e.target.value })}
                  placeholder="10 минутад вэбсайтаа бэлэн болголоо..."
                  className={inputCls}
                />
              </Field>
              <Field label="Нэр" required>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Батбаяр Д."
                  className={inputCls}
                />
              </Field>
              <Field label="Албан тушаал / салбар" required>
                <input
                  required
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  placeholder="Кофе шоп эзэн"
                  className={inputCls}
                />
              </Field>
              <Field label="Аватар үсэг" hint="Хоосон бол нэрийн эхний үсэг">
                <input
                  maxLength={2}
                  value={form.avatar}
                  onChange={(e) => setForm({ ...form, avatar: e.target.value })}
                  placeholder="Б"
                  className={inputCls}
                />
              </Field>
              <Field label="Үнэлгээ (1-5)">
                <input
                  type="number"
                  min={1}
                  max={5}
                  value={form.rating}
                  onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
                  className={inputCls}
                />
              </Field>
              <Field label="Өнгө" full>
                <div className="flex flex-wrap gap-2">
                  {COLORS.map((c) => (
                    <button
                      key={c.value}
                      type="button"
                      onClick={() => setForm({ ...form, color: c.value })}
                      className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-xs transition-all ${
                        form.color === c.value
                          ? "border-v bg-bg-3 text-txt"
                          : "border-[--bd] bg-bg-3 text-txt-2 hover:border-v"
                      }`}
                    >
                      <span
                        className="h-3 w-3 rounded-full"
                        style={{ background: c.swatch }}
                      />
                      {c.label}
                    </button>
                  ))}
                </div>
              </Field>
              <Field label="Дараалал" hint="Бага = эхэнд">
                <input
                  type="number"
                  value={form.order}
                  onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
                  className={inputCls}
                />
              </Field>
              <Field label="Идэвхтэй">
                <button
                  type="button"
                  onClick={() => setForm({ ...form, isActive: !form.isActive })}
                  className="flex w-full items-center gap-2 rounded-lg border border-[--bd] bg-bg-3 px-3 py-2 text-sm text-txt-2 hover:border-v"
                >
                  {form.isActive ? (
                    <ToggleRight className="h-5 w-5 text-v" />
                  ) : (
                    <ToggleLeft className="h-5 w-5 text-txt-3" />
                  )}
                  <span>{form.isActive ? "Тийм" : "Үгүй"}</span>
                </button>
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
              <strong className="text-txt">{deleteTarget.name}</strong>-ийн
              сэтгэгдлийг устгана. Энэ үйлдлийг буцаах боломжгүй.
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
