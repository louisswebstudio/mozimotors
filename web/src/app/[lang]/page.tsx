/**
 * / — homepage cloned from siaracash.ma (same layout and copy), with the MoziMotors logo, stock,
 * reviews and contact details. Like the original it renders a desktop tree (lg+) and a mobile tree.
 */
import type { Metadata } from "next";
import { localeAlternates } from "@/i18n/seo";
import { buildCatalog, getCars, getTestimonials } from "@/lib/cms";
import { getSettings } from "@/components/sites/siaracash-ma-449ca86b/root-8a5edab2/settings";
import { toListed } from "@/components/sites/siaracash-ma-449ca86b/root-8a5edab2/listing";
import { CarListings } from "@/components/sites/siaracash-ma-449ca86b/root-8a5edab2/CarListings";
import { DesktopHero, MobileSearch, QuickNavDesktop, QuickNavMobile } from "@/components/sites/siaracash-ma-449ca86b/root-8a5edab2/Hero";
import { MobileHero } from "@/components/sites/siaracash-ma-449ca86b/root-8a5edab2/MobileHero";
import { CertifiedBanner } from "@/components/sites/siaracash-ma-449ca86b/root-8a5edab2/CertifiedBanner";
import { BrandStrip } from "@/components/sites/siaracash-ma-449ca86b/root-8a5edab2/BrandStrip";
import { EdgeGrid } from "@/components/sites/siaracash-ma-449ca86b/root-8a5edab2/EdgeGrid";
import { HowItWorks } from "@/components/sites/siaracash-ma-449ca86b/root-8a5edab2/HowItWorks";
import { SellCta } from "@/components/sites/siaracash-ma-449ca86b/root-8a5edab2/SellCta";
import { Testimonials } from "@/components/sites/siaracash-ma-449ca86b/root-8a5edab2/Testimonials";
import { ContactCards } from "@/components/sites/siaracash-ma-449ca86b/root-8a5edab2/ContactCards";
import { BodyTypeRail } from "@/components/sites/siaracash-ma-449ca86b/root-8a5edab2/BodyTypeRail";
import { FuelTypeRail } from "@/components/sites/siaracash-ma-449ca86b/root-8a5edab2/FuelTypeRail";
import { PeaceOfMind } from "@/components/sites/siaracash-ma-449ca86b/root-8a5edab2/PeaceOfMind";

export async function generateMetadata(): Promise<Metadata> {
  return { alternates: await localeAlternates("/") };
}

export default async function V2Home() {
  const [cars, testimonials, settings] = await Promise.all([getCars(), getTestimonials(), getSettings()]);

  const all = cars.map((c) => toListed(c));
  const featured = (cars.some((c) => c.featured) ? cars.filter((c) => c.featured) : cars).slice(0, 8).map((c) => toListed(c));
  const catalog = buildCatalog(cars);

  const listings = <CarListings featured={featured} all={all} />;

  return (
    <div className="flex flex-col">
      <div className="hidden lg:block">
        <DesktopHero catalog={catalog} />
        <QuickNavDesktop />
        <CertifiedBanner />
        <section className="mx-auto max-w-[1280px] px-12 pt-8" />
        {listings}
        <BrandStrip catalog={catalog} />
        <EdgeGrid />
        <HowItWorks />
        <SellCta />
        <Testimonials testimonials={testimonials} />
        <ContactCards settings={settings} />
      </div>
      <div className="lg:hidden">
        <MobileHero />
        <QuickNavMobile />
        <MobileSearch catalog={catalog} />
        <CertifiedBanner />
        <section className="px-4 pt-6" />
        {listings}
        <BrandStrip catalog={catalog} />
        <SellCta />
        <BodyTypeRail />
        <EdgeGrid />
        <HowItWorks />
        <FuelTypeRail />
        <Testimonials testimonials={testimonials} />
        <ContactCards settings={settings} />
        <PeaceOfMind />
      </div>
    </div>
  );
}
