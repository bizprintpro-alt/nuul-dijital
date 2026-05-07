import { ScrollReveal } from "@/components/scroll-reveal";

const steps = [
  { step: "01", title: "Бүртгүүлэх", desc: "Имэйл, утасны дугаараар 2 минутад бүртгэл хийнэ." },
  { step: "02", title: "Домэйн хайх", desc: "Хүссэн .mn, .com, .org домэйнээ хайж шалгана." },
  { step: "03", title: "Хостинг сонгох", desc: "Starter, Business, Enterprise багцаас сонгоно." },
  { step: "04", title: "Вэбсайт бэлэн!", desc: "Загвар сонгоод drag & drop-оор сайтаа бэлдэнэ." },
];

export function StepsSection() {
  return (
    <ScrollReveal>
      <section className="relative z-[2] px-6 py-24 sm:px-12">
        <div className="mb-3 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.12em] text-v">
          <span className="inline-block h-px w-6 bg-v" />
          Хэрхэн эхлэх вэ
        </div>
        <h2 className="mb-14 font-syne text-[clamp(32px,4vw,48px)] font-bold leading-tight tracking-tight">
          Хэдхэн минутад эхлэх
        </h2>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((item, i) => (
            <div key={item.step} className="group relative flex flex-col items-center text-center">
              {i < steps.length - 1 && (
                <div className="pointer-events-none absolute -right-3 top-8 z-10 hidden text-txt-3/30 lg:block">
                  <svg width="24" height="24" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              )}
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-[--bdv] bg-bg-2 font-syne text-xl font-bold text-v transition-all group-hover:border-v group-hover:shadow-[0_0_24px_#7B6FFF30]">
                {item.step}
              </div>
              <h3 className="mb-2 font-syne text-lg font-semibold tracking-tight">{item.title}</h3>
              <p className="max-w-[200px] text-[13px] leading-relaxed text-txt-2">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </ScrollReveal>
  );
}
