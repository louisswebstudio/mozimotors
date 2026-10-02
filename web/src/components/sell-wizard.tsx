"use client";

/**
 * « Vendre ma voiture » — 4-step request flow modelled on siaracash.ma/sell/demande:
 * 1 Ville (coverage check) → 2 Coordonnées → 3 Véhicule → 4 Rendez-vous d'inspection.
 * The draft is kept in localStorage so a visitor can come back to it; the final step posts
 * one "estimation" lead to /api/leads (→ WordPress › Demandes).
 */
import Link from "@/i18n/link";
import { useI18n } from "@/i18n/client";
import { fmt as fill } from "@/i18n/core";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Check, Home, Loader2, MapPin, Search, Store } from "lucide-react";
import { ArrowIcon } from "@/components/sites/boxcars-framer-website-cd8da657/root-8a5edab2/ui";
import { CheckBadge } from "@/components/sites/boxcars-framer-website-cd8da657/shared/page";
import {
  CONDITIONS, OTHER_CITY, SELL_BRANDS, SELL_CITIES, SELL_DOCUMENTS, coverageFor, nextInspectionDays, normalizeMaPhone,
} from "@/lib/sell";
import { FUEL_LABELS } from "@/lib/format";
import { INTL_LOCALE } from "@/i18n/config";
import type { SiteSettings } from "@/lib/types";

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
  day: string; // ISO date
  slot: "matin" | "apres-midi" | "";
}

const EMPTY: Draft = {
  step: 1, city: "", name: "", phone: "", email: "", plateSerial: "", plateLetter: "", plateRegion: "",
  brand: "", model: "", year: "", version: "", fuel: "", gearbox: "", mileage: "", condition: "", owner: true,
  documents: [], place: "", day: "", slot: "",
};

const DRAFT_KEY = "mozi:vente";
const PLATE_LETTERS = ["أ", "ب", "د", "ه", "و", "ط", "ج", "WW"];
const YEARS = Array.from({ length: 25 }, (_, i) => String(new Date().getFullYear() - i));

const labelCls = "mb-2.5 block text-sm leading-5 text-[#818181]";
const inputCls =
  "h-12 w-full rounded-xl border border-bx-line bg-white px-4 text-sm text-bx-navy outline-none transition-colors duration-300 placeholder:text-bx-muted focus:border-bx-blue";
const selectCls = `${inputCls} appearance-none bg-[url('data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20viewBox=%220%200%2024%2024%22%20fill=%22none%22%20stroke=%22%23050B20%22%20stroke-width=%221.5%22%20stroke-linecap=%22round%22%20stroke-linejoin=%22round%22%3E%3Cpath%20d=%22m6%209%206%206%206-6%22/%3E%3C/svg%3E')] bg-[length:16px] bg-[right_16px_center] bg-no-repeat rtl:bg-[left_16px_center] pe-10`;

/** Dates for the WordPress payload stay in French (the team reads Demandes in French); the UI uses `dayLabel`. */
const fmtDay = (iso: string, opts: Intl.DateTimeFormatOptions = { weekday: "long", day: "numeric", month: "long" }, tag = "fr-FR") =>
  new Date(iso).toLocaleDateString(tag, opts);

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
    /* storage unavailable — the flow still works, just without resume */
  }
}

/* ------------------------------------------------------------------ small UI pieces */

function Field({ label, required, children, className = "" }: { label: string; required?: boolean; children: React.ReactNode; className?: string }) {
  return (
    <label className={`block ${className}`}>
      <span className={labelCls}>
        {label} {required && <span className="text-bx-blue">*</span>}
      </span>
      {children}
    </label>
  );
}

function Choice({ active, onClick, children, className = "" }: { active: boolean; onClick: () => void; children: React.ReactNode; className?: string }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`rounded-xl border px-3 py-3 text-sm font-medium transition-colors duration-300 bx-ease ${
        active ? "border-bx-blue bg-bx-lavender text-bx-navy" : "border-bx-line bg-white text-bx-ink hover:border-bx-navy"
      } ${className}`}
    >
      {children}
    </button>
  );
}

function PrimaryButton({ disabled, onClick, children, type = "button" }: { disabled?: boolean; onClick?: () => void; children: React.ReactNode; type?: "button" | "submit" }) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className="flex h-12 w-full items-center justify-center gap-2.5 rounded-xl bg-bx-blue px-6 text-[15px] font-medium text-white transition-colors duration-300 bx-ease hover:bg-bx-blue-hover disabled:cursor-not-allowed disabled:bg-bx-blue/40"
    >
      {children}
    </button>
  );
}

/* ------------------------------------------------------------------ wizard */

export function SellWizard({
  initialCity,
  settings,
  models,
}: {
  initialCity?: string;
  settings: Pick<SiteSettings, "showroomCity" | "homeInspectionCities" | "address" | "phone">;
  /** brand name → models seen in stock, used as suggestions */
  models: Record<string, string[]>;
}) {
  const { t, locale, num } = useI18n();
  const w = t.sellWizard;
  const dayLabel = (iso: string, opts?: Intl.DateTimeFormatOptions) => fmtDay(iso, opts, INTL_LOCALE[locale]);
  const cityLabel = (c: string) => (c === OTHER_CITY ? w.otherCity : c);
  const [d, setD] = useState<Draft>(() => ({ ...EMPTY, city: initialCity ?? "" }));
  const [resumed, setResumed] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [cityQuery, setCityQuery] = useState(initialCity ?? "");
  const [touched, setTouched] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  // Resume a saved draft once on mount (client only).
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

  /* ---------- validity per step */
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
      lang: locale,
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

  /* ---------- header copy per step */
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
          <span className="grid size-16 place-items-center rounded-full bg-bx-lavender">
            <CheckBadge className="size-8" />
          </span>
          <h2 className="mt-5 text-xl font-medium leading-7 text-bx-navy">
            {needsSlot && d.day
              ? fill(w.doneWithDay, { day: dayLabel(d.day, { weekday: "long", day: "numeric", month: "long" }) })
              : w.doneNoDay}
          </h2>
          <p className="mt-3 text-[15px] leading-6 text-bx-ink">
            {w.doneText}
          </p>
          {needsSlot && (
            <div className="mt-6 w-full rounded-xl bg-bx-soft p-5 text-start">
              <p className="text-sm font-medium text-bx-navy">{w.bringTitle}</p>
              <ul className="mt-3 flex flex-col gap-2">
                {w.bring.map((x) => (
                  <li key={x} className="flex items-center gap-2 text-sm text-bx-ink">
                    <CheckBadge className="size-4 shrink-0" /> {x}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="mt-8 flex w-full flex-col gap-2.5 bxt:flex-row">
            <Link href="/" className="flex h-12 flex-1 items-center justify-center rounded-xl border border-bx-line text-[15px] font-medium text-bx-navy hover:border-bx-navy">
              {w.backHome}
            </Link>
            <Link href="/acheter" className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-bx-blue text-[15px] font-medium text-white hover:bg-bx-blue-hover">
              {w.seeCars} <ArrowIcon />
            </Link>
          </div>
          <button type="button" onClick={restart} className="mt-5 text-sm font-medium text-bx-blue hover:text-bx-blue-hover">
            {w.sellAnother}
          </button>
        </div>
      </Shell>
    );
  }

  const step = d.step;
  const back = step > 1 ? () => go((step - 1) as Step) : undefined;

  return (
    <Shell step={step} title={HEAD[step][0]} subtitle={HEAD[step][1]} onBack={back}>
      {resumed && (
        <div className="mb-5 flex items-center justify-between gap-3 rounded-xl bg-bx-lavender px-4 py-3 text-sm text-bx-navy">
          <span>{w.resumed}</span>
          <button type="button" onClick={restart} className="shrink-0 font-medium text-bx-blue hover:text-bx-blue-hover">
            {w.restart}
          </button>
        </div>
      )}

      {/* ---------------- 1. Ville */}
      {step === 1 && (
        <div className="flex flex-col gap-4">
          <div className="relative">
            <Search className="pointer-events-none absolute start-4 top-1/2 size-4 -translate-y-1/2 text-bx-muted" strokeWidth={1.5} />
            <input
              type="search"
              value={cityQuery}
              onChange={(e) => setCityQuery(e.target.value)}
              placeholder={w.citySearch}
              aria-label={w.citySearchLabel}
              className={`${inputCls} ps-11`}
            />
          </div>
          <ul role="listbox" aria-label={w.cities} className="max-h-[280px] overflow-y-auto" data-lenis-prevent>
            {cities.map((c) => {
              const active = d.city === c;
              return (
                <li key={c}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={active}
                    onClick={() => set("city", c)}
                    className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-start text-sm transition-colors ${
                      active ? "bg-bx-lavender font-medium text-bx-navy" : "text-bx-ink hover:bg-bx-soft"
                    }`}
                  >
                    <MapPin className={`size-4 ${active ? "text-bx-blue" : "text-bx-muted"}`} strokeWidth={1.5} />
                    {cityLabel(c)}
                  </button>
                </li>
              );
            })}
          </ul>
          {d.city && (
            <div className="flex items-start gap-2.5 rounded-xl bg-bx-lavender p-4 text-sm leading-5 text-bx-navy">
              <CheckBadge className="mt-0.5 size-[18px] shrink-0" />
              <div>
                {cov.atShowroom && <p>{w.covShowroom}</p>}
                {cov.atHome && <p>{w.covHome}</p>}
                {cov.level === "none" && (
                  <p>{w.covNone}</p>
                )}
              </div>
            </div>
          )}
          <PrimaryButton disabled={!ok1} onClick={() => go(2)}>
            {w.continue}
          </PrimaryButton>
        </div>
      )}

      {/* ---------------- 2. Coordonnées */}
      {step === 2 && (
        <form
          className="flex flex-col gap-5"
          onSubmit={(e) => {
            e.preventDefault();
            setTouched(true);
            if (ok2) go(3);
          }}
        >
          <Field label={t.leadForm.name} required>
            <input className={inputCls} value={d.name} onChange={(e) => set("name", e.target.value)} placeholder={w.namePlaceholder} autoComplete="name" />
          </Field>
          <Field label={t.leadForm.phone} required>
            <div className={`flex items-center overflow-hidden rounded-xl border bg-white transition-colors focus-within:border-bx-blue ${touched && !phone ? "border-red-400" : "border-bx-line"}`}>
              <span className="flex h-12 items-center gap-1.5 border-e border-bx-line px-3 text-sm text-bx-navy" dir="ltr">
                <span aria-hidden>🇲🇦</span> +212
              </span>
              <input
                type="tel"
                inputMode="tel"
                autoComplete="tel-national"
                className="h-12 min-w-0 flex-1 bg-transparent px-3 text-sm text-bx-navy outline-none placeholder:text-bx-muted"
                value={d.phone}
                onChange={(e) => set("phone", e.target.value)}
                placeholder="6 12 34 56 78"
              />
            </div>
            {touched && !phone && <span className="mt-1.5 block text-xs text-red-600">{w.phoneError}</span>}
          </Field>
          <Field label={w.emailOptional}>
            <input type="email" className={inputCls} value={d.email} onChange={(e) => set("email", e.target.value)} placeholder={w.emailPlaceholder} autoComplete="email" />
            {touched && !emailOk && <span className="mt-1.5 block text-xs text-red-600">{w.emailError}</span>}
          </Field>
          <PrimaryButton type="submit">{w.continue}</PrimaryButton>
        </form>
      )}

      {/* ---------------- 3. Véhicule */}
      {step === 3 && (
        <form
          className="flex flex-col gap-5"
          onSubmit={(e) => {
            e.preventDefault();
            setTouched(true);
            if (ok3) go(4);
          }}
        >
          <div>
            <span className={labelCls}>{w.plate}</span>
            <div className="flex items-center gap-2 rounded-xl border border-bx-line p-1.5">
              <input
                className="h-10 min-w-0 flex-[2] rounded-lg bg-bx-soft px-3 text-center text-sm tracking-widest text-bx-navy outline-none"
                inputMode="numeric"
                maxLength={6}
                placeholder="12345"
                aria-label={w.plateSerial}
                value={d.plateSerial}
                onChange={(e) => set("plateSerial", e.target.value.replace(/\D/g, ""))}
              />
              <span className="text-bx-muted">|</span>
              <select aria-label={w.plateLetter} className="h-10 flex-1 rounded-lg bg-bx-soft px-2 text-center text-sm text-bx-navy outline-none" value={d.plateLetter} onChange={(e) => set("plateLetter", e.target.value)}>
                <option value="">{w.plateLetter}</option>
                {PLATE_LETTERS.map((l) => (
                  <option key={l}>{l}</option>
                ))}
              </select>
              <span className="text-bx-muted">|</span>
              <input
                className="h-10 min-w-0 flex-1 rounded-lg bg-bx-soft px-3 text-center text-sm text-bx-navy outline-none"
                inputMode="numeric"
                maxLength={2}
                placeholder={w.plateRegion}
                aria-label={w.plateRegionLabel}
                value={d.plateRegion}
                onChange={(e) => set("plateRegion", e.target.value.replace(/\D/g, ""))}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 bxt:grid-cols-2">
            <Field label={w.brand} required>
              <select className={selectCls} value={d.brand} onChange={(e) => setD((x) => ({ ...x, brand: e.target.value, model: "" }))}>
                <option value="">{w.brand}</option>
                {SELL_BRANDS.map((b) => (
                  <option key={b} value={b}>
                    {b === "Autre" ? w.otherBrand : b}
                  </option>
                ))}
              </select>
            </Field>
            <Field label={w.model} required>
              <input className={inputCls} list="sell-models" value={d.model} onChange={(e) => set("model", e.target.value)} placeholder={w.modelPlaceholder} disabled={!d.brand} />
              <datalist id="sell-models">
                {brandModels.map((m) => (
                  <option key={m} value={m} />
                ))}
              </datalist>
            </Field>
            <Field label={w.year} required>
              <select className={selectCls} value={d.year} onChange={(e) => set("year", e.target.value)}>
                <option value="">{w.year}</option>
                {YEARS.map((y) => (
                  <option key={y}>{y}</option>
                ))}
              </select>
            </Field>
            <Field label={w.version}>
              <input className={inputCls} value={d.version} onChange={(e) => set("version", e.target.value)} placeholder={w.versionPlaceholder} />
            </Field>
            <Field label={w.fuel} required>
              <select className={selectCls} value={d.fuel} onChange={(e) => set("fuel", e.target.value)}>
                <option value="">{w.fuel}</option>
                {Object.entries(t.vehicle.fuel).map(([k, l]) => (
                  <option key={k} value={k}>
                    {l}
                  </option>
                ))}
              </select>
            </Field>
            <Field label={w.gearbox} required>
              <select className={selectCls} value={d.gearbox} onChange={(e) => set("gearbox", e.target.value)}>
                <option value="">{w.gearboxShort}</option>
                <option value="manuelle">{t.vehicle.gearbox.manuelle}</option>
                <option value="automatique">{t.vehicle.gearbox.automatique}</option>
              </select>
            </Field>
            <Field label={w.mileage} required className="bxt:col-span-2">
              <div className="relative">
                <input
                  className={`${inputCls} pe-12`}
                  inputMode="numeric"
                  value={d.mileage ? num(Number(d.mileage)) : ""}
                  onChange={(e) => set("mileage", e.target.value.replace(/\D/g, "").slice(0, 7))}
                  placeholder={w.mileagePlaceholder}
                />
                <span className="pointer-events-none absolute end-4 top-1/2 -translate-y-1/2 text-sm text-bx-muted">km</span>
              </div>
            </Field>
          </div>

          <div>
            <span className={labelCls}>
              {w.condition} <span className="text-bx-blue">*</span>
            </span>
            <div className="grid grid-cols-3 gap-2.5">
              {CONDITIONS.map((c) => (
                <Choice key={c.value} active={d.condition === c.value} onClick={() => set("condition", c.value)} className="flex flex-col items-center gap-0.5">
                  <span>{w.conditions[c.value].label}</span>
                  <span className="text-[11px] font-normal leading-4 text-bx-muted">{w.conditions[c.value].hint}</span>
                </Choice>
              ))}
            </div>
          </div>

          <label className="flex cursor-pointer items-center gap-3 text-sm text-bx-ink">
            <input type="checkbox" checked={d.owner} onChange={(e) => set("owner", e.target.checked)} className="size-5 accent-bx-blue" />
            {w.owner}
          </label>

          <div>
            <span className={labelCls}>{w.documents}</span>
            <div className="flex flex-wrap gap-2">
              {SELL_DOCUMENTS.map((doc) => (
                <Choice
                  key={doc}
                  active={d.documents.includes(doc)}
                  onClick={() => set("documents", d.documents.includes(doc) ? d.documents.filter((x) => x !== doc) : [...d.documents, doc])}
                  className="rounded-[120px] px-4 py-2"
                >
                  {w.docs[doc] ?? doc}
                </Choice>
              ))}
            </div>
          </div>

          {touched && !ok3 && <p className="text-sm text-red-600">{w.requiredHint}</p>}
          <PrimaryButton type="submit">{w.continue}</PrimaryButton>
        </form>
      )}

      {/* ---------------- 4. Rendez-vous */}
      {step === 4 && (
        <div className="flex flex-col gap-6">
          {needsSlot ? (
            <>
              <div>
                <span className={labelCls}>{w.place}</span>
                <div className="grid grid-cols-2 gap-2.5">
                  {cov.atShowroom && (
                    <Choice active={d.place === "showroom"} onClick={() => set("place", "showroom")} className="flex flex-col items-center gap-1.5 py-4">
                      <Store className={`size-6 ${d.place === "showroom" ? "text-bx-blue" : "text-bx-navy"}`} strokeWidth={1.5} />
                      {w.atShowroom}
                    </Choice>
                  )}
                  {cov.atHome && (
                    <Choice active={d.place === "domicile"} onClick={() => set("place", "domicile")} className="flex flex-col items-center gap-1.5 py-4">
                      <Home className={`size-6 ${d.place === "domicile" ? "text-bx-blue" : "text-bx-navy"}`} strokeWidth={1.5} />
                      {w.atHome}
                    </Choice>
                  )}
                </div>
                {d.place === "showroom" && <p className="mt-2 text-xs text-bx-muted">{settings.address}</p>}
              </div>

              <div>
                <span className={labelCls}>{w.chooseDay}</span>
                <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-1" data-lenis-prevent>
                  {days.map((iso) => {
                    const active = d.day === iso;
                    return (
                      <button
                        key={iso}
                        type="button"
                        aria-pressed={active}
                        onClick={() => set("day", iso)}
                        className={`flex w-[68px] shrink-0 flex-col items-center rounded-xl border py-2.5 transition-colors duration-300 ${
                          active ? "border-bx-blue bg-bx-blue text-white" : "border-bx-line bg-white text-bx-navy hover:border-bx-navy"
                        }`}
                      >
                        <span className={`text-[11px] uppercase ${active ? "text-white/80" : "text-bx-muted"}`}>{dayLabel(iso, { weekday: "short" })}</span>
                        <span className="text-lg font-semibold leading-6">{dayLabel(iso, { day: "numeric" })}</span>
                        <span className={`text-[11px] ${active ? "text-white/80" : "text-bx-muted"}`}>{dayLabel(iso, { month: "short" })}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <span className={labelCls}>{w.slot}</span>
                <div className="grid grid-cols-2 gap-2.5">
                  <Choice active={d.slot === "matin"} onClick={() => set("slot", "matin")}>
                    {w.morning} <span className="block text-[11px] font-normal text-bx-muted">{w.morningHours}</span>
                  </Choice>
                  <Choice active={d.slot === "apres-midi"} onClick={() => set("slot", "apres-midi")}>
                    {w.afternoon} <span className="block text-[11px] font-normal text-bx-muted">{w.afternoonHours}</span>
                  </Choice>
                </div>
              </div>

              <div className="rounded-xl bg-bx-soft p-4">
                <p className="text-sm font-medium text-bx-navy">{w.bringShort}</p>
                <div className="mt-2 flex flex-wrap gap-x-5 gap-y-2">
                  {w.bring.map((x) => (
                    <span key={x} className="flex items-center gap-1.5 text-sm text-bx-ink">
                      <Check className="size-4 text-bx-blue" strokeWidth={2} /> {x}
                    </span>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="rounded-xl bg-bx-lavender p-5 text-[15px] leading-6 text-bx-navy">
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
            </div>
          )}

          {/* Summary */}
          <div className="rounded-xl border border-bx-line p-4 text-sm text-bx-ink">
            <p className="font-medium text-bx-navy">
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
            <p className="text-sm text-red-600" role="alert">
              {error}
            </p>
          )}
          <PrimaryButton disabled={!ok4 || sending} onClick={submit}>
            {sending && <Loader2 className="size-4 animate-spin" />}
            {w.submit}
          </PrimaryButton>
          <p className="text-center text-xs text-[#818181]">{w.footnote}</p>
        </div>
      )}
    </Shell>
  );
}

/* ------------------------------------------------------------------ layout shell */

function Shell({
  step,
  title,
  subtitle,
  onBack,
  children,
}: {
  step: Step;
  title: string;
  subtitle: string;
  onBack?: () => void;
  children: React.ReactNode;
}) {
  const { t, fmt } = useI18n();
  const n = step === "done" ? 4 : step;
  return (
    <div className="bg-white">
      <div className="bg-bx-navy pb-24 pt-[110px] bxt:pt-[134px]">
        <div className="mx-auto w-full max-w-[620px] px-[30px]">
          <div className="flex items-center gap-3">
            {onBack ? (
              <button type="button" onClick={onBack} aria-label={t.sellWizard.prevStep} className="grid size-8 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20">
                <ArrowLeft className="size-4 rtl:-scale-x-100" strokeWidth={1.5} />
              </button>
            ) : null}
            <p className="text-xs font-medium uppercase tracking-wide text-bx-muted">
              {step === "done" ? t.sellWizard.done : fmt(t.sellWizard.step, { n: step })}
            </p>
          </div>
          <h1 className="mt-3 text-[26px] font-bold leading-[1.25] text-white bxt:text-[30px]">{title}</h1>
          <p className="mt-1.5 text-[15px] leading-6 text-bx-muted">{subtitle}</p>
          <div className="mt-5 grid grid-cols-4 gap-2" aria-hidden>
            {[1, 2, 3, 4].map((k) => (
              <span key={k} className={`h-1 rounded-full transition-colors duration-500 ${k <= n ? "bg-bx-blue" : "bg-white/15"}`} />
            ))}
          </div>
        </div>
      </div>
      <div className="mx-auto -mt-16 w-full max-w-[620px] px-4 pb-[60px] bxt:px-[30px] bxd:pb-[90px]">
        <div className="rounded-2xl border border-bx-line bg-white p-5 shadow-[0_8px_30px_rgba(5,11,32,0.08)] bxt:p-8">{children}</div>
      </div>
    </div>
  );
}
