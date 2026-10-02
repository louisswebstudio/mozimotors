"use client";

/**
 * /acheter filter sidebar — structure modelled on siaracash.ma/lists (tile groups,
 * accordion sections, preset + custom ranges), styled with the Boxcars tokens.
 * Every choice is written to the URL (comma-separated lists), so results are shareable.
 */
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState, useTransition } from "react";
import {
  BadgeCheck, ChevronDown, Search, ShieldOff, SlidersHorizontal, Sparkles, Store, Users, Wallet, X,
} from "lucide-react";
import type { Facets } from "@/lib/wp";
import { useI18n } from "@/i18n/client";

const TYPES = [
  { value: "non-certifie", icon: ShieldOff },
  { value: "certifie", icon: BadgeCheck },
  { value: "financable", icon: Wallet },
  { value: "sans-imperfection", icon: Sparkles },
] as const;

const DISPO = [
  { value: "showroom", icon: Store },
  { value: "particulier", icon: Users },
] as const;

/** Labels are built per language in FilterBody ("Moins de …", "… – …", "Plus de …"). */
const PRICE_PRESETS = [
  { min: 0, max: 100000 },
  { min: 100000, max: 200000 },
  { min: 200000, max: 350000 },
  { min: 350000, max: 0 },
];

const KM_PRESETS = [25000, 50000, 80000, 100000, 120000, 140000, 160000];

/* ---------------------------------------------------------------- URL state */

function useFilterUrl() {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const [pending, start] = useTransition();

  const commit = (p: URLSearchParams) =>
    start(() => router.replace(`${pathname}${p.size ? `?${p}` : ""}`, { scroll: false }));

  const get = (k: string) => sp.get(k) ?? "";
  const list = (k: string) => get(k).split(",").filter(Boolean);

  const setMany = (entries: Record<string, string>) => {
    const p = new URLSearchParams(sp);
    for (const [k, v] of Object.entries(entries)) {
      if (v) p.set(k, v);
      else p.delete(k);
    }
    commit(p);
  };

  const toggle = (k: string, value: string) => {
    const cur = list(k);
    const next = cur.includes(value) ? cur.filter((x) => x !== value) : [...cur, value];
    setMany({ [k]: next.join(",") });
  };

  const activeCount = [...sp.entries()]
    .filter(([k]) => k !== "sort")
    .reduce((n, [, v]) => n + v.split(",").filter(Boolean).length, 0);

  return { get, list, setMany, toggle, pending, activeCount, clear: () => commit(new URLSearchParams(sp.get("sort") ? { sort: sp.get("sort")! } : {})) };
}

/* ---------------------------------------------------------------- building blocks */

function Section({
  title,
  badge = 0,
  defaultOpen = false,
  children,
}: {
  title: string;
  badge?: number;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen || badge > 0);
  return (
    <div className="border-b border-bx-line last:border-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center gap-2 py-4 text-start text-[15px] font-semibold leading-6 text-bx-navy"
      >
        {title}
        {badge > 0 && (
          <span className="grid h-5 min-w-5 place-items-center rounded-full bg-bx-blue px-1.5 text-xs font-medium text-white">
            {badge}
          </span>
        )}
        <ChevronDown
          className={`ms-auto size-4 transition-transform duration-300 bx-ease ${open ? "rotate-180" : ""}`}
          strokeWidth={1.5}
        />
      </button>
      <div className={`grid transition-[grid-template-rows] duration-300 bx-ease ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
        <div className="overflow-hidden">
          <div className="pb-5">{children}</div>
        </div>
      </div>
    </div>
  );
}

/** Icon tile (Type d'annonce / Disponibilité). */
function Tile({
  label,
  icon: Icon,
  active,
  onClick,
  count,
}: {
  label: string;
  icon: typeof BadgeCheck;
  active: boolean;
  onClick: () => void;
  count?: number;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`flex min-h-[78px] flex-col items-center justify-center gap-2 rounded-xl border px-2 py-3 text-center text-[13px] font-medium leading-4 transition-colors duration-300 bx-ease ${
        active ? "border-bx-blue bg-bx-lavender text-bx-navy" : "border-bx-line bg-white text-bx-ink hover:border-bx-navy"
      }`}
    >
      <Icon className={`size-6 ${active ? "text-bx-blue" : "text-bx-navy"}`} strokeWidth={1.5} />
      <span>
        {label}
        {count !== undefined && <span className="ms-1 text-bx-muted">({count})</span>}
      </span>
    </button>
  );
}

/** Checkbox / radio row. */
function OptionRow({
  label,
  checked,
  onChange,
  count,
  radio = false,
}: {
  label: React.ReactNode;
  checked: boolean;
  onChange: () => void;
  count?: number;
  radio?: boolean;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-3 py-1.5 text-[15px] leading-6 text-bx-ink">
      <input type={radio ? "radio" : "checkbox"} checked={checked} onChange={onChange} className="peer sr-only" />
      <span
        aria-hidden
        className={`grid size-5 shrink-0 place-items-center border transition-colors duration-200 peer-focus-visible:ring-2 peer-focus-visible:ring-bx-blue/40 ${
          radio ? "rounded-full" : "rounded-md"
        } ${checked ? "border-bx-blue bg-bx-blue" : "border-bx-line bg-white"}`}
      >
        {checked &&
          (radio ? (
            <span className="size-2 rounded-full bg-white" />
          ) : (
            <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="white" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
              <path d="m5 12 5 5 9-10" />
            </svg>
          ))}
      </span>
      <span className="min-w-0 flex-1 truncate">{label}</span>
      {count !== undefined && <span className="text-[13px] text-bx-muted">{count}</span>}
    </label>
  );
}

const inputCls =
  "h-11 w-full rounded-xl border border-bx-line bg-white px-3.5 text-sm text-bx-navy outline-none transition-colors duration-300 placeholder:text-bx-muted focus:border-bx-blue";

/** "Définir la plage" min – max inputs, committed on blur / Enter. Remounted (via key) when the URL changes. */
function RangeInputs({
  unit,
  min,
  max,
  onCommit,
}: {
  unit: string;
  min: string;
  max: string;
  onCommit: (min: string, max: string) => void;
}) {
  const { t, num } = useI18n();
  const show = (v: string) => (v ? num(Number(v)) : "");
  const digits = (v: string) => v.replace(/\D/g, "");
  const [a, setA] = useState(show(min));
  const [b, setB] = useState(show(max));
  const commit = () => (digits(a) !== min || digits(b) !== max) && onCommit(digits(a), digits(b));
  const field = (value: string, set: (v: string) => void, placeholder: string) => (
    <div className="relative min-w-0 flex-1">
      <input
        inputMode="numeric"
        aria-label={`${placeholder} (${unit})`}
        placeholder={placeholder}
        value={value}
        onChange={(e) => set(show(digits(e.target.value)))}
        onBlur={commit}
        onKeyDown={(e) => e.key === "Enter" && commit()}
        className={`${inputCls} pe-10`}
      />
      <span className="pointer-events-none absolute end-3.5 top-1/2 -translate-y-1/2 text-xs text-bx-muted">{unit}</span>
    </div>
  );
  return (
    <div className="mt-4">
      <p className="mb-2 text-[13px] font-semibold text-bx-navy">{t.filters.range}</p>
      <div className="flex items-center gap-2">
        {field(a, setA, t.filters.min)}
        <span className="text-bx-muted">–</span>
        {field(b, setB, t.filters.max)}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- sidebar body */

function FilterBody({ facets }: { facets: Facets }) {
  const { t, fmt, num, price } = useI18n();
  const f = useFilterUrl();
  const presetLabel = (p: (typeof PRICE_PRESETS)[number]) =>
    !p.min
      ? fmt(t.filters.priceUnder, { a: price(p.max) })
      : !p.max
        ? fmt(t.filters.priceOver, { a: price(p.min) })
        : fmt(t.filters.priceBetween, { a: num(p.min), b: price(p.max) });
  const [brandQuery, setBrandQuery] = useState("");
  const [cityQuery, setCityQuery] = useState("");
  const [openBrands, setOpenBrands] = useState<string[]>(() => f.list("brand"));

  const types = f.list("type");
  const dispo = f.list("dispo");
  const brands = f.list("brand");
  const models = f.list("model");
  const cities = f.list("city");
  const years = f.list("year");
  const fuels = f.list("fuel");
  const bodies = f.list("body");
  const gearboxes = f.list("gearbox");
  const minPrice = f.get("minPrice");
  const maxPrice = f.get("maxPrice");
  const minKm = f.get("minMileage");
  const maxKm = f.get("maxMileage");

  const shownBrands = useMemo(() => {
    const q = brandQuery.trim().toLowerCase();
    if (!q) return facets.brands;
    return facets.brands
      .map((b) =>
        b.name.toLowerCase().includes(q) ? b : { ...b, models: b.models.filter((m) => m.name.toLowerCase().includes(q)) },
      )
      .filter((b) => b.name.toLowerCase().includes(q) || b.models.length);
  }, [brandQuery, facets.brands]);

  const shownCities = facets.cities.filter((c) => String(c.value).toLowerCase().includes(cityQuery.trim().toLowerCase()));

  const toggleModel = (brandSlug: string, model: string) => {
    const key = `${brandSlug}~${model}`;
    const next = models.includes(key) ? models.filter((m) => m !== key) : [...models, key];
    // Ticking a model implies its brand; unticking the last one keeps the brand selected.
    const nextBrands = brands.includes(brandSlug) ? brands : [...brands, brandSlug];
    f.setMany({ model: next.join(","), brand: nextBrands.join(",") });
  };

  const toggleBrand = (slug: string) => {
    if (brands.includes(slug)) {
      f.setMany({
        brand: brands.filter((b) => b !== slug).join(","),
        model: models.filter((m) => !m.startsWith(`${slug}~`)).join(","),
      });
    } else {
      f.setMany({ brand: [...brands, slug].join(",") });
      setOpenBrands((o) => (o.includes(slug) ? o : [...o, slug]));
    }
  };

  const pricePreset = PRICE_PRESETS.find((p) => String(p.min || "") === minPrice && String(p.max || "") === maxPrice);
  const kmPreset = !minKm && KM_PRESETS.find((k) => String(k) === maxKm);

  return (
    <div className={`transition-opacity ${f.pending ? "opacity-60" : ""}`}>
      <Section title={t.filters.sections.type} badge={types.length} defaultOpen>
        <div className="grid grid-cols-2 gap-2.5">
          {TYPES.map((x) => (
            <Tile key={x.value} label={t.filters.types[x.value]} icon={x.icon} active={types.includes(x.value)} onClick={() => f.toggle("type", x.value)} />
          ))}
        </div>
      </Section>

      <Section title={t.filters.sections.dispo} badge={dispo.length} defaultOpen>
        <div className="grid grid-cols-2 gap-2.5">
          {DISPO.map((x) => (
            <Tile key={x.value} label={t.filters.dispo[x.value]} icon={x.icon} active={dispo.includes(x.value)} onClick={() => f.toggle("dispo", x.value)} />
          ))}
        </div>
      </Section>

      <Section title={t.filters.sections.brandModel} badge={brands.length + models.length}>
        <div className="relative mb-3">
          <Search className="pointer-events-none absolute start-3.5 top-1/2 size-4 -translate-y-1/2 text-bx-muted" strokeWidth={1.5} />
          <input
            type="search"
            placeholder={t.filters.brandSearch}
            aria-label={t.filters.brandSearch}
            value={brandQuery}
            onChange={(e) => setBrandQuery(e.target.value)}
            className={`${inputCls} ps-10`}
          />
        </div>
        <div className="max-h-[320px] overflow-y-auto pe-1" data-lenis-prevent>
          {shownBrands.map((b) => {
            const expanded = openBrands.includes(b.slug) || Boolean(brandQuery.trim());
            return (
              <div key={b.slug}>
                <div className="flex items-center">
                  <div className="min-w-0 flex-1">
                    <OptionRow label={b.name} count={b.count} checked={brands.includes(b.slug)} onChange={() => toggleBrand(b.slug)} />
                  </div>
                  <button
                    type="button"
                    aria-label={fmt(expanded ? t.filters.hideModels : t.filters.showModels, { brand: b.name })}
                    aria-expanded={expanded}
                    onClick={() => setOpenBrands((o) => (o.includes(b.slug) ? o.filter((x) => x !== b.slug) : [...o, b.slug]))}
                    className="grid size-8 shrink-0 place-items-center rounded-lg text-bx-navy hover:bg-bx-soft"
                  >
                    <ChevronDown className={`size-4 transition-transform duration-300 ${expanded ? "rotate-180" : ""}`} strokeWidth={1.5} />
                  </button>
                </div>
                {expanded && (
                  <div className="ms-8 border-s border-bx-line ps-3">
                    {b.models.map((m) => (
                      <OptionRow
                        key={m.name}
                        label={m.name}
                        count={m.count}
                        checked={models.includes(`${b.slug}~${m.name}`)}
                        onChange={() => toggleModel(b.slug, m.name)}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
          {!shownBrands.length && <p className="py-2 text-sm text-bx-muted">{t.filters.noBrand}</p>}
        </div>
      </Section>

      <Section title={t.filters.sections.price} badge={minPrice || maxPrice ? 1 : 0}>
        {PRICE_PRESETS.map((p) => (
          <OptionRow
            key={`${p.min}-${p.max}`}
            radio
            label={presetLabel(p)}
            checked={pricePreset === p}
            onChange={() => f.setMany({ minPrice: p.min ? String(p.min) : "", maxPrice: p.max ? String(p.max) : "" })}
          />
        ))}
        <RangeInputs key={`p${minPrice}-${maxPrice}`} unit={t.common.currency} min={minPrice} max={maxPrice} onCommit={(a, b) => f.setMany({ minPrice: a, maxPrice: b })} />
      </Section>

      <Section title={t.filters.sections.city} badge={cities.length}>
        <div className="relative mb-3">
          <Search className="pointer-events-none absolute start-3.5 top-1/2 size-4 -translate-y-1/2 text-bx-muted" strokeWidth={1.5} />
          <input
            type="search"
            placeholder={t.filters.citySearch}
            aria-label={t.filters.citySearch}
            value={cityQuery}
            onChange={(e) => setCityQuery(e.target.value)}
            className={`${inputCls} ps-10`}
          />
        </div>
        <div className="max-h-[260px] overflow-y-auto pe-1" data-lenis-prevent>
          {shownCities.map((c) => (
            <OptionRow
              key={c.value}
              label={c.value}
              count={c.count}
              checked={cities.includes(String(c.value))}
              onChange={() => f.toggle("city", String(c.value))}
            />
          ))}
          {!shownCities.length && <p className="py-2 text-sm text-bx-muted">{t.filters.noCity}</p>}
        </div>
      </Section>

      <Section title={t.filters.sections.year} badge={years.length}>
        <div className="grid grid-cols-3 gap-2">
          {facets.years.map((y) => {
            const active = years.includes(String(y.value));
            return (
              <button
                key={y.value}
                type="button"
                aria-pressed={active}
                onClick={() => f.toggle("year", String(y.value))}
                className={`h-11 rounded-xl border text-[15px] font-semibold transition-colors duration-300 bx-ease ${
                  active ? "border-bx-blue bg-bx-lavender text-bx-blue" : "border-bx-line bg-white text-bx-navy hover:border-bx-navy"
                }`}
              >
                {y.value}
              </button>
            );
          })}
        </div>
      </Section>

      <Section title={t.filters.sections.km} badge={minKm || maxKm ? 1 : 0}>
        {KM_PRESETS.map((k) => (
          <OptionRow
            key={k}
            radio
            label={fmt(t.filters.kmUnder, { km: fmt(t.common.km, { n: num(k) }) })}
            checked={kmPreset === k}
            onChange={() => f.setMany({ minMileage: "", maxMileage: String(k) })}
          />
        ))}
        <RangeInputs key={`k${minKm}-${maxKm}`} unit="km" min={minKm} max={maxKm} onCommit={(a, b) => f.setMany({ minMileage: a, maxMileage: b })} />
      </Section>

      <Section title={t.filters.sections.fuel} badge={fuels.length}>
        {Object.entries(t.vehicle.fuel).map(([k, label]) => (
          <OptionRow key={k} label={label} count={facets.fuels.get(k as never) ?? 0} checked={fuels.includes(k)} onChange={() => f.toggle("fuel", k)} />
        ))}
      </Section>

      <Section title={t.filters.sections.gearbox} badge={gearboxes.length}>
        {Object.entries(t.vehicle.gearbox).map(([k, label]) => (
          <OptionRow key={k} label={label} count={facets.gearboxes.get(k as never) ?? 0} checked={gearboxes.includes(k)} onChange={() => f.toggle("gearbox", k)} />
        ))}
      </Section>

      <Section title={t.filters.sections.body} badge={bodies.length}>
        {Object.entries(t.vehicle.body)
          .filter(([k]) => facets.bodies.has(k as never) || bodies.includes(k))
          .map(([k, label]) => (
            <OptionRow key={k} label={label} count={facets.bodies.get(k as never) ?? 0} checked={bodies.includes(k)} onChange={() => f.toggle("body", k)} />
          ))}
      </Section>
    </div>
  );
}

/* ---------------------------------------------------------------- public API */

/** Desktop (≥1200px): sticky sidebar card. */
export function FilterSidebar({ facets }: { facets: Facets }) {
  const { t, plural } = useI18n();
  const f = useFilterUrl();
  return (
    <aside
      className="sticky top-[96px] hidden max-h-[calc(100dvh-116px)] w-[300px] shrink-0 self-start overflow-y-auto rounded-2xl border border-bx-line bg-white px-5 py-1 bxd:block"
      data-lenis-prevent
      aria-label={t.filters.label}
    >
      {f.activeCount > 0 && (
        <div className="flex items-center justify-between border-b border-bx-line py-3">
          <p className="text-sm text-bx-ink">
            {plural(f.activeCount, t.filters.active)}
          </p>
          <button type="button" onClick={f.clear} className="text-sm font-medium text-bx-blue hover:text-bx-blue-hover">
            {t.filters.clearAll}
          </button>
        </div>
      )}
      <FilterBody facets={facets} />
    </aside>
  );
}

/** Below 1200px: "Filtres (n)" button opening a full-height sheet with the same body. */
export function MobileFilters({ facets, resultCount }: { facets: Facets; resultCount: number }) {
  const { t, plural } = useI18n();
  const f = useFilterUrl();
  const [open, setOpen] = useState(false);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex h-11 items-center gap-2 rounded-[120px] border border-bx-navy bg-white px-4 text-sm text-bx-navy bxd:hidden"
      >
        <SlidersHorizontal className="size-4" strokeWidth={1.5} /> {t.filters.label} {f.activeCount > 0 && `(${f.activeCount})`}
      </button>
      {open && (
        <div className="fixed inset-0 z-50 bxd:hidden" role="dialog" aria-modal aria-label={t.filters.label}>
          <div className="absolute inset-0 bg-bx-navy/50" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 start-0 flex w-full max-w-[400px] flex-col bg-white">
            <div className="flex items-center justify-between border-b border-bx-line px-5 py-4">
              <p className="text-xl font-medium text-bx-navy">{t.filters.label}</p>
              <div className="flex items-center gap-3">
                {f.activeCount > 0 && (
                  <button type="button" onClick={f.clear} className="text-sm font-medium text-bx-blue">
                    {t.filters.clearAll}
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label={t.common.close}
                  className="grid size-9 place-items-center rounded-full border border-bx-line text-bx-navy"
                >
                  <X className="size-4" strokeWidth={1.5} />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto px-5" data-lenis-prevent>
              <FilterBody facets={facets} />
            </div>
            <div className="border-t border-bx-line p-5">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="h-11 w-full rounded-[10px] bg-bx-blue text-[15px] font-medium text-white transition-colors duration-300 bx-ease hover:bg-bx-blue-hover"
              >
                {plural(resultCount, t.filters.showResults)}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/** Free-text search pill above the results. */
export function SearchPill() {
  const { t } = useI18n();
  const f = useFilterUrl();
  const q = f.get("q");
  return (
    <div className="relative min-w-0 flex-1 bxt:max-w-[320px]">
      <Search className="pointer-events-none absolute start-4 top-1/2 size-4 -translate-y-1/2 text-bx-navy" strokeWidth={1.5} />
      <input
        key={q}
        type="search"
        aria-label={t.filters.search}
        placeholder={t.filters.searchPlaceholder}
        defaultValue={q}
        onKeyDown={(e) => e.key === "Enter" && f.setMany({ q: e.currentTarget.value.trim() })}
        onBlur={(e) => e.currentTarget.value.trim() !== q && f.setMany({ q: e.currentTarget.value.trim() })}
        className="h-11 w-full rounded-[120px] border border-bx-line bg-white ps-10 pe-4 text-sm text-bx-navy outline-none transition-colors duration-300 placeholder:text-bx-navy/60 hover:border-bx-navy focus:border-bx-navy"
      />
    </div>
  );
}

export function SortSelect() {
  const { t } = useI18n();
  const f = useFilterUrl();
  const sort = f.get("sort") || "recent";
  return (
    <div className="relative shrink-0">
      <select
        aria-label={t.filters.sort}
        value={sort}
        onChange={(e) => f.setMany({ sort: e.target.value === "recent" ? "" : e.target.value })}
        className={`h-11 appearance-none rounded-[120px] border bg-white py-3 ps-4 pe-10 text-sm text-bx-navy outline-none transition-colors duration-300 hover:border-bx-navy ${
          sort !== "recent" ? "border-bx-navy" : "border-bx-line"
        }`}
      >
        {Object.entries(t.filters.sortOptions).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute end-4 top-1/2 size-4 -translate-y-1/2 text-bx-navy" strokeWidth={1.5} />
    </div>
  );
}
