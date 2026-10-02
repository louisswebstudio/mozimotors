import type { Metadata } from "next";
import Image from "next/image";
import {
  BadgeCheck, Banknote, Car, ClipboardCheck, Clock, FileText, Gauge, Home, KeyRound, MapPin, ScanSearch, ShieldCheck, Store, Timer, Wallet, Wrench,
} from "lucide-react";
import { CountUp } from "@/components/count-up";
import { SellStart } from "@/components/sell-start";
import { getSettings } from "@/lib/wp";
import { getI18n } from "@/i18n/server";
import { localeAlternates } from "@/i18n/seo";
import { FaqList } from "@/components/sites/boxcars-framer-website-cd8da657/root-8a5edab2/FaqList";
import { Reveal } from "@/components/sites/boxcars-framer-website-cd8da657/root-8a5edab2/reveal";
import {
  ASSETS, BxButton, Container, Eyebrow, H3, SECTION_Y, SectionHead,
} from "@/components/sites/boxcars-framer-website-cd8da657/root-8a5edab2/ui";
import { Card, CheckBadge, H1, H5, PageSheet } from "@/components/sites/boxcars-framer-website-cd8da657/shared/page";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t.sell.metaTitle, description: t.sell.metaDescription, alternates: await localeAlternates("/vendre") };
}

/** Icons/flags index-aligned with the matching dictionary arrays (t.sell.formulas / t.sell.inspection). */
const FORMULA_META = [
  { icon: Banknote, recommended: false },
  { icon: Store, recommended: true },
];
const STAT_ICONS = [Car, Clock, Wallet, Timer];
const STEP_IMAGES = ["how-1", "how-3", "how-2"];
const INSPECTION_ICONS = [Car, ScanSearch, Gauge, Wrench, ClipboardCheck, FileText];

export default async function SellPage() {
  const [s, { t, fmt, plural, price }] = await Promise.all([getSettings(), getI18n()]);
  const homeCities = s.homeInspectionCities ?? [];
  const stats = ["140+", "24h", price(0), "2 min"].map((v, i) => [v, t.sell.stats[i]]);

  return (
    <PageSheet>
      {/* HERO */}
      <section className="pb-[30px] pt-5 bxt:pb-[40px]">
        <Container className="grid items-center gap-10 bxd:grid-cols-[1.05fr_1fr] bxd:gap-[70px]">
          <Reveal y={24} className="flex flex-col items-start gap-5">
            <Eyebrow>{t.sell.eyebrow}</Eyebrow>
            <h1 className={`${H1} text-balance bxd:text-[56px] bxd:leading-[66px]`}>{t.sell.title}</h1>
            <p className="max-w-[520px] text-[17px] leading-7 text-bx-ink">{t.sell.text}</p>
            <SellStart />
            <p className="flex items-center gap-2 text-sm text-[#818181]">
              <ShieldCheck className="size-4 text-bx-blue" strokeWidth={1.75} /> {t.sell.heroNote}
            </p>
          </Reveal>
          <Reveal y={24} delay={0.1} className="relative pb-6 ps-0 bxt:pb-8 bxt:ps-8">
            <div className="absolute -end-3 -top-3 hidden size-full rounded-[28px] bg-bx-lavender bxt:block" aria-hidden />
            <div className="relative h-[320px] overflow-hidden rounded-[24px] shadow-[0_30px_60px_-20px_rgba(5,11,32,0.45)] bxt:h-[460px]">
              <Image src={`${ASSETS}/images/sell-handshake.jpg`} alt={t.sell.heroAlt} fill preload sizes="(min-width:1200px) 620px, 100vw" className="bx-kenburns object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-bx-navy/50 via-transparent to-transparent" />
            </div>
            <div className="bx-float absolute bottom-0 start-4 flex items-center gap-3 rounded-2xl bg-white px-5 py-4 shadow-[0_20px_40px_-12px_rgba(5,11,32,0.35)] bxt:start-0">
              <span className="bx-pulse grid size-11 place-items-center rounded-full bg-bx-blue">
                <BadgeCheck className="size-6 text-white" strokeWidth={1.5} />
              </span>
              <div>
                <p className="text-lg font-semibold leading-6 text-bx-navy">{stats[1][0]}</p>
                <p className="text-xs uppercase text-bx-ink">{stats[1][1]}</p>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* STATS */}
      <section className="pb-[30px] bxt:pb-[60px] bxd:pb-[90px]">
        <Container>
          <div className="grid grid-cols-2 gap-3 bxt:grid-cols-4 bxt:gap-5">
            {stats.map(([v, l], i) => {
              const Icon = STAT_ICONS[i];
              return (
                <Reveal key={l} y={20} delay={i * 0.06}>
                  <div className="bx-lift flex h-full flex-col gap-4 rounded-2xl border border-bx-line bg-white p-5 hover:shadow-[0_16px_32px_-20px_rgba(5,11,32,0.4)] bxt:p-6">
                    <span className="grid size-11 place-items-center rounded-xl bg-bx-lavender">
                      <Icon className="size-5 text-bx-blue" strokeWidth={1.5} />
                    </span>
                    <div>
                      <p className="text-[30px] font-semibold leading-9 text-bx-navy bxt:text-[36px] bxt:leading-10"><CountUp value={v} /></p>
                      <p className="mt-1 text-[13px] uppercase leading-5 text-bx-ink/70">{l}</p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </Container>
      </section>

      {/* STEPS */}
      <section className="pb-[30px] bxt:pb-[60px] bxd:pb-[90px]">
        <Container className="flex flex-col gap-[30px] bxt:gap-10">
          <SectionHead eyebrow={t.sell.stepsEyebrow} title={t.sell.stepsTitle} />
          <div className="grid gap-5 bxt:grid-cols-3">
            {t.sell.steps.map(({ t: title, d }, i) => (
              <Reveal key={title} y={24} delay={i * 0.08}>
                <Card className="bx-lift group h-full overflow-hidden hover:shadow-[0_24px_48px_-24px_rgba(5,11,32,0.35)]">
                  <div className="relative h-[200px] overflow-hidden">
                    <Image src={`${ASSETS}/images/${STEP_IMAGES[i]}.jpg`} alt="" fill sizes="(min-width:810px) 33vw, 100vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-bx-navy/60 to-transparent" />
                    <span className="absolute start-5 top-5 grid size-11 place-items-center rounded-full bg-bx-blue text-base font-semibold text-white">{i + 1}</span>
                  </div>
                  <div className="p-[30px]">
                    <h3 className="text-xl font-medium text-bx-navy">{title}</h3>
                    <p className="mt-2 text-[15px] leading-6 text-bx-ink">{d}</p>
                  </div>
                </Card>
              </Reveal>
            ))}
          </div>
          <Reveal y={20} className="flex justify-center">
            <BxButton href="/vendre/demande">{t.sell.start}</BxButton>
          </Reveal>
        </Container>
      </section>

      {/* FORMULAS */}
      <section className="bg-bx-soft py-[30px] bxt:py-[60px] bxd:py-[90px]">
        <Container className="flex flex-col gap-[30px] bxt:gap-10">
          <SectionHead eyebrow={t.sell.formulasEyebrow} title={t.sell.formulasTitle} />
          <div className="grid gap-5 bxt:grid-cols-2">
            {t.sell.formulas.map(({ tag, title, text, points }, i) => {
              const { icon: Icon, recommended } = FORMULA_META[i];
              return (
                <Reveal key={tag} y={24}>
                  <div className={`relative flex h-full flex-col gap-5 rounded-2xl border bg-white p-[30px] ${recommended ? "border-bx-blue" : "border-bx-line"}`}>
                    {recommended && (
                      <span className="absolute end-5 top-5 rounded-[120px] bg-bx-blue px-3 py-1 text-xs font-medium uppercase text-white">
                        {t.sell.recommended}
                      </span>
                    )}
                    <span className="grid size-12 place-items-center rounded-xl bg-bx-lavender">
                      <Icon className="size-6 text-bx-blue" strokeWidth={1.5} />
                    </span>
                    <div>
                      <p className="text-sm font-medium uppercase text-bx-blue">{tag}</p>
                      <h3 className={`${H5} mt-1`}>{title}</h3>
                      <p className="mt-2 text-[15px] leading-6 text-bx-ink">{text}</p>
                    </div>
                    <ul className="mt-auto flex flex-col gap-2.5">
                      {points.map((p) => (
                        <li key={p} className="flex items-start gap-2 text-[15px] leading-6 text-bx-ink">
                          <CheckBadge /> {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </Container>
      </section>

      {/* INSPECTION */}
      <section className={SECTION_Y}>
        <Container className="flex flex-col gap-[30px] bxt:gap-12">
          <div className="flex flex-col items-center gap-4 text-center">
            <SectionHead
              eyebrow={t.sell.inspectionEyebrow}
              title={t.sell.inspectionTitle}
              right={<p className="max-w-[560px] text-[17px] leading-7 text-bx-ink">{t.sell.inspectionText}</p>}
            />
          </div>
          <div className="grid gap-5 bxd:grid-cols-[380px_1fr]">
            <Reveal y={24} className="relative min-h-[280px] overflow-hidden rounded-2xl">
              <Image src={`${ASSETS}/images/step-1.jpg`} alt="" fill sizes="(min-width:1200px) 380px, 100vw" className="bx-parallax object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-bx-navy/80 via-bx-navy/10 to-transparent" />
              <div className="absolute inset-x-6 bottom-6 flex items-center gap-4 text-white">
                <span className="grid size-12 shrink-0 place-items-center rounded-full bg-white/15 backdrop-blur">
                  <ShieldCheck className="size-6" strokeWidth={1.5} />
                </span>
                <div>
                  <p className="text-[32px] font-semibold leading-9">{stats[0][0]}</p>
                  <p className="text-sm uppercase text-white/80">{stats[0][1]}</p>
                </div>
              </div>
            </Reveal>
          <div className="grid gap-5 bxt:grid-cols-2">
            {t.sell.inspection.map(({ t: title, d }, i) => {
              const Icon = INSPECTION_ICONS[i];
              return (
                <Reveal key={title} y={24} delay={(i % 3) * 0.06}>
                  <div className="flex h-full gap-4 rounded-2xl border border-bx-line bg-white p-6 transition-shadow hover:shadow-[0_16px_32px_-20px_rgba(5,11,32,0.4)]">
                    <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-bx-lavender">
                      <Icon className="size-6 text-bx-blue" strokeWidth={1.5} />
                    </span>
                    <div>
                      <h3 className="text-lg font-medium text-bx-navy">{title}</h3>
                      <p className="mt-1 text-[15px] leading-6 text-bx-ink">{d}</p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
          </div>
          <Reveal y={20} className="flex flex-col items-center gap-3">
            <BxButton href="/vendre/demande">{t.sell.inspectionCta}</BxButton>
            <p className="text-sm text-[#818181]">{t.sell.heroNote}</p>
          </Reveal>
        </Container>
      </section>

      {/* PREPARE + WHERE */}
      <section className="pb-[30px] bxt:pb-[60px] bxd:pb-[90px]">
        <Container className="flex flex-col gap-[30px] bxt:gap-10">
          <SectionHead eyebrow={t.sell.prepareEyebrow} title={t.sell.prepareTitle} />
          <div className="grid gap-5 bxd:grid-cols-2">
            <Card className="flex flex-col gap-5 p-[30px]">
              <p className="text-sm font-medium uppercase text-bx-blue">{fmt(t.sell.step, { n: 1 })}</p>
              <h3 className={H5}>{t.sell.docsTitle}</h3>
              <p className="text-[15px] leading-6 text-bx-ink">{t.sell.docsText}</p>
              <ul className="flex flex-col gap-3">
                {t.sell.docs.map((x) => (
                  <li key={x} className="flex items-start gap-2 text-[15px] leading-6 text-bx-ink">
                    <KeyRound className="mt-1 size-4 shrink-0 text-bx-blue" strokeWidth={1.5} /> {x}
                  </li>
                ))}
              </ul>
              <p className="text-sm text-[#818181]">{t.sell.docsNote}</p>
            </Card>
            <Card className="flex flex-col gap-5 p-[30px]">
              <p className="text-sm font-medium uppercase text-bx-blue">{fmt(t.sell.step, { n: 2 })}</p>
              <h3 className={H5}>{t.sell.whereTitle}</h3>
              <div className="flex items-start gap-3 rounded-xl bg-bx-lavender p-4">
                <Store className="mt-0.5 size-5 shrink-0 text-bx-blue" strokeWidth={1.5} />
                <div>
                  <p className="font-medium text-bx-navy">{t.sell.showroomInspection}</p>
                  <p className="text-sm text-bx-ink">{s.address}</p>
                  {s.mapsUrl && (
                    <a href={s.mapsUrl} target="_blank" rel="noreferrer" className="mt-1 inline-flex items-center gap-1 text-sm font-medium text-bx-blue hover:text-bx-blue-hover">
                      <MapPin className="size-3.5" strokeWidth={1.5} /> {t.sell.directions}
                    </a>
                  )}
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-xl bg-bx-soft p-4">
                <Home className="mt-0.5 size-5 shrink-0 text-bx-blue" strokeWidth={1.5} />
                <div className="min-w-0">
                  <p className="font-medium text-bx-navy">
                    {t.sell.homeInspection}{" "}
                    {homeCities.length > 0 && <span className="font-normal text-bx-muted">· {plural(homeCities.length, t.sell.cities)}</span>}
                  </p>
                  {homeCities.length ? (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {homeCities.map((c) => (
                        <span key={c} className="rounded-[120px] border border-bx-line bg-white px-3 py-1 text-sm text-bx-navy">
                          {c}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-bx-ink">{t.sell.soon}</p>
                  )}
                </div>
              </div>
              <p className="text-sm text-[#818181]">{t.sell.cityNotListed}</p>
            </Card>
          </div>
        </Container>
      </section>

      {/* FAQ */}
      <section id="faq" className="pb-[30px] bxt:pb-[60px] bxd:pb-[90px]">
        <Container className="flex flex-col gap-[30px] bxt:flex-row bxt:items-start bxt:gap-0">
          <div className="flex-[1_1_0] bxt:sticky bxt:top-[100px]">
            <div className="flex flex-col items-center gap-[30px] pe-0 text-center bxt:items-start bxt:pe-[30px] bxt:text-start bxd:pe-[180px]">
              <Reveal y={24} className="flex flex-col items-center gap-2.5 bxt:items-start">
                <Eyebrow>{t.sell.faqEyebrow}</Eyebrow>
                <h3 className={`${H3} text-bx-navy`}>{t.sell.faqTitle}</h3>
                <p className="text-[15px] leading-6 text-bx-ink">{t.sell.faqText}</p>
              </Reveal>
              <Reveal y={20}>
                <BxButton href="/contact">{t.common.contactUs}</BxButton>
              </Reveal>
            </div>
          </div>
          <Reveal x={20} y={0} className="w-full flex-[1_1_0]">
            <FaqList items={t.sell.faq} />
          </Reveal>
        </Container>
      </section>

      {/* FINAL CTA */}
      <section className="pb-[30px] bxt:pb-[60px] bxd:pb-[90px]">
        <Container>
          <div className="relative isolate flex flex-col items-center gap-5 overflow-hidden rounded-2xl bg-bx-navy px-6 py-14 text-center bxt:py-20">
            <Image src={`${ASSETS}/images/cta-atlas-road.jpg`} alt="" fill sizes="1200px" className="bx-parallax -z-10 object-cover opacity-40" />
            <div className="absolute inset-0 -z-10 bg-gradient-to-t from-bx-navy via-bx-navy/60 to-bx-navy/40" />
            <Eyebrow light>{t.sell.ctaEyebrow}</Eyebrow>
            <h2 className={`${H3} text-white`}>{t.sell.ctaTitle}</h2>
            <p className="text-[15px] leading-6 text-bx-muted">{t.sell.ctaText}</p>
            <SellStart dark />
          </div>
        </Container>
      </section>
    </PageSheet>
  );
}
