"use client";

import { Bot, MessageSquare, Facebook, Globe, Plus, BarChart3 } from "lucide-react";

const chatbots = [
  { name: "Борлуулалтын бот", platform: "Facebook", messages: 1247, autoRate: 94, active: true },
  { name: "Вэбсайт тусламж", platform: "Web", messages: 856, autoRate: 89, active: true },
  { name: "Viber бот", platform: "Viber", messages: 238, autoRate: 78, active: false },
];

export default function ChatbotPage() {
  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-syne text-2xl font-bold tracking-tight text-txt">AI Чатбот Builder</h1>
            <span className="rounded-md bg-v/15 px-2 py-0.5 text-[10px] font-bold text-v-soft">AI</span>
          </div>
          <p className="mt-1 text-[13px] text-txt-3">Монгол хэлтэй AI чатбот — Facebook, вэбсайт, Viber</p>
        </div>
        <button className="flex items-center gap-2 rounded-xl bg-v px-5 py-2.5 text-[13px] font-bold text-white shadow-[0_0_16px_rgba(108,99,255,0.25)]">
          <Plus size={15} />
          Шинэ чатбот
        </button>
      </div>

      {/* Stats */}
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        {[
          { label: "Нийт хариулт", value: "2,341", icon: MessageSquare, color: "text-v", bg: "bg-v/10" },
          { label: "Автомат хариулт", value: "94%", icon: Bot, color: "text-t", bg: "bg-t/10" },
          { label: "Идэвхтэй бот", value: "2", icon: BarChart3, color: "text-[#FFB02E]", bg: "bg-[#FFB02E]/10" },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="rounded-2xl border border-white/[0.04] bg-bg-2 p-5">
              <div className={`mb-3 flex h-9 w-9 items-center justify-center rounded-lg ${s.bg}`}>
                <Icon size={16} className={s.color} />
              </div>
              <div className="font-syne text-xl font-bold text-txt">{s.value}</div>
              <div className="text-[11px] text-txt-3">{s.label}</div>
            </div>
          );
        })}
      </div>

      {/* Chatbot list */}
      <div className="rounded-2xl border border-white/[0.04] bg-bg-2 p-6">
        <h3 className="mb-4 font-syne text-base font-bold text-txt">Миний чатботууд</h3>
        <div className="space-y-3">
          {chatbots.map((bot) => (
            <div key={bot.name} className="flex items-center justify-between rounded-xl border border-white/[0.04] bg-white/[0.01] p-4 transition-all hover:border-v/10">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-v/10">
                  {bot.platform === "Facebook" ? <Facebook size={18} className="text-[#1877F2]" /> :
                   bot.platform === "Web" ? <Globe size={18} className="text-t" /> :
                   <MessageSquare size={18} className="text-v" />}
                </div>
                <div>
                  <div className="text-[13px] font-semibold text-txt">{bot.name}</div>
                  <div className="text-[11px] text-txt-3">{bot.platform} · {bot.messages.toLocaleString()} хариулт</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-[13px] font-bold text-t">{bot.autoRate}%</div>
                  <div className="text-[10px] text-txt-3">автомат</div>
                </div>
                <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                  bot.active ? "bg-t/15 text-t" : "bg-white/[0.06] text-txt-3"
                }`}>
                  {bot.active ? "Идэвхтэй" : "Зогссон"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
