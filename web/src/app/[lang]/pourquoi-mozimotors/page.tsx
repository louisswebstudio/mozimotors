/**
 * /pourquoi-mozimotors — Boxcars /about layout, MoziMotors content.
 * Spec: docs/research/boxcars-framer-website-cd8da657/inner-pages/pourquoi-contact.spec.md
 */
import type { Metadata } from "next";
import Image from "next/image";
import { CountUp } from "@/components/count-up";
import { BadgeCheck, Car, FileCheck2, Landmark, ShieldCheck, Wallet, X } from "lucide-react";
import { getCars, getTestimonials } from "@/lib/wp";
import { getI18n } from "@/i18n/server";
import { localeAlternates } from "@/i18n/seo";
import { Eyebrow, H3 } from "@/components/sites/boxcars-framer-website-cd8da657/root-8a5edab2/ui";
import { Card, PageIntro, PageSheet } from "@/components/sites/boxcars-framer-website-cd8da657/shared/page";
import { ASSETS, Container, SECTION_Y, SectionHead } from "@/components/sites/boxcars-framer-website-cd8da657/root-8a5edab2/ui";
import { Reveal } from "@/components/sites/boxcars-framer-website-cd8da657/root-8a5edab2/reveal";
import type { StatData } from "@/components/sites/boxcars-framer-website-cd8da657/root-8a5edab2/content";
import { HowItWorks } from "@/components/sites/boxcars-framer-website-cd8da657/root-8a5edab2/HowItWorks";
import { Stats } from "@/components/sites/boxcars-framer-website-cd8da657/root-8a5edab2/Stats";
import { ReviewsMarquee } from "@/components/sites/boxcars-framer-website-cd8da657/root-8a5edab2/ReviewsMarquee";
import { CtaBanner } from "@/components/sites/boxcars-framer-website-cd8da657/root-8a5edab2/CtaBanner";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t.why.metaTitle, description: t.why.metaDescription, alternates: await localeAlternates("/pourquoi-mozimotors") };
}

/** MoziMotors vs classifieds, index-aligned with t.why.compare. */
const COMPARE: [boolean, boolean][] = [
  [true, false], [true, false], [true, false], [true, false], [true, false], [true, false], [true, false],
];

function Mark({ ok, yes, no }: { ok: boolean; yes: string; no: string }) {
  return ok ? (
    <BadgeCheck className="size-5 text-bx-blue" strokeWidth={1.5} aria-label={yes} />
  ) : (
    <X className="size-[18px] text-bx-muted" strokeWidth={1.5} aria-label={no} />
  );
}

const IMG = `${ASSETS}/images`;

function Mosaic({ statLabel, alts }: { statLabel: string; alts: string[] }) {
  const tile = "relative overflow-hidden rounded-2xl";
  const sizes = "(min-width:810px) 25vw, 50vw";
  return (
    <Reveal
      y={24}
      className="grid grid-flow-row-dense auto-rows-[160px] grid-cols-2 gap-2.5 bxt:h-[470px] bxt:auto-rows-auto bxt:grid-cols-4 bxt:grid-rows-2"
    >
      <div className="flex flex-col items-center justify-center gap-1 rounded-2xl bg-bx-blue p-5 text-center text-white">
        <span className="text-[40px] font-bold leading-none bxd:text-[52px]"><CountUp value="140+" /></span>
        <span className="text-lg leading-[1.3]">{statLabel}</span>
      </div>
      <div className={`${tile} row-span-2 bxt:col-start-2 bxt:row-start-1`}>
        <Image src={`${IMG}/step-1.jpg`} alt={alts[0]} fill preload sizes={sizes} className="bx-parallax object-cover" />
      </div>
      <div className={`${tile} col-span-2 bxt:col-start-3 bxt:row-start-1`}>
        <Image src={`${IMG}/step-3.jpg`} alt={alts[1]} fill sizes="(min-width:810px) 50vw, 100vw" className="bx-parallax object-cover" />
      </div>
      <div className={`${tile} bxt:col-start-1 bxt:row-start-2`}>
        <Image src={`${IMG}/buy-couple.jpg`} alt="" fill sizes={sizes} className="bx-parallax object-cover" />
      </div>
      <div className={`${tile} bxt:col-start-3 bxt:row-start-2`}>
        <Image src={`${IMG}/step-4.jpg`} alt="" fill sizes={sizes} className="bx-parallax object-cover" />
      </div>
      <div className={`${tile} bxt:col-start-4 bxt:row-start-2`}>
        <Image src={`${IMG}/blog-2.jpg`} alt="" fill sizes={sizes} className="bx-parallax object-cover" />
      </div>
    </Reveal>
  );
}

export default async function WhyPage() {
  const [cars, testimonials, { t }] = await Promise.all([getCars(), getTestimonials(), getI18n()]);

  const stats: StatData[] = [
    { value: 140, suffix: "+", label: t.stats.inspection },
    { value: 4.8, decimals: 1, star: true, label: t.stats.rating },
    { value: 24, suffix: "h", label: t.stats.offer },
    { value: cars.length, suffix: "+", label: t.stats.stock },
  ];

  return (
    <PageSheet>
      <PageIntro eyebrow={t.why.eyebrow} title={t.why.title} lead={t.why.lead} text={<p>{t.why.text}</p>}>
        <Mosaic statLabel={t.why.statLabel} alts={t.why.mosaicAlt} />
      </PageIntro>

      <section className={`bg-white ${SECTION_Y}`}>
        <Container className="flex flex-col gap-10">
          <SectionHead eyebrow={t.why.labelEyebrow} title={t.why.labelTitle} />
          <div className="grid grid-cols-1 gap-5 bxt:grid-cols-3">
            {t.why.pillars.map(({ v, t: title, d }, i) => (
              <Reveal key={title} y={24} delay={i * 0.1} className="flex flex-col gap-2.5 rounded-2xl bg-bx-navy p-[30px] text-white">
                <span className="text-[44px] font-bold leading-[52px]">{v}</span>
                <h3 className="text-xl font-medium leading-[1.3]">{title}</h3>
                <p className="text-[15px] leading-6 text-white/70">{d}</p>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className={`bg-white ${SECTION_Y}`}>
        <Container className="flex flex-col gap-10">
          <SectionHead eyebrow={t.why.inspectionEyebrow} title={t.why.inspectionTitle} />
          <div className="grid grid-cols-1 gap-5 bxt:grid-cols-2 bxd:grid-cols-3">
            {t.why.inspection.map(({ t: title, d }, i) => (
              <Reveal key={title} y={24} delay={(i % 3) * 0.1} className="flex flex-col gap-2.5 bx-lift rounded-2xl bg-bx-soft p-[30px] hover:shadow-[0_16px_32px_-20px_rgba(5,11,32,0.4)]">
                <span className="text-[40px] font-bold leading-[52px] text-bx-blue">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="text-xl font-medium leading-[1.3] text-bx-navy">{title}</h3>
                <p className="text-[15px] leading-6 text-bx-ink">{d}</p>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-white">
        <Container>
          <div className="grid gap-10 rounded-2xl bg-bx-lavender p-[30px] bxt:grid-cols-2 bxt:items-center bxt:gap-[60px] bxt:p-[60px]">
            <Reveal y={24} className="flex flex-col gap-[15px]">
              <Eyebrow>{t.why.adminEyebrow}</Eyebrow>
              <h3 className={`${H3} text-bx-navy`}>{t.why.adminTitle}</h3>
              <p className="text-[15px] leading-6 text-bx-ink">{t.why.adminText}</p>
            </Reveal>
            <ul className="flex flex-col gap-3">
              {t.why.adminBullets.map((b, i) => {
                const Icon = [ShieldCheck, FileCheck2, Landmark][i] ?? BadgeCheck;
                return (
                  <Reveal key={b} y={20} delay={i * 0.1}>
                    <li className="flex items-center gap-4 rounded-2xl bg-white p-5">
                      <span className="grid size-[46px] shrink-0 place-items-center rounded-xl bg-bx-navy text-white">
                        <Icon size={22} strokeWidth={1.5} aria-hidden />
                      </span>
                      <span className="text-[15px] font-medium leading-6 text-bx-navy">{b}</span>
                    </li>
                  </Reveal>
                );
              })}
            </ul>
          </div>
        </Container>
      </section>

      <section className={`bg-white ${SECTION_Y}`}>
        <Container className="flex flex-col gap-10">
          <SectionHead eyebrow={t.why.supportEyebrow} title={t.why.supportTitle} />
          <div className="grid grid-cols-1 gap-5 bxt:grid-cols-3">
            {t.why.support.map(({ t: title, d }, i) => (
              <Reveal key={title} y={24} delay={i * 0.1} className="flex flex-col gap-2.5 rounded-2xl bg-bx-soft p-[30px]">
                <span className="text-[40px] font-bold leading-[52px] text-bx-blue">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="text-xl font-medium leading-[1.3] text-bx-navy">{title}</h3>
                <p className="text-[15px] leading-6 text-bx-ink">{d}</p>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className={`bg-bx-soft ${SECTION_Y}`}>
        <Container className="flex flex-col gap-10">
          <SectionHead eyebrow={t.why.perksEyebrow} title={t.why.perksTitle} />
          <div className="grid grid-cols-1 gap-5 bxt:grid-cols-2">
            {t.why.perks.map(({ t: title, d }, i) => (
              <Reveal key={title} y={24} delay={i * 0.1} className="flex flex-col gap-5 rounded-2xl bg-white p-[30px] bxt:p-10">
                <span className="grid size-14 place-items-center rounded-2xl bg-bx-blue text-white">
                  {i === 0 ? <Car size={26} strokeWidth={1.5} aria-hidden /> : <Wallet size={26} strokeWidth={1.5} aria-hidden />}
                </span>
                <div className="flex flex-col gap-2.5">
                  <h3 className="text-xl font-medium leading-[1.3] text-bx-navy">{title}</h3>
                  <p className="text-[15px] leading-6 text-bx-ink">{d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <HowItWorks />

      <section className={`bg-white ${SECTION_Y}`}>
        <Container className="flex flex-col gap-10">
          <SectionHead eyebrow={t.why.compareEyebrow} title={t.why.compareTitle} />
          <Reveal y={24}>
            <Card className="overflow-hidden">
              <div className="grid grid-cols-[1fr_96px_96px] bg-bx-navy px-5 py-[15px] text-[15px] font-medium leading-6 text-white bxt:grid-cols-[1fr_160px_160px]">
                <span />
                <span className="text-center">MoziMotors</span>
                <span className="text-center text-white/60">{t.why.compareThem}</span>
              </div>
              {t.why.compare.map((label, i) => (
                <div
                  key={label}
                  className="grid grid-cols-[1fr_96px_96px] items-center border-b border-bx-line px-5 py-[15px] text-[15px] leading-6 text-bx-ink last:border-0 bxt:grid-cols-[1fr_160px_160px]"
                >
                  <span>{label}</span>
                  <span className="flex justify-center"><Mark ok={COMPARE[i][0]} yes={t.car.yes} no={t.car.no} /></span>
                  <span className="flex justify-center"><Mark ok={COMPARE[i][1]} yes={t.car.yes} no={t.car.no} /></span>
                </div>
              ))}
            </Card>
          </Reveal>
        </Container>
      </section>

      <Stats stats={stats} />
      <ReviewsMarquee testimonials={testimonials} />
      <div className="py-[30px] bxt:py-[60px] bxd:py-[90px]">
        <CtaBanner />
      </div>
    </PageSheet>
  );
}
