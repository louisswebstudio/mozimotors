/**
 * Builds seed/catalog.json (every brand and model sold new in Morocco) from leguideauto.ma/le-neuf/les-marques.
 * Run again to refresh the list, then `npm run seed` to add new brands/models to Sanity (existing ones are kept).
 *
 *   node scripts/fetch-catalog.mjs
 */
import { writeFile } from "node:fs/promises";

const BASE = "https://www.leguideauto.ma/le-neuf/les-marques";
const DELAY_MS = 1000; // be polite: one request per second

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const decode = (s) =>
  s
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#0?39;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();

async function get(url) {
  const res = await fetch(url, { headers: { "User-Agent": "MoziMotors catalog sync (contact: contact@mozimotors.ma)" } });
  if (!res.ok) throw new Error(`${res.status} on ${url}`);
  return res.text();
}

/** Brand slug → display name, from the brand grid. */
function parseBrands(html) {
  const brands = new Map();
  const re = new RegExp(`<a[^>]*href="${BASE}/([^"/]+)"[^>]*>([\\s\\S]*?)</a>`, "g");
  for (const [, slug, inner] of html.matchAll(re)) {
    const name = decode(inner);
    if (name && !brands.has(slug)) brands.set(slug, name);
  }
  return brands;
}

/** Model slug → display name: each model card has `<span class="text-uppercase">Brand</span> <span class="font-weight-semibold">Model</span>`. */
function parseModels(html, brandSlug) {
  const models = new Map();
  const re = new RegExp(
    `href="${BASE}/${brandSlug}/([^"/]+)"[^>]*>\\s*<h3[^>]*>[\\s\\S]*?<span class="font-weight-semibold">([\\s\\S]*?)</span>`,
    "g",
  );
  for (const [, slug, name] of html.matchAll(re)) if (!models.has(slug)) models.set(slug, decode(name));
  return models;
}

/** Our own URL-safe slug (the source uses Arabic for one brand). */
const slugify = (s) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/&/g, "et")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

/** « LYNK & CO » → « Lynk & Co »; names that are acronyms (BMW, MG) stay as they are. */
const tidy = (name) =>
  name === name.toUpperCase() && name.length > 4 && /\s/.test(name)
    ? name.toLowerCase().replace(/\b\p{L}/gu, (c) => c.toUpperCase())
    : name;

const brandMap = parseBrands(await get(BASE));
console.log(`${brandMap.size} brands`);

const catalog = [];
for (const [sourceSlug, rawName] of brandMap) {
  await sleep(DELAY_MS);
  const html = await get(`${BASE}/${encodeURIComponent(sourceSlug)}`);
  const name = tidy(rawName);
  const models = [...parseModels(html, sourceSlug)].map(([s, n]) => ({ name: n, slug: slugify(s) }));
  models.sort((a, b) => a.name.localeCompare(b.name, "fr", { numeric: true }));
  catalog.push({ name, slug: slugify(name), models });
  console.log(`${name.padEnd(16)} ${models.length} models`);
}

catalog.sort((a, b) => a.name.localeCompare(b.name, "fr"));
await writeFile(new URL("../seed/catalog.json", import.meta.url), JSON.stringify(catalog, null, 2) + "\n");
console.log(`\n${catalog.length} brands, ${catalog.reduce((n, b) => n + b.models.length, 0)} models → seed/catalog.json`);
