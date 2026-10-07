"use client";

/**
 * Filters of siaracash.ma/lists, driven by the /v2/acheter URL (same params as the main /acheter:
 * type, dispo, brand, model=brand~model, city, year, fuel, min/maxPrice, min/maxMileage, q, sort).
 * - FilterPanel: desktop sticky card with accordion sections.
 * - FilterSheet: mobile full-screen sheet, section tabs on the left.
 * Types with no MoziMotors equivalent (Lite, Garantie, Partenaires…) are left out.
 */
import { createContext, useContext, useEffect, useMemo, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  BadgeCheck,
  Check,
  ChevronDown,
  ChevronLeft,
  Fuel,
  House,
  Leaf,
  Search,
  ShieldCheck,
  ShieldOff,
  Warehouse,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { A } from "./assets";
import { BRAND_LOGOS } from "./brands";
import { useV2 } from "./V2Locale";

export type ListingFacets = {
  brands: { slug: string; name: string; count: number; models: { name: string; count: number }[] }[];
  cities: string[];
  years: number[];
};

/* ---------- URL state ---------- */

const MULTI = ["type", "dispo", "brand", "model", "city", "year", "fuel", "body"] as const;
const SINGLE = ["minPrice", "maxPrice", "minMileage", "maxMileage", "q"] as const;

export function useFilters() {
  const params = useSearchParams();
  const router = useRouter();
  const path = usePathname();
  const [pending, start] = useTransition();

  const list = (k: string) => params.get(k)?.split(",").filter(Boolean) ?? [];
  const one = (k: string) => params.get(k) ?? "";

  const push = (next: URLSearchParams) => {
    const qs = next.toString();
    start(() => router.replace(`${path}${qs ? `?${qs}` : ""}`, { scroll: false }));
  };
  const update = (fn: (p: URLSearchParams) => void) => {
    const next = new URLSearchParams(params.toString());
    fn(next);
    push(next);
  };
  const setList = (p: URLSearchParams, k: string, values: string[]) => (values.length ? p.set(k, values.join(",")) : p.delete(k));
  const toggle = (k: string, v: string) =>
    update((p) => {
      const cur = p.get(k)?.split(",").filter(Boolean) ?? [];
      setList(p, k, cur.includes(v) ? cur.filter((x) => x !== v) : [...cur, v]);
    });
  const set = (entries: Record<string, string | undefined>) =>
    update((p) => {
      for (const [k, v] of Object.entries(entries)) {
        if (v) p.set(k, v);
        else p.delete(k);
      }
    });
  const clear = (keys: readonly string[] = [...MULTI, ...SINGLE]) => update((p) => keys.forEach((k) => p.delete(k)));

  return { params, list, one, toggle, set, update, setList, clear, pending };
}

/** Number of active values per section (the orange badge) and in total (« Effacer (n) »). */
function useCounts() {
  const f = useFilters();
  const range = (a: string, b: string) => (f.one(a) || f.one(b) ? 1 : 0);
  const counts: Record<SectionId, number> = {
    type: f.list("type").length,
    dispo: f.list("dispo").length,
    brand: f.list("brand").length + f.list("model").length,
    price: range("minPrice", "maxPrice"),
    city: f.list("city").length,
    year: f.list("year").length,
    km: range("minMileage", "maxMileage"),
    fuel: f.list("fuel").length,
  };
  const total = Object.values(counts).reduce((a, b) => a + b, 0) + f.list("body").length + (f.one("q") ? 1 : 0);
  return { counts, total };
}

const FacetsContext = createContext<ListingFacets>({ brands: [], cities: [], years: [] });

export const useFacets = () => useContext(FacetsContext);

export function FacetsProvider({ facets, children }: { facets: ListingFacets; children: React.ReactNode }) {
  return <FacetsContext.Provider value={facets}>{children}</FacetsContext.Provider>;
}

/* ---------- building blocks (siaracash.ma markup) ---------- */

function Tile({ icon: Icon, label, on, onClick }: { icon: LucideIcon; label: string; on: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onClick}
      className={`rounded-xl border p-3 flex flex-col items-center gap-1.5 text-center transition ${on ? "border-[var(--cc-primary)] bg-[var(--cc-primary-tint)]" : "border-[var(--cc-line)]"}`}
    >
      <Icon className="size-7 text-[var(--cc-primary)]" aria-hidden="true" />
      <span className={`text-[12px] text-[var(--cc-ink)] ${on ? "font-bold text-[var(--cc-primary)]" : "font-semibold"}`}>{label}</span>
    </button>
  );
}

function Checkbox({ on }: { on: boolean }) {
  return (
    <span
      className={`grid size-4 shrink-0 place-items-center rounded border-2 transition ${on ? "border-[var(--cc-primary)] bg-[var(--cc-primary)] text-white" : "border-[var(--cc-line)] text-transparent"}`}
    >
      <Check className="size-3" strokeWidth={3} aria-hidden="true" />
    </span>
  );
}

function Radio({ label, on, onClick }: { label: string; on: boolean; onClick: () => void }) {
  return (
    <li>
      <button
        type="button"
        role="radio"
        aria-checked={on}
        onClick={onClick}
        className="flex w-full items-center gap-3 py-2.5 text-left text-[14px] text-[var(--cc-ink)]"
      >
        <span className={`grid size-5 shrink-0 place-items-center rounded-full border-2 ${on ? "border-[var(--cc-primary)]" : "border-[var(--cc-line)]"}`}>
          {on && <span className="size-2.5 rounded-full bg-[var(--cc-primary)]" />}
        </span>
        {label}
      </button>
    </li>
  );
}

function SearchBox({ label, name, value, onChange }: { label: string; name: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="mb-3 flex items-center gap-2 rounded-lg border border-[var(--cc-line)] px-3 py-2">
      <Search className="size-4 text-[var(--cc-muted)]" aria-hidden="true" />
      <input
        aria-label={label}
        placeholder={label}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-transparent text-[13px] outline-none"
      />
    </label>
  );
}

/** « Définir la plage » min–max inputs, applied on blur / Enter. */
function RangeInputs({ minKey, maxKey, unit, label }: { minKey: string; maxKey: string; unit: string; label: string }) {
  const { t } = useV2();
  const f = useFilters();
  const [min, setMin] = useState(f.one(minKey));
  const [max, setMax] = useState(f.one(maxKey));
  const urlMin = f.one(minKey);
  const urlMax = f.one(maxKey);
  useEffect(() => {
    // Keep inputs in sync when a preset changes the URL.
    setMin(urlMin);
    setMax(urlMax);
  }, [urlMin, urlMax]);
  const commit = () => f.set({ [minKey]: min.replace(/\D/g, "") || undefined, [maxKey]: max.replace(/\D/g, "") || undefined });
  const input = (v: string, set: (v: string) => void, which: string) => (
    <div className="flex w-full items-center gap-1">
      <input
        inputMode="numeric"
        aria-label={`${label} ${t(which).toLowerCase()}`}
        placeholder={t(which)}
        type="number"
        value={v}
        onChange={(e) => set(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => e.key === "Enter" && commit()}
        className="w-full rounded-lg border border-[var(--cc-line)] px-3 py-2 text-[13px] outline-none"
      />
      <span className="text-[11px] text-[var(--cc-muted)]">{unit}</span>
    </div>
  );
  return (
    <>
      <p className="mb-1.5 text-[12px] font-bold text-[var(--cc-ink)]">{t("Définir la plage")}</p>
      <div className="flex items-center gap-2">
        {input(min, setMin, "Min")}
        <span className="text-[12px] text-[var(--cc-muted)]">–</span>
        {input(max, setMax, "Max")}
      </div>
    </>
  );
}

/* ---------- sections ---------- */

type SectionId = "type" | "dispo" | "brand" | "price" | "city" | "year" | "km" | "fuel";

const TYPES: { value: string; label: string; icon: LucideIcon }[] = [
  { value: "non-certifie", label: "Non Certifié", icon: ShieldOff },
  { value: "certifie", label: "Certifié", icon: BadgeCheck },
  { value: "sans-imperfection", label: "Sans imperfection", icon: ShieldCheck },
];

const DISPOS: { value: string; label: string; icon: LucideIcon }[] = [
  { value: "showroom", label: "Au showroom MoziMotors", icon: Warehouse },
  { value: "particulier", label: "Particuliers", icon: House },
];

const FUELS: { value: string; label: string; icon: LucideIcon }[] = [
  { value: "diesel", label: "Diesel", icon: Fuel },
  { value: "essence", label: "Essence", icon: Fuel },
  { value: "hybride", label: "Hybride", icon: Leaf },
  { value: "electrique", label: "Électrique", icon: Zap },
];

const PRICES = [
  { label: "Moins de 100 000 DH", min: "", max: "100000" },
  { label: "100 000 – 200 000 DH", min: "100000", max: "200000" },
  { label: "200 000 – 350 000 DH", min: "200000", max: "350000" },
  { label: "Plus de 350 000 DH", min: "350000", max: "" },
];

const KMS = [25_000, 50_000, 80_000, 100_000, 120_000, 140_000, 160_000];
const nf = (n: number) => n.toLocaleString("fr-FR").replace(/ | /g, " ");

function TileGrid({ k, items }: { k: string; items: { value: string; label: string; icon: LucideIcon }[] }) {
  const { t } = useV2();
  const f = useFilters();
  const cur = f.list(k);
  return (
    <div className="grid grid-cols-2 gap-2.5">
      {items.map((x) => (
        <Tile key={x.value} icon={x.icon} label={t(x.label)} on={cur.includes(x.value)} onClick={() => f.toggle(k, x.value)} />
      ))}
    </div>
  );
}

function BrandSection() {
  const { t, tf } = useV2();
  const f = useFilters();
  const { brands } = useContext(FacetsContext);
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<string[]>(() => f.list("brand"));
  const selBrands = f.list("brand");
  const selModels = f.list("model");
  const needle = q.toLowerCase().trim();

  const shown = brands.filter((b) => !needle || b.name.toLowerCase().includes(needle) || b.models.some((m) => m.name.toLowerCase().includes(needle)));

  const toggleBrand = (slug: string) =>
    f.update((p) => {
      const on = selBrands.includes(slug);
      f.setList(p, "brand", on ? selBrands.filter((x) => x !== slug) : [...selBrands, slug]);
      // Unticking a brand also drops its models.
      if (on)
        f.setList(
          p,
          "model",
          selModels.filter((m) => !m.startsWith(`${slug}~`)),
        );
    });

  return (
    <div>
      <SearchBox label={t("Rechercher une marque ou un modèle")} name="filter-make" value={q} onChange={setQ} />
      <div className="max-h-[calc(100svh-230px)] overflow-y-auto cc-noscroll">
        {shown.map((b) => {
          const on = selBrands.includes(b.slug);
          const expanded = open.includes(b.slug) || (needle.length > 0 && !b.name.toLowerCase().includes(needle));
          return (
            <div key={b.slug} className="border-b border-[var(--cc-line)] last:border-b-0">
              <div className="flex items-center gap-2.5 pe-1">
                <button
                  type="button"
                  onClick={() => toggleBrand(b.slug)}
                  className="flex flex-1 cursor-pointer items-center gap-2.5 py-2 text-left text-[13px] text-[var(--cc-body)]"
                >
                  <Checkbox on={on} />
                  {BRAND_LOGOS.has(b.slug) ? (
                    <img alt="" className="size-7 object-contain" src={`${A}/storage/brands/${b.slug}.png`} />
                  ) : (
                    <span className="size-7" />
                  )}
                  <span className={on ? "font-semibold text-[var(--cc-ink)]" : ""}>{b.name}</span>
                </button>
                <button
                  type="button"
                  aria-label={tf("Afficher les modèles de {name}", { name: b.name })}
                  aria-expanded={expanded}
                  onClick={() => setOpen((o) => (o.includes(b.slug) ? o.filter((x) => x !== b.slug) : [...o, b.slug]))}
                  className="grid size-7 shrink-0 place-items-center rounded text-[var(--cc-muted)]"
                >
                  <ChevronDown className={`size-4 transition ${expanded ? "rotate-180" : ""}`} aria-hidden="true" />
                </button>
              </div>
              {expanded && (
                <div>
                  {b.models
                    .filter((m) => !needle || b.name.toLowerCase().includes(needle) || m.name.toLowerCase().includes(needle))
                    .map((m) => {
                      const key = `${b.slug}~${m.name}`;
                      const mOn = selModels.includes(key);
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => f.toggle("model", key)}
                          className="flex w-full cursor-pointer items-center gap-2.5 py-1.5 ps-9 pe-1 text-left text-[12px] text-[var(--cc-body)]"
                        >
                          <Checkbox on={mOn} />
                          <span className={mOn ? "font-semibold text-[var(--cc-ink)]" : ""}>{m.name}</span>
                        </button>
                      );
                    })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PriceSection() {
  const { t } = useV2();
  const f = useFilters();
  const min = f.one("minPrice");
  const max = f.one("maxPrice");
  return (
    <div>
      <ul className="mb-4" role="radiogroup">
        {PRICES.map((p) => {
          const on = min === p.min && max === p.max;
          return (
            <Radio
              key={p.label}
              label={t(p.label)}
              on={on}
              onClick={() => f.set(on ? { minPrice: undefined, maxPrice: undefined } : { minPrice: p.min || undefined, maxPrice: p.max || undefined })}
            />
          );
        })}
      </ul>
      <RangeInputs minKey="minPrice" maxKey="maxPrice" unit="DH" label={t("Prix")} />
    </div>
  );
}

function CitySection() {
  const { t } = useV2();
  const f = useFilters();
  const { cities } = useContext(FacetsContext);
  const [q, setQ] = useState("");
  const cur = f.list("city");
  const needle = q.toLowerCase().trim();
  return (
    <div>
      <SearchBox label={t("Rechercher une ville")} name="filter-city" value={q} onChange={setQ} />
      <div className="max-h-[calc(100svh-230px)] overflow-y-auto cc-noscroll">
        {cities
          .filter((c) => !needle || c.toLowerCase().includes(needle))
          .map((c) => {
            const on = cur.includes(c);
            return (
              <button
                key={c}
                type="button"
                onClick={() => f.toggle("city", c)}
                className="flex w-full cursor-pointer items-center gap-2.5 py-2 text-left text-[13px] text-[var(--cc-body)]"
              >
                <Checkbox on={on} />
                <span className={on ? "font-semibold text-[var(--cc-ink)]" : ""}>{c}</span>
              </button>
            );
          })}
      </div>
    </div>
  );
}

function YearSection() {
  const f = useFilters();
  const { years } = useContext(FacetsContext);
  const cur = f.list("year");
  return (
    <div className="grid grid-cols-3 gap-2.5">
      {years.map((y) => {
        const on = cur.includes(String(y));
        return (
          <button
            key={y}
            type="button"
            aria-pressed={on}
            onClick={() => f.toggle("year", String(y))}
            className={`rounded-lg border py-2.5 text-center text-[14px] font-bold transition ${on ? "border-[var(--cc-primary)] bg-[var(--cc-primary-tint)] text-[var(--cc-primary)]" : "border-[var(--cc-line)] text-[var(--cc-ink)]"}`}
          >
            {y}
          </button>
        );
      })}
    </div>
  );
}

function KmSection() {
  const { t, tf } = useV2();
  const f = useFilters();
  const min = f.one("minMileage");
  const max = f.one("maxMileage");
  return (
    <div>
      <ul className="mb-4" role="radiogroup">
        {KMS.map((k) => {
          const on = !min && max === String(k);
          return (
            <Radio
              key={k}
              label={tf("Moins de {n} km", { n: nf(k) })}
              on={on}
              onClick={() => f.set(on ? { minMileage: undefined, maxMileage: undefined } : { minMileage: undefined, maxMileage: String(k) })}
            />
          );
        })}
      </ul>
      <RangeInputs minKey="minMileage" maxKey="maxMileage" unit="km" label={t("Kilométrage")} />
    </div>
  );
}

const ALL_SECTIONS: { id: SectionId; label: string; body: () => React.ReactNode }[] = [
  { id: "type", label: "Type d'annonce", body: () => <TileGrid k="type" items={TYPES} /> },
  { id: "dispo", label: "Disponibilité", body: () => <TileGrid k="dispo" items={DISPOS} /> },
  { id: "brand", label: "Marque / Modèle", body: () => <BrandSection /> },
  { id: "price", label: "Prix", body: () => <PriceSection /> },
  { id: "city", label: "Ville", body: () => <CitySection /> },
  { id: "year", label: "Année", body: () => <YearSection /> },
  { id: "km", label: "Kilométrage", body: () => <KmSection /> },
  { id: "fuel", label: "Carburant", body: () => <TileGrid k="fuel" items={FUELS} /> },
];

/** Hidden for now at the client's request (the URL params still work). */
const HIDDEN: SectionId[] = ["type", "dispo", "city"];
const SECTIONS = ALL_SECTIONS.filter((s) => !HIDDEN.includes(s.id));

function Badge({ n }: { n: number }) {
  return <span className="grid size-5 shrink-0 place-items-center rounded-full bg-[color:var(--color-warning)] text-[10px] font-bold text-white">{n}</span>;
}

/* ---------- desktop panel ---------- */

export function FilterPanel() {
  const { t } = useV2();
  const f = useFilters();
  const { counts, total } = useCounts();
  // Marque / Modèle starts open, plus any section that already has a value.
  const [open, setOpen] = useState<SectionId[]>(() => ["brand", ...SECTIONS.filter((s) => counts[s.id] > 0).map((s) => s.id)]);
  const toggle = (id: SectionId) => setOpen((o) => (o.includes(id) ? o.filter((x) => x !== id) : [...o, id]));

  return (
    <aside className="hidden w-[320px] shrink-0 lg:block">
      <div className="cc-card sticky top-[92px] max-h-[calc(100svh-108px)] overflow-y-auto p-4 cc-noscroll">
        <div className="flex items-center justify-between">
          <h2 className="text-[16px] font-bold text-[var(--cc-ink)]">{t("Filtres")}</h2>
          {total > 0 && (
            <button onClick={() => f.clear()} className="text-[12px] font-semibold text-[var(--cc-primary)]">
              {t("Effacer")} ({total})
            </button>
          )}
        </div>
        <div>
          {SECTIONS.map((s) => {
            const isOpen = open.includes(s.id);
            const n = counts[s.id];
            return (
              <div key={s.id} className="border-b border-[var(--cc-line)] py-1">
                <button
                  onClick={() => toggle(s.id)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-2 py-3 text-left text-[14px] font-bold text-[var(--cc-ink)]"
                >
                  <span className={n ? "text-[var(--cc-primary)]" : ""}>{t(s.label)}</span>
                  <span className="ml-auto flex items-center gap-2">
                    {n > 0 && <Badge n={n} />}
                    <ChevronDown className={`cc-chev size-4 text-[var(--cc-muted)] ${isOpen ? "cc-open" : ""}`} aria-hidden="true" />
                  </span>
                </button>
                <div className={`cc-acc-body ${isOpen ? "cc-open" : ""}`}>
                  <div>
                    <div className="pb-3">{s.body()}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
}

/* ---------- mobile sheet ---------- */

export function FilterSheet({ onClose, resultCount }: { onClose: () => void; resultCount: number }) {
  const { t } = useV2();
  const f = useFilters();
  const { counts } = useCounts();
  const [tab, setTab] = useState<SectionId>(SECTIONS[0].id);
  const current = useMemo(() => SECTIONS.find((s) => s.id === tab)!, [tab]);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[80] flex">
      <div className="flex h-full w-full flex-col overflow-hidden bg-white shadow-2xl" role="dialog" aria-modal="true" aria-label={t("Tous les filtres")}>
        <div className="flex items-center gap-3 border-b border-[var(--cc-line)] px-4 py-4">
          <button aria-label={t("Retour")} onClick={onClose}>
            <ChevronLeft className="size-6 text-[var(--cc-ink)]" aria-hidden="true" />
          </button>
          <h3 className="flex-1 text-[18px] font-bold text-[var(--cc-ink)]">{t("Tous les filtres")}</h3>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-end border-b border-[var(--cc-line)] px-4 py-2">
              <button onClick={() => f.clear()} className="text-[13px] font-bold text-[var(--cc-primary)]">
                {t("Tout effacer")}
              </button>
            </div>
            <div className="flex min-h-0 flex-1">
              <nav className="w-[38%] max-w-[160px] shrink-0 overflow-y-auto border-r border-[var(--cc-line)] cc-noscroll">
                {SECTIONS.map((s) => {
                  const on = s.id === tab;
                  return (
                    <button
                      key={s.id}
                      onClick={() => setTab(s.id)}
                      className={`flex w-full items-center gap-1.5 px-3 py-3.5 text-left text-[13px] ${on ? "bg-[var(--cc-primary-tint)] font-bold text-[var(--cc-primary)]" : "font-semibold text-[var(--cc-body)]"}`}
                    >
                      <span className="min-w-0 flex-1 truncate">{t(s.label)}</span>
                      {counts[s.id] > 0 && <Badge n={counts[s.id]} />}
                    </button>
                  );
                })}
              </nav>
              <div className="min-w-0 flex-1 overflow-y-auto p-4">{current.body()}</div>
            </div>
          </div>
        </div>
        <div className="border-t border-[var(--cc-line)] bg-white p-3">
          <button onClick={onClose} className="cc-btn cc-btn-primary cc-btn-block w-full uppercase">
            {f.pending ? "…" : `${t("Voir les voitures")} (${resultCount})`}
          </button>
        </div>
      </div>
    </div>
  );
}
