"use client";

/**
 * /v2/vendre — siaracash.ma/sell for MoziMotors. Desktop and mobile blocks (separate trees on the page).
 * Every « Vendre ma voiture » goes to the sell flow: /v2/vendre/demande?ville=…
 * Hub / home-inspection cities come from Studio › Réglages (showroomCity, homeInspectionCities).
 */
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, BadgeCheck, ChevronRight, CircleCheck, FileCheck, FileText, Headset, MapPin, ShieldCheck, Users } from "lucide-react";
import { CITIES } from "@/lib/format";
import { A } from "./assets";
import { Combobox } from "./SearchCard";
import { useV2 } from "./V2Locale";

const S = `${A}/assets/sell2`;
export const SELL_FORM = "/vendre/demande";
const sellHref = (city?: string) => `${SELL_FORM}${city ? `?ville=${encodeURIComponent(city)}` : ""}`;

/* ---------- hero ---------- */

function CityStart() {
  const { t, href } = useV2();
  const router = useRouter();
  const [city, setCity] = useState("");
  return (
    <div className="mt-6 flex max-w-[520px] items-center gap-3 rounded-xl border border-[color:var(--color-line-soft)] p-3">
      <div className="min-w-0 flex-1">
        <Combobox
          placeholder={t("Choisir votre ville")}
          searchPlaceholder={t("Rechercher une ville…")}
          options={CITIES.map((c) => ({ value: c, label: c }))}
          value={city}
          onChange={setCity}
          triggerClass="h-[48px] rounded-lg border border-[color:var(--color-line-soft)] px-3.5 py-2 has-[>svg]:px-3 text-[15px]"
        />
      </div>
      <button
        type="button"
        onClick={() => router.push(href(sellHref(city)))}
        className="flex h-[48px] shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full bg-[color:var(--color-brand-teal)] hover:bg-[color:var(--color-brand-teal-hover)] px-6 text-[15px] font-bold text-white transition-colors"
      >
        {t("Vendre ma voiture")} <ArrowRight className="size-4 rtl:rotate-180" aria-hidden="true" />
      </button>
    </div>
  );
}

const STATS = [
  ["100%", "voitures inspectées"],
  ["24h", "pour votre offre"],
  ["140+", "points contrôlés"],
  ["0 DH", "frais d'expertise"],
];
const HERO_IMG = `${S}/hero-handover-mozi.webp`;
const HERO_ALT = "Poignée de main devant une voiture vendue";

export function SellHeroDesktop() {
  const { t } = useV2();
  return (
    <section className="relative">
      {/* Same full-bleed showroom photo as the home hero (mz-hero-* in mozi-theme.css), content over the light wall. */}
      <div className="mz-hero-stage relative overflow-hidden" style={{ height: 580 }}>
        <div className="mz-hero-media mz-hero-media-sell absolute">
          <img
            src={`${A}/assets/home/hero-wide.webp`}
            alt={t(HERO_ALT)}
            width="2000"
            height="750"
            loading="eager"
            fetchPriority="high"
            className="mz-hero-photo block h-full"
          />
          <div aria-hidden="true" className="mz-hero-fade absolute inset-0" />
        </div>
        <div className="relative mx-auto flex h-full w-full max-w-[1280px] items-center px-12">
          <div style={{ maxWidth: 580 }}>
            <h1 className="font-black tracking-[-0.02em] text-[color:var(--color-brand-dark)]" style={{ fontSize: 56, lineHeight: 1.05 }}>
              {t("Vendez votre voiture")}
              <br />
              <span className="text-[color:var(--color-brand-teal)]">{t("au meilleur prix.")}</span>
            </h1>
            <p className="mt-4 max-w-[440px] text-[18px] leading-relaxed text-[color:var(--color-ink-muted)]">
              {t("Expertise gratuite, offre sous 24h, paiement sécurisé — sans engagement.")}
            </p>
            <div className="rounded-xl bg-white">
              <CityStart />
            </div>
            <p className="mt-3 text-[12px] font-semibold text-[color:var(--color-ink-muted)]">{t("Gratuit · Sans engagement · Estimation indicative sous 24h")}</p>
            <div className="mt-8 flex">
              {STATS.map(([v, l], i) => (
                <div key={v} className={`w-max pe-8 ${i ? "border-s border-[color:var(--color-line-soft)] ps-8" : ""}`}>
                  <div className="whitespace-nowrap text-[26px] font-black leading-none text-[color:var(--color-brand-dark)]">{v}</div>
                  <div className="mt-1 whitespace-nowrap text-[13px] text-[color:var(--color-ink-muted)]">{t(l)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function SellHeroMobile() {
  const { t } = useV2();
  return (
    <>
      <section className="bg-white px-4 pt-6 text-center">
        <h1 className="text-[32px] font-black leading-[1.08] tracking-[-0.02em] text-[color:var(--color-brand-dark)]">
          {t("Vendez votre voiture")}
          <br />
          <span className="text-[color:var(--color-brand-teal)]">{t("au meilleur prix.")}</span>
        </h1>
        <p className="mt-2 text-[14px] text-[color:var(--color-ink-muted)]">{t("Expertise gratuite, offre sous 24h, paiement sécurisé — sans engagement.")}</p>
        <div className="mt-3.5 flex flex-wrap justify-center gap-2">
          {[
            ["24h", "pour votre offre"],
            ["140+", "points contrôlés"],
            ["0 DH", "frais d'expertise"],
          ].map(([v, l]) => (
            <span
              key={v}
              className="inline-flex items-center gap-1.5 rounded-full border border-[color:var(--color-line-soft)] px-3 py-1.5 text-[12px] font-medium text-[color:var(--color-ink-muted)]"
            >
              <BadgeCheck className="size-3.5 text-[color:var(--color-brand-teal)]" aria-hidden="true" />
              <span>
                <strong className="font-bold text-[color:var(--color-brand-dark)]">{v}</strong> {t(l)}
              </span>
            </span>
          ))}
        </div>
        <img src={HERO_IMG} alt={t(HERO_ALT)} loading="eager" fetchPriority="high" className="mt-3 h-[250px] w-full rounded-xl object-cover" style={{ objectPosition: "45% center" }} />
      </section>
      <section className="mt-5 border-y border-[color:var(--color-line-soft)] bg-white px-3 py-3.5">
        <div className="grid grid-cols-2 gap-x-2 gap-y-3">
          {[
            { icon: ShieldCheck, t: "Sécurisé", d: "Paiement sécurisé", c: "text-[color:var(--color-brand-purple)]" },
            { icon: Users, t: "Experts", d: "+10 ans d'expérience", c: "text-[color:var(--color-brand-purple)]" },
            { icon: FileCheck, t: "Transparence", d: "Zéro frais cachés", c: "text-[color:var(--color-brand-purple)]" },
            { icon: Headset, t: "Accompagnement", d: "De A à Z", c: "text-[color:var(--color-brand-teal)]" },
          ].map(({ icon: Icon, t: title, d, c }) => (
            <div key={title} className="flex items-center gap-2.5">
              <Icon className={`size-6 shrink-0 ${c}`} aria-hidden="true" />
              <div className="text-start">
                <div className="text-[12px] font-bold text-[color:var(--color-brand-dark)]">{t(title)}</div>
                <div className="text-[11px] text-[color:var(--color-ink-muted)]">{t(d)}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

/* ---------- steps ---------- */

export function SellStepsDesktop() {
  const { t } = useV2();
  const steps = [
    ["01", "step-form", "Renseignez les infos de votre voiture"],
    ["02", "step-checklist", "On programme une expertise"],
    ["03", "step-cash", "Recevez la meilleure offre"],
  ];
  return (
    <section className="bg-white px-8 lg:px-12">
      <div className="mx-auto flex max-w-[1240px] items-stretch border-t border-[color:var(--color-line-soft)] py-9">
        {steps.map(([n, img, label], i) => (
          <div key={n} className="flex flex-1 items-center">
            {i > 0 && <ChevronRight className="mx-1 size-5 shrink-0 text-[color:var(--color-line-medium)] rtl:rotate-180" aria-hidden="true" />}
            <div className="flex items-center gap-3">
              <span className="shrink-0 text-[22px] font-black text-[color:var(--color-brand-teal)]">{n}</span>
              <img src={`${S}/${img}-mozi.webp`} alt="" className="size-12 shrink-0 object-contain" loading="lazy" />
              <div className="text-[15px] font-bold leading-tight text-[color:var(--color-brand-dark)]">{t(label)}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function SellStepsMobile() {
  const { t } = useV2();
  const steps = [
    ["01", "step-pin", "Choisissez votre ville", "Dites-nous où se trouve votre voiture."],
    ["02", "step-form", "Renseignez vos coordonnées", "Un formulaire simple, en 2 minutes."],
    ["03", "step-checklist", "Décrivez votre véhicule", "Marque, modèle, kilométrage et photos."],
    ["04", "step-cash", "Recevez votre meilleure offre", "Offre ferme sous 24h, sans engagement."],
  ];
  return (
    <section className="bg-white px-4 pt-6">
      <h2 className="text-[20px] font-extrabold text-[color:var(--color-brand-dark)]">{t("Comment vendre sa voiture avec MoziMotors")}</h2>
      <div className="mt-3 flex flex-col">
        {steps.map(([n, img, label, d], i) => (
          <div key={n} className={`flex items-center gap-3.5 py-3 ${i < steps.length - 1 ? "border-b border-[color:var(--color-line-soft)]" : ""}`}>
            <span className="w-7 shrink-0 text-[24px] font-black text-[color:var(--color-brand-teal)]">{n}</span>
            <img src={`${S}/${img}-mozi.webp`} alt="" className="size-[46px] shrink-0 object-contain" loading="lazy" />
            <div>
              <div className="text-[15px] font-bold text-[color:var(--color-brand-dark)]">{t(label)}</div>
              <div className="mt-0.5 text-[12px] text-[color:var(--color-ink-muted)]">{t(d)}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------- formulas ---------- */

const FORMULAS = [
  {
    kicker: "Cash",
    title: "Vente immédiate",
    text: "MoziMotors rachète votre voiture directement. Idéal si vous voulez vendre vite, sans attendre un acheteur.",
    points: ["Offre ferme sous 24h", "Paiement rapide après signature"],
  },
  {
    kicker: "Premium",
    title: "On vend pour vous",
    text: "Votre voiture certifiée, photographiée et publiée. Notre équipe gère les acheteurs et négocie le meilleur prix.",
    points: ["Le meilleur prix pour votre voiture", "Zéro paperasse pour vous"],
    featured: true,
  },
  {
    kicker: "Lite",
    title: "Annonce simple",
    text: "Votre annonce en ligne sur MoziMotors, vous gardez la main sur la vente. Parfait pour les villes non couvertes.",
    points: ["Publication gratuite", "Acheteurs vérifiés"],
  },
];

export function Formulas({ mobile = false }: { mobile?: boolean }) {
  const { t, href } = useV2();
  return (
    <section className={`bg-white ${mobile ? "px-4" : "px-8 lg:px-12"}`}>
      <div className={`mx-auto max-w-[1240px] border-t border-[color:var(--color-line-soft)] pb-2 ${mobile ? "pt-5" : "pt-10"}`}>
        <h2 className={`font-extrabold tracking-tight text-[color:var(--color-brand-dark)] ${mobile ? "text-[19px]" : "text-[26px]"}`}>
          {t("Vendre avec MoziMotors")}
        </h2>
        <p className={`mt-1 text-[color:var(--color-ink-muted)] ${mobile ? "text-[13px]" : "text-[15px]"}`}>
          {t("Trois formules, un seul objectif : le meilleur prix.")}
        </p>
        <div className={`mt-5 ${mobile ? "flex flex-col gap-3" : "grid grid-cols-3 gap-6"}`}>
          {FORMULAS.map((f) => (
            <a
              key={f.title}
              href={href(SELL_FORM)}
              className={`relative block rounded-xl bg-white transition-shadow hover:shadow-md ${mobile ? "p-4" : "p-6"} ${f.featured ? "border-2 border-[color:var(--color-brand-teal)]" : "border border-[color:var(--color-line-soft)]"}`}
            >
              {f.featured && (
                <span className="absolute -top-2.5 start-5 rounded-full bg-[color:var(--color-brand-teal)] px-3 py-0.5 text-[10px] font-bold uppercase tracking-[0.06em] text-white">
                  {t("Recommandé")}
                </span>
              )}
              <div className="text-[11px] font-bold uppercase tracking-[0.08em] text-[color:var(--color-brand-teal)]">{t(f.kicker)}</div>
              <div className={`mt-1 font-extrabold text-[color:var(--color-brand-dark)] ${mobile ? "text-[17px]" : "text-[20px]"}`}>{t(f.title)}</div>
              {!mobile && <p className="mt-2 text-[14px] leading-relaxed text-[color:var(--color-ink-muted)]">{t(f.text)}</p>}
              <div className="mt-3.5 flex flex-col gap-1.5">
                {f.points.map((p) => (
                  <div key={p} className="flex items-center gap-2 text-[13px] font-medium text-[color:var(--color-ink-base,#344054)]">
                    <CircleCheck className="size-[15px] shrink-0 text-[color:var(--color-brand-teal)]" aria-hidden="true" />
                    {t(p)}
                  </div>
                ))}
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- expertise ---------- */

const EXPERTISE = [
  ["exp-essai", "Essai routier", "Test des performances du véhicule."],
  ["exp-diagnostic", "Diagnostic électronique", "Analyse complète des systèmes électroniques."],
  ["exp-peinture", "Épaisseur de peinture", "Détection des réparations et retouches."],
  ["exp-pont", "Pont élévateur", "Inspection du dessous du véhicule."],
  ["exp-photos", "Photos professionnelles", "Mise en valeur du véhicule."],
  ["exp-rapport", "Rapport certifié", "Rapport complet pour rassurer l'acheteur."],
];

export function ExpertiseDesktop() {
  const { t, href } = useV2();
  return (
    <section id="expertise" className="scroll-mt-24 bg-white px-8 lg:scroll-mt-[88px] lg:px-12">
      <div className="mx-auto max-w-[1240px] border-t border-[color:var(--color-line-soft)] py-10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-[620px]">
            <h2 className="text-[26px] font-extrabold tracking-tight text-[color:var(--color-brand-dark)]">{t("Pourquoi l'expertise au hub change tout")}</h2>
            <p className="mt-2 text-[15px] leading-relaxed text-[color:var(--color-ink-muted)]">
              {t("Les acheteurs font confiance, et votre voiture se vend plus vite, au bon prix.")}
            </p>
          </div>
          <a
            className="inline-flex h-12 items-center rounded-full border-2 border-[color:var(--color-brand-teal)] px-6 text-[15px] font-bold text-[color:var(--color-brand-teal)] transition-colors hover:bg-[color:var(--color-brand-teal-soft)]"
            href={href(SELL_FORM)}
          >
            {t("Prendre RDV expertise")}
          </a>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {EXPERTISE.map(([img, label, d], i) => (
            <div
              key={img}
              className="flex items-start gap-4 rounded-2xl border border-[color:var(--color-line-soft)] bg-white px-5 py-4 transition-shadow hover:shadow-md"
            >
              <img src={`${S}/${img}-mozi.webp`} alt="" className="size-12 shrink-0 object-contain" loading="lazy" />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[12px] font-bold text-[color:var(--color-brand-teal)]">{String(i + 1).padStart(2, "0")}</span>
                  <div className="text-[16px] font-bold leading-tight text-[color:var(--color-brand-dark)]">{t(label)}</div>
                </div>
                <div className="mt-1 text-[13px] leading-snug text-[color:var(--color-ink-muted)]">{t(d)}</div>
              </div>
              <CircleCheck className="size-5 shrink-0 text-[color:var(--color-brand-teal)]" aria-hidden="true" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ExpertiseMobile() {
  const { t } = useV2();
  return (
    <section id="expertise-m" className="scroll-mt-24 bg-white px-4">
      <div className="border-t border-[color:var(--color-line-soft)] py-5">
        <h2 className="text-[19px] font-extrabold text-[color:var(--color-brand-dark)]">{t("Pourquoi l'expertise au hub change tout")}</h2>
        <p className="mt-1 text-[13px] text-[color:var(--color-ink-muted)]">{t("Les acheteurs font confiance, et votre voiture se vend plus vite, au bon prix.")}</p>
        <div className="mt-3.5 grid grid-cols-2 gap-x-3.5 gap-y-2.5">
          {EXPERTISE.map(([img, label]) => (
            <div key={img} className="flex items-center gap-2 text-[13.5px] font-semibold text-[color:var(--color-brand-dark)]">
              <CircleCheck className="size-[17px] shrink-0 text-[color:var(--color-brand-teal)]" aria-hidden="true" />
              {t(label)}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- prepare + map ---------- */

/** Approximate [lon, lat] of Moroccan cities, projected onto morocco-map.webp (fitted on siaracash.ma's pins). */
const COORDS: Record<string, [number, number]> = {
  Casablanca: [-7.59, 33.57],
  Mohammadia: [-7.38, 33.69],
  Mohammedia: [-7.38, 33.69],
  Rabat: [-6.84, 34.02],
  Salé: [-6.8, 34.05],
  Témara: [-6.91, 33.93],
  Kénitra: [-6.58, 34.26],
  "El Jadida": [-8.5, 33.25],
  Settat: [-7.62, 33.0],
  Bouskoura: [-7.65, 33.45],
  "Dar Bouazza": [-7.82, 33.52],
  Marrakech: [-7.99, 31.63],
  Fès: [-5.0, 34.03],
  Meknès: [-5.55, 33.89],
  Tanger: [-5.81, 35.76],
  Tétouan: [-5.37, 35.57],
  Agadir: [-9.6, 30.43],
  Oujda: [-1.91, 34.68],
};
const pinPos = (city: string) => {
  const c = COORDS[city];
  if (!c) return null;
  const x = 46.19 + (c[0] + 7.59) * 13.08;
  const y = 43.11 - (c[1] - 33.57) * 15.69;
  return x > 2 && x < 98 && y > 4 && y < 98 ? { x, y } : null;
};

function Pin({ color }: { color: string }) {
  return (
    <svg width="26" height="34" viewBox="0 0 26 34" className="relative block drop-shadow-[0_3px_4px_rgba(0,0,0,0.28)]" aria-hidden="true">
      <path d="M13 0C5.8 0 0 5.7 0 12.8 0 22.4 13 34 13 34s13-11.6 13-21.2C26 5.7 20.2 0 13 0Z" fill={color} />
      <circle cx="13" cy="12.8" r="5" fill="#fff" />
    </svg>
  );
}

function HubMap({ hubs, home }: { hubs: string[]; home: string[] }) {
  const { t } = useV2();
  const all = [...new Set([...hubs, ...home])];
  const cities = all;
  const [active, setActive] = useState(cities[0] ?? "");
  const isHub = (c: string) => hubs.includes(c);

  return (
    <div className="mt-5">
      <div className="flex flex-col">
        <style>
          {
            "@keyframes hubPulse{0%{transform:scale(.55);opacity:.5}70%{transform:scale(2.2);opacity:0}100%{transform:scale(2.2);opacity:0}}.hub-pulse{animation:hubPulse 1.8s ease-out infinite}"
          }
        </style>
        <div className="mt-4 flex flex-col gap-4">
          <div className="relative z-10 order-2 flex flex-col lg:order-1 lg:w-[150px]">
            {cities.map((c) => {
              const on = c === active;
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => setActive(c)}
                  className={`flex w-full items-center justify-between rounded-lg border px-2.5 py-1.5 text-start transition-colors ${on ? "border-[color:var(--color-brand-teal)] bg-[color:var(--color-brand-teal)]/10 text-[14px] font-bold text-[color:var(--color-brand-teal)]" : "border-transparent text-[13.5px] font-medium text-[color:var(--color-ink-muted)] hover:bg-white/70"}`}
                >
                  <span className="inline-flex min-w-0 items-center gap-2">
                    <MapPin className="size-[14px] shrink-0" aria-hidden="true" />
                    <span className="truncate">{c}</span>
                  </span>
                  {on && <ChevronRight className="size-3.5 shrink-0 rtl:rotate-180" aria-hidden="true" />}
                </button>
              );
            })}
          </div>
          <div className="relative order-1 aspect-square overflow-hidden rounded-[14px] bg-[#EDF4F5] lg:absolute lg:bg-transparent lg:end-0 lg:bottom-0 lg:z-0 lg:w-[62%] lg:overflow-visible lg:rounded-none">
            <img
              src={`${S}/morocco-map.webp`}
              alt={t("Carte du Maroc — nos centres et villes couvertes")}
              loading="lazy"
              className="absolute inset-0 size-full object-cover"
            />
            {cities.map((c) => {
              const p = pinPos(c);
              if (!p) return null;
              const on = c === active;
              const color = isHub(c) ? "var(--color-brand-teal)" : "var(--color-brand-purple)";
              return (
                <button
                  key={c}
                  type="button"
                  aria-label={c}
                  onClick={() => setActive(c)}
                  className="absolute -translate-x-1/2 -translate-y-full transition-transform hover:scale-110"
                  style={{ left: `${p.x}%`, top: `${p.y}%`, zIndex: on ? 5 : 2 }}
                >
                  {on && (
                    <span
                      className="hub-pulse pointer-events-none absolute bottom-0.5 left-1/2 -ml-[17px] size-[34px] rounded-full"
                      aria-hidden="true"
                      style={{ background: color }}
                    />
                  )}
                  <Pin color={color} />
                  {on && (
                    <span className="absolute bottom-full left-1/2 mb-1 -translate-x-1/2 whitespace-nowrap rounded-full bg-white/95 px-2.5 py-1 text-[12px] font-bold text-[color:var(--color-brand-dark)] shadow-sm">
                      {c}
                    </span>
                  )}
                </button>
              );
            })}
            <div className="absolute end-3 bottom-3 z-10 flex items-center gap-2.5 rounded-full bg-white/92 px-3 py-1.5 text-[11px] font-semibold shadow-[0_1px_4px_rgba(0,0,0,0.12)]">
              <span className="inline-flex items-center gap-1.5 text-[color:var(--color-brand-dark)]">
                <span className="size-2.5 rounded-full" style={{ background: "var(--color-brand-teal)" }} />
                {t("Hub")}
              </span>
              <span className="inline-flex items-center gap-1.5 text-[color:var(--color-brand-dark)]">
                <span className="size-2.5 rounded-full" style={{ background: "var(--color-brand-purple)" }} />{t("À domicile")}
              </span>
              <a
                href="https://www.openstreetmap.org/copyright"
                target="_blank"
                rel="noopener nofollow"
                className="border-s border-[color:var(--color-line-soft)] ps-2 text-[9px] font-medium text-[color:var(--color-ink-muted)] hover:underline"
              >
                © OSM
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Prepare({ hubs, home }: { hubs: string[]; home: string[] }) {
  const { t } = useV2();
  const docs = ["Carte grise du véhicule", "Carnet d'entretien", "Double des clés", "Détails du crédit en cours, le cas échéant"];
  return (
    <section className="bg-white px-4 pt-10 pb-8 lg:px-12 lg:pt-16 lg:pb-16">
      <div className="mx-auto max-w-[1240px]">
        <div className="mx-auto max-w-[640px] text-center">
          <h2 className="text-[26px] font-black tracking-tight text-[color:var(--color-brand-dark)] lg:text-[40px]">{t("Bien préparer votre vente")}</h2>
          <p className="mt-2 text-[14px] leading-relaxed text-[color:var(--color-ink-muted)] lg:mt-2.5 lg:text-[17px]">
            {t("MoziMotors vous accompagne à chaque étape avec des outils simples et un réseau d'experts")}{" "}
            <span className="font-semibold text-[color:var(--color-brand-teal)]">{t("proches de vous.")}</span>
          </p>
        </div>
        <div className="mt-6 grid gap-5 lg:mt-8 lg:grid-cols-2 lg:gap-7">
          <div className="relative rounded-[20px] mz-soft-grad p-6 lg:rounded-[24px] lg:p-8">
            <img
              src={`${S}/prep-docs-mozi.webp`}
              alt=""
              loading="lazy"
              className="pointer-events-none absolute hidden max-w-none -rotate-3 mz-shadow-docs lg:block lg:end-[-2%] lg:top-1/2 lg:w-[50%] lg:-translate-y-1/2"
            />
            <div className="relative lg:max-w-[38%]">
              <span className="inline-flex rounded-full bg-[color:var(--color-brand-purple)] px-3.5 py-1 text-[11px] font-bold uppercase tracking-[0.08em] text-white">
                {t("Étape 1")}
              </span>
              <h3 className="mt-4 text-[26px] font-black leading-[1.05] tracking-tight lg:text-[34px]">
                <span className="text-[color:var(--color-brand-dark)]">{t("À préparer")}</span>
                <br />
                <span className="text-[color:var(--color-brand-teal)]">{t("pour vendre")}</span>
              </h3>
              <div className="my-4 h-[3px] w-11 rounded-full bg-[color:var(--color-brand-teal)]" />
              <p className="text-[14px] leading-relaxed text-[color:var(--color-ink-muted)] lg:text-[15px]">
                {t("Réunissez ces documents pour une vente rapide et sans tracas.")}
              </p>
              <div className="mt-5 flex flex-col">
                {docs.map((d, i) => (
                  <div key={d} className={`flex items-center gap-3 py-3 ${i < docs.length - 1 ? "border-b border-[color:var(--color-brand-purple)]/12" : ""}`}>
                    <span className="grid size-9 shrink-0 place-items-center rounded-[10px] bg-white shadow-[0_1px_3px_rgba(0,0,0,.08)]">
                      <FileText className="size-4 text-[color:var(--color-brand-teal)]" aria-hidden="true" />
                    </span>
                    <span className="text-[14px] font-semibold leading-snug text-[color:var(--color-brand-dark)]">{t(d)}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative mt-5 flex items-center gap-3 rounded-xl bg-white/70 px-3.5 py-3 lg:max-w-[56%]">
              <ShieldCheck className="size-5 shrink-0 text-[color:var(--color-brand-purple)]" aria-hidden="true" />
              <p className="text-[13px] font-semibold leading-snug text-[color:var(--color-brand-purple)]">
                {t("Pas de panique : notre équipe vous aide à réunir le reste.")}
              </p>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-[20px] mz-soft-grad p-6 lg:min-h-[540px] lg:rounded-[24px] lg:p-8">
            <span className="inline-flex rounded-full bg-[color:var(--color-brand-teal)] px-3.5 py-1 text-[11px] font-bold uppercase tracking-[0.08em] text-white">
              {t("Étape 2")}
            </span>
            <h3 className="mt-4 text-[26px] font-black tracking-tight text-[color:var(--color-brand-dark)] lg:text-[34px]">{t("Où sommes-nous ?")}</h3>
            <p className="mt-2 max-w-[300px] text-[14px] leading-relaxed text-[color:var(--color-ink-muted)] lg:text-[15px]">
              {t("Trouvez le hub ou l'expertise le plus proche de vous.")}
            </p>
            <HubMap hubs={hubs} home={home} />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- SEO FAQ ---------- */

const know = (t: (s: string) => string): { q: string; a: React.ReactNode }[] => [
  {
    q: "Où vendre sa voiture au Maroc au meilleur prix ?",
    a: (
      <>
        {t("Entre les annonces classiques, les revendeurs et les plateformes, les écarts de prix sont énormes. Une voiture")}{" "}
        <strong className="text-[color:var(--color-brand-teal-text)]">{t("expertisée et certifiée")}</strong>{" "}
        {t("inspire confiance : l'acheteur sait exactement ce qu'il achète et négocie moins. C'est le principe de MoziMotors — l'expertise gratuite transforme votre voiture en annonce certifiée qui se démarque.")}
      </>
    ),
  },
  {
    q: "Qu'est-ce qu'une expertise automobile 140+ points ?",
    a: "C'est un contrôle professionnel complet : moteur, boîte, châssis sur pont élévateur, diagnostic électronique OBD, mesure d'épaisseur de peinture pour détecter les accidents cachés, essai routier et vérification des documents. Le rapport d'expertise qui en résulte est remis à l'acheteur — c'est lui qui déclenche la vente rapide.",
  },
  {
    q: "Combien vaut ma voiture d'occasion ?",
    a: (
      <>
        {t("Le prix dépend du modèle, de l'année, du kilométrage, de l'état réel et de la demande au Maroc. Après l'expertise, MoziMotors vous donne une")}{" "}
        <strong className="text-[color:var(--color-brand-teal-text)]">{t("estimation fondée sur le marché réel")}</strong>{" "}
        {t("— pas un chiffre au hasard — et une offre ferme sous 24h, sans engagement.")}
      </>
    ),
  },
  {
    q: "Combien de temps prend la vente de ma voiture ?",
    a: "Avec l'expertise gratuite MoziMotors, vous recevez une offre sous 24h après l'inspection. En vente immédiate, le paiement peut arriver sous 48h.",
  },
  {
    q: "L'expertise automobile est-elle vraiment gratuite ?",
    a: "Oui — les 140+ points de contrôle, le rapport complet et les photos professionnelles sont offerts, sans engagement de vendre.",
  },
  {
    q: "Ma ville n'a pas de hub, je peux quand même vendre ma voiture ?",
    a: "Oui, publiez une annonce digitale validée par notre équipe, visible partout au Maroc, ou déplacez-vous à notre showroom pour la certification.",
  },
  {
    q: "Comment suis-je payé ?",
    a: "Selon votre préférence : par chèque certifié ou par virement bancaire sécurisé. Le règlement est déclenché dès la signature du contrat, généralement sous 48 h.",
  },
  {
    q: "Que se passe-t-il si j'ai un crédit en cours ?",
    a: "Notre équipe gère la mainlevée avec votre organisme de crédit et le montant restant est déduit du paiement.",
  },
];

export function SellKnowHow() {
  const { t } = useV2();
  return (
    <section className="bg-[color:var(--color-surface-soft)] px-4 pt-10 pb-8 lg:px-12 lg:pt-16 lg:pb-16">
      <div className="mx-auto max-w-[1240px]">
        <h2 className="text-start text-[16px] font-medium lg:text-[32px] lg:font-semibold text-[color:var(--color-ink-strong)] lg:tracking-[-0.02em]">
          {t("Vendre sa voiture d'occasion au Maroc : ce qu'il faut savoir")}
        </h2>
        <div className="mt-4 grid gap-6 lg:mt-10 lg:grid-cols-2 lg:gap-x-10 lg:gap-y-8">
          {know(t).map((k) => (
            <article key={k.q}>
              <h3 className="text-[16px] font-bold text-[color:var(--color-brand-navy)] lg:text-[20px]">{t(k.q)}</h3>
              <p className="mt-2 text-[13px] leading-relaxed text-[color:var(--color-ink-muted)] lg:text-[14px]">{typeof k.a === "string" ? t(k.a) : k.a}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- CTAs ---------- */

export function SellBottomCta({ mobile = false }: { mobile?: boolean }) {
  const { t, href } = useV2();
  return (
    <section className={`bg-[color:var(--color-brand-purple)] ${mobile ? "px-4" : "px-8 lg:px-12"}`}>
      <div className={`mx-auto flex max-w-[1240px] items-center gap-8 ${mobile ? "flex-col py-6 text-center" : "justify-between py-10"}`}>
        <div>
          <div className={`font-black tracking-tight text-white ${mobile ? "text-[20px]" : "text-[30px]"}`}>
            {t("Prêt à vendre votre voiture en moins de 2 minutes ?")}
          </div>
          <div className={`mt-1 text-[color:var(--color-brand-purple-soft)] ${mobile ? "text-[13px]" : "text-[15px]"}`}>
            {t("Expertise gratuite, offre sous 24h, paiement sécurisé.")}
          </div>
        </div>
        {!mobile && (
          <a
            className="inline-flex h-12 shrink-0 items-center rounded-full bg-[color:var(--color-brand-teal)] px-7 text-[15px] font-bold text-white transition-transform hover:-translate-y-0.5"
            href={href(SELL_FORM)}
          >
            {t("Vendre ma voiture")}
          </a>
        )}
      </div>
    </section>
  );
}

/** Desktop: floating pill once the hero is scrolled past. Mobile: sticky bottom bar above the tab bar. */
export function SellFloatingCta() {
  const { t, href } = useV2();
  const [show, setShow] = useState(false);
  useEffect(() => {
    const on = () => setShow(window.scrollY > 520 && window.innerHeight + window.scrollY < document.body.scrollHeight - 700);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <>
      <div
        aria-hidden={!show}
        className={`pointer-events-none fixed inset-x-0 bottom-6 z-[60] hidden justify-center transition-all duration-300 motion-reduce:transition-none lg:flex ${show ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"}`}
      >
        <a
          tabIndex={show ? 0 : -1}
          className="pointer-events-auto inline-flex h-[52px] items-center gap-2 rounded-full bg-[color:var(--color-brand-teal)] hover:bg-[color:var(--color-brand-teal-hover)] px-8 text-[15px] font-bold text-white mz-shadow-pill transition-transform hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-brand-teal)] focus-visible:ring-offset-2"
          href={href(SELL_FORM)}
        >
          {t("Vendre ma voiture")}
          <ChevronRight className="size-4" aria-hidden="true" />
        </a>
      </div>
      <div
        style={{ bottom: "var(--bottom-nav-h, 0px)" }}
        className="cc-bottombar fixed inset-x-0 z-[60] flex gap-2.5 border-t border-[color:var(--color-line-soft)] bg-white p-3 shadow-[0_-6px_24px_rgba(0,45,93,.12)] lg:hidden"
      >
        <a
          className="flex h-12 flex-1 items-center justify-center rounded-full bg-[color:var(--color-brand-teal)] hover:bg-[color:var(--color-brand-teal-hover)] text-[15px] font-bold text-white"
          href={href(SELL_FORM)}
        >
          {t("Vendre ma voiture")}
        </a>
      </div>
    </>
  );
}
