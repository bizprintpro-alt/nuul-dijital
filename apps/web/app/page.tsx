import Link from "next/link";
import { DomainSearch } from "@/components/domain-search";
import { ScrollReveal } from "@/components/scroll-reveal";
import { Marquee } from "@/components/marquee";
import { FAQ } from "@/components/landing/FAQ";
import { ServiceGrid } from "@/components/landing/ServiceGrid";
import { LiquidGlassHero } from "@/components/landing/LiquidGlassHero";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { prisma } from "@/lib/prisma";

async function getHeroSettings() {
  const rows = await prisma.siteSetting.findMany({
    where: {
      key: { in: ["hero_video_url", "hero_headline", "hero_subheadline", "hero_tag"] },
    },
  });
  const map = Object.fromEntries(rows.map((r) => [r.key, r.value]));
  return {
    videoUrl: map.hero_video_url || undefined,
    headline: map.hero_headline || undefined,
    subheadline: map.hero_subheadline || undefined,
    tag: map.hero_tag || undefined,
  };
}

async function getPricingPlans() {
  return prisma.marketingPlan.findMany({
    where: { isActive: true },
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });
}

const FALLBACK_PRICING_PLANS = [
  {
    id: "fallback-starter",
    name: "Starter",
    price: "₮490,000",
    priceSmall: false,
    description: "Шинээр эхэлж буй бизнест",
    features: [
      "Сарын 8 FB контент",
      "Facebook page удирдлага",
      "1 рекламын кампанит ажил",
      "Сар бүр тайлан",
      "Имэйл дэмжлэг",
    ],
    featured: false,
    btnText: "Санал авах",
    btnLink: "/contact",
  },
  {
    id: "fallback-growth",
    name: "Growth",
    price: "₮1,200,000",
    priceSmall: false,
    description: "Өсөлтөд бэлтгэж буй бизнест",
    features: [
      "Сарын 16 FB + IG контент",
      "Google + Meta Ads удирдлага",
      "AI чатбот суулгах & тохируулах",
      "Сар бүр дэлгэрэнгүй тайлан",
      "Чат + утсаар дэмжлэг",
    ],
    featured: true,
    btnText: "Санал авах",
    btnLink: "/contact",
  },
  {
    id: "fallback-enterprise",
    name: "Enterprise",
    price: "Тохиролцоно",
    priceSmall: true,
    description: "Том брэнд, байгууллагад",
    features: [
      "Бүтэн маркетинг багаар",
      "Вэбсайт + Landing page хийх",
      "Call center + CRM суурилуулах",
      "Стратеги & brand identity",
      "Dedicated account manager",
    ],
    featured: false,
    btnText: "Холбоо барих",
    btnLink: "/contact",
  },
];

/* ── Service data ── */
const services: Array<{
  name: string; desc: string; tag: string; featureKey?: string;
  iconBg: string; iconBorder: string; tagBg: string; tagColor: string; glow: string;
  icon: React.ReactNode;
}> = [
  {
    name: "Дижитал маркетинг",
    desc: "Facebook, Instagram, Google Ads — зорилтот хэрэглэгчид хүргэж борлуулалтыг нэмэгдүүлнэ",
    tag: "ROI 3-5x",
    iconBg: "#7B6FFF18",
    iconBorder: "#7B6FFF25",
    tagBg: "#7B6FFF12",
    tagColor: "#9F98FF",
    glow: "#7B6FFF40",
    icon: (
      <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
        <path d="M2 12L6 8L9 11L14 4" stroke="#7B6FFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M10 4L14 4L14 8" stroke="#7B6FFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    name: "FB контент бүүст",
    desc: "Facebook post, reels, story контент бүтээж зорилтот audience-д хүргэнэ",
    tag: "Сарын багц",
    iconBg: "#00E5B815",
    iconBorder: "#00E5B825",
    tagBg: "#00E5B812",
    tagColor: "#00E5B8",
    glow: "#00E5B840",
    icon: (
      <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
        <path d="M10 2L13 2L13 5" stroke="#00E5B8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M13 2L8 7" stroke="#00E5B8" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M6 4L3 4C2.4 4 2 4.4 2 5L2 13C2 13.6 2.4 14 3 14L11 14C11.6 14 12 13.6 12 13L12 10" stroke="#00E5B8" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    name: "Вэбсайт хийх",
    featureKey: "feature_website_builder",
    desc: "Таны бизнест тохирсон мэргэжлийн вэбсайтыг загвартайгаар хийж өгнө",
    tag: "Загвар 50+",
    iconBg: "#FFB02E18",
    iconBorder: "#FFB02E25",
    tagBg: "#FFB02E12",
    tagColor: "#FFB02E",
    glow: "#FFB02E40",
    icon: (
      <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
        <rect x="2" y="3" width="12" height="8" rx="1.5" stroke="#FFB02E" strokeWidth="1.3" />
        <line x1="5" y1="13" x2="11" y2="13" stroke="#FFB02E" strokeWidth="1.5" />
        <line x1="8" y1="11" x2="8" y2="13" stroke="#FFB02E" strokeWidth="1.3" />
      </svg>
    ),
  },
  {
    name: "AI Чатбот",
    featureKey: "feature_chatbot",
    desc: "Монгол хэлтэй AI. Facebook, вэбсайт, Viber-д зэрэг ажиллаж харилцагчидтай харилцана",
    tag: "94% автомат",
    iconBg: "#9F98FF18",
    iconBorder: "#9F98FF25",
    tagBg: "#9F98FF12",
    tagColor: "#9F98FF",
    glow: "#9F98FF40",
    icon: (
      <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
        <path d="M3 11L2 14L5.5 12.5C6.2 13.1 7 13.5 8 13.5C11.1 13.5 13.5 11.4 13.5 8.8C13.5 6.2 11.1 4 8 4C4.9 4 2.5 6.2 2.5 8.8C2.5 9.6 2.7 10.4 3 11Z" stroke="#9F98FF" strokeWidth="1.3" />
      </svg>
    ),
  },
  {
    name: "Домэйн & Хост",
    featureKey: "feature_domain",
    desc: ".mn .com .org хаягаа хайж олоод минутын дотор идэвхжүүл",
    tag: ".mn ₮165,000/жил",
    iconBg: "#7B6FFF18",
    iconBorder: "#7B6FFF25",
    tagBg: "#7B6FFF12",
    tagColor: "#9F98FF",
    glow: "#7B6FFF40",
    icon: (
      <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="5.5" stroke="#7B6FFF" strokeWidth="1.3" />
        <ellipse cx="8" cy="8" rx="2.5" ry="5.5" stroke="#7B6FFF" strokeWidth="1.1" />
        <line x1="2.5" y1="8" x2="13.5" y2="8" stroke="#7B6FFF" strokeWidth="1.1" />
      </svg>
    ),
  },
  {
    name: "CRM Pipeline",
    featureKey: "feature_crm",
    desc: "Харилцагчийн мэдээлэл, борлуулалтын дарааллыг нэг дороос хянах",
    tag: "Kanban + List",
    iconBg: "#FF6B9D18",
    iconBorder: "#FF6B9D25",
    tagBg: "#FF6B9D12",
    tagColor: "#FF6B9D",
    glow: "#FF6B9D40",
    icon: (
      <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
        <circle cx="5.5" cy="5" r="2.5" stroke="#FF6B9D" strokeWidth="1.3" />
        <path d="M1.5 13C1.5 10.8 3.3 9 5.5 9" stroke="#FF6B9D" strokeWidth="1.3" />
        <path d="M11 8L13 10L15 7" stroke="#FF6B9D" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    name: "Call Center",
    featureKey: "feature_call_center",
    desc: "Callpro AI технологитой. Хоногийн 24 цаг автомат хариулт",
    tag: "24/7 · AI",
    iconBg: "#9F98FF18",
    iconBorder: "#9F98FF25",
    tagBg: "#9F98FF12",
    tagColor: "#9F98FF",
    glow: "#9F98FF40",
    icon: (
      <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
        <path d="M4 2.5C4 2.5 2.5 4 2.5 6.5C2.5 10.5 5.5 13.5 9.5 13.5C12 13.5 13.5 12 13.5 12L11.5 10L9.5 11.5C9.5 11.5 7 9.5 4.5 6.5L6 4.5Z" stroke="#9F98FF" strokeWidth="1.3" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    name: "eSeller",
    featureKey: "feature_eseller",
    desc: "QPay & SocialPay интегратэй. Захиалга хүлээн авч автомат идэвхжүүл",
    tag: "98.7% автомат",
    iconBg: "#00E5B815",
    iconBorder: "#00E5B825",
    tagBg: "#00E5B812",
    tagColor: "#00E5B8",
    glow: "#00E5B840",
    icon: (
      <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
        <circle cx="6" cy="12" r="1.2" fill="#00E5B8" />
        <circle cx="12" cy="12" r="1.2" fill="#00E5B8" />
        <path d="M2 3L4 3L5.5 9L12.5 9L14 5L5 5" stroke="#00E5B8" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

const testimonials = [
  {
    text: "10 минутад вэбсайтаа бэлэн болголоо. Домэйноосоо чатбот хүртэл нэг дороос шийдсэн нь маш хялбар байлаа. Өмнө нь ингэж хялбар байх юм гэж бодоогүй.",
    name: "Батбаяр Д.",
    role: "Кофе шоп эзэн",
    avatar: "Б",
    avBg: "#7B6FFF22",
    avColor: "#A89FFF",
    avBorder: "#7B6FFF30",
  },
  {
    text: "Өмнө нь 3 компанид төлж байсан. Nuul нэг төлбөрт бүгдийг оруулж өгсөн. Сарын зардал 40% буурсан. Хамгийн сайн шийдвэрүүдийн нэг болсон.",
    name: "Номин Г.",
    role: "Онлайн дэлгүүр",
    avatar: "Н",
    avBg: "#00E5B815",
    avColor: "#00E5B8",
    avBorder: "#00E5B825",
  },
  {
    text: "AI чатбот маань 24/7 хариулж байна. Ажилтангүйгээр хоногт 50+ хэрэглэгчтэй харилцдаг болсон. Орлого 30% өссөн.",
    name: "Энхбаяр С.",
    role: "Маркетинг агентла��",
    avatar: "Э",
    avBg: "#FFB02E18",
    avColor: "#FFB02E",
    avBorder: "#FFB02E25",
  },
];

export default async function HomePage() {
  const heroSettings = await getHeroSettings().catch(() => ({
    videoUrl: undefined,
    headline: undefined,
    subheadline: undefined,
    tag: undefined,
  }));

  const dbPlans = await getPricingPlans().catch(() => []);
  const pricingPlans = dbPlans.length > 0 ? dbPlans : FALLBACK_PRICING_PLANS;

  return (
    <>
      {/* ── HERO (Liquid Glass with video bg) ── */}
      <LiquidGlassHero
        videoUrl={heroSettings.videoUrl}
        headline={heroSettings.headline}
        subheadline={heroSettings.subheadline}
        tag={heroSettings.tag}
      />

      {/* ── Mesh BG (behind rest of page) ── */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -left-[150px] -top-[200px] h-[700px] w-[700px] animate-drift1 rounded-full bg-[radial-gradient(circle,#7B6FFF22_0%,transparent_65%)]" />
        <div className="absolute -bottom-[150px] -right-[100px] h-[600px] w-[600px] animate-drift2 rounded-full bg-[radial-gradient(circle,#00E5B815_0%,transparent_65%)]" />
      </div>
      <div className="grid-bg" />

      {/* ── MARQUEE ── */}
      <Marquee />

      {/* ── SERVICES ── */}
      <ScrollReveal>
        <section id="svc" className="relative z-[2] px-6 py-24 sm:px-12">
          <div className="mb-3 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.12em] text-v">
            <span className="inline-block h-px w-6 bg-v" />
            Үйлчилгээ
          </div>
          <h2 className="mb-3 font-clash text-[clamp(32px,4vw,48px)] font-bold leading-tight tracking-tight">
            Нэг платформ.
            <br />
            Бүх зүйл.
          </h2>
          <p className="mb-14 max-w-[500px] text-[15px] leading-relaxed text-txt-2">
            Өрсөлдөгчдийнх шиг 3 өөр компанид төлж, 3 өөр хаяг санах хэрэггүй.
          </p>

          <ServiceGrid services={services} />
        </section>
      </ScrollReveal>

      {/* ── DOMAIN SEARCH ── */}
      <ScrollReveal>
        <section
          id="domain"
          className="relative z-[2] mx-auto max-w-[900px] px-6 py-24 sm:px-12"
        >
          <DomainSearch />
        </section>
      </ScrollReveal>

      {/* ── PRICING ── */}
      <ScrollReveal>
        <section id="price" className="relative z-[2] px-6 py-24 sm:px-12">
          <div className="mb-3 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.12em] text-v">
            <span className="inline-block h-px w-6 bg-v" />
            Үнэ
          </div>
          <h2 className="mb-3 font-clash text-[clamp(32px,4vw,48px)] font-bold leading-tight tracking-tight">
            Шударга. Нэг үнэ.
            <br />
            Нуугдмал зардал үгүй.
          </h2>
          <p className="mb-14 max-w-[500px] text-[15px] leading-relaxed text-txt-2">
            Хэдийд ч цуцалж болно. Кредит карт шаардлагагүй.
          </p>

          <div className="grid items-start gap-4 md:grid-cols-3">
            {pricingPlans.map((plan) => (
              <div
                key={plan.id}
                className={`relative overflow-hidden rounded-2xl border p-8 transition-all hover:-translate-y-1 ${
                  plan.featured
                    ? "border-[--bdv] bg-gradient-to-br from-bg-3 to-bg-4 shadow-[0_0_40px_#7B6FFF18] hover:-translate-y-1.5 hover:shadow-[0_12px_50px_#7B6FFF25]"
                    : "border-[--bd] bg-bg-2"
                }`}
              >
                {plan.featured && (
                  <>
                    <div className="absolute left-[10%] right-[10%] top-0 h-0.5 bg-gradient-to-r from-transparent via-v to-transparent" />
                    <div className="mb-4 inline-block rounded-[5px] border border-[#7B6FFF25] bg-[#7B6FFF18] px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.1em] text-v-soft">
                      Хамгийн их сонгогддог
                    </div>
                  </>
                )}
                <div className="mb-2 font-clash text-xl font-semibold tracking-tight">
                  {plan.name}
                </div>
                <div
                  className={`text-gradient-txt-vg mb-1 font-clash font-bold tracking-tight ${
                    plan.priceSmall
                      ? "mt-1.5 text-[22px]"
                      : "text-[38px] tracking-[-2px]"
                  }`}
                >
                  {plan.price}
                  {!plan.priceSmall && (
                    <span className="font-cabinet text-sm font-normal text-txt-2">
                      /сар
                    </span>
                  )}
                </div>
                <div className="mb-6 text-xs text-txt-3">{plan.description}</div>
                <div className="mb-5 h-px bg-gradient-to-r from-transparent via-[--bdv] to-transparent" />
                <div className="mb-6 flex flex-col gap-2.5">
                  {plan.features.map((f) => (
                    <div
                      key={f}
                      className="flex items-center gap-2 text-xs text-txt-2"
                    >
                      <div className="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-[5px] border border-[#00E5B830] bg-[#00E5B815]">
                        <svg width="9" height="9" viewBox="0 0 8 8">
                          <polyline
                            points="1,4 3,6 7,2"
                            fill="none"
                            stroke="#00E5B8"
                            strokeWidth="1.5"
                          />
                        </svg>
                      </div>
                      {f}
                    </div>
                  ))}
                </div>
                <Link
                  href={plan.btnLink}
                  className={`block w-full rounded-[10px] py-3 text-center font-cabinet text-[13px] font-bold transition-all ${
                    plan.featured
                      ? "bg-gradient-to-br from-v to-v-dark text-white shadow-[0_0_20px_#7B6FFF30] hover:-translate-y-0.5 hover:shadow-[0_0_30px_#7B6FFF50]"
                      : "border border-[--bdv] bg-transparent text-v-soft hover:border-v hover:bg-[#7B6FFF0D]"
                  }`}
                >
                  {plan.btnText}
                </Link>
              </div>
            ))}
          </div>
        </section>
      </ScrollReveal>

      {/* ── TESTIMONIALS ── */}
      <ScrollReveal>
        <section id="testi" className="relative z-[2] px-6 py-24 sm:px-12">
          <div className="mb-3 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.12em] text-v">
            <span className="inline-block h-px w-6 bg-v" />
            Харилцагчид
          </div>
          <h2 className="mb-10 font-clash text-[clamp(32px,4vw,48px)] font-bold leading-tight tracking-tight">
            Тэд Nuul-ийг ашиглаж байна
          </h2>

          <div className="grid gap-4 md:grid-cols-3">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="group relative overflow-hidden rounded-2xl border border-[--bd] bg-bg-2 p-7 transition-all hover:-translate-y-0.5 hover:border-[--bdv]"
              >
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[--bdv] to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                {/* Stars */}
                <div className="mb-3.5 flex gap-1">
                  {Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <div
                        key={i}
                        className="h-3 w-3 rounded-[3px] bg-gradient-to-br from-t to-t-dark"
                      />
                    ))}
                </div>
                <div className="mb-3 font-serif text-3xl leading-none text-[--bdv]">
                  &ldquo;
                </div>
                <p className="mb-5 text-[13px] leading-relaxed text-txt-2">
                  {t.text}
                </p>
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-[34px] w-[34px] flex-shrink-0 items-center justify-center rounded-full border text-xs font-bold"
                    style={{
                      background: t.avBg,
                      color: t.avColor,
                      borderColor: t.avBorder,
                    }}
                  >
                    {t.avatar}
                  </div>
                  <div>
                    <div className="text-[13px] font-semibold">{t.name}</div>
                    <div className="text-[11px] text-txt-3">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </ScrollReveal>

      {/* ── WHY NUUL.MN ── */}
      <ScrollReveal>
        <section className="relative z-[2] px-6 py-24 sm:px-12">
          <div className="mb-3 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.12em] text-v">
            <span className="inline-block h-px w-6 bg-v" />
            Бидний онцлог
          </div>
          <h2 className="mb-3 font-syne text-[clamp(32px,4vw,48px)] font-bold leading-tight tracking-tight">
            Яагаад Nuul.mn?
          </h2>
          <p className="mb-14 max-w-[560px] text-[15px] leading-relaxed text-txt-2">
            Бизнесээ дижитал ертөнцөд нээх хамгийн хялбар зам
          </p>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: "Бүх зүйл нэг газар",
                desc: "Вэбсайт, чатбот, дижитал маркетинг, FB контент — бизнесээ өсгөх бүх хэрэгсэл нэг платформоос",
                icon: (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
                  </svg>
                ),
              },
              {
                title: "Минутын дотор нээгдэнэ",
                desc: "Бүртгэлээс эхлээд домэйн, хостинг идэвхжүүлэх хүртэл автомат. Хүлээх, залгах шаардлагагүй",
                icon: (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                  </svg>
                ),
              },
              {
                title: "Монгол хэлээр 24/7",
                desc: "AI туслах болон жинхэнэ хүмүүс Монгол хэлээр 24 цаг дэмжиж, асуулт бүрт хариулна",
                icon: (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                  </svg>
                ),
              },
              {
                title: "Ил тод үнэ",
                desc: "Нуугдмал төлбөргүй. Юунд төлж буйгаа таньж, хэдийд ч үнийн багцаа өөрчилнө",
                icon: (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                ),
              },
            ].map((f) => (
              <div
                key={f.title}
                className="group rounded-2xl border border-white/[0.04] bg-bg-2/60 p-6 transition-all hover:border-v/30 hover:bg-bg-2"
              >
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-v/10 text-v transition-colors group-hover:bg-v/15">
                  {f.icon}
                </div>
                <h3 className="mb-2 font-syne text-[17px] font-bold tracking-tight text-txt">
                  {f.title}
                </h3>
                <p className="text-[13px] leading-relaxed text-txt-2">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </section>
      </ScrollReveal>

      {/* ── FAQ ── */}
      <ScrollReveal>
        <section className="relative z-[2] px-6 py-24 sm:px-12">
          <div className="mb-3 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.12em] text-v">
            <span className="inline-block h-px w-6 bg-v" />
            Асуулт & Хариулт
          </div>
          <h2 className="mb-10 font-syne text-[clamp(32px,4vw,48px)] font-bold">
            Түгээмэл асуултууд
          </h2>
          <div className="mx-auto max-w-[760px]">
            <FAQ />
          </div>
        </section>
      </ScrollReveal>

      {/* ── STEPS ── */}
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
            {[
              { step: "01", title: "Бүртгүүлэх", desc: "Имэйл, утасны дугаараар 2 минутад бүртгэл хийнэ." },
              { step: "02", title: "Домэйн хайх", desc: "Хүссэн .mn, .com, .org домэйнээ хайж шалгана." },
              { step: "03", title: "Хостинг сонгох", desc: "Starter, Business, Enterprise багцаас сонгоно." },
              { step: "04", title: "Вэбсайт бэлэн!", desc: "Загвар сонгоод drag & drop-оор сайтаа бэлдэнэ." },
            ].map((item, i) => (
              <div key={item.step} className="group relative flex flex-col items-center text-center">
                {/* Arrow between steps */}
                {i < 3 && (
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

      {/* ── CTA SECTION ── */}
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

      {/* ── FOOTER ── */}
      <PublicFooter />
    </>
  );
}
