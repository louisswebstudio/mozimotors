import "server-only";
import type { Car, CarFilters, CarPhoto, SiteSettings, Testimonial } from "./types";
import { DEFAULT_SETTINGS, MOCK_CARS, MOCK_TESTIMONIALS } from "./mock-data";
import { sanityConfigured, sanityImage, sanityQuery } from "./sanity";

/**
 * Content of the site, managed by the client in Sanity Studio (../studio).
 *
 * - SANITY_PROJECT_ID unset → demo data (local design work, no backend needed).
 * - SANITY_PROJECT_ID set   → Sanity is the only source of truth. If a request fails we THROW instead
 *   of showing demo cars: Next then keeps serving the last good cached page (ISR) and retries,
 *   rather than caching fake stock for the whole revalidation window.
 *
 * Cache tags (cars, car-<slug>, testimonials, settings, texts) are purged by the Sanity webhook → /api/revalidate.
 */

const CAR_FIELDS = `{
  _createdAt,
  "slug": slug.current,
  "brand": brand->name,
  "brandSlug": brand->slug.current,
  "model": model->name,
  version, year, mileage, fuel, gearbox, bodyType, city, price, oldPrice,
  fiscalPower, doors, seats, cylinders, drivetrain, owners, origin, negotiable, condition, imperfections,
  certified, financeable, privateSeller, noDefects, featured, description,
  "photos": photos[]{ "url": asset->url, category },
  "reportUrl": coalesce(report.asset->url, reportUrl),
  features,
  otherFeatures[]{ group, label }
}`;

/** Published, unsold cars with a page address. */
const CAR_FILTER = `_type == "car" && sold != true && defined(slug.current) && defined(brand) && defined(model)`;

type SanityCar = Omit<Car, "id" | "images" | "photos" | "features"> & {
  _createdAt: string;
  photos?: { url?: string; category?: CarPhoto["category"] }[] | null;
  features?: Partial<Car["features"]> | null;
  otherFeatures?: { group?: keyof Car["features"]; label?: string }[] | null;
};

const dropNulls = <T extends object>(o: T) => Object.fromEntries(Object.entries(o).filter(([, v]) => v != null)) as T;

function toCar(c: SanityCar): Car {
  const { _createdAt, photos: rawPhotos, features: f, otherFeatures, ...rest } = c;
  const photos: CarPhoto[] = (rawPhotos ?? [])
    .filter((p) => p.url)
    .map((p) => ({ url: sanityImage(p.url, "w=1600&fit=max&q=80")!, category: p.category ?? "exterieur" }));
  const features: Car["features"] = {
    multimedia: [...(f?.multimedia ?? [])],
    confort: [...(f?.confort ?? [])],
    securite: [...(f?.securite ?? [])],
    exterieur: [...(f?.exterieur ?? [])],
  };
  for (const o of otherFeatures ?? []) if (o.group && o.label && features[o.group]) features[o.group].push(o.label);
  return {
    ...dropNulls(rest),
    // Numeric id: creation time in seconds — newest cars sort first (« recent »).
    id: Math.floor(Date.parse(_createdAt) / 1000),
    certified: Boolean(c.certified),
    financeable: Boolean(c.financeable),
    privateSeller: Boolean(c.privateSeller),
    noDefects: Boolean(c.noDefects),
    featured: Boolean(c.featured),
    images: photos.map((p) => p.url),
    photos,
    features,
  };
}

export async function getCars(): Promise<Car[]> {
  if (!sanityConfigured) return MOCK_CARS;
  const cars = await sanityQuery<SanityCar[]>(`*[${CAR_FILTER}] | order(_createdAt desc) ${CAR_FIELDS}`, {}, ["cars"]);
  return cars.map(toCar);
}

export async function getCar(slug: string): Promise<Car | null> {
  if (!sanityConfigured) return MOCK_CARS.find((c) => c.slug === slug) ?? null;
  // Sold / unpublished / bad URL → null → regular 404.
  const car = await sanityQuery<SanityCar | null>(`*[${CAR_FILTER} && slug.current == $slug][0] ${CAR_FIELDS}`, { slug }, ["cars", `car-${slug}`]);
  return car ? toCar(car) : null;
}

export async function getTestimonials(): Promise<Testimonial[]> {
  if (!sanityConfigured) return MOCK_TESTIMONIALS;
  const list = await sanityQuery<(Omit<Testimonial, "id"> & { _createdAt: string })[]>(
    `*[_type == "testimonial" && defined(name) && defined(text)] | order(_createdAt desc)[0...50]{
      _createdAt, name, city, "rating": coalesce(rating, 5), title, text, "avatar": avatar.asset->url
    }`,
    {},
    ["testimonials"],
  );
  return list.map(({ _createdAt, avatar, ...t }) => ({
    ...dropNulls(t),
    id: Math.floor(Date.parse(_createdAt) / 1000),
    ...(avatar ? { avatar: sanityImage(avatar, "w=160&h=160&fit=crop") } : {}),
  }));
}

/**
 * Every brand → its models, from the Studio catalog (Marques / Modèles), whether or not they are in stock.
 * Used by the sell form so owners can pick any car. Empty in demo mode (the form then uses SELL_BRANDS).
 */
export async function getAllBrands(): Promise<{ name: string; models: string[] }[]> {
  if (!sanityConfigured) return [];
  const brands = await sanityQuery<{ name: string; models: (string | null)[] | null }[]>(
    `*[_type == "brand" && defined(name)] | order(name asc){ name, "models": *[_type == "model" && brand._ref == ^._id && defined(name)] | order(name asc).name }`,
    {},
    ["cars"],
  );
  return brands.map((b) => ({ name: b.name, models: (b.models ?? []).filter((m): m is string => Boolean(m)) }));
}

/** Settings are cosmetic (contact details): on failure fall back to defaults rather than breaking every page. */
export async function getSettings(): Promise<SiteSettings> {
  if (!sanityConfigured) return DEFAULT_SETTINGS;
  let s: Partial<SiteSettings> = {};
  try {
    s = (await sanityQuery<Partial<SiteSettings> | null>(`*[_id == "settings"][0]`, {}, ["settings"])) ?? {};
  } catch (err) {
    console.error("[cms] settings unavailable, using defaults:", err);
  }
  const set = Object.entries(s).filter(([k, v]) => !k.startsWith("_") && v !== "" && v != null && !(Array.isArray(v) && !v.length));
  return { ...DEFAULT_SETTINGS, ...Object.fromEntries(set) };
}

/** Email that receives form submissions (Réglages › Demandes), falling back to the contact email. Server only. */
export async function getLeadEmail(): Promise<string | undefined> {
  if (!sanityConfigured) return undefined;
  return (await sanityQuery<string | null>(`coalesce(*[_id == "settings"][0].leadEmail, *[_id == "settings"][0].email)`, {}, ["settings"])) ?? undefined;
}

/** Text overrides per language from Studio › Textes du site. Cosmetic: on failure the built-in text is used. */
export async function getTextOverrides(locale: string): Promise<Record<string, string>> {
  if (!sanityConfigured) return {};
  try {
    const rows = await sanityQuery<{ key?: string; fr?: string; en?: string; ar?: string }[] | null>(
      `*[_id == "siteTexts"][0].overrides[]{ key, fr, en, ar }`,
      {},
      ["texts"],
    );
    const lang = locale as "fr" | "en" | "ar";
    return Object.fromEntries((rows ?? []).filter((r) => r.key && r[lang]?.trim()).map((r) => [r.key!, r[lang]!]));
  } catch (err) {
    console.error("[cms] text overrides unavailable, using built-in text:", err);
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
