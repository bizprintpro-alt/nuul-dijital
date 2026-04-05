import { PanelsTopLeft, Eye, Pencil, Plus } from "lucide-react";

const templates = [
  { name: "Бизнес сайт", category: "Корпорат", color: "from-v to-v-dark" },
  { name: "Онлайн дэлгүүр", category: "И-коммерс", color: "from-t to-t-dark" },
  { name: "Портфолио", category: "Хувийн", color: "from-[#FFB02E] to-[#FF8C00]" },
  { name: "Блог", category: "Контент", color: "from-[#FF6B9D] to-[#FF3366]" },
  { name: "Ресторан", category: "F&B", color: "from-v-soft to-v" },
  { name: "Зочид буудал", category: "Аялал", color: "from-t to-v" },
];

export default function WebsiteBuilderPage() {
  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-syne text-2xl font-bold tracking-tight text-txt">Вэбсайт Builder</h1>
          <p className="mt-1 text-[13px] text-txt-3">Drag & drop загварчлал — 10 минутад бэлэн</p>
        </div>
        <button className="flex items-center gap-2 rounded-xl bg-v px-5 py-2.5 text-[13px] font-bold text-white shadow-[0_0_16px_rgba(108,99,255,0.25)] transition-all hover:shadow-[0_0_24px_rgba(108,99,255,0.4)]">
          <Plus size={15} />
          Шинэ вэбсайт
        </button>
      </div>

      {/* Active sites */}
      <div className="mb-8 rounded-2xl border border-white/[0.04] bg-bg-2 p-6">
        <h3 className="mb-4 font-syne text-base font-bold text-txt">Миний вэбсайтууд</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            { name: "MiniShop.mn", url: "miniishop.mn", status: "live" },
            { name: "Company Site", url: "company.com.mn", status: "draft" },
          ].map((site) => (
            <div key={site.name} className="flex items-center justify-between rounded-xl border border-white/[0.04] bg-white/[0.01] p-4">
              <div>
                <div className="text-[13px] font-semibold text-txt">{site.name}</div>
                <div className="text-[11px] text-txt-3">{site.url}</div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                  site.status === "live" ? "bg-t/15 text-t" : "bg-white/[0.06] text-txt-3"
                }`}>
                  {site.status === "live" ? "Live" : "Draft"}
                </span>
                <button className="rounded-lg p-2 text-txt-3 transition-all hover:bg-white/[0.04] hover:text-txt-2">
                  <Pencil size={13} />
                </button>
                <button className="rounded-lg p-2 text-txt-3 transition-all hover:bg-white/[0.04] hover:text-txt-2">
                  <Eye size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Templates */}
      <h3 className="mb-4 font-syne text-base font-bold text-txt">Загварууд (50+)</h3>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {templates.map((t) => (
          <div key={t.name} className="group cursor-pointer overflow-hidden rounded-2xl border border-white/[0.04] bg-bg-2 transition-all hover:border-v/10">
            <div className={`h-36 bg-gradient-to-br ${t.color} opacity-20 transition-opacity group-hover:opacity-30`} />
            <div className="p-4">
              <div className="text-[13px] font-semibold text-txt">{t.name}</div>
              <div className="text-[11px] text-txt-3">{t.category}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
