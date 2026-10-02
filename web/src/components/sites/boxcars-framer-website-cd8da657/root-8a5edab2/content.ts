/**
 * Language-independent data for the Boxcars-style pages: view-model types, image paths and
 * link targets. All visible text lives in the dictionaries (src/i18n/dictionaries), read with
 * `getI18n()` on the server or `useI18n()` in client components; arrays here line up by index
 * with the matching dictionary arrays (e.g. HOW_STEP_IMAGES[i] ↔ t.how.steps[i]).
 */
import { ASSETS } from "./ui";

/* ---------- view models (built from WordPress/mock data) ---------- */

export interface VehicleCardData {
  href: string;
  image: string;
  tag: string; // "Certifiée" / "Certified"
  title: string; // "Peugeot 3008"
  subtitle: string; // "2022 • 1.5 BlueHDi 130 EAT8 Allure"
  mileage: string; // "48 200 km"
  fuel: string; // "Diesel"
  gearbox: string; // "Automatique"
  gearboxShort: string; // "Auto" — fits a third of a 4-up card
  price: string; // "259 000 DH"
  monthly: string; // "5 116 DH"
}

export interface BrandCardData {
  name: string;
  href: string;
  logo?: string; // public path to a monochrome svg; fall back to a monogram when missing
}

export interface StatData {
  value: number;
  decimals?: number;
  suffix?: string; // "+", "h", "%"
  star?: boolean;
  label: string;
}

/* ---------- assets & links ---------- */

export const HERO_IMAGE = `${ASSETS}/images/hero-poster.jpg`;
export const HERO_VIDEO = { mp4: `${ASSETS}/video/hero.mp4`, webm: `${ASSETS}/video/hero.webm` };

export const BANNERS = [
  { image: `${ASSETS}/images/buy-couple.jpg`, objectPosition: "50% 50%", href: "/acheter" },
  { image: `${ASSETS}/images/sell-handshake.jpg`, objectPosition: "50% 50%", href: "/vendre" },
];

export const HOW_ID = "comment-ca-marche";
export const HOW_AVATARS = [`${ASSETS}/images/avatar-1.jpg`, `${ASSETS}/images/avatar-2.jpg`, `${ASSETS}/images/avatar-3.jpg`];
export const HOW_STEP_IMAGES = [1, 2, 3, 4].map((n) => `${ASSETS}/images/how-${n}.jpg`);

export const TRUST_VIDEO = `${ASSETS}/video/trust-story.mp4`;

export const CTA_IMAGE = `${ASSETS}/images/cta-atlas-road.jpg`;
export const FINANCE_IMAGE = `${ASSETS}/images/finance-calculator.jpg`;

export const GUIDES = [
  { image: `${ASSETS}/images/blog-2.jpg`, href: "/acheter" },
  { image: `${ASSETS}/images/blog-3.jpg`, href: "/vendre" },
  { image: `${ASSETS}/images/blog-1.jpg`, href: "/pourquoi-mozimotors" },
];

/** Footer link targets, index-aligned with t.footer.buyLinks / servicesLinks. */
export const FOOTER_BUY_HREFS = ["/acheter", "/acheter?body=suv", "/acheter?body=berline", "/acheter?fuel=hybride", "/acheter?maxPrice=150000"];
export const FOOTER_SERVICES_HREFS = ["/vendre", "/pourquoi-mozimotors", "/contact", "/faq"];

export const LOGO = {
  white: "/brand/mozi-logo-white.png",
  dark: "/brand/mozi-logo-dark.png",
  ratio: 900 / 198,
};
