"use client";

/**
 * /v2/pourquoi-mozimotors — siaracash.ma/why-siaracash (« SiaraCash Certifié ») for MoziMotors.
 * Single responsive tree like the original. Inspection figures reproduce the callout lines at the same
 * positions (container-query units so labels scale with the image).
 */
import { useRef } from "react";
import { CarFront, ChevronRight, ClipboardCheck, FileCheck, ShieldCheck } from "lucide-react";
import { A } from "./assets";
import { CarCard } from "./CarCard";
import type { ListedCar } from "./listing";
import { useV2 } from "./V2Locale";

const W = `${A}/assets/why`;
const INSPECTION = `${A}/assets/certified/inspection`;
const CHEV = <ChevronRight className="size-4 rtl:rotate-180" aria-hidden="true" />;

export function WhyHero() {
  const { t, href } = useV2();
  return (
    <section className="relative overflow-hidden bg-[color:var(--color-brand-navy)]">
      <img
        src={`${W}/hero-mozi.webp`}
        alt=""
        aria-hidden="true"
        width={1672}
        height={941}
        loading="eager"
        className="absolute inset-0 size-full object-cover object-[center_26%]"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,21,44,0.82)_0%,rgba(0,21,44,0.5)_48%,rgba(0,21,44,0.1)_78%)] rtl:bg-[linear-gradient(270deg,rgba(0,21,44,0.82)_0%,rgba(0,21,44,0.5)_48%,rgba(0,21,44,0.1)_78%)]" />
      <div className="relative mx-auto flex min-h-[520px] w-full max-w-[1280px] items-center px-4 pb-28 pt-14 lg:min-h-[640px] lg:px-12 lg:pb-36 lg:pt-16">
        <div className="max-w-[620px] text-start">
          <span className="block text-[15px] font-semibold uppercase tracking-[0.08em] text-[color:var(--color-brand-mint)] lg:text-[17px]">
            {t("MoziMotors Certifié")}
          </span>
          <h1 className="mt-3 text-[30px] font-bold leading-[1.2] tracking-[-0.02em] text-white lg:text-[44px]">
            {t("veut dire une voiture inspectée, fiable et accompagnée de A à Z")}
          </h1>
          <p className="mt-5 text-[14px] leading-[1.75] text-white/85 lg:text-[17px]">
            {t("Notre processus de certification et nos engagements ne sont pas qu'un label de qualité. C'est la promesse de vous offrir la sérénité que vous méritez.")}
          </p>
          <a
            className="mt-7 inline-flex h-[52px] items-center justify-center gap-2 rounded-[12px] bg-[color:var(--color-brand-teal)] px-7 text-[15px] font-semibold text-white shadow-[0_8px_24px_rgba(0,0,0,0.25)] transition-colors hover:bg-[color:var(--color-brand-teal-hover)] lg:text-[16px]"
            href={href("/v2/acheter?type=certifie")}
          >
            {t("Voir les voitures certifiées")}{CHEV}
          </a>
        </div>
      </div>
    </section>
  );
}

const ICON_PROPS = { fill: "none", stroke: "currentColor", strokeWidth: 2.6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

function LabelIcon({ i, cls }: { i: number; cls: string }) {
  if (i === 0)
    return (
      <svg viewBox="0 0 56 56" className={cls} aria-hidden="true">
        <path d="M26 49.5C15.5 45.5 9 37.5 9 27V13.5L26 7l17 6.5V27c0 2.4-.3 4.6-1 6.7" {...ICON_PROPS} />
        <path d="m18.5 24.5 5.5 5.5 9.5-9.5" {...ICON_PROPS} />
        <rect x="33" y="33" width="16" height="18" rx="2.5" {...ICON_PROPS} />
        <path d="M37 39h8M37 43.5h5" {...ICON_PROPS} />
        <path d="m39.5 47.5 2 2 3.8-3.4" {...ICON_PROPS} />
      </svg>
    );
  return (
    <svg viewBox="0 0 56 56" className={cls} aria-hidden="true">
      <rect x="11" y="9" width="34" height="43" rx="4" {...ICON_PROPS} />
      <path d="M21 9V6.5a2.5 2.5 0 0 1 2.5-2.5h9A2.5 2.5 0 0 1 35 6.5V9" {...ICON_PROPS} />
      <text
        x="28"
        y={i === 1 ? 30 : 28}
        textAnchor="middle"
        fill="currentColor"
        stroke="none"
        fontFamily="inherit"
        fontWeight="700"
        fontSize={i === 1 ? 13 : 11}
      >
        {i === 1 ? "140" : "A-Z"}
      </text>
      {i === 1 ? <path d="M20.5 38.5l4.5 4.5 10.5-10" {...ICON_PROPS} /> : <path d="M19 36.5h18" {...ICON_PROPS} />}
      {i === 2 && <path d="M20.5 43.5l4 4 9.5-9" {...ICON_PROPS} />}
    </svg>
  );
}

export function LabelBand() {
  const { t } = useV2();
  const items = ["140+ points d'inspection", "Essai avant achat", "Démarches simplifiées"];
  return (
    <div className="bg-[color:var(--color-surface-soft)] px-4 lg:px-12">
      <div className="mx-auto flex w-full max-w-[1280px] -translate-y-16 flex-col items-center gap-6 rounded-t-[14px] bg-[color:var(--color-brand-teal)] px-5 py-6 -mb-16 lg:-mb-24 lg:-translate-y-24 lg:flex-row lg:items-stretch lg:gap-8 lg:px-10 lg:py-8">
        <div className="flex shrink-0 flex-col justify-center text-center lg:border-e lg:border-white/40 lg:pe-9 lg:text-start">
          <span className="text-[26px] font-light leading-[1.15] text-white lg:text-[30px]">{t("Le Label")}</span>
          <span className="text-[26px] font-bold leading-[1.15] text-white lg:text-[30px]">MoziMotors</span>
        </div>
        <div className="flex w-full flex-1 flex-col gap-3.5 sm:grid sm:grid-cols-3 sm:gap-x-6 sm:gap-y-6">
          {items.map((label, i) => (
            <div key={label} className="flex items-center gap-3.5 text-start sm:flex-col sm:justify-start sm:gap-2.5 sm:text-center lg:px-2">
              <LabelIcon i={i} cls="size-12 shrink-0 text-white sm:size-[56px] lg:size-[60px]" />
              <span className="flex-1 text-[13px] font-medium leading-[1.35] text-white sm:flex-none sm:text-[13.5px] lg:text-[15px]">{t(label)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const H2 = "flex items-center gap-3 text-[22px] font-bold leading-[1.2] tracking-[-0.02em] text-[color:var(--color-brand-teal)] lg:text-[30px]";
const LEAD = "mt-4 text-[16px] font-semibold leading-[1.5] text-[color:var(--color-brand-purple)] lg:text-[19px]";
const BODY = "text-[14px] leading-[1.85] text-[color:var(--color-ink-base)] lg:text-[15.5px]";

export function AdminCheck() {
  const { t } = useV2();
  const items = [
    ["opposition.png", "Absence d'opposition", "Vérifiée auprès de la NARSA"],
    ["documents.png", "Documents du véhicule", "Carte grise, visite technique, vignette"],
    ["clean.png", "Situation financière", "Gage bancaire et crédit en cours levés"],
  ];
  return (
    <section className="px-4 py-10 lg:px-12 lg:py-16 bg-[color:var(--color-surface-soft)] pt-10 lg:pt-14">
      <div className="mx-auto w-full max-w-[1280px]">
        <div className="grid gap-6 lg:grid-cols-[1.08fr_1fr] lg:grid-rows-[auto_1fr] lg:items-start lg:gap-x-14 lg:gap-y-0">
          <div className="lg:col-start-2 lg:row-start-1">
            <h2 className={H2}>
              <ShieldCheck className="hidden size-8 shrink-0 lg:block" aria-hidden="true" />
              {t("Contrôle administratif")}
            </h2>
            <p className={LEAD}>{t("Ni arnaque, ni intermédiaire inutile.")}</p>
          </div>
          <div className="overflow-hidden rounded-[16px] border border-[color:var(--color-line-soft)] lg:col-start-1 lg:row-span-2 lg:row-start-1 lg:self-center">
            <img
              src={`${A}/icons/admin-check/narsa-result.webp`}
              alt={t("Contrôle administratif")}
              width={1200}
              height={751}
              className="aspect-[8/5] w-full object-cover"
              loading="lazy"
            />
          </div>
          <div className="lg:col-start-2 lg:row-start-2 lg:mt-5">
            <p className={BODY}>
              {t("Avant même l'inspection technique, chaque véhicule passe notre vérification administrative complète. Une voiture qui n'est pas parfaitement en règle et libre de tout engagement n'est pas proposée à la vente.")}
            </p>
            <p className={`mt-4 ${BODY}`}>
              {t("C'est aussi ce qui vous évite la chaîne d'intermédiaires : vous traitez avec nous, pas avec trois personnes dont vous ne savez pas laquelle détient réellement la voiture.")}
            </p>
            <ul className="mt-6 grid gap-2.5">
              {items.map(([img, title, d]) => (
                <li
                  key={title}
                  className="relative flex items-center gap-3 overflow-hidden rounded-[12px] border border-[color:var(--color-line-soft)] bg-white py-3 pe-3.5 ps-5"
                >
                  <span aria-hidden="true" className="absolute inset-y-2.5 start-0 w-1 rounded-e-full bg-[color:var(--color-brand-teal)]" />
                  <img src={`${A}/icons/admin-check/${img}`} alt="" className="size-10 shrink-0 object-contain" loading="lazy" />
                  <div className="min-w-0">
                    <p className="text-[14px] font-semibold leading-snug text-[color:var(--color-ink-strong)]">{t(title)}</p>
                    <p className="mt-0.5 text-[12.5px] leading-snug text-[color:var(--color-ink-muted)]">{t(d)}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- inspection figures ---------- */

type Callout = { label: string; top: number; side: "start" | "end"; offset?: number; width: number; labelWidth: number; dir: "row" | "row-reverse" };
type Figure = { img: string; w: number; h: number; callouts: Callout[] };

const FIGURES: Figure[] = [
  {
    img: "cc-engine",
    w: 2000,
    h: 1319,
    callouts: [
      { label: "Moteur", top: 34, side: "start", width: 57, labelWidth: 42.1, dir: "row" },
      { label: "Embrayage et transmission", top: 64, side: "start", width: 58, labelWidth: 41.38, dir: "row" },
    ],
  },
  {
    img: "cc-running-gear",
    w: 2000,
    h: 1161,
    callouts: [
      { label: "Direction, freins et suspension", top: 42, side: "end", width: 50, labelWidth: 48, dir: "row-reverse" },
      { label: "Soubassement", top: 62, side: "end", width: 62, labelWidth: 38.71, dir: "row-reverse" },
    ],
  },
  {
    img: "cc-interior",
    w: 2000,
    h: 1875,
    callouts: [
      { label: "Système audio et alarme", top: 30, side: "start", width: 46, labelWidth: 54.35, dir: "row" },
      { label: "Moquette, garnitures et tapis", top: 46, side: "start", width: 43, labelWidth: 58.14, dir: "row" },
      { label: "Sécurité", top: 66, side: "start", width: 44, labelWidth: 56.82, dir: "row" },
      { label: "Compartiment à bagages", top: 85, side: "start", width: 47, labelWidth: 53.19, dir: "row" },
      { label: "Chauffage, ventilation, climatisation", top: 28, side: "end", width: 45, labelWidth: 55.56, dir: "row-reverse" },
      { label: "Équipements intérieurs", top: 48, side: "end", width: 46, labelWidth: 54.35, dir: "row-reverse" },
      { label: "Verrouillage et accès", top: 68, side: "end", width: 42, labelWidth: 59.52, dir: "row-reverse" },
    ],
  },
  {
    img: "cc-exterior",
    w: 2000,
    h: 1515,
    callouts: [
      { label: "Vitres et rétroviseurs", top: 30, side: "end", offset: 22, width: 38.5, labelWidth: 54.55, dir: "row" },
      { label: "Capot et coffre", top: 38, side: "end", offset: 26, width: 34.5, labelWidth: 60.87, dir: "row" },
      { label: "Feux extérieurs", top: 46, side: "end", offset: 25, width: 35.5, labelWidth: 59.15, dir: "row" },
      { label: "Carrosserie et pare-chocs", top: 63, side: "start", offset: 22, width: 38.5, labelWidth: 54.55, dir: "row-reverse" },
      { label: "Système d'échappement", top: 71, side: "start", offset: 23, width: 37.5, labelWidth: 56, dir: "row-reverse" },
      { label: "Jantes, roues et pneus", top: 79, side: "start", offset: 29, width: 31.5, labelWidth: 66.67, dir: "row-reverse" },
    ],
  },
  {
    img: "cc-bonnet",
    w: 2000,
    h: 1040,
    callouts: [
      { label: "Système électrique", top: 14, side: "start", width: 60, labelWidth: 45, dir: "row" },
      { label: "Fluides", top: 26, side: "start", width: 76, labelWidth: 35.53, dir: "row" },
      { label: "Liquide de refroidissement", top: 37, side: "start", width: 52, labelWidth: 51.92, dir: "row" },
    ],
  },
];

const PURPLE = "#0b1a3a";

function InspectionFigure({ f }: { f: Figure }) {
  const { t } = useV2();
  const alt = f.callouts.map((c) => t(c.label)).join(", ");
  return (
    <div>
      <figure dir="ltr" className="relative hidden w-full lg:block" style={{ containerType: "inline-size" }}>
        <img src={`${INSPECTION}/${f.img}.webp`} alt={alt} width={f.w} height={f.h} loading="lazy" className="h-auto w-full object-contain" />
        {f.callouts.map((c) => (
          <div
            key={c.label}
            className="absolute flex -translate-y-1/2 items-center"
            style={{
              top: `${c.top}%`,
              [c.side === "start" ? "insetInlineStart" : "insetInlineEnd"]: `${c.offset ?? 0}%`,
              width: `${c.width}%`,
              flexDirection: c.dir,
            }}
          >
            <span className="shrink-0" style={{ width: `${c.labelWidth}%`, textAlign: c.dir === "row" ? "end" : "start" }}>
              <span
                className="inline-block border-b pb-[0.3cqw] text-[1.5cqw] font-semibold leading-tight"
                style={{ color: PURPLE, borderColor: "rgba(11,26,58,0.35)" }}
              >
                {t(c.label)}
              </span>
            </span>
            <span aria-hidden="true" className="flex flex-1 items-center" style={{ flexDirection: c.dir }}>
              <span className="h-px flex-1" style={{ backgroundColor: PURPLE }} />
              <span className="size-[0.6cqw] shrink-0 rounded-full border" style={{ borderColor: PURPLE, backgroundColor: "#fff" }} />
            </span>
          </div>
        ))}
      </figure>
      <figure className="lg:hidden">
        <img src={`${INSPECTION}/${f.img}.webp`} alt={alt} width={f.w} height={f.h} loading="lazy" className="h-auto w-full object-contain" />
        <figcaption className="mt-3 flex flex-wrap justify-center gap-1.5">
          {f.callouts.map((c) => (
            <span
              key={c.label}
              className="rounded-full px-2.5 py-1 text-[12px] font-semibold"
              style={{ color: PURPLE, backgroundColor: "rgba(85,31,38,0.1)" }}
            >
              {c.label}
            </span>
          ))}
        </figcaption>
      </figure>
    </div>
  );
}

const CHECKED = [
  "Carrosserie, optiques & vitrages",
  "Extérieur",
  "Intérieur",
  "Peinture",
  "Mécanique",
  "Moteur & transmission",
  "Trains roulants, freins & suspension",
  "Électricité",
  "Consommables, fluides & niveaux",
  "Avis de l'expert",
];

function WhiteCard({ children, first = false }: { children: React.ReactNode; first?: boolean }) {
  return (
    <section className={`px-4 py-10 lg:px-12 lg:py-16 bg-[color:var(--color-surface-soft)] ${first ? "pt-0 lg:pt-0" : "pt-0 lg:pt-0"}`}>
      <div className="mx-auto w-full max-w-[1280px]">
        <div className="rounded-[20px] bg-white p-6 shadow-[0_6px_24px_rgba(16,24,40,0.06)] sm:p-10 lg:p-14">{children}</div>
      </div>
    </section>
  );
}

export function Expertise() {
  const { t } = useV2();
  return (
    <WhiteCard first>
      <h2 className={H2}>
        <ClipboardCheck className="hidden size-8 shrink-0 lg:block" aria-hidden="true" />
        {t("Expertise détaillée")}
      </h2>
      <p className={LEAD}>{t("Vous savez exactement ce que vous achetez.")}</p>
      <p className={`mt-5 max-w-[900px] ${BODY}`}>
        {t("Nos experts passent chaque véhicule au crible — 140+ points de contrôle, de l'historique complet au moindre recoin sous le capot. Vous repartez avec un rapport d'expertise détaillé, y compris sur les points à surveiller. Le kilométrage est vérifié et affiché tel quel, jamais retouché.")}
      </p>
      <div className="mt-10 lg:mt-12">
        <p className="text-[13px] font-semibold uppercase tracking-[0.04em] text-[color:var(--color-ink-muted)]">{t("Ce que nous contrôlons")}</p>
        <ul className="mt-4 flex flex-wrap gap-2">
          {CHECKED.map((c) => (
            <li
              key={c}
              className="rounded-full bg-[color:var(--color-brand-teal-soft)] px-3.5 py-1.5 text-[13px] font-medium text-[color:var(--color-brand-teal)]"
            >
              {t(c)}
            </li>
          ))}
        </ul>
        <div className="mx-auto mt-8 flex w-full max-w-[1000px] flex-col gap-10 lg:mt-10 lg:gap-16">
          {FIGURES.map((f) => (
            <InspectionFigure key={f.img} f={f} />
          ))}
        </div>
      </div>
    </WhiteCard>
  );
}

export function Journey() {
  const { t } = useV2();
  const phases = [
    ["Mise en vente", ["Expertise complète du véhicule", "Mise en ligne sur la plateforme"]],
    ["Vente", ["Sélection et qualification des acheteurs", "Accompagnement commercial jusqu'à l'accord"]],
    ["Transfert", ["Mainlevée du gage auprès de l'organisme de financement", "Visite technique", "Légalisation à la Moqata'a et dossier de mutation"]],
  ] as const;
  return (
    <WhiteCard>
      <h2 className={H2}>
        <FileCheck className="hidden size-8 shrink-0 lg:block" aria-hidden="true" />
        {t("Accompagnement de A à Z")}
      </h2>
      <p className={LEAD}>{t("De l'expertise à la carte grise, nous portons toute la transaction.")}</p>
      <p className={`mt-5 max-w-[900px] ${BODY}`}>
        {t("Une vente de voiture, ce n'est pas seulement un acheteur et un vendeur qui se mettent d'accord. C'est une expertise, une mise en vente, des acheteurs à qualifier, une négociation à encadrer, puis un dossier administratif qui prend des semaines. Nous prenons l'ensemble en charge — vous n'avez à traiter qu'avec nous, et vous suivez chaque étape.")}
      </p>
      <p className="mt-9 text-[13px] font-semibold uppercase tracking-[0.04em] text-[color:var(--color-ink-muted)]">{t("Le parcours, en trois phases")}</p>
      <ol className="mt-5 grid gap-4 lg:grid-cols-3 lg:gap-6">
        {phases.map(([title, pts], i) => (
          <li key={title} className="rounded-[16px] border border-[color:var(--color-line-soft)] bg-[color:var(--color-surface-soft)] p-5 lg:p-6">
            <div className="flex items-center gap-2.5">
              <span className="grid size-7 shrink-0 place-items-center rounded-full bg-[color:var(--color-brand-teal)] text-[13px] font-bold text-white">
                {i + 1}
              </span>
              <h3 className="text-[16px] font-semibold text-[color:var(--color-ink-strong)] lg:text-[17px]">{t(title)}</h3>
            </div>
            <ul className="mt-4 space-y-2.5">
              {pts.map((p) => (
                <li key={p} className="flex gap-2.5 text-[13.5px] leading-[1.6] text-[color:var(--color-ink-base)] lg:text-[14px]">
                  <span aria-hidden="true" className="mt-[7px] size-1.5 shrink-0 rounded-full bg-[color:var(--color-brand-teal)]" />
                  {t(p)}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
      <p className="mt-6 inline-flex items-center gap-2.5 rounded-[12px] bg-[color:var(--color-brand-teal-soft)] px-4 py-3 text-[14px] font-semibold text-[color:var(--color-brand-teal)] lg:text-[15px]">
        <FileCheck className="size-5 shrink-0" aria-hidden="true" />
        {t("Remise de la carte grise provisoire")}
      </p>
    </WhiteCard>
  );
}

export function TwoThings() {
  const { t, href } = useV2();
  const rows = [
    {
      icon: CarFront,
      title: "Essayez-la avant de l'acheter",
      text: "Réservez un essai, roulez en conditions réelles, un expert reste à vos côtés. Sans pression, sans engagement.",
      img: "essai-mozi",
      w: 1586,
      h: 992,
      link: ["Choisir une voiture à essayer", "/v2/acheter"],
      imgFirst: true,
    },
    {
      icon: FileCheck,
      title: "Démarches simplifiées",
      text: "Profitez de votre nouvelle voiture, nous vous accompagnons dans les formalités. Du dossier de mutation à la carte grise provisoire, notre équipe suit chaque étape à vos côtés.",
      img: "demarches-mozi",
      w: 1448,
      h: 1086,
      link: ["Découvrir les voitures certifiées", "/v2/acheter?type=certifie"],
      imgFirst: false,
    },
  ];
  return (
    <section className="px-4 py-10 lg:px-12 lg:py-16 bg-[color:var(--color-surface-soft)] pt-2 lg:pt-6">
      <div className="mx-auto w-full max-w-[1280px]">
        <h2 className="text-[22px] font-bold leading-[1.3] tracking-[-0.02em] text-[color:var(--color-brand-teal)] lg:text-[30px]">
          {t("Deux choses qui rendent l'achat plus simple")}
        </h2>
        <div className="mt-8 flex flex-col">
          {rows.map((r, i) => {
            const Icon = r.icon;
            const textCol = r.imgFirst ? "lg:col-start-2" : "lg:col-start-1";
            const imgCol = r.imgFirst ? "lg:col-start-1" : "lg:col-start-2";
            return (
              <div
                key={r.title}
                className={`grid gap-y-5 py-8 lg:grid-cols-2 lg:grid-rows-[1fr_auto_auto_1fr] lg:gap-x-16 lg:gap-y-0 lg:py-12 ${i ? "border-t-[1.5px] border-[color:var(--color-brand-teal-soft-2)]" : ""}`}
              >
                <h3
                  className={`flex items-center gap-3 text-[20px] font-semibold leading-[1.35] tracking-[-0.01em] text-[color:var(--color-brand-teal)] lg:row-start-2 lg:text-[24px] ${textCol}`}
                >
                  <Icon className="size-6 shrink-0 lg:size-7" aria-hidden="true" />
                  {t(r.title)}
                </h3>
                <div className={`lg:row-span-4 lg:row-start-1 lg:self-center ${imgCol}`}>
                  <img
                    src={`${W}/${r.img}.webp`}
                    alt=""
                    aria-hidden="true"
                    width={r.w}
                    height={r.h}
                    loading="lazy"
                    className="aspect-[8/5] w-full rounded-[10px] object-cover"
                  />
                </div>
                <div className={`lg:row-start-3 lg:mt-4 ${textCol}`}>
                  <p className="text-[14px] leading-[1.85] text-[color:var(--color-ink-base)] lg:text-[15px]">{t(r.text)}</p>
                  <a
                    className="mt-6 inline-flex h-[52px] items-center justify-center gap-2 rounded-full bg-[color:var(--color-brand-teal)] px-7 text-[15px] font-semibold text-white shadow-sm transition-colors hover:bg-[color:var(--color-brand-teal-hover)]"
                    href={href(r.link[1])}
                  >
                    {t(r.link[0])}
                    {CHEV}
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function BrowseCars({ cars }: { cars: ListedCar[] }) {
  const { t, href } = useV2();
  const track = useRef<HTMLDivElement>(null);
  if (!cars.length) return null;
  return (
    <section className="bg-white px-4 py-10 lg:px-12 lg:py-16">
      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-[16px] lg:gap-[32px]">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-[18px] font-bold leading-[1.2] tracking-[-0.01em] text-[color:var(--color-ink-strong)] lg:text-[32px] lg:font-semibold lg:tracking-[-0.02em]">
            {t("Parcourez les voitures disponibles")}
          </h2>
          <a
            className="flex-shrink-0 text-[14px] font-medium text-[color:var(--color-brand-teal)] hover:underline lg:text-[22px] lg:font-semibold"
            href={href("/v2/acheter")}
          >
            {t("Afficher tout")}
          </a>
        </div>
        <div className="relative">
          <div ref={track} className="flex snap-x snap-mandatory gap-[20px] overflow-x-auto scroll-smooth pb-2 scrollbar-hide">
            {cars.map((c) => (
              <div key={c.id} className="w-[78%] flex-shrink-0 snap-start sm:w-[46%] lg:w-[30%] xl:w-[23%]">
                <CarCard car={c} />
              </div>
            ))}
          </div>
          <button
            type="button"
            aria-label={t("Suivant")}
            onClick={() => track.current?.scrollBy({ left: track.current.clientWidth * 0.75 })}
            className="absolute end-2 top-[85px] z-10 hidden size-9 -translate-y-1/2 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-brand-teal)] lg:flex"
          >
            <span className="flex size-6 items-center justify-center rounded-full bg-[rgba(7,3,17,0.33)]">
              <ChevronRight className="size-4 text-white rtl:rotate-180" aria-hidden="true" />
            </span>
          </button>
        </div>
        <div className="flex justify-center">
          <a
            className="inline-flex h-[52px] items-center justify-center gap-2 rounded-[16px] bg-[color:var(--color-brand-teal)] px-7 text-[15px] font-semibold text-white transition-colors hover:bg-[color:var(--color-brand-teal-hover)]"
            href={href("/v2/acheter")}
          >
            {t("Voir toutes les voitures")}{CHEV}
          </a>
        </div>
      </div>
    </section>
  );
}
