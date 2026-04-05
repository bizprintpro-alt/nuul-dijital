"use client";

import { useState, useMemo } from "react";
import { Plus, DollarSign, Trash2, X, GripVertical } from "lucide-react";
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { trpc } from "@/lib/trpc-client";

// ── Stage definitions ──────────────────────────────────────────────
const STAGES = [
  {
    key: "NEW" as const,
    label: "Шинэ",
    color: "border-v/30 bg-v/5",
    dotColor: "bg-v",
  },
  {
    key: "CONTACTED" as const,
    label: "Холбогдсон",
    color: "border-[#FFB02E]/30 bg-[#FFB02E]/5",
    dotColor: "bg-[#FFB02E]",
  },
  {
    key: "PROPOSAL" as const,
    label: "Санал",
    color: "border-t/30 bg-t/5",
    dotColor: "bg-t",
  },
  {
    key: "NEGOTIATION" as const,
    label: "Хэлэлцээр",
    color: "border-[#FF6B9D]/30 bg-[#FF6B9D]/5",
    dotColor: "bg-[#FF6B9D]",
  },
  {
    key: "CLOSED_WON" as const,
    label: "Хаагдсан-Won",
    color: "border-[#34D399]/30 bg-[#34D399]/5",
    dotColor: "bg-[#34D399]",
  },
  {
    key: "CLOSED_LOST" as const,
    label: "Хаагдсан-Lost",
    color: "border-[#EF4444]/30 bg-[#EF4444]/5",
    dotColor: "bg-[#EF4444]",
  },
] as const;

type StageKey = (typeof STAGES)[number]["key"];

interface Lead {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  value: number | null;
  stage: StageKey;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

// ── Draggable card ─────────────────────────────────────────────────
function LeadCard({
  lead,
  stageColor,
  onDelete,
}: {
  lead: Lead;
  stageColor: string;
  onDelete: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: lead.id });

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    opacity: isDragging ? 0.3 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group cursor-grab rounded-xl border p-4 transition-all hover:-translate-y-0.5 active:cursor-grabbing ${stageColor}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-1.5">
          <GripVertical
            size={14}
            className="shrink-0 text-txt-3"
            {...listeners}
            {...attributes}
          />
          <span className="text-[13px] font-semibold text-txt">
            {lead.name}
          </span>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(lead.id);
          }}
          className="opacity-0 transition-opacity group-hover:opacity-100"
        >
          <Trash2 size={13} className="text-txt-3 hover:text-[#EF4444]" />
        </button>
      </div>
      {lead.company && (
        <div className="mt-1 text-[11px] text-txt-3">{lead.company}</div>
      )}
      {lead.email && (
        <div className="mt-0.5 text-[11px] text-txt-3">{lead.email}</div>
      )}
      {lead.value != null && (
        <div className="mt-2 font-syne text-sm font-bold text-txt">
          ₮{lead.value.toLocaleString()}
        </div>
      )}
    </div>
  );
}

// ── Static overlay card (no drag hooks) ────────────────────────────
function LeadCardOverlay({ lead }: { lead: Lead }) {
  return (
    <div className="w-[250px] cursor-grabbing rounded-xl border border-v/40 bg-bg-2 p-4 shadow-lg shadow-v/10">
      <div className="text-[13px] font-semibold text-txt">{lead.name}</div>
      {lead.company && (
        <div className="mt-1 text-[11px] text-txt-3">{lead.company}</div>
      )}
      {lead.value != null && (
        <div className="mt-2 font-syne text-sm font-bold text-txt">
          ₮{lead.value.toLocaleString()}
        </div>
      )}
    </div>
  );
}

// ── Droppable column ───────────────────────────────────────────────
function StageColumn({
  stage,
  leads,
  onDelete,
}: {
  stage: (typeof STAGES)[number];
  leads: Lead[];
  onDelete: (id: string) => void;
}) {
  const { isOver, setNodeRef } = useDroppable({ id: stage.key });

  return (
    <div
      ref={setNodeRef}
      className={`min-h-[300px] rounded-2xl border border-white/[0.04] bg-bg-2 p-3 transition-colors ${
        isOver ? "border-v/50 bg-v/5" : ""
      }`}
    >
      <div className="mb-3 flex items-center gap-2">
        <div className={`h-2 w-2 rounded-full ${stage.dotColor}`} />
        <span className="text-[12px] font-semibold text-txt">
          {stage.label}
        </span>
        <span className="rounded-md bg-white/[0.04] px-1.5 py-0.5 text-[10px] text-txt-3">
          {leads.length}
        </span>
      </div>
      <div className="space-y-2">
        {leads.map((lead) => (
          <LeadCard
            key={lead.id}
            lead={lead}
            stageColor={stage.color}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
}

// ── Modal form ─────────────────────────────────────────────────────
function CreateLeadModal({
  open,
  onClose,
  onSubmit,
  isLoading,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    email: string;
    phone: string;
    company: string;
    value: number;
    stage: StageKey;
  }) => void;
  isLoading: boolean;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [value, setValue] = useState("");
  const [stage, setStage] = useState<StageKey>("NEW");

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      email,
      phone,
      company,
      value: parseInt(value) || 0,
      stage,
    });
    setName("");
    setEmail("");
    setPhone("");
    setCompany("");
    setValue("");
    setStage("NEW");
  };

  const inputClass =
    "w-full rounded-xl border border-white/[0.06] bg-bg-3 px-4 py-2.5 text-[13px] text-txt placeholder:text-txt-3 outline-none focus:border-v/50 transition-colors";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-white/[0.06] bg-bg-2 p-6 shadow-xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-syne text-lg font-bold text-txt">
            Шинэ lead нэмэх
          </h2>
          <button onClick={onClose} className="text-txt-3 hover:text-txt">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="mb-1 block text-[11px] font-medium text-txt-2">
              Нэр *
            </label>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Байгууллага эсвэл хүний нэр"
              className={inputClass}
            />
          </div>
          <div>
            <label className="mb-1 block text-[11px] font-medium text-txt-2">
              Имэйл
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.mn"
              className={inputClass}
            />
          </div>
          <div>
            <label className="mb-1 block text-[11px] font-medium text-txt-2">
              Утас
            </label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="99001122"
              className={inputClass}
            />
          </div>
          <div>
            <label className="mb-1 block text-[11px] font-medium text-txt-2">
              Компани
            </label>
            <input
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="Компанийн нэр"
              className={inputClass}
            />
          </div>
          <div>
            <label className="mb-1 block text-[11px] font-medium text-txt-2">
              Дүн (₮)
            </label>
            <input
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="0"
              className={inputClass}
            />
          </div>
          <div>
            <label className="mb-1 block text-[11px] font-medium text-txt-2">
              Шат
            </label>
            <select
              value={stage}
              onChange={(e) => setStage(e.target.value as StageKey)}
              className={inputClass}
            >
              {STAGES.map((s) => (
                <option key={s.key} value={s.key}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={isLoading || !name}
            className="mt-2 w-full rounded-xl bg-v py-2.5 text-[13px] font-bold text-white shadow-[0_0_16px_rgba(108,99,255,0.25)] transition-all hover:bg-v/90 disabled:opacity-50"
          >
            {isLoading ? "Хадгалж байна..." : "Нэмэх"}
          </button>
        </form>
      </div>
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────────
export default function CRMPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [activeLead, setActiveLead] = useState<Lead | null>(null);

  const utils = trpc.useUtils();
  const { data: leads = [], isLoading } = trpc.crm.getLeads.useQuery();

  const createLead = trpc.crm.createLead.useMutation({
    onSuccess: () => {
      utils.crm.getLeads.invalidate();
      setModalOpen(false);
    },
  });

  const updateStage = trpc.crm.updateStage.useMutation({
    onSuccess: () => {
      utils.crm.getLeads.invalidate();
    },
  });

  const deleteLead = trpc.crm.deleteLead.useMutation({
    onSuccess: () => {
      utils.crm.getLeads.invalidate();
    },
  });

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  // Group leads by stage
  const leadsByStage = useMemo(() => {
    const map: Record<StageKey, Lead[]> = {
      NEW: [],
      CONTACTED: [],
      PROPOSAL: [],
      NEGOTIATION: [],
      CLOSED_WON: [],
      CLOSED_LOST: [],
    };
    for (const lead of leads as Lead[]) {
      if (map[lead.stage]) {
        map[lead.stage].push(lead);
      }
    }
    return map;
  }, [leads]);

  // Pipeline total
  const pipelineTotal = useMemo(() => {
    return (leads as Lead[]).reduce((sum, l) => sum + (l.value ?? 0), 0);
  }, [leads]);

  const handleDragStart = (event: DragStartEvent) => {
    const lead = (leads as Lead[]).find((l) => l.id === event.active.id);
    setActiveLead(lead ?? null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveLead(null);
    const { active, over } = event;
    if (!over) return;

    const leadId = active.id as string;
    const newStage = over.id as StageKey;

    // Only update if dropped on a valid stage column and stage changed
    const currentLead = (leads as Lead[]).find((l) => l.id === leadId);
    if (!currentLead) return;
    if (!STAGES.some((s) => s.key === newStage)) return;
    if (currentLead.stage === newStage) return;

    updateStage.mutate({ leadId, stage: newStage });
  };

  const handleDelete = (id: string) => {
    if (confirm("Энэ lead-г устгах уу?")) {
      deleteLead.mutate({ leadId: id });
    }
  };

  const handleCreate = (data: {
    name: string;
    email: string;
    phone: string;
    company: string;
    value: number;
    stage: StageKey;
  }) => {
    createLead.mutate({
      name: data.name,
      email: data.email || "",
      phone: data.phone || "",
      company: data.company || "",
      value: data.value || 0,
      stage: data.stage,
    });
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-syne text-2xl font-bold tracking-tight text-txt">
            CRM & Борлуулалт
          </h1>
          <p className="mt-1 text-[13px] text-txt-3">
            Харилцагчийн pipeline — Kanban хэлбэрээр
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-v px-5 py-2.5 text-[13px] font-bold text-white shadow-[0_0_16px_rgba(108,99,255,0.25)] transition-all hover:bg-v/90"
        >
          <Plus size={15} />
          Шинэ lead
        </button>
      </div>

      {/* Pipeline total */}
      <div className="mb-6 flex items-center gap-2 rounded-xl border border-white/[0.04] bg-bg-2 px-5 py-3">
        <DollarSign size={16} className="text-t" />
        <span className="text-[13px] text-txt-2">Pipeline нийт дүн:</span>
        <span className="font-syne text-lg font-bold text-t">
          ₮{pipelineTotal.toLocaleString()}
        </span>
        <span className="text-[12px] text-txt-3">
          · {(leads as Lead[]).length} lead
        </span>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="py-20 text-center text-[13px] text-txt-3">
          Ачаалж байна...
        </div>
      )}

      {/* Kanban board */}
      {!isLoading && (
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
            {STAGES.map((stage) => (
              <StageColumn
                key={stage.key}
                stage={stage}
                leads={leadsByStage[stage.key]}
                onDelete={handleDelete}
              />
            ))}
          </div>

          <DragOverlay>
            {activeLead ? <LeadCardOverlay lead={activeLead} /> : null}
          </DragOverlay>
        </DndContext>
      )}

      {/* Create modal */}
      <CreateLeadModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleCreate}
        isLoading={createLead.isPending}
      />
    </div>
  );
}
