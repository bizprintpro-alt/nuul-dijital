import { ScrollReveal } from "@/components/scroll-reveal";
import { Marquee } from "@/components/marquee";
import { DomainSearch } from "@/components/domain-search";
import { FAQ } from "@/components/landing/FAQ";
import { LiquidGlassHero } from "@/components/landing/LiquidGlassHero";
import { ServicesSection } from "@/components/landing/sections/ServicesSection";
import { PricingSection } from "@/components/landing/sections/PricingSection";
import { TestimonialsSection } from "@/components/landing/sections/TestimonialsSection";
import { WhyNuulSection } from "@/components/landing/sections/WhyNuulSection";
import { StepsSection } from "@/components/landing/sections/StepsSection";
import { CTASection } from "@/components/landing/sections/CTASection";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { prisma } from "@/lib/prisma";

async function getHeroSettings() {
  try {
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
  } catch {
    return { videoUrl: undefined, headline: undefined, subheadline: undefined, tag: undefined };
  }
}

export default async function HomePage() {
  const hero = await getHeroSettings();

  return (
    <>
      <LiquidGlassHero
        videoUrl={hero.videoUrl}
        headline={hero.headline}
        subheadline={hero.subheadline}
        tag={hero.tag}
      />

      {/* Mesh BG behind rest of page */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -left-[150px] -top-[200px] h-[700px] w-[700px] animate-drift1 rounded-full bg-[radial-gradient(circle,#7B6FFF22_0%,transparent_65%)]" />
        <div className="absolute -bottom-[150px] -right-[100px] h-[600px] w-[600px] animate-drift2 rounded-full bg-[radial-gradient(circle,#00E5B815_0%,transparent_65%)]" />
      </div>
      <div className="grid-bg" />

      <Marquee />
      <ServicesSection />

      <ScrollReveal>
        <section
          id="domain"
          className="relative z-[2] mx-auto max-w-[900px] px-6 py-24 sm:px-12"
        >
          <DomainSearch />
        </section>
      </ScrollReveal>

      <PricingSection />
      <TestimonialsSection />
      <WhyNuulSection />

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

      <StepsSection />
      <CTASection />
      <PublicFooter />
    </>
  );
}
