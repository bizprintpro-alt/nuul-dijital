// @ts-nocheck
"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc-client";
import {
  Server, Plus, Pencil, Trash2, Loader2, X, Check,
  ToggleLeft, ToggleRight, AlertTriangle,
} from "lucide-react";

const HOSTING_TYPES = ["STARTER", "BUSINESS", "ENTERPRISE"];
const VPS_TYPES = ["VPS_BASIC", "VPS_PRO", "VPS_CLOUD"];

const TYPE_LABELS: Record<string, string> = {
  STARTER: "Starter",
  BUSINESS: "Business",
  ENTERPRISE: "Enterprise",
  VPS_BASIC: "VPS Basic",
  VPS_PRO: "VPS Pro",
  VPS_CLOUD: "Cloud Server",
};

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const emptyForm = {
  name: "",
  slug: "",
  type: "STARTER",
  description: "",
  price: 0,
  priceYearly: null as number | null,
  storage: 0,
  bandwidth: 0,
  websites: 0,
  emails: 0,
  features: "",
  isActive: true,
};

export default function AdminHostingPage() {
  const [tab, setTab] = useState<"hosting" | "vps">("hosting");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  const utils = trpc.useUtils();
  const { data: plans, isLoading } = trpc.hosting.adminGetAllPlans.useQuery();
  const createMutation = trpc.hosting.adminCreatePlan.useMutation({
    onSuccess: () => { utils.hosting.adminGetAllPlans.invalidate(); closeModal(); },
  });
  const updateMutation = trpc.hosting.adminUpdatePlan.useMutation({
    onSuccess: () => { utils.hosting.adminGetAllPlans.invalidate(); closeModal(); },
  });
  const deleteMutation = trpc.hosting.adminDeletePlan.useMutation({
    onSuccess: () => { utils.hosting.adminGetAllPlans.invalidate(); setDeleteTarget(null); },
  });
  const toggleMutation = trpc.hosting.adminTogglePlan.useMutation({
    onSuccess: () => { utils.hosting.adminGetAllPlans.invalidate(); },
  });

  const filteredPlans = plans?.filter((p) =>
    tab === "hosting" ? HOSTING_TYPES.includes(p.type) : VPS_TYPES.includes(p.type)
  );

  function closeModal() {
    setModalOpen(false);
    setEditingId(null);
    setForm({ ...emptyForm });
  }

  function openCreate() {
    setForm({
      ...emptyForm,
      type: tab === "hosting" ? "STARTER" : "VPS_BASIC",
    });
    setEditingId(null);
    setModalOpen(true);
  }

  function openEdit(plan: any) {
    setForm({
      name: plan.name,
      slug: plan.slug,
      type: plan.type,
      description: plan.description ?? "",
      price: plan.price,
      priceYearly: plan.priceYearly,
      storage: plan.storage,
      bandwidth: plan.bandwidth,
      websites: plan.websites,
      emails: plan.emails,
      features: plan.features.join("\n"),
      isActive: plan.isActive,
    });
    setEditingId(plan.id);
    setModalOpen(true);
  }

  function handleSave() {
    const featuresArr = form.features
      .split("\n")
      .map((f) => f.trim())
      .filter(Boolean);

    const payload = {
      name: form.name,
      slug: form.slug,
      type: form.type as any,
      description: form.description || undefined,
      price: form.price,
      priceYearly: form.priceYearly || null,
      storage: form.storage,
      bandwidth: form.bandwidth,
      websites: form.websites,
      emails: form.emails,
      features: featuresArr,
      isActive: form.isActive,
    };

    if (editingId) {
      updateMutation.mutate({ id: editingId, ...payload });
    } else {
      createMutation.mutate(payload);
    }
  }

  const saving = createMutation.isPending || updateMutation.isPending;

  const typeOptions = tab === "hosting" ? HOSTING_TYPES : VPS_TYPES;

  function formatPrice(n: number) {
    return new Intl.NumberFormat("mn-MN").format(n);
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Server size={20} className="text-v" />
            <h1 className="font-syne text-2xl font-bold tracking-tight text-txt">
              Хостинг & VPS планууд
            </h1>
          </div>
          <p className="mt-1 text-[13px] text-txt-3">
            Хостинг болон VPS планууд удирдах, үнэ өөрчлөх
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 rounded-xl bg-v px-5 py-2.5 text-[13px] font-bold text-white shadow-[0_0_16px_rgba(108,99,255,0.25)] transition hover:shadow-[0_0_24px_rgba(108,99,255,0.4)]"
        >
          <Plus size={15} />
          Шинэ план нэмэх
        </button>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-1 rounded-xl bg-bg-2 p-1">
        {[
          { key: "hosting" as const, label: "Хостинг планууд" },
          { key: "vps" as const, label: "VPS планууд" },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex-1 rounded-lg py-2.5 text-[13px] font-semibold transition-all ${
              tab === t.key
                ? "bg-v/15 text-v-soft"
                : "text-txt-3 hover:text-txt-2"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="flex items-center justify-center rounded-2xl border border-white/[0.04] bg-bg-2 py-20">
          <Loader2 size={24} className="animate-spin text-v" />
        </div>
      ) : !filteredPlans?.length ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-white/[0.04] bg-bg-2 py-20">
          <Server size={32} className="mb-3 text-txt-3" />
          <p className="text-[13px] text-txt-3">План байхгүй байна</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-white/[0.04] bg-bg-2">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.04]">
                  {["Нэр", "Төрөл", "Үнэ (₮/сар)", "Хадгалах зай", "Bandwidth", "Вэбсайт", "Идэвхтэй", "Үйлдэл"].map(
                    (h) => (
                      <th
                        key={h}
                        className="px-5 py-3 text-left text-[11px] font-medium uppercase tracking-wider text-txt-3"
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {filteredPlans.map((plan) => (
                  <tr
                    key={plan.id}
                    className="border-b border-white/[0.02] transition hover:bg-white/[0.02]"
                  >
                    <td className="px-5 py-4">
                      <div className="text-[13px] font-medium text-txt">{plan.name}</div>
                      <div className="text-[11px] text-txt-3">{plan.slug}</div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="rounded-md bg-v/10 px-2 py-0.5 text-[11px] font-medium text-v-soft">
                        {TYPE_LABELS[plan.type] ?? plan.type}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-[13px] text-txt">
                      ₮{formatPrice(plan.price)}
                    </td>
                    <td className="px-5 py-4 text-[13px] text-txt-2">{plan.storage}GB</td>
                    <td className="px-5 py-4 text-[13px] text-txt-2">
                      {plan.bandwidth === 0 ? "Хязгааргүй" : `${plan.bandwidth}GB`}
                    </td>
                    <td className="px-5 py-4 text-[13px] text-txt-2">{plan.websites}</td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => toggleMutation.mutate({ id: plan.id })}
                        disabled={toggleMutation.isPending}
                      >
                        {plan.isActive ? (
                          <ToggleRight size={24} className="text-t" />
                        ) : (
                          <ToggleLeft size={24} className="text-txt-3" />
                        )}
                      </button>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEdit(plan)}
                          className="flex items-center gap-1 rounded-lg border border-v/20 px-3 py-1.5 text-[11px] font-medium text-v-soft transition hover:bg-v/5"
                        >
                          <Pencil size={12} />
                          Засах
                        </button>
                        <button
                          onClick={() => setDeleteTarget({ id: plan.id, name: plan.name })}
                          className="flex items-center gap-1 rounded-lg border border-red-500/20 px-3 py-1.5 text-[11px] font-medium text-red-400 transition hover:bg-red-500/5"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-white/[0.06] bg-bg-2 p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="font-syne text-lg font-bold text-txt">
                {editingId ? "План засах" : "Шинэ план нэмэх"}
              </h3>
              <button
                onClick={closeModal}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-txt-3 transition hover:bg-white/[0.04] hover:text-txt"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="mb-1 block text-[12px] font-medium text-txt-3">Нэр</label>
                <input
                  value={form.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    setForm((f) => ({
                      ...f,
                      name,
                      slug: editingId ? f.slug : slugify(name),
                    }));
                  }}
                  className="w-full rounded-xl border border-white/[0.06] bg-bg-3 px-4 py-2.5 text-[13px] text-txt outline-none transition focus:border-v/40"
                  placeholder="VPS Basic"
                />
              </div>

              {/* Slug */}
              <div>
                <label className="mb-1 block text-[12px] font-medium text-txt-3">Slug</label>
                <input
                  value={form.slug}
                  onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                  className="w-full rounded-xl border border-white/[0.06] bg-bg-3 px-4 py-2.5 text-[13px] text-txt outline-none transition focus:border-v/40"
                  placeholder="vps-basic"
                />
              </div>

              {/* Type */}
              <div>
                <label className="mb-1 block text-[12px] font-medium text-txt-3">Төрөл</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
                  className="w-full rounded-xl border border-white/[0.06] bg-bg-3 px-4 py-2.5 text-[13px] text-txt outline-none transition focus:border-v/40"
                >
                  {typeOptions.map((t) => (
                    <option key={t} value={t}>
                      {TYPE_LABELS[t]}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price row */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-[12px] font-medium text-txt-3">
                    Үнэ (MNT/сар)
                  </label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) => setForm((f) => ({ ...f, price: parseInt(e.target.value) || 0 }))}
                    className="w-full rounded-xl border border-white/[0.06] bg-bg-3 px-4 py-2.5 text-[13px] text-txt outline-none transition focus:border-v/40"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[12px] font-medium text-txt-3">
                    Жилийн үнэ (заавал биш)
                  </label>
                  <input
                    type="number"
                    value={form.priceYearly ?? ""}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        priceYearly: e.target.value ? parseInt(e.target.value) : null,
                      }))
                    }
                    className="w-full rounded-xl border border-white/[0.06] bg-bg-3 px-4 py-2.5 text-[13px] text-txt outline-none transition focus:border-v/40"
                    placeholder="0"
                  />
                </div>
              </div>

              {/* Storage / Bandwidth */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-[12px] font-medium text-txt-3">
                    Хадгалах зай (GB)
                  </label>
                  <input
                    type="number"
                    value={form.storage}
                    onChange={(e) => setForm((f) => ({ ...f, storage: parseInt(e.target.value) || 0 }))}
                    className="w-full rounded-xl border border-white/[0.06] bg-bg-3 px-4 py-2.5 text-[13px] text-txt outline-none transition focus:border-v/40"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[12px] font-medium text-txt-3">
                    Bandwidth (GB/сар, 0=хязгааргүй)
                  </label>
                  <input
                    type="number"
                    value={form.bandwidth}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, bandwidth: parseInt(e.target.value) || 0 }))
                    }
                    className="w-full rounded-xl border border-white/[0.06] bg-bg-3 px-4 py-2.5 text-[13px] text-txt outline-none transition focus:border-v/40"
                  />
                </div>
              </div>

              {/* Websites / Emails */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-[12px] font-medium text-txt-3">
                    Вэбсайт тоо
                  </label>
                  <input
                    type="number"
                    value={form.websites}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, websites: parseInt(e.target.value) || 0 }))
                    }
                    className="w-full rounded-xl border border-white/[0.06] bg-bg-3 px-4 py-2.5 text-[13px] text-txt outline-none transition focus:border-v/40"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[12px] font-medium text-txt-3">
                    Имэйл тоо
                  </label>
                  <input
                    type="number"
                    value={form.emails}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, emails: parseInt(e.target.value) || 0 }))
                    }
                    className="w-full rounded-xl border border-white/[0.06] bg-bg-3 px-4 py-2.5 text-[13px] text-txt outline-none transition focus:border-v/40"
                  />
                </div>
              </div>

              {/* Features */}
              <div>
                <label className="mb-1 block text-[12px] font-medium text-txt-3">
                  Features (мөр тус бүрт нэг)
                </label>
                <textarea
                  value={form.features}
                  onChange={(e) => setForm((f) => ({ ...f, features: e.target.value }))}
                  rows={5}
                  className="w-full rounded-xl border border-white/[0.06] bg-bg-3 px-4 py-2.5 text-[13px] text-txt outline-none transition focus:border-v/40"
                  placeholder={"2 vCPU\n4GB RAM\n80GB SSD"}
                />
              </div>

              {/* Description */}
              <div>
                <label className="mb-1 block text-[12px] font-medium text-txt-3">Тайлбар</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  rows={2}
                  className="w-full rounded-xl border border-white/[0.06] bg-bg-3 px-4 py-2.5 text-[13px] text-txt outline-none transition focus:border-v/40"
                />
              </div>

              {/* Active toggle */}
              <div className="flex items-center justify-between rounded-xl border border-white/[0.04] bg-bg-3 px-4 py-3">
                <span className="text-[13px] text-txt-2">Идэвхтэй</span>
                <button onClick={() => setForm((f) => ({ ...f, isActive: !f.isActive }))}>
                  {form.isActive ? (
                    <ToggleRight size={28} className="text-t" />
                  ) : (
                    <ToggleLeft size={28} className="text-txt-3" />
                  )}
                </button>
              </div>

              {/* Error display */}
              {(createMutation.error || updateMutation.error) && (
                <div className="rounded-xl bg-red-500/10 px-4 py-3 text-[12px] text-red-400">
                  {createMutation.error?.message || updateMutation.error?.message}
                </div>
              )}

              {/* Save */}
              <button
                onClick={handleSave}
                disabled={saving || !form.name || !form.slug}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-v py-3 text-[13px] font-bold text-white transition hover:shadow-[0_0_20px_rgba(108,99,255,0.3)] disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Хадгалж байна...
                  </>
                ) : (
                  <>
                    <Check size={14} />
                    Хадгалах
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-white/[0.06] bg-bg-2 p-6 shadow-2xl">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500/15">
                <AlertTriangle size={20} className="text-red-400" />
              </div>
              <div>
                <h3 className="font-syne text-base font-bold text-txt">План устгах</h3>
                <p className="text-[12px] text-txt-3">Энэ үйлдлийг буцаах боломжгүй</p>
              </div>
            </div>

            <div className="mb-5 rounded-xl bg-red-500/5 px-4 py-3 text-[12px] text-red-300">
              <strong>{deleteTarget.name}</strong> план бүрмөсөн устгагдах болно.
            </div>

            {deleteMutation.error && (
              <div className="mb-4 rounded-xl bg-red-500/10 px-4 py-3 text-[12px] text-red-400">
                {deleteMutation.error.message}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 rounded-xl border border-white/[0.06] py-2.5 text-[13px] font-medium text-txt-2 transition hover:bg-white/[0.04]"
              >
                Болих
              </button>
              <button
                onClick={() => deleteMutation.mutate({ id: deleteTarget.id })}
                disabled={deleteMutation.isPending}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-500/20 py-2.5 text-[13px] font-bold text-red-400 transition hover:bg-red-500/30 disabled:opacity-50"
              >
                {deleteMutation.isPending ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Устгаж байна...
                  </>
                ) : (
                  <>
                    <Trash2 size={14} />
                    Устгах
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
