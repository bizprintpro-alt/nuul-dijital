"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc-client";
import {
  GripVertical,
  Plus,
  Pencil,
  Trash2,
  X,
  Loader2,
  LayoutList,
  ExternalLink,
} from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

/* ── Types ── */
interface NavItem {
  id: string;
  label: string;
  labelEn: string | null;
  href: string;
  order: number;
  isActive: boolean;
  openInNew: boolean;
}

interface ModalData {
  label: string;
  labelEn: string;
  href: string;
  openInNew: boolean;
  isActive: boolean;
}

const emptyModal: ModalData = {
  label: "",
  labelEn: "",
  href: "",
  openInNew: false,
  isActive: true,
};

/* ── Sortable Item ── */
function SortableNavItem({
  item,
  onEdit,
  onDelete,
  onToggle,
}: {
  item: NavItem;
  onEdit: (item: NavItem) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 rounded-xl border border-white/[0.04] bg-bg-2 px-4 py-3 transition-colors hover:border-white/[0.08]"
    >
      {/* Drag handle */}
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab touch-none text-txt-3 hover:text-txt-2"
      >
        <GripVertical size={18} />
      </button>

      {/* Label MN */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="truncate text-sm font-medium text-txt">
            {item.label}
          </span>
          {item.labelEn && (
            <span className="truncate text-xs text-txt-3">{item.labelEn}</span>
          )}
        </div>
        <div className="flex items-center gap-1.5 text-xs text-txt-3">
          <span className="truncate">{item.href}</span>
          {item.openInNew && <ExternalLink size={10} />}
        </div>
      </div>

      {/* Active toggle */}
      <button
        onClick={() => onToggle(item.id)}
        className={`relative h-6 w-11 flex-shrink-0 rounded-full transition-colors ${
          item.isActive ? "bg-v" : "bg-white/[0.08]"
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
            item.isActive ? "left-[22px]" : "left-0.5"
          }`}
        />
      </button>

      {/* Edit */}
      <button
        onClick={() => onEdit(item)}
        className="rounded-lg p-2 text-txt-3 transition-colors hover:bg-white/[0.04] hover:text-txt"
      >
        <Pencil size={15} />
      </button>

      {/* Delete */}
      <button
        onClick={() => onDelete(item.id)}
        className="rounded-lg p-2 text-txt-3 transition-colors hover:bg-red-500/10 hover:text-red-400"
      >
        <Trash2 size={15} />
      </button>
    </div>
  );
}

/* ── Main Page ── */
export default function AdminNavigationPage() {
  const utils = trpc.useUtils();
  const { data: items = [], isLoading } =
    trpc.nav.adminGetNavItems.useQuery();

  const createMutation = trpc.nav.adminCreateNavItem.useMutation({
    onSuccess: () => utils.nav.adminGetNavItems.invalidate(),
  });
  const updateMutation = trpc.nav.adminUpdateNavItem.useMutation({
    onSuccess: () => utils.nav.adminGetNavItems.invalidate(),
  });
  const deleteMutation = trpc.nav.adminDeleteNavItem.useMutation({
    onSuccess: () => utils.nav.adminGetNavItems.invalidate(),
  });
  const reorderMutation = trpc.nav.adminReorderNavItems.useMutation({
    onSuccess: () => utils.nav.adminGetNavItems.invalidate(),
  });
  const toggleMutation = trpc.nav.adminToggleNavItem.useMutation({
    onSuccess: () => utils.nav.adminGetNavItems.invalidate(),
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ModalData>(emptyModal);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  /* ── Handlers ── */
  const openCreate = () => {
    setEditingId(null);
    setForm(emptyModal);
    setModalOpen(true);
  };

  const openEdit = (item: NavItem) => {
    setEditingId(item.id);
    setForm({
      label: item.label,
      labelEn: item.labelEn ?? "",
      href: item.href,
      openInNew: item.openInNew,
      isActive: item.isActive,
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (editingId) {
      await updateMutation.mutateAsync({
        id: editingId,
        label: form.label,
        labelEn: form.labelEn || undefined,
        href: form.href,
        openInNew: form.openInNew,
        isActive: form.isActive,
      });
    } else {
      await createMutation.mutateAsync({
        label: form.label,
        labelEn: form.labelEn || undefined,
        href: form.href,
        openInNew: form.openInNew,
        isActive: form.isActive,
      });
    }
    setModalOpen(false);
  };

  const handleDelete = async (id: string) => {
    await deleteMutation.mutateAsync({ id });
    setDeleteConfirm(null);
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((i) => i.id === active.id);
    const newIndex = items.findIndex((i) => i.id === over.id);
    const reordered = arrayMove(items, oldIndex, newIndex);

    reorderMutation.mutate({ ids: reordered.map((i) => i.id) });
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-v" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-v/10">
            <LayoutList className="h-5 w-5 text-v" />
          </div>
          <div>
            <h1 className="font-syne text-xl font-bold text-txt">
              Меню удирдлага
            </h1>
            <p className="text-sm text-txt-2">
              Сайтын навигацийн менюг удирдах
            </p>
          </div>
        </div>

        <button
          onClick={openCreate}
          className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-v to-v-dark px-4 py-2.5 text-sm font-semibold text-white shadow-[0_0_20px_#7B6FFF30] transition-all hover:-translate-y-0.5 hover:shadow-[0_0_30px_#7B6FFF50]"
        >
          <Plus size={16} />
          Шинэ меню нэмэх
        </button>
      </div>

      {/* Draggable list */}
      <div className="space-y-2">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-white/[0.04] bg-bg-2 py-16 text-center">
            <LayoutList className="mb-3 h-10 w-10 text-txt-3" />
            <p className="text-sm text-txt-2">Меню байхгүй байна</p>
            <p className="text-xs text-txt-3">
              &quot;Шинэ меню нэмэх&quot; товч дарж эхлүүлнэ үү
            </p>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={items.map((i) => i.id)}
              strategy={verticalListSortingStrategy}
            >
              {items.map((item) => (
                <SortableNavItem
                  key={item.id}
                  item={item}
                  onEdit={openEdit}
                  onDelete={(id) => setDeleteConfirm(id)}
                  onToggle={(id) => toggleMutation.mutate({ id })}
                />
              ))}
            </SortableContext>
          </DndContext>
        )}
      </div>

      {/* Live preview */}
      {items.length > 0 && (
        <div className="space-y-3">
          <h2 className="font-syne text-sm font-semibold text-txt-2">
            Урьдчилж харах
          </h2>
          <div className="rounded-xl border border-white/[0.04] bg-bg-2 px-6 py-4">
            <div className="flex flex-wrap items-center gap-6">
              {items
                .filter((i) => i.isActive)
                .map((item) => (
                  <span
                    key={item.id}
                    className="text-sm font-medium text-txt transition-colors hover:text-v"
                  >
                    {item.label}
                  </span>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Create / Edit Modal ── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-white/[0.06] bg-bg-2 p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-syne text-lg font-bold text-txt">
                {editingId ? "Меню засах" : "Шинэ меню нэмэх"}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="rounded-lg p-1.5 text-txt-3 transition-colors hover:bg-white/[0.04] hover:text-txt"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              {/* Label MN */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-txt-2">
                  Label (МН) *
                </label>
                <input
                  type="text"
                  value={form.label}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, label: e.target.value }))
                  }
                  className="w-full rounded-lg border border-white/[0.06] bg-bg-3 px-4 py-2.5 text-sm text-txt outline-none transition-colors focus:border-v/30"
                  placeholder="Нүүр хуудас"
                />
              </div>

              {/* Label EN */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-txt-2">
                  Label (EN)
                </label>
                <input
                  type="text"
                  value={form.labelEn}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, labelEn: e.target.value }))
                  }
                  className="w-full rounded-lg border border-white/[0.06] bg-bg-3 px-4 py-2.5 text-sm text-txt outline-none transition-colors focus:border-v/30"
                  placeholder="Home"
                />
              </div>

              {/* Href */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-txt-2">
                  Href *
                </label>
                <input
                  type="text"
                  value={form.href}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, href: e.target.value }))
                  }
                  className="w-full rounded-lg border border-white/[0.06] bg-bg-3 px-4 py-2.5 text-sm text-txt outline-none transition-colors focus:border-v/30"
                  placeholder="/about"
                />
              </div>

              {/* Toggles row */}
              <div className="flex items-center gap-6">
                {/* Open in new */}
                <label className="flex cursor-pointer items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() =>
                      setForm((f) => ({ ...f, openInNew: !f.openInNew }))
                    }
                    className={`relative h-6 w-11 rounded-full transition-colors ${
                      form.openInNew ? "bg-v" : "bg-white/[0.08]"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                        form.openInNew ? "left-[22px]" : "left-0.5"
                      }`}
                    />
                  </button>
                  <span className="text-sm text-txt-2">Шинэ цонхонд нээх</span>
                </label>

                {/* Active */}
                <label className="flex cursor-pointer items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() =>
                      setForm((f) => ({ ...f, isActive: !f.isActive }))
                    }
                    className={`relative h-6 w-11 rounded-full transition-colors ${
                      form.isActive ? "bg-v" : "bg-white/[0.08]"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                        form.isActive ? "left-[22px]" : "left-0.5"
                      }`}
                    />
                  </button>
                  <span className="text-sm text-txt-2">Идэвхтэй</span>
                </label>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setModalOpen(false)}
                className="rounded-lg border border-white/[0.06] px-4 py-2.5 text-sm font-medium text-txt-2 transition-colors hover:bg-white/[0.03]"
              >
                Болих
              </button>
              <button
                onClick={handleSave}
                disabled={!form.label || !form.href || isSaving}
                className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-v to-v-dark px-5 py-2.5 text-sm font-semibold text-white shadow-[0_0_20px_#7B6FFF30] transition-all hover:-translate-y-0.5 hover:shadow-[0_0_30px_#7B6FFF50] disabled:opacity-50"
              >
                {isSaving && <Loader2 size={14} className="animate-spin" />}
                Хадгалах
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Confirm Modal ── */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-white/[0.06] bg-bg-2 p-6 shadow-2xl">
            <h2 className="font-syne text-lg font-bold text-txt">
              Меню устгах
            </h2>
            <p className="mt-2 text-sm text-txt-2">
              Энэ менюг устгахдаа итгэлтэй байна уу? Энэ үйлдлийг буцаах
              боломжгүй.
            </p>
            <div className="mt-5 flex justify-end gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="rounded-lg border border-white/[0.06] px-4 py-2.5 text-sm font-medium text-txt-2 transition-colors hover:bg-white/[0.03]"
              >
                Болих
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                disabled={deleteMutation.isPending}
                className="flex items-center gap-2 rounded-lg bg-red-500/20 px-5 py-2.5 text-sm font-semibold text-red-400 transition-all hover:bg-red-500/30 disabled:opacity-50"
              >
                {deleteMutation.isPending && (
                  <Loader2 size={14} className="animate-spin" />
                )}
                Устгах
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
