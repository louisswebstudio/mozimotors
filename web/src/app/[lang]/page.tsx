/**
 * Homepage — design cloned from boxcars.framer.website, content from MoziMotors
 * (WordPress via src/lib/wp.ts, demo data as fallback).
 * Site chrome (nav, footer, fonts, smooth scroll) lives in src/app/layout.tsx.
 * Research + specs: docs/research/boxcars-framer-website-cd8da657/root-8a5edab2/
 * Previous homepage kept at docs/research/…/previous-homepage.page.tsx.txt
 */
import { buildCatalog, getCars, getSettings, getTestimonials } from "@/lib/wp";
import { toVehicleCard } from "@/components/sites/boxcars-framer-website-cd8da657/shared/vehicle";
import { ASSETS } from "@/components/sites/boxcars-framer-website-cd8da657/root-8a5edab2/ui";
import type { Metadata } from "next";
import type { BrandCardData, StatData } from "@/components/sites/boxcars-framer-website-cd8da657/root-8a5edab2/content";
import { getI18n } from "@/i18n/server";
import { localeAlternates } from "@/i18n/seo";
import { Hero } from "@/components/sites/boxcars-framer-website-cd8da657/root-8a5edab2/Hero";
import { BodyTypeCarousel } from "@/components/sites/boxcars-framer-website-cd8da657/root-8a5edab2/BodyTypeCarousel";
import { BrandsSection } from "@/components/sites/boxcars-framer-website-cd8da657/root-8a5edab2/BrandsSection";
import { FeaturedVehicles } from "@/components/sites/boxcars-framer-website-cd8da657/root-8a5edab2/FeaturedVehicles";
import { BuySellBanners } from "@/components/sites/boxcars-framer-website-cd8da657/root-8a5edab2/BuySellBanners";
import { HowItWorks } from "@/components/sites/boxcars-framer-website-cd8da657/root-8a5edab2/HowItWorks";
import { FinanceTeaser } from "@/components/sites/boxcars-framer-website-cd8da657/root-8a5edab2/FinanceTeaser";
import { Stats } from "@/components/sites/boxcars-framer-website-cd8da657/root-8a5edab2/Stats";
import { ReviewsMarquee } from "@/components/sites/boxcars-framer-website-cd8da657/root-8a5edab2/ReviewsMarquee";
import { CtaBanner } from "@/components/sites/boxcars-framer-website-cd8da657/root-8a5edab2/CtaBanner";
import { Faq } from "@/components/sites/boxcars-framer-website-cd8da657/root-8a5edab2/Faq";

/** Brands with a downloaded monochrome logo in public/sites/…/brands. */
const BRAND_LOGOS = new Set([
  "audi", "bmw", "byd", "citroen", "dacia", "fiat", "ford", "hyundai", "kia", "mercedes-benz",
  "nissan", "opel", "peugeot", "renault", "seat", "skoda", "toyota", "volkswagen",
]);


export async function generateMetadata(): Promise<Metadata> {
  return { alternates: await localeAlternates("/") };
}

export default async function Home() {
  const [cars, testimonials, settings, i18n] = await Promise.all([getCars(), getTestimonials(), getSettings(), getI18n()]);
  const { t } = i18n;

  const featured = (cars.some((c) => c.featured) ? cars.filter((c) => c.featured) : cars)
    .slice(0, 8)
    .map((c) => toVehicleCard(c, settings.loanRate, settings.loanMonths, i18n));

  const brands: BrandCardData[] = buildCatalog(cars)
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
    .slice(0, 8)
    .map((b) => ({
      name: b.name,
      href: `/acheter?brand=${b.slug}`,
      logo: BRAND_LOGOS.has(b.slug) ? `${ASSETS}/brands/${b.slug}.svg` : undefined,
    }));

  const stats: StatData[] = [
    { value: 140, suffix: "+", label: t.stats.inspection },
    { value: 4.8, decimals: 1, star: true, label: t.stats.rating },
    { value: 24, suffix: "h", label: t.stats.offer },
    { value: cars.length, suffix: "+", label: t.stats.stock },
  ];

  return (
    <>
      <Hero count={cars.length} />
      <BodyTypeCarousel />
      <FeaturedVehicles cars={featured} />
      <BrandsSection brands={brands} />
      <BuySellBanners />
      <HowItWorks />
      <FinanceTeaser rate={settings.loanRate} months={settings.loanMonths} />
      <Stats stats={stats} />
      <ReviewsMarquee testimonials={testimonials} />
      <Faq />
      <CtaBanner />
    </>
  );
}
