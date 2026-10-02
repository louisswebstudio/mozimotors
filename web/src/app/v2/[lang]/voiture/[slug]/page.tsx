/**
 * /v2/voiture/[slug] — car page cloned from siaracash.ma/voiture/…, on MoziMotors cars.
 * Desktop (lg+): gallery + content left, sticky price/contact card right, similar cars + FAQ below.
 * Mobile: own top bar, swipe gallery, sections in siaracash.ma's mobile order, bottom CTA bar.
 */
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCar, getCars, getTestimonials } from "@/lib/wp";
import { getSettings } from "@/components/sites/siaracash-ma-449ca86b/root-8a5edab2/settings";
import { toDetail } from "@/components/sites/siaracash-ma-449ca86b/root-8a5edab2/listing";
import { DesktopGallery, MobileGallery } from "@/components/sites/siaracash-ma-449ca86b/root-8a5edab2/CarGallery";
import { MobileCtaBar, MobileInfo, MobileTopBar, PriceCard } from "@/components/sites/siaracash-ma-449ca86b/root-8a5edab2/CarSummary";
import {
  CarFaq,
  Condition,
  Features,
  Overview,
  QualityPledge,
  Serenity,
  SimilarDesktop,
  SimilarMobile,
  WhyThisCar,
} from "@/components/sites/siaracash-ma-449ca86b/root-8a5edab2/CarSections";
import { ReviewCard } from "@/components/sites/siaracash-ma-449ca86b/root-8a5edab2/Testimonials";
import { getV2 } from "@/components/sites/siaracash-ma-449ca86b/root-8a5edab2/server-locale";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const cars = await getCars();
  return cars.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const [car, { tf }] = await Promise.all([getCar((await params).slug), getV2()]);
  if (!car) return {};
  const price = `${car.price.toLocaleString("fr-FR")} DH`;
  return {
    title: `${car.brand} ${car.model} ${car.version} ${car.year} — ${price} | MoziMotors`,
    description: tf("{car} d'occasion à {city} : {price}. Inspectée, rapport d'expertise et essai sur rendez-vous.", {
      car: `${car.brand} ${car.model} ${car.year}`,
      city: car.city,
      price,
    }),
    openGraph: { images: car.images.slice(0, 1) },
  };
}

export default async function V2Car({ params }: Props) {
  const { slug } = await params;
  const [car, cars, settings, testimonials, { t }] = await Promise.all([getCar(slug), getCars(), getSettings(), getTestimonials(), getV2()]);
  if (!car) notFound();
  const d = toDetail(car, cars);
  const reportHref = car.reportUrl || "#condition";
  const reportHrefM = car.reportUrl || "#condition-m";

  return (
    <div className="cc-root min-h-svh">
      {/* Desktop */}
      <main className="mx-auto hidden max-w-[1280px] px-4 py-6 lg:block">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_380px]">
          <div className="min-w-0 space-y-6">
            <DesktopGallery photos={d.photos} carId={d.listed.id} />
            <WhyThisCar items={d.highlights} />
            <Overview rows={d.overview} />
            <Features tabs={d.tabs} />
            <Serenity checks={d.serenity} reportUrl={car.reportUrl} />
            <QualityPledge />
            <Condition label={d.condition} imperfections={d.imperfections} reportHref={reportHref} />
          </div>
          <PriceCard car={d.listed} owners={d.owners} rdv={d.rdv} reportHref={reportHref} phone={settings.phone} whatsapp={settings.whatsapp} />
        </div>
        <div className="mt-8 space-y-6">
          <SimilarDesktop cars={d.similar} />
          <CarFaq />
        </div>
      </main>

      {/* Mobile */}
      <div className="lg:hidden">
        <MobileTopBar car={d.listed} />
        <main className="space-y-4 px-4 pb-32 pt-4">
          <div>
            <MobileGallery photos={d.photos} />
            <MobileInfo car={d.listed} owners={d.owners} reportHref={reportHrefM} />
          </div>
          <Overview rows={d.overview} />
          <WhyThisCar items={d.highlights} />
          <Condition id="condition-m" label={d.condition} imperfections={d.imperfections} reportHref={reportHrefM} />
          <Serenity checks={d.serenity} reportUrl={car.reportUrl} />
          <Features tabs={d.tabs} />
          {testimonials.length > 0 && (
            <div className="rounded-xl bg-[var(--cc-primary-tint)] p-4">
              <h2 className="text-[17px] font-bold text-[var(--cc-ink)]">{t("Ils nous ont fait confiance")}</h2>
              <p className="mt-1 text-[13px] text-[var(--cc-body)]">{t("Rejoignez les clients qui ont acheté leur voiture en toute confiance avec MoziMotors.")}</p>
              <div className="mt-4 flex snap-x snap-mandatory gap-3 overflow-x-auto cc-noscroll">
                {testimonials.map((r) => (
                  <ReviewCard key={r.id} t={r} />
                ))}
              </div>
            </div>
          )}
          <SimilarMobile cars={d.similar} />
          <CarFaq />
        </main>
        <MobileCtaBar car={d.listed} rdv={d.rdv} phone={settings.phone} whatsapp={settings.whatsapp} />
      </div>
    </div>
  );
}
