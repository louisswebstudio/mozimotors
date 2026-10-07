/**
 * Loads the brand/model catalogue (seed/catalog.json), brand logos (seed/logos) and starter settings into the dataset.
 * Safe to run again: documents that already exist are left untouched, only missing ones are added.
 *
 *   npm run seed            (= sanity exec scripts/seed.ts --with-user-token)
 */
import { createReadStream, existsSync } from "node:fs";
import { getCliClient } from "sanity/cli";
import catalog from "../seed/catalog.json" with { type: "json" };

type CatalogBrand = { name: string; slug: string; models: { name: string; slug: string }[] };

const client = getCliClient({ apiVersion: "2025-02-19" });

const docs: { _id: string; _type: string; [k: string]: unknown }[] = [];

for (const b of catalog as CatalogBrand[]) {
  const brandId = `brand-${b.slug}`;
  docs.push({ _id: brandId, _type: "brand", name: b.name, slug: { _type: "slug", current: b.slug } });
  for (const m of b.models) {
    docs.push({
      _id: `model-${b.slug}-${m.slug}`,
      _type: "model",
      name: m.name,
      slug: { _type: "slug", current: m.slug },
      brand: { _type: "reference", _ref: brandId },
    });
  }
}

// Current contact details of the site (same values the website used before the CMS).
docs.push({
  _id: "settings",
  _type: "settings",
  phone: "07 73 19 14 33",
  whatsapp: "212773191433",
  email: "contact@mozimotors.ma",
  address: "Showroom MoziMotors, Casablanca",
  hours: "Lun – Sam · 9h00 – 19h00",
  instagram: "https://www.instagram.com/mozi.motors",
  facebook: "https://www.facebook.com/share/1EPEcYEkEN/",
  showroomCity: "Casablanca",
  homeInspectionCities: ["Casablanca"],
  loanRate: 6.9,
  loanMonths: 60,
  leadEmail: "contact@mozimotors.ma",
});
docs.push({ _id: "siteTexts", _type: "siteTexts", overrides: [] });

const existing = new Set(await client.fetch<string[]>(`*[_id in $ids]._id`, { ids: docs.map((d) => d._id) }));
const missing = docs.filter((d) => !existing.has(d._id));

for (let i = 0; i < missing.length; i += 100) {
  const tx = client.transaction();
  for (const d of missing.slice(i, i + 100)) tx.createIfNotExists(d);
  await tx.commit({ visibility: "async" });
}

const count = (t: string) => missing.filter((d) => d._type === t).length;
console.log(
  `Added ${count("brand")} brands, ${count("model")} models` +
    `${count("settings") ? ", settings" : ""}${count("siteTexts") ? ", site texts" : ""}. ` +
    `${existing.size} already existed and were left as is.`,
);

// Logos (seed/logos/<brand slug>.png) for brands that don't have one yet — a logo set in the Studio is kept.
const LOGOS = new URL("../seed/logos/", import.meta.url);
const noLogo = await client.fetch<{ _id: string; slug: string }[]>(`*[_type == "brand" && !defined(logo)]{ _id, "slug": slug.current }`);
let logos = 0;
for (const b of noLogo) {
  const file = new URL(`${b.slug}.png`, LOGOS);
  if (!existsSync(file)) continue;
  const asset = await client.assets.upload("image", createReadStream(file), { filename: `${b.slug}.png` });
  await client.patch(b._id).set({ logo: { _type: "image", asset: { _type: "reference", _ref: asset._id } } }).commit();
  logos++;
}
const stillMissing = noLogo.length - logos;
console.log(`Added ${logos} brand logos.${stillMissing ? ` ${stillMissing} brand(s) have no logo file — add one in the Studio.` : ""}`);
