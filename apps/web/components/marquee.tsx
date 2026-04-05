const items = [
  { label: "Домэйн", sub: "Хайлт & Захиалга" },
  { label: "AI Чатбот", sub: "Монгол хэлтэй" },
  { label: "CRM Pipeline", sub: "Борлуулалт" },
  { label: "Call Center", sub: "24/7 дэмжлэг" },
  { label: "QPay & SocialPay", sub: "Интеграц" },
  { label: "Вэбсайт Builder", sub: "10 минутад" },
  { label: "eSeller", sub: "Автомат захиалга" },
  { label: "И-мэйл", sub: "Маркетинг" },
];

export function Marquee() {
  const doubled = [...items, ...items];

  return (
    <div className="relative z-[2] overflow-hidden border-y border-[--bdv] bg-gradient-to-r from-[#7B6FFF06] to-transparent py-4">
      <div className="flex animate-marquee whitespace-nowrap">
        {doubled.map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-3 px-8 text-xs font-medium uppercase tracking-[0.06em] text-txt-3"
          >
            <span className="h-1 w-1 rounded-full bg-v" />
            <span className="text-v-soft">{item.label}</span>
            {item.sub}
          </span>
        ))}
      </div>
    </div>
  );
}
