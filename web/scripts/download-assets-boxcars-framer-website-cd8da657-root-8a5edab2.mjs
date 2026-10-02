// Downloads the Boxcars (boxcars.framer.website) design assets used by the homepage.
// Usage: node scripts/download-assets-boxcars-framer-website-cd8da657-root-8a5edab2.mjs
import fs from "node:fs/promises";
import path from "node:path";

const OUT = path.resolve("public/sites/boxcars-framer-website-cd8da657/root-8a5edab2");
const F = (id) => `https://framerusercontent.com/images/${id}`;
const SI = (slug) => `https://cdn.jsdelivr.net/npm/simple-icons@13/icons/${slug}.svg`;

const ASSETS = {
  // hero
  "images/hero-bg.jpg": F("PTxYY7jLPHaHgiQh2aXtASji6g4.jpg"),
  "icons/type-suv.svg": F("vItzdk3WQxgAnaG7rKkSqYIFQ0.svg"),
  "icons/type-sedan.svg": F("CouivDN7KBD9EuVDNN7lB3NU.svg"),
  "icons/type-electric.svg": F("h0mdzfn4yH1aC5bmF0ECvP3rsQ.svg"),
  // buyer / seller banners
  "images/banner-buy.jpg": F("lHsPToRqlThwuyMMWVZ0GV09tcg.jpg"),
  "images/banner-sell.jpg": F("aIb3JofA4FLCqaCFeWWMSE8Atx0.jpg"),
  // how it works
  "images/step-1.jpg": F("aeucp7FH86HpvzN5rd7gKdbe8.jpg"),
  "images/step-2.jpg": F("cDK4KtjafKId0VH1hZbttvV8GTU.jpg"),
  "images/step-3.jpg": F("pKIeOa5m9aAbhIG69E6xDFIlA8.jpg"),
  "images/step-4.jpg": F("AfsLNxCYoKl1Uti50ad50bmJJ4.jpg"),
  "images/avatar-1.jpg": F("f0VyG7epm01Zf9bLGF1jg55Sn4.jpg"),
  "images/avatar-2.jpg": F("pTuTcG3cC2VdJMeM4xhRO3VHWYM.jpg"),
  "images/avatar-3.jpg": F("qGQqFJ0V7ezdzgnBv6ojEZn1kjI.jpg"),
  // trust story
  "video/trust-story.mp4": "https://framerusercontent.com/assets/rfckGPCEEJvsZLXYG6wVh8q5dyQ.mp4",
  // testimonials (car photos)
  "images/review-car-1.jpg": F("mNsfvp6yJoMjpRhwfNQMCNhKxYM.jpg"),
  "images/review-car-2.jpg": F("iFWagMWyoGY8krgFiSbAWoAyzY.jpg"),
  "images/review-car-3.jpg": F("U8uysC6NgBjnXqJYQC0vBQ2U5Y.jpg"),
  "images/review-car-4.jpg": F("RRKkCrKRolzX5V4sMo7NrpzPzw.jpg"),
  "icons/arrow-prev.svg": F("A226aSSgrZp8j4dwSMsUtYDNu4k.svg"),
  "icons/arrow-next.svg": F("u7kO7y6SQWfWGhP53b9kDkuLyqI.svg"),
  // CTA
  "images/cta-bg.jpg": F("j2tfndbaoQ5sJw8x025LuZyuk4.jpg"),
  // blog
  "images/blog-1.jpg": F("L9GGUohzR5DS6nkASRF9ow6673Y.jpg"),
  "images/blog-2.jpg": F("UR3I0b9xKldzfOObxlI2fhDppA.jpg"),
  "images/blog-3.jpg": F("NjfEKAzlkR3OvHBbYRCoosToC5M.jpg"),
  // MoziMotors stock brands (monochrome logos from simple-icons)
  "brands/peugeot.svg": SI("peugeot"),
  "brands/dacia.svg": SI("dacia"),
  "brands/volkswagen.svg": SI("volkswagen"),
  "brands/mercedes-benz.svg": SI("mercedes"),
  "brands/hyundai.svg": SI("hyundai"),
  "brands/renault.svg": SI("renault"),
  "brands/toyota.svg": SI("toyota"),
  "brands/kia.svg": SI("kia"),
  "brands/skoda.svg": SI("skoda"),
  "brands/bmw.svg": SI("bmw"),
  "brands/fiat.svg": SI("fiat"),
  "brands/byd.svg": SI("byd"),
  "brands/audi.svg": SI("audi"),
  "brands/citroen.svg": SI("citroen"),
  "brands/ford.svg": SI("ford"),
  "brands/nissan.svg": SI("nissan"),
  "brands/seat.svg": SI("seat"),
  "brands/opel.svg": SI("opel"),
};

async function get([rel, url]) {
  const dest = path.join(OUT, rel);
  await fs.mkdir(path.dirname(dest), { recursive: true });
  if (await fs.stat(dest).catch(() => null)) return `skip ${rel}`;
  let err;
  for (let attempt = 0; attempt < 4; attempt++) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`${res.status}`);
      await fs.writeFile(dest, Buffer.from(await res.arrayBuffer()));
      return `ok   ${rel}`;
    } catch (e) {
      err = e;
      if (String(e.message) === "404") break;
      await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
    }
  }
  return `FAIL ${rel} (${url}): ${err.message}`;
}

const entries = Object.entries(ASSETS);
for (let i = 0; i < entries.length; i += 4) {
  const results = await Promise.all(entries.slice(i, i + 4).map(get));
  results.forEach((r) => console.log(r));
}
