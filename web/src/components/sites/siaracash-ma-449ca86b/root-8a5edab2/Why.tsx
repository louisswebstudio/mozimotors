"use client";

/**
 * /v2/pourquoi-mozimotors — siaracash.ma/why-siaracash (« SiaraCash Certifié ») for MoziMotors.
 * Single responsive tree like the original.
 */
import { useRef } from "react";
import { CarFront, ChevronRight, ClipboardCheck, FileCheck, ShieldCheck } from "lucide-react";
import { A } from "./assets";
import { CarCard } from "./CarCard";
import type { ListedCar } from "./listing";
import { useV2 } from "./V2Locale";

const W = `${A}/assets/why`;
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
            {t("Notre expertise")}
          </span>
          <h1 className="mt-3 text-[30px] font-bold leading-[1.2] tracking-[-0.02em] text-white lg:text-[44px]">
            {t("L'expertise, gage de confiance")}
          </h1>
          <p className="mt-5 text-[14px] leading-[1.75] text-white/85 lg:text-[17px]">
            {t("Des contrôles approfondis, un rapport détaillé et un accompagnement à chaque étape pour acheter votre voiture en toute confiance.")}
          </p>
          <a
            className="mt-7 inline-flex h-[52px] items-center justify-center gap-2 rounded-[12px] bg-[color:var(--color-brand-teal)] px-7 text-[15px] font-semibold text-white shadow-[0_8px_24px_rgba(0,0,0,0.25)] transition-colors hover:bg-[color:var(--color-brand-teal-hover)] lg:text-[16px]"
            href={href("/acheter?type=certifie")}
          >
            {t("Découvrir nos voitures inspectées")}{CHEV}
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
  const items = ["Plus de 140 points de contrôle", "Essai avant achat", "Démarches accompagnées"];
  return (
    <div className="bg-[color:var(--color-surface-soft)] px-4 lg:px-12">
      <div className="mx-auto flex w-full max-w-[1280px] -translate-y-16 flex-col items-center gap-6 rounded-t-[14px] bg-[color:var(--color-brand-teal)] px-5 py-6 -mb-16 lg:-mb-24 lg:-translate-y-24 lg:flex-row lg:items-stretch lg:gap-8 lg:px-10 lg:py-8">
        <div className="flex shrink-0 flex-col justify-center text-center lg:border-e lg:border-white/40 lg:pe-9 lg:text-start">
          <span className="text-[26px] font-light leading-[1.15] text-white lg:text-[30px]">{t("Les engagements")}</span>
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
    ["opposition.png", "Absence d'opposition", "Vérification auprès de la NARSA."],
    ["documents.png", "Documents du véhicule", "Contrôle de la carte grise, de la visite technique et de la vignette."],
    ["clean.png", "Situation du financement", "Vérification des éventuels crédits ou gages et de leur régularisation."],
  ];
  return (
    <section className="px-4 py-10 lg:px-12 lg:py-16 bg-[color:var(--color-surface-soft)] pt-10 lg:pt-14">
      <div className="mx-auto w-full max-w-[1280px]">
        <div className="grid gap-6 lg:grid-cols-[1.08fr_1fr] lg:grid-rows-[auto_1fr] lg:items-start lg:gap-x-14 lg:gap-y-0">
          <div className="lg:col-start-2 lg:row-start-1">
            <h2 className={H2}>
              <ShieldCheck className="hidden size-8 shrink-0 lg:block" aria-hidden="true" />
              {t("Vérification administrative")}
            </h2>
            <p className={LEAD}>{t("Les documents contrôlés, votre achat facilité.")}</p>
          </div>
          <div className="overflow-hidden rounded-[16px] border border-[color:var(--color-line-soft)] lg:col-start-1 lg:row-span-2 lg:row-start-1 lg:self-center">
            <img
              src={`${A}/icons/admin-check/narsa-result.webp`}
              alt={t("Vérification administrative")}
              width={1200}
              height={751}
              className="aspect-[8/5] w-full object-cover"
              loading="lazy"
            />
          </div>
          <div className="lg:col-start-2 lg:row-start-2 lg:mt-5">
            <p className={BODY}>
              {t("Nous vérifions les documents du véhicule, l'absence d'opposition et la situation du crédit éventuel avant la mise en vente. Notre équipe vous accompagne pour une transaction claire et sereine.")}
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

const CHECKED = [
  "Carrosserie, peinture et vitrages",
  "Habitacle et équipements",
  "Moteur et transmission",
  "Freins, suspension et trains roulants",
  "Systèmes électriques et électroniques",
  "Pneus, fluides et niveaux",
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
        {t("Inspection approfondie")}
      </h2>
      <p className={LEAD}>{t("Un état détaillé pour un choix éclairé.")}</p>
      <p className={`mt-5 max-w-[900px] ${BODY}`}>
        {t("Nos experts examinent votre future voiture sur plus de 140 points de contrôle. Vous disposez d'un rapport présentant son état, ses éventuels défauts et les points à surveiller pour décider en toute confiance.")}
      </p>
      <div className="mt-10 lg:mt-12">
        <p className="text-[13px] font-semibold uppercase tracking-[0.04em] text-[color:var(--color-ink-muted)]">{t("Nos points de contrôle")}</p>
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
        <div className="mt-10 flex gap-3 rounded-[16px] bg-[color:var(--color-brand-teal-soft)] p-5 lg:mt-12 lg:p-6">
          <FileCheck className="mt-0.5 size-5 shrink-0 text-[color:var(--color-brand-teal)]" aria-hidden="true" />
          <div>
            <h3 className="text-[16px] font-semibold text-[color:var(--color-ink-strong)] lg:text-[17px]">{t("Un rapport transparent")}</h3>
            <p className={`mt-1.5 ${BODY}`}>{t("Les résultats de l'inspection et les observations de l'expert réunis dans un document clair.")}</p>
          </div>
        </div>
      </div>
    </WhiteCard>
  );
}

export function Journey() {
  const { t } = useV2();
  const phases = [
    ["Préparer et publier", ["Expertise complète du véhicule", "Photos professionnelles et mise en ligne de l'annonce"]],
    ["Trouver l'acheteur", ["Gestion des demandes et organisation des visites", "Négociation et accompagnement jusqu'à l'accord"]],
    [
      "Finaliser la transaction",
      ["Accompagnement à la levée du gage, si nécessaire", "Suivi de la visite technique et du dossier de mutation", "Accompagnement jusqu'à la remise de la carte grise provisoire"],
    ],
  ] as const;
  return (
    <WhiteCard>
      <h2 className={H2}>
        <FileCheck className="hidden size-8 shrink-0 lg:block" aria-hidden="true" />
        {t("À vos côtés, jusqu'à la remise des clés")}
      </h2>
      <p className={LEAD}>{t("De l'expertise au changement de propriétaire, nous coordonnons chaque étape de votre vente.")}</p>
      <p className={`mt-5 max-w-[900px] ${BODY}`}>
        {t("Notre équipe met votre voiture en valeur, gère les échanges avec les acheteurs et vous accompagne dans les démarches administratives. Vous gardez la visibilité sur l'avancement, nous nous occupons du suivi.")}
      </p>
      <p className="mt-9 text-[13px] font-semibold uppercase tracking-[0.04em] text-[color:var(--color-ink-muted)]">{t("Votre vente en trois étapes")}</p>
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
    </WhiteCard>
  );
}

export function TwoThings() {
  const { t, href } = useV2();
  const rows = [
    {
      icon: CarFront,
      title: "Prenez le volant avant de vous décider",
      text: "Découvrez la voiture en conditions réelles, avec un expert à vos côtés pour répondre à vos questions. Un essai sans engagement, à votre rythme.",
      img: "essai-mozi",
      w: 1586,
      h: 992,
      link: ["Réserver un essai", "/acheter"],
      imgFirst: true,
    },
  ];
  return (
    <section className="px-4 py-10 lg:px-12 lg:py-16 bg-[color:var(--color-surface-soft)] pt-2 lg:pt-6">
      <div className="mx-auto w-full max-w-[1280px]">
        <h2 className="text-[22px] font-bold leading-[1.3] tracking-[-0.02em] text-[color:var(--color-brand-teal)] lg:text-[30px]">
          {t("Achetez en confiance, choisissez sereinement")}
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
            href={href("/acheter")}
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
            href={href("/acheter")}
          >
            {t("Voir toutes les voitures")}{CHEV}
          </a>
        </div>
      </div>
    </section>
  );
}
