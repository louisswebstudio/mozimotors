import "server-only";
import { existsSync } from "node:fs";
import path from "node:path";
import type { BodyType, Car } from "./types";
import { getI18n } from "@/i18n/server";
import type { I18n } from "@/i18n/core";
import { buildCatalog, filterCars, parseCarFilters } from "./wp";

export interface BuyMenuLink {
  label: string;
  href: string;
  count: number;
  /** Body types: side-view car cut-out. */
  image?: string;
  /** Brands: monochrome logo, when one exists in /public. */
  logo?: string;
  /** Budgets: share of the stock (0–1) this ceiling covers. */
  share?: number;
}
export interface BuyMenu {
  total: number;
  bodies: BuyMenuLink[];
  budgets: BuyMenuLink[];
  brands: BuyMenuLink[];
}

/** Budget ceilings offered, in DH; only the useful ones are kept (see `budgetLinks`). */
const BUDGETS = [100_000, 150_000, 200_000, 250_000, 300_000, 400_000, 500_000];
const PER_GROUP = 4;
/** Brands get the widest column (two tiles per row), so they can show more. */
const MAX_BRANDS = 8;

/** Same cut-outs as the homepage body-type carousel. */
const BODY_IMG = "/sites/siaracash/body-types";
const BODY_IMAGES: Partial<Record<BodyType, string>> = {
  suv: "suv", pickup: "suv", berline: "sedan", break: "station-wagon", citadine: "compact",
  compacte: "compact", monospace: "van", coupe: "coupe", cabriolet: "convertible", utilitaire: "transport",
};
const LOGO_DIR = "/sites/boxcars-framer-website-cd8da657/root-8a5edab2/brands";
const logoFor = (slug: string) =>
  existsSync(path.join(process.cwd(), "public", LOGO_DIR, `${slug}.svg`)) ? `${LOGO_DIR}/${slug}.svg` : undefined;

/**
 * The "Acheter" mega menu, built from the real stock. Each link's count comes from running
 * the exact filter /acheter will apply to that URL, so the number shown always matches the page,
 * and a link is only listed when it leads to at least one car.
 */
export async function buildBuyMenu(cars: Car[]): Promise<BuyMenu> {
  const i18n = await getI18n();
  const bodyLabel = (b: BodyType) => i18n.t.vehicle.body[b];
  const countFor = (query: string) =>
    filterCars(cars, parseCarFilters(Object.fromEntries(new URLSearchParams(query)))).length;
  const link = (label: string, query: string, extra: Partial<BuyMenuLink> = {}): BuyMenuLink => ({
    label,
    href: `/acheter?${query}`,
    count: countFor(query),
    ...extra,
  });

  const bodyCounts = new Map<BodyType, number>();
  for (const c of cars) bodyCounts.set(c.bodyType, (bodyCounts.get(c.bodyType) ?? 0) + 1);
  const bodies = [...bodyCounts]
    .sort((a, b) => b[1] - a[1] || bodyLabel(a[0]).localeCompare(bodyLabel(b[0])))
    .slice(0, PER_GROUP)
    .map(([body]) =>
      link(bodyLabel(body), `body=${body}`, { image: BODY_IMAGES[body] && `${BODY_IMG}/${BODY_IMAGES[body]}.webp` }),
    );

  const brands = buildCatalog(cars)
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
    .slice(0, MAX_BRANDS)
    .map((b) => link(b.name, `brand=${b.slug}`, { logo: logoFor(b.slug) }));

  const nonEmpty = (l: BuyMenuLink[]) => l.filter((x) => x.count > 0);
  return {
    total: cars.length,
    bodies: nonEmpty(bodies),
    budgets: budgetLinks(cars.length, link, i18n),
    brands: nonEmpty(brands),
  };
}

/** Keep ceilings that match some cars but not all, and that each add cars over the previous one. */
function budgetLinks(
  total: number,
  link: (label: string, query: string, extra?: Partial<BuyMenuLink>) => BuyMenuLink,
  { t, fmt, price }: I18n,
) {
  const out: BuyMenuLink[] = [];
  for (const max of BUDGETS) {
    const l = link(fmt(t.buyMenu.under, { amount: price(max) }), `maxPrice=${max}`);
    if (l.count === 0 || l.count >= total) continue;
    if (out.length && l.count <= out[out.length - 1].count) continue;
    out.push({ ...l, share: l.count / total });
    if (out.length === PER_GROUP - 1) break;
  }
  return out;
}
