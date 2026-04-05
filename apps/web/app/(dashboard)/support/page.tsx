"use client";

import { useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  Headphones,
  Bot,
  Send,
  CheckCircle,
  Clock,
  AlertCircle,
  Plus,
  X,
  Loader2,
  TicketIcon,
} from "lucide-react";
import { trpc } from "@/lib/trpc-client";

/* ─── types ─── */
interface ChatMessage {
  role: "ai" | "user";
  content: string;
}

/* ─── page ─── */
export default function SupportPage() {
  const { data: session } = useSession();
  const userName = session?.user?.name || "Хэрэглэгч";
  const userInitial = userName.charAt(0).toUpperCase();

  /* ── chat state ── */
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "ai",
      content:
        "Сайн байна уу! Би Nuul AI туслах. Домэйн, хостинг, чатбот, төлбөр — ямар ч асуулт байсан асуугаарай!",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  /* ── ticket state ── */
  const [showModal, setShowModal] = useState(false);
  const [ticketSubject, setTicketSubject] = useState("");
  const [ticketMessage, setTicketMessage] = useState("");
  const [ticketPriority, setTicketPriority] = useState<
    "LOW" | "MEDIUM" | "HIGH" | "URGENT"
  >("MEDIUM");

  /* ── trpc ── */
  const ticketsQuery = trpc.ticket.getTickets.useQuery();
  const createTicketMut = trpc.ticket.createTicket.useMutation({
    onSuccess: () => {
      ticketsQuery.refetch();
      setShowModal(false);
      setTicketSubject("");
      setTicketMessage("");
      setTicketPriority("MEDIUM");
    },
  });

  /* ── auto-scroll ── */
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  /* ── send message ── */
  const sendMessage = async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "ai", content: data.response },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          content:
            "Уучлаарай, алдаа гарлаа. Дахин оролдоно уу эсвэл тикет үүсгэнэ үү.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  /* ── create ticket from chat ── */
  const createTicketFromChat = () => {
    const conversation = messages
      .map((m) => (m.role === "ai" ? `AI: ${m.content}` : `Би: ${m.content}`))
      .join("\n\n");
    setTicketSubject("AI чатаас үүссэн тикет");
    setTicketMessage(conversation);
    setShowModal(true);
  };

  /* ── submit ticket ── */
  const handleSubmitTicket = () => {
    if (!ticketSubject.trim() || !ticketMessage.trim()) return;
    createTicketMut.mutate({
      subject: ticketSubject,
      message: ticketMessage,
      priority: ticketPriority,
    });
  };

  /* ── format date ── */
  const formatDate = (date: string | Date) => {
    const d = new Date(date);
    return d.toLocaleDateString("mn-MN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  /* ── status helpers ── */
  const statusIcon = (status: string) => {
    switch (status) {
      case "RESOLVED":
      case "CLOSED":
        return <CheckCircle size={12} className="text-t" />;
      case "IN_PROGRESS":
        return <Clock size={12} className="text-[#FFB02E]" />;
      default:
        return <AlertCircle size={12} className="text-[#FF6B9D]" />;
    }
  };

  const statusLabel = (status: string) => {
    switch (status) {
      case "OPEN":
        return (
          <span className="rounded bg-[#FF6B9D]/10 px-1.5 py-0.5 text-[10px] font-medium text-[#FF6B9D]">
            Нээлттэй
          </span>
        );
      case "IN_PROGRESS":
        return (
          <span className="rounded bg-[#FFB02E]/10 px-1.5 py-0.5 text-[10px] font-medium text-[#FFB02E]">
            Шийдвэрлэж буй
          </span>
        );
      case "RESOLVED":
        return (
          <span className="rounded bg-t/10 px-1.5 py-0.5 text-[10px] font-medium text-t">
            Шийдэгдсэн
          </span>
        );
      case "CLOSED":
        return (
          <span className="rounded bg-txt-3/10 px-1.5 py-0.5 text-[10px] font-medium text-txt-3">
            Хаагдсан
          </span>
        );
      default:
        return null;
    }
  };

  const priorityLabel = (p: string) => {
    switch (p) {
      case "URGENT":
        return "Яаралтай";
      case "HIGH":
        return "Өндөр";
      case "MEDIUM":
        return "Дунд";
      case "LOW":
        return "Бага";
      default:
        return p;
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2">
          <h1 className="font-syne text-2xl font-bold tracking-tight text-txt">
            AI Дэмжлэг
          </h1>
          {ticketsQuery.data && ticketsQuery.data.length > 0 && (
            <span className="rounded-md bg-[#FF6B9D]/15 px-2 py-0.5 text-[10px] font-bold text-[#FF6B9D]">
              {ticketsQuery.data.length}
            </span>
          )}
        </div>
        <p className="mt-1 text-[13px] text-txt-3">
          AI-тай чатлах эсвэл тикет үүсгэх
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* ═══ LEFT: AI Chat ═══ */}
        <div className="lg:col-span-3">
          <div className="flex h-[600px] flex-col rounded-2xl border border-white/[0.04] bg-bg-2">
            {/* Chat header */}
            <div className="flex items-center gap-3 border-b border-white/[0.04] p-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-v/10">
                <Bot size={16} className="text-v" />
              </div>
              <div className="flex-1">
                <div className="text-[13px] font-semibold text-txt">
                  Nuul AI Туслах
                </div>
                <div className="flex items-center gap-1 text-[11px] text-t">
                  <span className="h-1.5 w-1.5 rounded-full bg-t" /> Онлайн
                </div>
              </div>
            </div>

            {/* Messages area */}
            <div
              ref={scrollRef}
              className="flex-1 space-y-4 overflow-y-auto p-4"
            >
              {messages.map((msg, i) =>
                msg.role === "ai" ? (
                  <div key={i} className="flex gap-3">
                    <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-v/10 text-[10px] font-bold text-v">
                      AI
                    </div>
                    <div className="max-w-[85%] rounded-2xl rounded-tl-md bg-bg-3 px-4 py-3 text-[13px] leading-relaxed text-txt-2 whitespace-pre-line">
                      {msg.content}
                    </div>
                  </div>
                ) : (
                  <div key={i} className="flex justify-end gap-3">
                    <div className="max-w-[85%] rounded-2xl rounded-tr-md bg-v/20 px-4 py-3 text-[13px] leading-relaxed text-txt whitespace-pre-line">
                      {msg.content}
                    </div>
                    <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-t/10 text-[10px] font-bold text-t">
                      {userInitial}
                    </div>
                  </div>
                )
              )}

              {/* Loading indicator */}
              {isLoading && (
                <div className="flex gap-3">
                  <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-v/10 text-[10px] font-bold text-v">
                    AI
                  </div>
                  <div className="rounded-2xl rounded-tl-md bg-bg-3 px-4 py-3">
                    <div className="flex items-center gap-1">
                      <span className="h-2 w-2 animate-bounce rounded-full bg-v/50 [animation-delay:0ms]" />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-v/50 [animation-delay:150ms]" />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-v/50 [animation-delay:300ms]" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input area */}
            <div className="border-t border-white/[0.04] p-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Асуултаа бичнэ үү..."
                  disabled={isLoading}
                  className="flex-1 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-2.5 text-[13px] text-txt outline-none placeholder:text-txt-3 focus:border-v/30 disabled:opacity-50"
                />
                <button
                  onClick={sendMessage}
                  disabled={isLoading || !input.trim()}
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-v text-white transition-all hover:shadow-[0_0_16px_rgba(108,99,255,0.3)] disabled:opacity-40"
                >
                  {isLoading ? (
                    <Loader2 size={15} className="animate-spin" />
                  ) : (
                    <Send size={15} />
                  )}
                </button>
              </div>

              {/* Create ticket from chat button */}
              {messages.length > 1 && (
                <button
                  onClick={createTicketFromChat}
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] py-2 text-[12px] text-txt-2 transition-all hover:border-v/20 hover:text-v"
                >
                  <TicketIcon size={13} />
                  Тикет үүсгэх
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ═══ RIGHT: Tickets ═══ */}
        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-white/[0.04] bg-bg-2 p-5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-syne text-base font-bold text-txt">
                Тикетүүд
              </h3>
              <button
                onClick={() => {
                  setTicketSubject("");
                  setTicketMessage("");
                  setTicketPriority("MEDIUM");
                  setShowModal(true);
                }}
                className="flex items-center gap-1.5 rounded-lg bg-v/10 px-3 py-1.5 text-[11px] font-medium text-v transition-all hover:bg-v/20"
              >
                <Plus size={12} />
                Шинэ тикет
              </button>
            </div>

            {/* Ticket list */}
            <div className="max-h-[500px] space-y-2 overflow-y-auto">
              {ticketsQuery.isLoading && (
                <div className="flex items-center justify-center py-12">
                  <Loader2
                    size={20}
                    className="animate-spin text-txt-3"
                  />
                </div>
              )}

              {ticketsQuery.data && ticketsQuery.data.length === 0 && (
                <div className="py-12 text-center">
                  <Headphones
                    size={28}
                    className="mx-auto mb-3 text-txt-3/50"
                  />
                  <p className="text-[12px] text-txt-3">
                    Тикет байхгүй байна
                  </p>
                </div>
              )}

              {ticketsQuery.data?.map((ticket) => (
                <div
                  key={ticket.id}
                  className="cursor-pointer rounded-xl border border-white/[0.03] bg-white/[0.01] p-3 transition-all hover:border-v/10"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-v/60">
                      #{ticket.id.slice(-6).toUpperCase()}
                    </span>
                    <div className="flex items-center gap-2">
                      {statusLabel(ticket.status)}
                      {statusIcon(ticket.status)}
                    </div>
                  </div>
                  <div className="mt-1.5 text-[12px] font-medium text-txt">
                    {ticket.subject}
                  </div>
                  <div className="mt-1.5 flex items-center gap-2 text-[10px] text-txt-3">
                    {ticket.aiResolved && (
                      <span className="rounded bg-v/10 px-1.5 py-0.5 font-medium text-v/70">
                        AI шийдсэн
                      </span>
                    )}
                    <span className="rounded bg-white/[0.03] px-1.5 py-0.5">
                      {priorityLabel(ticket.priority)}
                    </span>
                    <span>{formatDate(ticket.createdAt)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ═══ Modal: New Ticket ═══ */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-white/[0.06] bg-bg-2 p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="font-syne text-lg font-bold text-txt">
                Шинэ тикет
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-txt-3 transition-colors hover:bg-white/[0.04] hover:text-txt"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-4">
              {/* Subject */}
              <div>
                <label className="mb-1.5 block text-[12px] font-medium text-txt-2">
                  Гарчиг
                </label>
                <input
                  type="text"
                  value={ticketSubject}
                  onChange={(e) => setTicketSubject(e.target.value)}
                  placeholder="Асуудлын товч тайлбар..."
                  className="w-full rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-2.5 text-[13px] text-txt outline-none placeholder:text-txt-3 focus:border-v/30"
                />
              </div>

              {/* Message */}
              <div>
                <label className="mb-1.5 block text-[12px] font-medium text-txt-2">
                  Дэлгэрэнгүй
                </label>
                <textarea
                  value={ticketMessage}
                  onChange={(e) => setTicketMessage(e.target.value)}
                  placeholder="Асуудлаа дэлгэрэнгүй тайлбарлана уу..."
                  rows={5}
                  className="w-full resize-none rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-2.5 text-[13px] text-txt outline-none placeholder:text-txt-3 focus:border-v/30"
                />
              </div>

              {/* Priority */}
              <div>
                <label className="mb-1.5 block text-[12px] font-medium text-txt-2">
                  Ач холбогдол
                </label>
                <select
                  value={ticketPriority}
                  onChange={(e) =>
                    setTicketPriority(
                      e.target.value as "LOW" | "MEDIUM" | "HIGH" | "URGENT"
                    )
                  }
                  className="w-full rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-2.5 text-[13px] text-txt outline-none focus:border-v/30"
                >
                  <option value="LOW">Бага</option>
                  <option value="MEDIUM">Дунд</option>
                  <option value="HIGH">Өндөр</option>
                  <option value="URGENT">Яаралтай</option>
                </select>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="rounded-xl px-4 py-2 text-[13px] text-txt-3 transition-colors hover:text-txt"
              >
                Болих
              </button>
              <button
                onClick={handleSubmitTicket}
                disabled={
                  createTicketMut.isPending ||
                  !ticketSubject.trim() ||
                  !ticketMessage.trim()
                }
                className="flex items-center gap-2 rounded-xl bg-v px-5 py-2 text-[13px] font-medium text-white transition-all hover:shadow-[0_0_16px_rgba(108,99,255,0.3)] disabled:opacity-40"
              >
                {createTicketMut.isPending && (
                  <Loader2 size={13} className="animate-spin" />
                )}
                Илгээх
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
