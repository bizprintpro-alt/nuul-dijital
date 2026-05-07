import Link from "next/link";
import { ScrollReveal } from "@/components/scroll-reveal";

export function CTASection() {
  return (
    <ScrollReveal>
      <section className="relative z-[2] px-6 py-24 sm:px-12">
        <div className="relative mx-auto max-w-[720px] overflow-hidden rounded-3xl border border-[--bdv] bg-gradient-to-br from-bg-2 to-bg-3 px-8 py-[72px] text-center sm:px-12">
          <div className="absolute left-[10%] right-[10%] top-0 h-0.5 bg-gradient-to-r from-transparent via-v via-50% to-transparent" />
          <div className="pointer-events-none absolute left-[20%] top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,#7B6FFF15,transparent_70%)]" />
          <div className="pointer-events-none absolute right-0 top-1/2 h-[250px] w-[250px] translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,#00E5B812,transparent_70%)]" />

          <h2 className="relative z-10 mb-3.5 font-clash text-5xl font-bold leading-none tracking-tight">
            <span className="text-gradient-v-t">Өнөөдрөөс</span>
            <br />
            эхэлцгээе
          </h2>
          <p className="relative z-10 mb-8 text-[15px] leading-relaxed text-txt-2">
            Бүртгүүлэхэд 2 минут. Кредит карт шаардлагагүй.
            <br />
            Эхний 14 хоног бүрэн үнэгүй.
          </p>
          <div className="relative z-10 flex justify-center gap-3">
            <Link
              href="/contact"
              className="flex items-center gap-2 rounded-xl bg-gradient-to-br from-v to-v-dark px-8 py-3.5 font-cabinet text-[15px] font-bold text-white shadow-[0_0_30px_#7B6FFF40] transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_40px_#7B6FFF50]"
            >
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                <path d="M8 2L14 8L8 14M14 8H2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Үнийн санал авах
            </Link>
            <Link
              href="/services"
              className="rounded-xl border border-[--bdv] bg-bg-3 px-8 py-3.5 font-cabinet text-[15px] font-medium text-txt-2 transition-all hover:border-v hover:bg-bg-4 hover:text-txt"
            >
              Үйлчилгээ үзэх
            </Link>
          </div>
          <div className="relative z-10 mt-5 inline-flex items-center gap-1.5 text-[11px] text-txt-3">
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none" className="text-t">
              <path d="M8 2L9.8 5.6L14 6.3L11 9.2L11.6 13.5L8 11.5L4.4 13.5L5 9.2L2 6.3L6.2 5.6Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
            </svg>
            Нуугдмал төлбөр байхгүй · Хэдийд ч цуцалж болно
          </div>
        </div>
      </section>
    </ScrollReveal>
  );
}
