"use client";

/** Content blocks of the siaracash.ma car page, fed with a MoziMotors car (see `toDetail` in listing.ts). */
import { useRef, useState } from "react";
import {
  BadgeCheck,
  Car as CarIcon,
  Check,
  ChevronLeft,
  ChevronRight,
  Circle,
  CircleCheck,
  Gauge,
  Heart,
  Info,
  MapPin,
  Search,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import { A } from "./assets";
import { Accordion, Section, SpecRow } from "./ui";
import { useFavorites } from "./favorites";
import type { ListedCar } from "./listing";
import { useV2 } from "./V2Locale";

export type Highlight = { icon: "badge" | "check" | "shield" | "car" | "gauge"; title: string; text: string };
export type FeatureTab = { id: string; label: string; rows: { label: string; value: string | boolean }[] };

const HIGHLIGHT_ICONS: Record<Highlight["icon"], LucideIcon> = { badge: BadgeCheck, check: Check, shield: ShieldCheck, car: CarIcon, gauge: Gauge };

export function WhyThisCar({ items }: { items: Highlight[] }) {
  const { t } = useV2();
  if (!items.length) return null;
  return (
    <Section id="highlights" title={t("Pourquoi choisir cette voiture ?")}>
      <ul className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {items.map((h) => {
          const Icon = HIGHLIGHT_ICONS[h.icon];
          return (
            <li key={h.title} className="flex gap-3">
              <Icon className="size-6 shrink-0 text-[var(--cc-primary)]" aria-hidden="true" />
              <div>
                <p className="text-[15px] font-bold text-[var(--cc-ink)]">{t(h.title)}</p>
                <p className="text-[13px] text-[var(--cc-muted)]">{t(h.text)}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}

export function Overview({ rows }: { rows: [string, string][] }) {
  const { t } = useV2();
  return (
    <Section id="overview" title={t("Aperçu du véhicule")}>
      <div className="grid grid-cols-1 gap-x-8 lg:grid-cols-2">
        {rows.map(([k, v]) => (
          <SpecRow key={k} label={k}>
            {v}
          </SpecRow>
        ))}
      </div>
    </Section>
  );
}

function FeatureValue({ value }: { value: string | boolean }) {
  const { t } = useV2();
  if (typeof value === "string") return <span className="text-right font-semibold text-[var(--cc-ink)]">{t(value)}</span>;
  return (
    <span className={`flex shrink-0 items-center gap-1.5 font-bold ${value ? "text-[var(--cc-success-text)]" : "text-[var(--cc-muted)]"}`}>
      {value ? <CircleCheck className="size-[18px]" aria-hidden="true" /> : <Circle className="size-[18px]" aria-hidden="true" />}
      <span className="min-w-[32px]">{t(value ? "Oui" : "Non")}</span>
    </span>
  );
}

/** « Caractéristiques »: search + Résumé / Multimédia / Confort / Sécurité / Extérieur tabs. */
export function Features({ tabs }: { tabs: FeatureTab[] }) {
  const { t } = useV2();
  const [tab, setTab] = useState(tabs[0]?.id);
  const [q, setQ] = useState("");
  const [all, setAll] = useState(false);
  const needle = q.toLowerCase().trim();
  const LIMIT = 18;

  // Searching looks across every tab; otherwise the selected tab (Résumé capped until « Voir toutes »).
  const rows = needle ? tabs.flatMap((x) => x.rows).filter((r) => t(r.label).toLowerCase().includes(needle)) : (tabs.find((x) => x.id === tab)?.rows ?? []);
  const shown = needle || all ? rows : rows.slice(0, LIMIT);

  return (
    <Section id="specs" title={t("Caractéristiques")}>
      <label className="mb-4 flex w-full items-center gap-2 rounded-lg border border-[var(--cc-line)] px-3 py-2.5 text-left">
        <Search className="size-4 text-[var(--cc-muted)]" aria-hidden="true" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={t("Rechercher une caractéristique")}
          aria-label={t("Rechercher une caractéristique")}
          className="w-full bg-transparent text-[13px] text-[var(--cc-ink)] outline-none placeholder:text-[var(--cc-muted)]"
        />
      </label>
      {!needle && (
        <div className="mb-4 flex gap-2 overflow-x-auto cc-noscroll">
          {tabs.map((x) => (
            <button
              key={x.id}
              type="button"
              aria-pressed={x.id === tab}
              onClick={() => setTab(x.id)}
              className={`whitespace-nowrap rounded-full px-3 py-1.5 text-[12px] font-semibold transition-colors ${x.id === tab ? "bg-[var(--cc-primary)] text-white" : "bg-[var(--cc-soft)] text-[var(--cc-body)] hover:bg-[var(--cc-primary-tint)]"}`}
            >
              {t(x.label)}
            </button>
          ))}
        </div>
      )}
      <div className="grid grid-cols-1 gap-x-8 sm:grid-cols-2">
        {shown.map((r) => (
          <div key={r.label} className="flex items-center justify-between border-b border-[var(--cc-line)] py-2.5 text-[13px]">
            <span className="text-[var(--cc-muted)]">{t(r.label)}</span>
            <FeatureValue value={r.value} />
          </div>
        ))}
        {shown.length === 0 && <p className="py-4 text-[13px] text-[var(--cc-muted)]">{t("Aucune caractéristique trouvée.")}</p>}
      </div>
      {!needle && rows.length > LIMIT && (
        <button onClick={() => setAll((a) => !a)} className="cc-btn cc-btn-outline cc-btn-block mt-4 w-full">
          {t(all ? "Voir moins" : "Voir toutes les caractéristiques")}
        </button>
      )}
    </Section>
  );
}

/** « Votre sérénité avec MoziMotors » + purple « Rapport d'expertise gratuit » banner. */
export function Serenity({ checks, reportUrl }: { checks: string[]; reportUrl?: string }) {
  const { t } = useV2();
  return (
    <Section id="report" title={t("Votre sérénité avec MoziMotors")} cardClass="!border-[color:var(--color-brand-purple)]">
      {checks.length > 0 && (
        <ul className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
          {checks.map((c) => (
            <li key={c} className="flex items-center gap-2.5 text-[14px] font-medium text-[var(--cc-ink)]">
              <span className="grid size-5 shrink-0 place-items-center rounded-full bg-[var(--cc-success)]">
                <Check className="size-3 text-white" aria-hidden="true" />
              </span>
              {t(c)}
            </li>
          ))}
        </ul>
      )}
      <p className="mt-3 text-[13px] text-[var(--cc-muted)]">{t("Consultez le rapport d'expertise complet ci-dessous.")}</p>
      <div className="relative -mx-4 -mb-4 mt-4 overflow-hidden rounded-xl rounded-b-[var(--cc-r-card)] bg-[var(--cc-accent)] text-white lg:-mx-5 lg:-mb-5">
        <div
          className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-25 mix-blend-soft-light"
          style={{ backgroundImage: `url('${A}/assets/voiture/assurance-waves.png')` }}
          aria-hidden="true"
        />
        <div className="relative p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-5">
            <div className="flex items-center gap-4 lg:flex-1">
              <img src={`${A}/assets/voiture/assurance-envelope-mozi.png`} alt="" className="size-24 shrink-0 object-contain" />
              <div>
                <p className="text-[16px] font-bold">{t("Rapport d'expertise gratuit")}</p>
                <p className="mt-1 text-[13px] leading-relaxed text-white/85">
                  {t("Chaque voiture du stock MoziMotors est livrée avec un rapport d'expertise complet.")}
                </p>
              </div>
            </div>
            {reportUrl && (
              <a
                href={reportUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 self-start rounded-full bg-white px-5 py-2.5 text-[14px] font-bold text-[var(--cc-accent)] lg:self-auto"
              >
                {t("Télécharger le rapport")}
              </a>
            )}
          </div>
        </div>
      </div>
    </Section>
  );
}

export function QualityPledge() {
  const { t } = useV2();
  return (
    <div className="cc-card p-4 lg:p-5">
      <div className="flex items-start gap-4">
        <div className="flex-1">
          <h2 className="text-[18px] font-bold lg:text-[20px]">{t("L'engagement qualité MoziMotors")}</h2>
          <p className="mt-1 text-[13px] text-[var(--cc-body)]">{t("Chaque voiture passe une inspection rigoureuse pour garantir qualité et fiabilité.")}</p>
          <p className="mt-2 inline-flex items-center gap-1.5 text-[13px] font-semibold text-[var(--cc-ink)]">
            {t("Plus de 140 points vérifiés")}
            <span className="relative inline-flex items-center align-middle" title={t("Moteur, boîte, freins, suspension, carrosserie, intérieur et électronique.")}>
              <Info className="size-3.5 opacity-60" aria-hidden="true" />
            </span>
          </p>
        </div>
        <ShieldCheck className="size-14 shrink-0 text-[var(--cc-primary)]" aria-hidden="true" />
      </div>
      <div className="mt-4">
        <Accordion
          defaultOpen={-1}
          items={[
            {
              q: "Notre inspection 140+ points",
              a: "Nos experts contrôlent plus de 140 points : moteur, boîte, freins, suspension, carrosserie, intérieur et électronique — consignés dans le rapport d'expertise.",
            },
            {
              q: "Nos standards qualité",
              a: "Seules les voitures qui réussissent l'inspection rejoignent le stock MoziMotors. Chaque véhicule est reconditionné et garanti.",
            },
          ]}
        />
      </div>
    </div>
  );
}

export function Condition({ id = "condition", label, imperfections, reportHref }: { id?: string; label: string; imperfections: number; reportHref: string }) {
  const { t, tf } = useV2();
  const impText =
    imperfections > 0 ? tf(imperfections > 1 ? "{n} imperfections signalées" : "{n} imperfection signalée", { n: imperfections }) : t("Aucune imperfection signalée");
  return (
    <Section id={id} title={t("État du véhicule")}>
      <div className="-mt-2">
        <Accordion
          items={[
            { q: label, a: "Consultez le rapport d'expertise pour le détail des constats." },
            { q: "Imperfections", a: impText },
          ]}
        />
      </div>
      <div
        className={`mt-3 flex flex-col items-center rounded-lg p-3.5 text-center ${imperfections > 0 ? "bg-[var(--color-warning-soft)]" : "bg-[var(--cc-success-bg)]"}`}
      >
        <span className={`grid size-8 place-items-center rounded-full ${imperfections > 0 ? "bg-[var(--color-warning)]" : "bg-[var(--cc-success)]"}`}>
          {imperfections > 0 ? <Info className="size-4 text-white" aria-hidden="true" /> : <Check className="size-4 text-white" aria-hidden="true" />}
        </span>
        <p className="mt-2 text-[13px] font-semibold text-black">{impText}</p>
        <p className="text-[11px] text-black/65">{t("Détails dans le rapport d'expertise")}</p>
      </div>
      <a
        href={reportHref}
        {...(reportHref.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        className="cc-btn cc-btn-outline cc-btn-block mt-4 w-full"
      >
        {t("Voir le rapport d'expertise complet")}
      </a>
    </Section>
  );
}

const CAR_FAQ = [
  {
    q: "Comment acheter une voiture ?",
    a: "Choisissez votre voiture en ligne, finalisez en toute sécurité, et nous vous la livrons avec tous les papiers en règle.",
  },
  { q: "La carte grise est-elle incluse ?", a: "Oui — le transfert de carte grise est inclus dans le prix affiché pour les voitures du stock MoziMotors." },
  { q: "Les prix sont-ils négociables ?", a: "Nos prix sont alignés sur le marché pour un tarif juste, sans marchandage." },
  {
    q: "Puis-je faire inspecter la voiture avant l'achat ?",
    a: "Absolument. Chaque voiture du stock MoziMotors est livrée avec un rapport d'expertise complet.",
  },
  { q: "Les essais sont-ils possibles ?", a: "Oui, réservez un essai dans le showroom MoziMotors le plus proche." },
];

export function CarFaq() {
  const { t } = useV2();
  return (
    <Section title={t("Questions fréquentes")}>
      <Accordion items={CAR_FAQ} />
    </Section>
  );
}

/* ---------- similar cars ---------- */

function Tags({ car }: { car: ListedCar }) {
  const { t } = useV2();
  return (
    <span className="flex flex-wrap items-center justify-end gap-1">
      {car.certified ? (
        <span className="flex items-center gap-1 rounded px-1.5 py-0.5 text-[11px] font-semibold bg-[var(--cc-success-bg)] text-[var(--cc-success-text)]">
          <ShieldCheck className="size-3" aria-hidden="true" /> {t("Certifié")}
        </span>
      ) : (
        <span className="flex items-center gap-1 rounded px-1.5 py-0.5 text-[11px] font-semibold bg-[var(--cc-primary-tint)] text-[var(--cc-primary)]">
          <ShieldCheck className="size-3" aria-hidden="true" /> {t("Non Certifié")}
        </span>
      )}
    </span>
  );
}

function SaveHeart({ id, className, iconClass }: { id: string; className: string; iconClass: string }) {
  const { t } = useV2();
  const fav = useFavorites();
  const on = fav.has(id);
  return (
    <button
      type="button"
      aria-label={t("Enregistrer")}
      aria-pressed={on}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        fav.toggle(id);
      }}
      className={className}
    >
      <Heart className={`${iconClass} ${on ? "fill-current text-[var(--cc-primary)]" : "text-[var(--cc-body)]"}`} aria-hidden="true" />
    </button>
  );
}

export function SimilarDesktop({ cars }: { cars: ListedCar[] }) {
  const { t, href } = useV2();
  const track = useRef<HTMLDivElement>(null);
  if (!cars.length) return null;
  const scroll = (d: number) => track.current?.scrollBy({ left: d * 296 });
  return (
    <div id="similar" className="cc-card p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-[20px] font-bold lg:text-[24px]">{t("Voitures similaires")}</h2>
        <div className="hidden gap-2 lg:flex">
          <button
            aria-label={t("Précédent")}
            onClick={() => scroll(-1)}
            className="grid size-9 place-items-center rounded-full border border-[var(--cc-line)] hover:bg-[var(--cc-soft)]"
          >
            <ChevronLeft className="size-4" aria-hidden="true" />
          </button>
          <button
            aria-label={t("Suivant")}
            onClick={() => scroll(1)}
            className="grid size-9 place-items-center rounded-full border border-[var(--cc-line)] hover:bg-[var(--cc-soft)]"
          >
            <ChevronRight className="size-4" aria-hidden="true" />
          </button>
        </div>
      </div>
      <div ref={track} className="cc-track">
        {cars.map((c) => (
          <a key={c.id} href={href(c.href)} className="block">
            <div className="cc-hovercard w-[280px] overflow-hidden rounded-xl border border-[var(--cc-line)] bg-white">
              <div className="relative aspect-[16/10] bg-[var(--cc-soft)]">
                {c.images[0] && <img src={c.images[0]} alt={c.title} loading="lazy" className="absolute inset-0 size-full object-cover" />}
                <SaveHeart id={c.id} className="absolute right-2 top-2 grid size-8 place-items-center rounded-full bg-white/90 shadow" iconClass="size-3.5" />
              </div>
              <div className="p-3">
                <h3 className="truncate text-[14px] font-semibold text-[var(--cc-ink)]">{c.title}</h3>
                <p className="text-[12px] text-[var(--cc-muted)]">{c.version}</p>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {[c.km, c.gearbox, c.fuel].map((x) => (
                    <span key={x} className="rounded border border-[var(--cc-line)] px-1.5 py-0.5 text-[11px] text-[var(--cc-body)]">
                      {t(x)}
                    </span>
                  ))}
                </div>
                <p className="text-[13px] font-semibold text-[var(--cc-ink)]">{c.price} </p>
                <div className="mt-2.5 flex items-center justify-between border-t border-[var(--cc-line)] pt-2.5">
                  <span className="flex items-center gap-1 text-[12px] text-[var(--cc-body)]">
                    <MapPin className="size-3.5 text-[var(--cc-primary)]" aria-hidden="true" /> {c.city}
                  </span>
                  <Tags car={c} />
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

export function SimilarMobile({ cars }: { cars: ListedCar[] }) {
  const { t, href } = useV2();
  const [n, setN] = useState(3);
  if (!cars.length) return null;
  return (
    <div id="similar">
      <h2 className="mb-2.5 text-[17px] font-bold !text-[var(--cc-primary)]">{t("Voitures similaires")}</h2>
      <div className="space-y-3">
        {cars.slice(0, n).map((c) => (
          <a key={c.id} href={href(c.href)} className="block">
            <div className="rounded-xl border border-[var(--cc-line)] bg-white">
              <div className="flex items-stretch gap-3">
                <div className="min-w-0 flex-[2] py-3 pl-3">
                  <h3 className="truncate text-[15px] font-bold text-[var(--cc-ink)]">{c.title}</h3>
                  <p className="truncate text-[13px] text-[var(--cc-muted)]">{c.version}</p>
                  <p className="mt-1 text-[15px] font-bold text-[var(--cc-ink)]">{c.price} </p>
                  <div className="mt-2 flex flex-wrap items-center gap-1.5">
                    {[c.fuel, c.gearbox, c.km].map((x) => (
                      <span key={x} className="rounded border border-[var(--cc-line)] px-2 py-0.5 text-[11px] font-medium text-[var(--cc-body)]">
                        {t(x)}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="relative min-h-[118px] flex-1 overflow-hidden rounded-tr-xl bg-[var(--cc-soft)]">
                  {c.images[0] && <img alt={c.title} loading="lazy" className="absolute inset-0 size-full object-cover" src={c.images[0]} />}
                  <SaveHeart id={c.id} className="absolute right-1.5 top-1.5 grid size-6 place-items-center rounded-full bg-white/90" iconClass="size-3" />
                </div>
              </div>
              <div className="flex items-center justify-between border-t border-[var(--cc-line)] px-3 pb-3 pt-2.5">
                <span className="flex items-center gap-1 text-[12px] text-[var(--cc-body)]">
                  <MapPin className="size-3.5 text-[var(--cc-primary)]" aria-hidden="true" /> {c.city}
                </span>
                <Tags car={c} />
              </div>
            </div>
          </a>
        ))}
      </div>
      {n < cars.length && (
        <button onClick={() => setN((x) => x + 3)} className="cc-btn cc-btn-outline cc-btn-block mt-3 w-full">
          {t("Voir plus")}
        </button>
      )}
    </div>
  );
}
