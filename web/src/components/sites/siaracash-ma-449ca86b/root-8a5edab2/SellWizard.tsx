"use client";

/**
 * /v2/vendre/demande — siaracash.ma/sell/demande look (purple band, « Étape n sur 4 », teal progress,
 * overlapping white card) over the MoziMotors sell flow of src/components/sell-wizard.tsx:
 * 1 Ville (coverage) → 2 Coordonnées → 3 Véhicule → 4 Créneau d'inspection → one "estimation" lead to /api/leads.
 * Copy comes from the main site's dictionary for the current language (t.sellWizard), so it stays editable from Studio › Textes du site.
 * The lead payload stays in French for the back office.
 */
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, BadgeCheck, Check, House, Loader2, MapPin, Search, Store } from "lucide-react";
import { useI18n } from "@/i18n/client";
import { fmt as fill } from "@/i18n/core";
import { CONDITIONS, OTHER_CITY, SELL_CITIES, SELL_DOCUMENTS, coverageFor, nextInspectionDays, normalizeMaPhone } from "@/lib/sell";
import { FUEL_LABELS } from "@/lib/format";
import type { SiteSettings } from "@/lib/types";
import { HOME } from "./assets";
import { useV2 } from "./V2Locale";

type Step = 1 | 2 | 3 | 4 | "done";

interface Draft {
  step: Step;
  city: string;
  name: string;
  phone: string;
  email: string;
  plateSerial: string;
  plateLetter: string;
  plateRegion: string;
  brand: string;
  model: string;
  year: string;
  version: string;
  fuel: string;
  gearbox: string;
  mileage: string;
  condition: string;
  owner: boolean;
  documents: string[];
  place: "showroom" | "domicile" | "";
  day: string;
  slot: "matin" | "apres-midi" | "";
}

const EMPTY: Draft = {
  step: 1,
  city: "",
  name: "",
  phone: "",
  email: "",
  plateSerial: "",
  plateLetter: "",
  plateRegion: "",
  brand: "",
  model: "",
  year: "",
  version: "",
  fuel: "",
  gearbox: "",
  mileage: "",
  condition: "",
  owner: true,
  documents: [],
  place: "",
  day: "",
  slot: "",
};

const DRAFT_KEY = "mozi:v2-vente";
const PLATE_LETTERS = ["أ", "ب", "د", "ه", "و", "ط", "ج", "WW"];
const YEARS = Array.from({ length: 25 }, (_, i) => String(new Date().getFullYear() - i));

/* siaracash.ma form styles (shadcn input + label) */
const LABEL = "flex items-center gap-2 text-sm leading-none font-medium select-none";
const INPUT =
  "placeholder:text-muted-foreground border-input h-10 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]";
const SELECT = `${INPUT} bg-white`;
const PRIMARY =
  "mt-5 flex h-[50px] w-full items-center justify-center gap-2 rounded-full bg-[color:var(--color-brand-teal)] hover:bg-[color:var(--color-brand-teal-hover)] text-[15px] font-bold text-white mz-shadow-cta transition-colors disabled:opacity-40 disabled:shadow-none";
const TEAL_BOX = "flex items-start gap-2.5 rounded-xl p-3.5 text-sm bg-[color:var(--color-brand-teal-soft)] text-[color:var(--color-brand-teal-text)]";

const fmtDay = (iso: string, opts: Intl.DateTimeFormatOptions = { weekday: "long", day: "numeric", month: "long" }) =>
  new Date(iso).toLocaleDateString("fr-FR", opts);

function loadDraft(): Draft | null {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    return raw ? { ...EMPTY, ...JSON.parse(raw) } : null;
  } catch {
    return null;
  }
}
function saveDraft(d: Draft | null) {
  try {
    if (d) localStorage.setItem(DRAFT_KEY, JSON.stringify(d));
    else localStorage.removeItem(DRAFT_KEY);
  } catch {
    /* storage unavailable — the flow still works without resume */
  }
}

function Field({
  id,
  label,
  required,
  children,
  className = "",
}: {
  id?: string;
  label: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      <label className={LABEL} htmlFor={id}>
        {label} {required && <span className="text-[color:var(--color-danger)]">*</span>}
      </label>
      {children}
    </div>
  );
}

function Choice({ active, onClick, children, className = "" }: { active: boolean; onClick: () => void; children: React.ReactNode; className?: string }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`rounded-xl border px-3 py-3 text-sm font-semibold transition-colors ${active ? "border-[color:var(--color-brand-teal)] bg-[color:var(--color-brand-teal-soft)] text-[color:var(--color-brand-teal-text)]" : "border-[color:var(--color-line-medium)] bg-white text-[color:var(--color-ink-strong)] hover:border-[color:var(--color-brand-purple-border)]"} ${className}`}
    >
      {children}
    </button>
  );
}

export function V2SellWizard({
  initialCity,
  settings,
  models,
}: {
  initialCity?: string;
  settings: Pick<SiteSettings, "showroomCity" | "homeInspectionCities" | "address" | "phone">;
  /** Brand → models (brands in display order; « Autre » is added here). */
  models: Record<string, string[]>;
}) {
  const { t, num } = useI18n();
  const { t: tr, href } = useV2();
  const w = t.sellWizard;
  const cityLabel = (c: string) => (c === OTHER_CITY ? w.otherCity : c);
  const [d, setD] = useState<Draft>(() => ({ ...EMPTY, city: initialCity ?? "" }));
  const [resumed, setResumed] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [cityQuery, setCityQuery] = useState(initialCity ?? "");
  const [touched, setTouched] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const saved = loadDraft();
    /* eslint-disable react-hooks/set-state-in-effect -- one-time hydration from localStorage */
    if (saved && saved.step !== "done" && (saved.step !== 1 || saved.city)) {
      setD(initialCity && saved.step === 1 ? { ...saved, city: initialCity } : saved);
      setCityQuery(saved.city);
      setResumed(saved.step !== 1);
    }
    setHydrated(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [initialCity]);

  useEffect(() => {
    if (hydrated) saveDraft(d.step === "done" ? null : d);
  }, [d, hydrated]);

  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => setD((x) => ({ ...x, [k]: v }));
  const go = (step: Step) => {
    setTouched(false);
    setError("");
    setD((x) => ({ ...x, step }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const restart = () => {
    saveDraft(null);
    setD({ ...EMPTY });
    setCityQuery("");
    setResumed(false);
  };

  const cov = coverageFor(d.city, settings);
  const days = useMemo(() => nextInspectionDays(8).map((x) => x.toISOString().slice(0, 10)), []);
  const cities = useMemo(() => {
    const q = cityQuery.trim().toLowerCase();
    const list = SELL_CITIES.filter((c) => c.toLowerCase().includes(q));
    return q && !list.length ? [OTHER_CITY] : [...list, OTHER_CITY];
  }, [cityQuery]);
  const phone = normalizeMaPhone(d.phone);
  const emailOk = !d.email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email);
  const brandModels = models[d.brand] ?? [];

  const ok1 = Boolean(d.city);
  const ok2 = d.name.trim().length >= 2 && Boolean(phone) && emailOk;
  const ok3 = Boolean(d.brand && d.model.trim() && d.year && d.fuel && d.gearbox && Number(d.mileage) > 0 && d.condition);
  const needsSlot = cov.level !== "none";
  const ok4 = !needsSlot || Boolean(d.place && d.day && d.slot);

  async function submit() {
    setSending(true);
    setError("");
    const plate = [d.plateSerial, d.plateLetter, d.plateRegion].filter(Boolean).join(" | ");
    const inspection = needsSlot
      ? `${d.place === "showroom" ? "Au showroom" : "À domicile"} — ${fmtDay(d.day)} (${d.slot === "matin" ? "matin" : "après-midi"})`
      : "Ville non couverte — rappel par un conseiller";
    const body = {
      type: "estimation",
      lang: "fr",
      name: d.name.trim(),
      phone: phone ?? d.phone,
      email: d.email.trim(),
      city: d.city,
      brand: d.brand,
      model: d.model.trim(),
      year: d.year,
      version: d.version.trim() || "Je ne sais pas",
      fuel: FUEL_LABELS[d.fuel as keyof typeof FUEL_LABELS] ?? d.fuel,
      gearbox: d.gearbox === "automatique" ? "Automatique" : "Manuelle",
      mileage: d.mileage,
      condition: CONDITIONS.find((c) => c.value === d.condition)?.label ?? d.condition,
      plate,
      owner_carte_grise: d.owner ? "Oui" : "Non",
      documents: d.documents.join(", ") || "Aucun",
      inspection,
      message: `Demande de vente : ${d.brand} ${d.model} ${d.year}, ${d.mileage} km. Inspection : ${inspection}.`,
    };
    try {
      const res = await fetch("/api/leads", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      if (!res.ok) throw new Error(String(res.status));
      go("done");
    } catch {
      setError(w.error);
    } finally {
      setSending(false);
    }
  }

  const HEAD: Record<Exclude<Step, "done">, [string, string]> = {
    1: [w.heads.city.t, w.heads.city.s],
    2: [w.heads.contact.t, w.heads.contact.s],
    3: [w.heads.vehicle.t, w.heads.vehicle.s],
    4: needsSlot ? [w.heads.slot.t, w.heads.slot.s] : [w.heads.last.t, w.heads.last.s],
  };

  if (d.step === "done") {
    return (
      <Shell step="done" title={w.doneTitle} subtitle={w.doneSubtitle}>
        <div className="flex flex-col items-center text-center">
          <span className="grid size-16 place-items-center rounded-full bg-[color:var(--color-brand-teal-soft)]">
            <BadgeCheck className="size-8 text-[color:var(--color-brand-teal)]" aria-hidden="true" />
          </span>
          <h2 className="mt-5 text-[20px] font-extrabold leading-tight text-[color:var(--color-ink-strong)]">
            {needsSlot && d.day ? fill(w.doneWithDay, { day: fmtDay(d.day) }) : w.doneNoDay}
          </h2>
          <p className="mt-3 text-[14px] leading-relaxed text-[color:var(--color-ink-muted)]">{w.doneText}</p>
          {needsSlot && (
            <div className="mt-6 w-full rounded-xl bg-[color:var(--color-surface-soft)] p-5 text-start">
              <p className="text-sm font-bold text-[color:var(--color-ink-strong)]">{w.bringTitle}</p>
              <ul className="mt-3 flex flex-col gap-2">
                {w.bring.map((x) => (
                  <li key={x} className="flex items-center gap-2 text-sm text-[color:var(--color-ink-base)]">
                    <Check className="size-4 shrink-0 text-[color:var(--color-brand-teal)]" aria-hidden="true" /> {x}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="mt-8 flex w-full flex-col gap-2.5 sm:flex-row">
            <a
              href={href(HOME)}
              className="flex h-[50px] flex-1 items-center justify-center rounded-full border border-[color:var(--color-line-medium)] text-[15px] font-bold text-[color:var(--color-ink-strong)] hover:border-[color:var(--color-brand-purple-border)]"
            >
              {w.backHome}
            </a>
            <a
              href={href("/acheter")}
              className="flex h-[50px] flex-1 items-center justify-center rounded-full bg-[color:var(--color-brand-teal)] hover:bg-[color:var(--color-brand-teal-hover)] text-[15px] font-bold text-white"
            >
              {w.seeCars}
            </a>
          </div>
          <button type="button" onClick={restart} className="mt-5 text-sm font-bold text-[color:var(--color-brand-purple)] hover:underline">
            {w.sellAnother}
          </button>
        </div>
      </Shell>
    );
  }

  const step = d.step;
  const back = step > 1 ? () => go((step - 1) as Step) : () => history.back();

  return (
    <Shell step={step} title={HEAD[step][0]} subtitle={HEAD[step][1]} onBack={back} backLabel={w.prevStep}>
      {resumed && (
        <div className="mb-4 flex items-center justify-between gap-3 rounded-xl bg-[color:var(--color-brand-purple-soft)] px-4 py-3 text-sm text-[color:var(--color-brand-purple)]">
          <span>{w.resumed}</span>
          <button type="button" onClick={restart} className="shrink-0 font-bold hover:underline">
            {w.restart}
          </button>
        </div>
      )}

      {step === 1 && (
        <div>
          <label className="flex items-center gap-2 rounded-xl border border-[color:var(--color-line-medium)] bg-white px-3.5 py-3">
            <Search className="size-4 text-[color:var(--color-ink-soft)]" aria-hidden="true" />
            <input
              value={cityQuery}
              onChange={(e) => setCityQuery(e.target.value)}
              placeholder={tr("Rechercher votre ville…")}
              aria-label={w.citySearchLabel}
              className="w-full bg-transparent text-sm outline-none"
            />
          </label>
          <ul role="listbox" aria-label={w.cities} className="mt-3 max-h-72 space-y-1 overflow-y-auto">
            {cities.map((c) => {
              const active = d.city === c;
              return (
                <li key={c}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={active}
                    onClick={() => set("city", c)}
                    className={`flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-start text-sm transition-colors ${active ? "bg-[color:var(--color-brand-teal-soft)] font-semibold text-[color:var(--color-brand-teal-text)]" : "hover:bg-[color:var(--color-surface-soft)]"}`}
                  >
                    <MapPin className="size-4 shrink-0 text-[color:var(--color-brand-grey)]" aria-hidden="true" /> {cityLabel(c)}
                  </button>
                </li>
              );
            })}
          </ul>
          {d.city && (
            <div className={`mt-4 ${TEAL_BOX}`}>
              <BadgeCheck className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              <div>
                {cov.atHome && <p>{w.covHome}</p>}
                {cov.atShowroom && <p className={cov.atHome ? "mt-1 text-xs opacity-75" : ""}>{w.covShowroom}</p>}
                {cov.level === "none" && <p>{w.covNone}</p>}
              </div>
            </div>
          )}
          <button type="button" disabled={!ok1} onClick={() => go(2)} className={PRIMARY}>
            {w.continue}
          </button>
        </div>
      )}

      {step === 2 && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setTouched(true);
            if (ok2) go(3);
          }}
        >
          <div className="space-y-3">
            <Field id="sf-name" label={t.leadForm.name} required>
              <input id="sf-name" className={INPUT} value={d.name} onChange={(e) => set("name", e.target.value)} placeholder={tr("Votre nom")} autoComplete="name" />
            </Field>
            <Field id="sf-phone" label={t.leadForm.phone} required>
              <div
                className={`flex h-10 w-full items-center gap-2 rounded-md border bg-card px-3 text-sm focus-within:ring-2 focus-within:ring-ring ${touched && !phone ? "border-[color:var(--color-danger)]" : "border-input"}`}
              >
                <span className="flex shrink-0 items-center gap-1.5" dir="ltr">
                  <span aria-hidden="true">🇲🇦</span> +212
                </span>
                <input
                  id="sf-phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel-national"
                  className="h-full min-w-0 flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
                  value={d.phone}
                  onChange={(e) => set("phone", e.target.value)}
                  placeholder="6 12 34 56 78"
                />
              </div>
              {touched && !phone && <span className="block text-xs text-[color:var(--color-danger)]">{w.phoneError}</span>}
            </Field>
            <Field id="sf-email" label={w.emailOptional}>
              <input
                id="sf-email"
                type="email"
                inputMode="email"
                dir="ltr"
                className={INPUT}
                value={d.email}
                onChange={(e) => set("email", e.target.value)}
                placeholder="vous@exemple.ma"
                autoComplete="email"
              />
              {touched && !emailOk && <span className="block text-xs text-[color:var(--color-danger)]">{w.emailError}</span>}
            </Field>
          </div>
          <button type="submit" disabled={!ok2} className={PRIMARY}>
            {w.continue}
          </button>
        </form>
      )}

      {step === 3 && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setTouched(true);
            if (ok3) go(4);
          }}
        >
          <div className="space-y-4">
            <div className="space-y-1.5">
              <span className={LABEL}>{w.plate}</span>
              <div className="flex items-center gap-2 rounded-xl border border-[color:var(--color-line-medium)] p-1.5">
                <input
                  className="h-9 min-w-0 flex-[2] rounded-lg bg-[color:var(--color-surface-soft)] px-3 text-center text-sm tracking-widest outline-none"
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="12345"
                  aria-label={w.plateSerial}
                  value={d.plateSerial}
                  onChange={(e) => set("plateSerial", e.target.value.replace(/\D/g, ""))}
                />
                <span className="text-[color:var(--color-ink-muted)]">|</span>
                <select
                  aria-label={w.plateLetter}
                  className="h-9 flex-1 rounded-lg bg-[color:var(--color-surface-soft)] px-2 text-center text-sm outline-none"
                  value={d.plateLetter}
                  onChange={(e) => set("plateLetter", e.target.value)}
                >
                  <option value="">{w.plateLetter}</option>
                  {PLATE_LETTERS.map((l) => (
                    <option key={l}>{l}</option>
                  ))}
                </select>
                <span className="text-[color:var(--color-ink-muted)]">|</span>
                <input
                  className="h-9 min-w-0 flex-1 rounded-lg bg-[color:var(--color-surface-soft)] px-3 text-center text-sm outline-none"
                  inputMode="numeric"
                  maxLength={2}
                  placeholder={w.plateRegion}
                  aria-label={w.plateRegionLabel}
                  value={d.plateRegion}
                  onChange={(e) => set("plateRegion", e.target.value.replace(/\D/g, ""))}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Field id="sf-brand" label={w.brand} required>
                <select id="sf-brand" className={SELECT} value={d.brand} onChange={(e) => setD((x) => ({ ...x, brand: e.target.value, model: "" }))}>
                  <option value="">{w.brand}</option>
                  {[...Object.keys(models), "Autre"].map((b) => (
                    <option key={b} value={b}>
                      {b === "Autre" ? w.otherBrand : b}
                    </option>
                  ))}
                </select>
              </Field>
              <Field id="sf-model" label={w.model} required>
                <input
                  id="sf-model"
                  className={INPUT}
                  list="v2-sell-models"
                  value={d.model}
                  onChange={(e) => set("model", e.target.value)}
                  placeholder={w.modelPlaceholder}
                  disabled={!d.brand}
                />
                <datalist id="v2-sell-models">
                  {brandModels.map((m) => (
                    <option key={m} value={m} />
                  ))}
                </datalist>
              </Field>
              <Field id="sf-year" label={w.year} required>
                <select id="sf-year" className={SELECT} value={d.year} onChange={(e) => set("year", e.target.value)}>
                  <option value="">{w.year}</option>
                  {YEARS.map((y) => (
                    <option key={y}>{y}</option>
                  ))}
                </select>
              </Field>
              <Field id="sf-version" label={w.version}>
                <input
                  id="sf-version"
                  className={INPUT}
                  value={d.version}
                  onChange={(e) => set("version", e.target.value)}
                  placeholder={w.versionPlaceholder}
                />
              </Field>
              <Field id="sf-fuel" label={w.fuel} required>
                <select id="sf-fuel" className={SELECT} value={d.fuel} onChange={(e) => set("fuel", e.target.value)}>
                  <option value="">{w.fuel}</option>
                  {Object.entries(t.vehicle.fuel).map(([k, l]) => (
                    <option key={k} value={k}>
                      {l}
                    </option>
                  ))}
                </select>
              </Field>
              <Field id="sf-gearbox" label={w.gearbox} required>
                <select id="sf-gearbox" className={SELECT} value={d.gearbox} onChange={(e) => set("gearbox", e.target.value)}>
                  <option value="">{w.gearboxShort}</option>
                  <option value="manuelle">{t.vehicle.gearbox.manuelle}</option>
                  <option value="automatique">{t.vehicle.gearbox.automatique}</option>
                </select>
              </Field>
              <Field id="sf-km" label={w.mileage} required className="sm:col-span-2">
                <div className="relative">
                  <input
                    id="sf-km"
                    className={`${INPUT} pe-12`}
                    inputMode="numeric"
                    value={d.mileage ? num(Number(d.mileage)) : ""}
                    onChange={(e) => set("mileage", e.target.value.replace(/\D/g, "").slice(0, 7))}
                    placeholder={w.mileagePlaceholder}
                  />
                  <span className="pointer-events-none absolute end-3 top-1/2 -translate-y-1/2 text-sm text-[color:var(--color-ink-muted)]">km</span>
                </div>
              </Field>
            </div>

            <div className="space-y-1.5">
              <span className={LABEL}>
                {w.condition} <span className="text-[color:var(--color-danger)]">*</span>
              </span>
              <div className="grid grid-cols-3 gap-2">
                {CONDITIONS.map((c) => (
                  <Choice
                    key={c.value}
                    active={d.condition === c.value}
                    onClick={() => set("condition", c.value)}
                    className="flex flex-col items-center gap-0.5"
                  >
                    <span>{w.conditions[c.value].label}</span>
                    <span className="text-[11px] font-normal leading-4 text-[color:var(--color-ink-muted)]">{w.conditions[c.value].hint}</span>
                  </Choice>
                ))}
              </div>
            </div>

            <label className="flex cursor-pointer items-center gap-3 text-sm text-[color:var(--color-ink-base)]">
              <input
                type="checkbox"
                checked={d.owner}
                onChange={(e) => set("owner", e.target.checked)}
                className="size-5 accent-[color:var(--color-brand-purple)]"
              />
              {w.owner}
            </label>

            <div className="space-y-1.5">
              <span className={LABEL}>{w.documents}</span>
              <div className="flex flex-wrap gap-2">
                {SELL_DOCUMENTS.map((doc) => (
                  <Choice
                    key={doc}
                    active={d.documents.includes(doc)}
                    onClick={() => set("documents", d.documents.includes(doc) ? d.documents.filter((x) => x !== doc) : [...d.documents, doc])}
                    className="rounded-full px-4 py-2"
                  >
                    {w.docs[doc] ?? doc}
                  </Choice>
                ))}
              </div>
            </div>
            {touched && !ok3 && <p className="text-sm text-[color:var(--color-danger)]">{w.requiredHint}</p>}
          </div>
          <button type="submit" className={PRIMARY}>
            {w.continue}
          </button>
        </form>
      )}

      {step === 4 && (
        <div>
          <div className="space-y-5">
            {needsSlot ? (
              <>
                <div className="space-y-1.5">
                  <span className={LABEL}>{w.place}</span>
                  <div className="grid grid-cols-2 gap-2">
                    {cov.atShowroom && (
                      <Choice active={d.place === "showroom"} onClick={() => set("place", "showroom")} className="flex flex-col items-center gap-1.5 py-4">
                        <Store className="size-6" aria-hidden="true" />
                        {w.atShowroom}
                      </Choice>
                    )}
                    {cov.atHome && (
                      <Choice active={d.place === "domicile"} onClick={() => set("place", "domicile")} className="flex flex-col items-center gap-1.5 py-4">
                        <House className="size-6" aria-hidden="true" />
                        {w.atHome}
                      </Choice>
                    )}
                  </div>
                  {d.place === "showroom" && <p className="text-xs text-[color:var(--color-ink-muted)]">{settings.address}</p>}
                </div>

                <div className="space-y-1.5">
                  <span className={LABEL}>{w.chooseDay}</span>
                  <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 scrollbar-hide">
                    {days.map((iso) => {
                      const active = d.day === iso;
                      return (
                        <button
                          key={iso}
                          type="button"
                          aria-pressed={active}
                          onClick={() => set("day", iso)}
                          className={`flex w-16 shrink-0 flex-col items-center rounded-xl border py-2.5 transition-colors ${active ? "border-[color:var(--color-brand-purple)] bg-[color:var(--color-brand-purple)] text-white" : "border-[color:var(--color-line-medium)] bg-white text-[color:var(--color-ink-strong)] hover:border-[color:var(--color-brand-purple-border)]"}`}
                        >
                          <span className={`text-[11px] uppercase ${active ? "text-white/80" : "text-[color:var(--color-ink-muted)]"}`}>
                            {fmtDay(iso, { weekday: "short" })}
                          </span>
                          <span className="text-lg font-bold leading-6">{fmtDay(iso, { day: "numeric" })}</span>
                          <span className={`text-[11px] ${active ? "text-white/80" : "text-[color:var(--color-ink-muted)]"}`}>
                            {fmtDay(iso, { month: "short" })}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className={LABEL}>{w.slot}</span>
                  <div className="grid grid-cols-2 gap-2">
                    <Choice active={d.slot === "matin"} onClick={() => set("slot", "matin")}>
                      {w.morning} <span className="block text-[11px] font-normal text-[color:var(--color-ink-muted)]">{w.morningHours}</span>
                    </Choice>
                    <Choice active={d.slot === "apres-midi"} onClick={() => set("slot", "apres-midi")}>
                      {w.afternoon} <span className="block text-[11px] font-normal text-[color:var(--color-ink-muted)]">{w.afternoonHours}</span>
                    </Choice>
                  </div>
                </div>

                <div className="rounded-xl bg-[color:var(--color-surface-soft)] p-4">
                  <p className="text-sm font-bold text-[color:var(--color-ink-strong)]">{w.bringShort}</p>
                  <div className="mt-2 flex flex-wrap gap-x-5 gap-y-2">
                    {w.bring.map((x) => (
                      <span key={x} className="flex items-center gap-1.5 text-sm text-[color:var(--color-ink-base)]">
                        <Check className="size-4 text-[color:var(--color-brand-teal)]" aria-hidden="true" /> {x}
                      </span>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className={TEAL_BOX}>
                <BadgeCheck className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                <p>
                  {(() => {
                    const [before, after] = fill(w.notCovered, { showroom: settings.showroomCity ?? "Casablanca" }).split("{city}");
                    return (
                      <>
                        {before}
                        <strong>{d.city === OTHER_CITY ? w.yourCity : d.city}</strong>
                        {after}
                      </>
                    );
                  })()}
                </p>
              </div>
            )}

            <div className="rounded-xl border border-[color:var(--color-line-soft)] p-4 text-sm text-[color:var(--color-ink-base)]">
              <p className="font-bold text-[color:var(--color-ink-strong)]">
                {d.brand} {d.model} {d.year}
              </p>
              <p className="mt-1">
                {num(Number(d.mileage || 0))} km · {t.vehicle.fuel[d.fuel as keyof typeof t.vehicle.fuel] ?? ""} ·{" "}
                {d.gearbox ? t.vehicle.gearbox[d.gearbox as keyof typeof t.vehicle.gearbox] : ""} · {cityLabel(d.city)}
              </p>
              <p className="mt-1">
                {d.name} · <span dir="ltr">{phone}</span>
              </p>
            </div>

            {error && (
              <p className="text-sm text-[color:var(--color-danger)]" role="alert">
                {error}
              </p>
            )}
          </div>
          <button type="button" disabled={!ok4 || sending} onClick={submit} className={PRIMARY}>
            {sending && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
            {w.submit}
          </button>
          <p className="mt-3 text-center text-xs text-[color:var(--color-ink-muted)]">{w.footnote}</p>
        </div>
      )}
    </Shell>
  );
}

function Shell({
  step,
  title,
  subtitle,
  onBack,
  backLabel = "Retour",
  children,
}: {
  step: Step;
  title: string;
  subtitle: string;
  onBack?: () => void;
  backLabel?: string;
  children: React.ReactNode;
}) {
  const n = step === "done" ? 4 : step;
  return (
    <div className="min-h-[calc(100vh-64px)] bg-[color:var(--color-surface-soft)] pb-12">
      <div className="bg-[color:var(--color-brand-purple)] text-white">
        <div className="mx-auto w-full max-w-xl px-5 pb-16 pt-4 sm:px-6">
          <div className="mb-4 flex items-center gap-3">
            {onBack && (
              <button
                type="button"
                aria-label={backLabel}
                onClick={onBack}
                className="grid size-8 shrink-0 place-items-center rounded-full bg-white/15 text-white transition-colors hover:bg-white/25"
              >
                <ArrowLeft className="size-4 rtl:rotate-180" aria-hidden="true" />
              </button>
            )}
            <span className="text-xs font-bold uppercase tracking-wide text-white/75">{step === "done" ? "Terminé" : `Étape ${step} sur 4`}</span>
          </div>
          <h1 className="text-[22px] font-extrabold leading-tight tracking-[-0.01em] sm:text-[23px]">{title}</h1>
          <p className="mt-1.5 text-[13.5px] text-white/80">{subtitle}</p>
          <div className="mt-4 flex gap-1.5" aria-hidden="true">
            {[1, 2, 3, 4].map((k) => (
              <span key={k} className="h-[5px] flex-1 rounded-full" style={{ background: k <= n ? "#e8b4bb" : "rgba(255, 255, 255, 0.25)" }} />
            ))}
          </div>
        </div>
      </div>
      <div className="mx-auto w-full max-w-xl px-4 transition-[max-width] duration-300">
        <div className="relative z-10 -mt-12 rounded-[20px] border border-[color:var(--color-line-soft)] bg-white p-5 shadow-[0_8px_24px_-8px_rgba(16,24,40,0.20)] sm:p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
