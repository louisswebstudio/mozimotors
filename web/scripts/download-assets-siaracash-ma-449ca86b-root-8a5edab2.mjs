/**
 * Downloads siaracash.ma homepage assets (compiled CSS, fonts, images) into
 * public/sites/siaracash-ma-449ca86b/root-8a5edab2/. Usage: node scripts/download-assets-…mjs <rendered-dom.html>
 * Remote paths map 1:1: /assets/x → ./assets/x, https://(beta.)siaracash.ma/storage/x → ./storage/x
 */
import fs from "node:fs";
import path from "node:path";

const ORIGIN = "https://siaracash.ma";
const OUT = path.resolve("public/sites/siaracash-ma-449ca86b/root-8a5edab2");
const CSS = ["579fd207517bc97f", "a6d8944efc0930f8", "656fa799d7f6976d", "0f9d595ef4f8e4b7", "97198621078a6e2d", "cb8544a4ef612ecd", "a02c54d85ade1f05"];

async function get(url, dest) {
  if (fs.existsSync(dest)) return;
  const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
  if (!res.ok) return console.warn("skip", res.status, url);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, Buffer.from(await res.arrayBuffer()));
}

async function batch(jobs, n = 4) {
  for (let i = 0; i < jobs.length; i += n) await Promise.all(jobs.slice(i, n + i).map((j) => j()));
}

// 1. CSS (concatenated), font URLs rewritten to ./fonts/
let css = "";
for (const id of CSS) css += await (await fetch(`${ORIGIN}/_next/static/css/${id}.css`)).text() + "\n";
const fonts = [...new Set([...css.matchAll(/url\(\/_next\/static\/media\/([^)]+)\)/g)].map((m) => m[1]))];
css = css.replace(/url\(\/_next\/static\/media\//g, "url(./fonts/");
fs.mkdirSync(OUT, { recursive: true });
fs.writeFileSync(path.join(OUT, "siaracash.css"), css);
await batch(fonts.map((f) => () => get(`${ORIGIN}/_next/static/media/${f}`, path.join(OUT, "fonts", f))));

// 2. Images referenced by the rendered DOM
const html = fs.readFileSync(process.argv[2], "utf8");
const srcs = new Set([...html.matchAll(/\s(?:src|poster)="([^"]+)"/g)].map((m) => m[1].replace(/&amp;/g, "&")));
const jobs = [];
for (const s of srcs) {
  const local = s.startsWith("/assets/") ? s : s.replace(/^https:\/\/(beta\.)?siaracash\.ma(?=\/storage\/)/, "");
  if (local === s && !s.startsWith("/assets/")) continue;
  // SiaraCash's own inventory, customers and branding are not reused (MoziMotors data is used instead).
  if (/^\/storage\/(cars|testimonials)\/|^\/assets\/(payments|certified)\//.test(local)) continue;
  const url = s.startsWith("/") ? ORIGIN + s : s;
  jobs.push(() => get(url, path.join(OUT, local.split("?")[0])));
}
await batch(jobs);
console.log(`css ${css.length}B, ${fonts.length} fonts, ${jobs.length} images → ${OUT}`);
