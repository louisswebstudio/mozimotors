/**
 * Generates wordpress/mozimotors-core/texts-catalog.json: every editable string of the site
 * (key path + FR/EN/AR default), which powers WP admin › Textes du site.
 * Re-run after adding or renaming dictionary keys:  node scripts/build-texts-catalog.mjs
 */
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";
import ts from "typescript";

// The dictionaries are TypeScript with extensionless imports: transpile them to a temp dir first.
const src = resolve(import.meta.dirname, "../src/i18n/dictionaries");
const tmp = mkdtempSync(`${tmpdir()}/mozi-dict-`);
for (const l of ["fr", "en", "ar"]) {
  const js = ts.transpileModule(readFileSync(`${src}/${l}.ts`, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022, verbatimModuleSyntax: false },
  }).outputText.replace(/from "\.\/(fr|en|ar)"/g, 'from "./$1.mjs"');
  writeFileSync(`${tmp}/${l}.mjs`, js);
}
const load = async (l) => (await import(pathToFileURL(`${tmp}/${l}.mjs`).href))[l];
const [fr, en, ar] = await Promise.all(["fr", "en", "ar"].map(load));

// Technical strings that must not be edited from WP (formats, language names).
const SKIP = [/^langs\./, /^meta\.titleTemplate$/, /^common\.priceFormat$/, /^common\.perMonthFull$/];

function flatten(node, path = "", out = {}) {
  if (typeof node === "string") out[path] = node;
  else if (Array.isArray(node)) node.forEach((v, i) => flatten(v, `${path}.${i}`, out));
  else if (node && typeof node === "object") for (const [k, v] of Object.entries(node)) flatten(v, path ? `${path}.${k}` : k, out);
  return out;
}

const [f, e, a] = [fr, en, ar].map((d) => flatten(d));
const keys = Object.keys(f).filter((k) => !SKIP.some((re) => re.test(k)));
const catalog = keys.map((k) => ({ k, fr: f[k], en: e[k] ?? "", ar: a[k] ?? "" }));
const out = resolve(import.meta.dirname, "../../wordpress/mozimotors-core/texts-catalog.json");
writeFileSync(out, JSON.stringify(catalog));
const sections = new Set(keys.map((k) => k.split(".")[0]));
console.log(`${catalog.length} strings in ${sections.size} sections → ${out}`);
console.log([...sections].join(", "));
