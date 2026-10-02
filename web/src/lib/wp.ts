import "server-only";
import type { Car, CarFilters, SiteSettings, Testimonial } from "./types";
import { DEFAULT_SETTINGS, MOCK_CARS, MOCK_TESTIMONIALS } from "./mock-data";

/**
 * WordPress headless client.
 * Talks to the `mozimotors-core` plugin REST namespace: {WP_API_URL}/wp-json/mozi/v1/*
 *
 * - WP_API_URL unset  → demo data (local design work, no backend needed).
 * - WP_API_URL set    → WordPress is the only source of truth. If a request fails we THROW instead
 *   of showing demo cars: Next then keeps serving the last good cached page (ISR) and retries,
 *   rather than caching fake stock for the whole revalidation window.
 */
const WP = process.env.WP_API_URL?.replace(/\/$/, "");
const REVALIDATE = Number(process.env.WP_REVALIDATE ?? 300);
const TIMEOUT_MS = 8000;

class WpNotFound extends Error {}

async function wpFetch<T>(path: string, tags: string[]): Promise<T> {
  const res = await fetch(`${WP}/wp-json/mozi/v1${path}`, {
    next: { revalidate: REVALIDATE, tags },
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (res.status === 404) throw new WpNotFound(path);
  if (!res.ok) throw new Error(`WP ${res.status} ${res.statusText} on ${path}`);
  return (await res.json()) as T;
}

/** Tolerate a PHP `[]` where an object/array is expected and fill optional car fields. */
function normalizeCar(c: Car): Car {
  const f = (c.features ?? {}) as Partial<Car["features"]>;
  const images = Array.isArray(c.images) ? c.images : [];
  return {
    ...c,
    images,
    photos: Array.isArray(c.photos) ? c.photos : undefined,
    features: {
      multimedia: f.multimedia ?? [],
      confort: f.confort ?? [],
      securite: f.securite ?? [],
      exterieur: f.exterieur ?? [],
    },
  };
}

export async function getCars(): Promise<Car[]> {
  if (!WP) return MOCK_CARS;
  const cars = await wpFetch<Car[]>("/cars", ["cars"]);
  return Array.isArray(cars) ? cars.map(normalizeCar) : [];
}

export async function getCar(slug: string): Promise<Car | null> {
  if (!WP) return MOCK_CARS.find((c) => c.slug === slug) ?? null;
  try {
    return normalizeCar(await wpFetch<Car>(`/cars/${encodeURIComponent(slug)}`, ["cars", `car-${slug}`]));
  } catch (err) {
    if (err instanceof WpNotFound) return null; // sold / unpublished / bad URL → regular 404
    throw err;
  }
}

export async function getTestimonials(): Promise<Testimonial[]> {
  if (!WP) return MOCK_TESTIMONIALS;
  const list = await wpFetch<Testimonial[]>("/testimonials", ["testimonials"]);
  return Array.isArray(list) ? list : [];
}

/** Settings are cosmetic (contact details): on failure fall back to defaults rather than breaking every page. */
export async function getSettings(): Promise<SiteSettings> {
  if (!WP) return DEFAULT_SETTINGS;
  let s: Partial<SiteSettings> = {};
  try {
    const raw = await wpFetch<Partial<SiteSettings> | []>("/settings", ["settings"]);
    if (!Array.isArray(raw)) s = raw;
  } catch (err) {
    console.error("[wp] settings unavailable, using defaults:", err);
  }
  return { ...DEFAULT_SETTINGS, ...Object.fromEntries(Object.entries(s).filter(([, v]) => v !== "" && v != null)) };
}

/** Text overrides per language from WP › Textes du site. Cosmetic: on failure the built-in text is used. */
export async function getTextOverrides(locale: string): Promise<Record<string, string>> {
  if (!WP) return {};
  try {
    const all = await wpFetch<Record<string, Record<string, string>> | []>("/texts", ["texts"]);
    const mine = Array.isArray(all) ? undefined : all[locale];
    return mine && typeof mine === "object" ? mine : {};
  } catch (err) {
    console.error("[wp] text overrides unavailable, using built-in text:", err);
    return {};
  }
}

const has = <T,>(list: T[] | undefined, v: T) => !list?.length || list.includes(v);

function matchesType(c: Car, types?: CarFilters["type"]) {
  if (!types?.length) return true;
  return types.some(
    (t) =>
      (t === "certifie" && c.certified) ||
      (t === "non-certifie" && !c.certified) ||
      (t === "financable" && c.financeable) ||
      (t === "sans-imperfection" && c.noDefects),
  );
}

/** Brand/model: a brand with no ticked model matches all its cars; ticked models narrow it. */
function matchesBrandModel(c: Car, brands?: string[], models?: string[]) {
  if (!brands?.length && !models?.length) return true;
  if (models?.includes(`${c.brandSlug}~${c.model}`)) return true;
  const brandHasModels = models?.some((m) => m.startsWith(`${c.brandSlug}~`));
  return Boolean(brands?.includes(c.brandSlug) && !brandHasModels);
}

export function filterCars(cars: Car[], f: CarFilters) {
  const q = f.q?.toLowerCase().trim();
  const out = cars.filter(
    (c) =>
      matchesType(c, f.type) &&
      (!f.dispo?.length || f.dispo.includes(c.privateSeller ? "particulier" : "showroom")) &&
      matchesBrandModel(c, f.brand, f.model) &&
      has(f.city, c.city) &&
      has(f.body, c.bodyType) &&
      has(f.fuel, c.fuel) &&
      has(f.gearbox, c.gearbox) &&
      has(f.year, c.year) &&
      (!f.minPrice || c.price >= f.minPrice) &&
      (!f.maxPrice || c.price <= f.maxPrice) &&
      (!f.minMileage || c.mileage >= f.minMileage) &&
      (!f.maxMileage || c.mileage <= f.maxMileage) &&
      (!f.minYear || c.year >= f.minYear) &&
      (!q || `${c.brand} ${c.model} ${c.version} ${c.city}`.toLowerCase().includes(q)),
  );
  const sorters: Record<string, (a: Car, b: Car) => number> = {
    "price-asc": (a, b) => a.price - b.price,
    "price-desc": (a, b) => b.price - a.price,
    "km-asc": (a, b) => a.mileage - b.mileage,
    recent: (a, b) => b.id - a.id,
  };
  return out.sort(sorters[f.sort ?? "recent"] ?? sorters.recent);
}

type Params = Record<string, string | string[] | undefined>;

/** Reads /acheter search params into `CarFilters`. */
export function parseCarFilters(sp: Params): CarFilters {
  const one = (k: string) => {
    const v = sp[k];
    return typeof v === "string" && v ? v : undefined;
  };
  const list = (k: string) => one(k)?.split(",").map((s) => s.trim()).filter(Boolean);
  const num = (k: string) => {
    const n = Number(one(k));
    return Number.isFinite(n) && n > 0 ? n : undefined;
  };
  return {
    type: list("type") as CarFilters["type"],
    dispo: list("dispo") as CarFilters["dispo"],
    brand: list("brand"),
    model: list("model"),
    city: list("city"),
    body: list("body"),
    fuel: list("fuel"),
    gearbox: list("gearbox"),
    year: list("year")?.map(Number).filter(Number.isFinite),
    minPrice: num("minPrice"),
    maxPrice: num("maxPrice"),
    minMileage: num("minMileage"),
    maxMileage: num("maxMileage"),
    minYear: num("minYear"),
    q: one("q"),
    sort: one("sort") as CarFilters["sort"],
  };
}

/** Option lists + counts for the /acheter sidebar, computed from the whole stock. */
export function buildFacets(cars: Car[]) {
  const count = <K extends string | number>(key: (c: Car) => K) => {
    const m = new Map<K, number>();
    for (const c of cars) m.set(key(c), (m.get(key(c)) ?? 0) + 1);
    return m;
  };
  const brands = buildCatalog(cars).map((b) => {
    const models = count((c) => (c.brandSlug === b.slug ? c.model : ""));
    models.delete("");
    return { ...b, models: [...models].map(([name, n]) => ({ name, count: n })).sort((x, y) => x.name.localeCompare(y.name)) };
  });
  const toList = <K extends string | number>(m: Map<K, number>) => [...m].map(([value, n]) => ({ value, count: n }));
  return {
    brands,
    cities: toList(count((c) => c.city)).sort((a, b) => b.count - a.count || String(a.value).localeCompare(String(b.value))),
    years: toList(count((c) => c.year)).sort((a, b) => Number(b.value) - Number(a.value)),
    fuels: count((c) => c.fuel),
    bodies: count((c) => c.bodyType),
    gearboxes: count((c) => c.gearbox),
  };
}

export type Facets = ReturnType<typeof buildFacets>;

/** Brand → models index, used to populate search selects. */
export function buildCatalog(cars: Car[]) {
  const brands = new Map<string, { slug: string; name: string; count: number; models: Set<string> }>();
  for (const c of cars) {
    const b = brands.get(c.brandSlug) ?? { slug: c.brandSlug, name: c.brand, count: 0, models: new Set() };
    b.count++;
    b.models.add(c.model);
    brands.set(c.brandSlug, b);
  }
  return [...brands.values()]
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((b) => ({ slug: b.slug, name: b.name, count: b.count, models: [...b.models].sort() }));
}
export type Catalog = ReturnType<typeof buildCatalog>;
