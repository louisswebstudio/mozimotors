import type { Metadata } from "next";
import Link from "@/i18n/link";
import { getI18n, getLocale } from "@/i18n/server";
import { localeAlternates } from "@/i18n/seo";
import { notFound } from "next/navigation";
import {
  BadgeCheck, Calendar, Car as CarIcon, ChevronRight, CircleDollarSign, Clock, Cog, DoorOpen, Download, Flag, Fuel, Gauge,
  Hash, KeyRound, MapPin, Phone, Settings, ShieldCheck, Sparkles, Tag, Users, Zap, type LucideIcon,
} from "lucide-react";
import { Gallery } from "@/components/gallery";
import { CarFeatures } from "@/components/car-features";
import { LoanCalculator } from "@/components/loan-calculator";
import { CarCtas, FavShare, MobileCtaBar } from "@/components/car-actions";
import { Card, CheckBadge, H5, PageSheet } from "@/components/sites/boxcars-framer-website-cd8da657/shared/page";
import { toVehicleCard } from "@/components/sites/boxcars-framer-website-cd8da657/shared/vehicle";
import {
  ArrowIcon, BxButton, Container, Eyebrow, SECTION_Y, SectionHead,
} from "@/components/sites/boxcars-framer-website-cd8da657/root-8a5edab2/ui";
import { Reveal } from "@/components/sites/boxcars-framer-website-cd8da657/root-8a5edab2/reveal";
import { VehicleCard } from "@/components/sites/boxcars-framer-website-cd8da657/root-8a5edab2/FeaturedVehicles";
import { CtaBanner } from "@/components/sites/boxcars-framer-website-cd8da657/root-8a5edab2/CtaBanner";
import { getCar, getCars, getSettings } from "@/lib/wp";
import { monthlyPayment, carPhotos } from "@/lib/format";

export async function generateStaticParams() {
  const cars = await getCars();
  return cars.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/voiture/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const [car, { t, fmt, price, num }] = await Promise.all([getCar(slug), getI18n()]);
  if (!car) return {};
  const title = `${car.brand} ${car.model} ${car.version} ${car.year} — ${price(car.price)}`;
  return {
    title,
    description: fmt(t.car.metaDescription, {
      car: `${car.brand} ${car.model}`,
      year: car.year,
      km: fmt(t.common.km, { n: num(car.mileage) }),
      fuel: t.vehicle.fuel[car.fuel],
      city: car.city,
    }),
    openGraph: { title, type: "website", images: car.images.slice(0, 4) },
    twitter: { card: "summary_large_image", title, images: car.images.slice(0, 1) },
    alternates: await localeAlternates(`/voiture/${slug}`),
  };
}

/** Small primary-styled anchor (external links / downloads that BxButton's <Link> can't open in a new tab). */
const primaryA =
  "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-bx-blue px-6 py-2.5 text-[15px] font-medium leading-6 text-white transition-colors duration-300 bx-ease hover:bg-bx-blue-hover";

export default async function CarPage({ params }: PageProps<"/[lang]/voiture/[slug]">) {
  const { slug } = await params;
  const [car, cars, settings, i18n, locale] = await Promise.all([getCar(slug), getCars(), getSettings(), getI18n(), getLocale()]);
  if (!car) notFound();
  const { t, fmt, plural, price, num } = i18n;
  const km = (n: number) => fmt(t.common.km, { n: num(n) });

  const monthly = monthlyPayment(car.price, settings.loanRate, settings.loanMonths);
  const similar = cars.filter((c) => c.id !== car.id && (c.bodyType === car.bodyType || c.brandSlug === car.brandSlug)).slice(0, 4);
  const name = `${car.brand} ${car.model}`;
  const gearbox = t.vehicle.gearbox[car.gearbox];
  const owners = car.owners ? plural(car.owners, t.vehicle.owners) : undefined;
  const s = t.car.specs;

  const specs: [string, string | number | undefined, string][] = [
    [s.brand, car.brand, "Tag"], [s.model, car.model, "Car"], [s.version, car.version, "Hash"], [s.year, car.year, "Calendar"],
    [s.mileage, km(car.mileage), "Gauge"], [s.fuel, t.vehicle.fuel[car.fuel], "Fuel"],
    [s.gearbox, gearbox, "Settings"], [s.body, t.vehicle.body[car.bodyType], "Car"],
    [s.drivetrain, car.drivetrain, "Cog"], [s.fiscalPower, car.fiscalPower && fmt(t.car.fiscalPowerValue, { n: car.fiscalPower }), "Zap"],
    [s.cylinders, car.cylinders, "Cog"], [s.doors, car.doors, "DoorOpen"], [s.seats, car.seats, "Users"],
    [s.owners, owners, "KeyRound"],
    [s.origin, car.origin, "Flag"], [s.city, car.city, "MapPin"],
    [s.negotiable, car.negotiable == null ? undefined : car.negotiable ? t.car.yes : t.car.no, "CircleDollarSign"],
  ];
  const h = t.car.highlights;

  const highlights = [
    car.certified && { icon: BadgeCheck, ...h.inspected },
    car.mileage < 60000 && { icon: Gauge, t: h.lowKm.t, d: fmt(h.lowKm.d, { km: km(car.mileage) }) },
    car.oldPrice && car.oldPrice > car.price && { icon: Tag, t: h.priceDrop.t, d: fmt(h.priceDrop.d, { amount: price(car.oldPrice - car.price) }) },
    car.noDefects && { icon: Sparkles, ...h.noDefects },
    car.owners === 1 && { icon: Users, ...h.firstHand },
    { icon: ShieldCheck, ...h.lienCheck },
  ].filter(Boolean) as { icon: LucideIcon; t: string; d: string }[];

  const featureGroups = (Object.entries(car.features) as [string, string[]][]).filter(([, l]) => l?.length);
  const mapsHref = settings.mapsUrl ?? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(settings.address)}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Car",
    name: `${name} ${car.version}`,
    brand: { "@type": "Brand", name: car.brand },
    model: car.model,
    vehicleModelDate: String(car.year),
    mileageFromOdometer: { "@type": "QuantitativeValue", value: car.mileage, unitCode: "KMT" },
    fuelType: t.vehicle.fuel[car.fuel],
    vehicleTransmission: gearbox,
    bodyType: t.vehicle.body[car.bodyType],
    itemCondition: "https://schema.org/UsedCondition",
    image: car.images,
    offers: {
      "@type": "Offer",
      price: car.price,
      priceCurrency: "MAD",
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/UsedCondition",
      seller: { "@type": "AutoDealer", name: "MoziMotors", telephone: settings.phone, address: settings.address },
    },
  };

  return (
    <PageSheet>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Container className="pt-5">
        <nav className="mb-5 flex min-w-0 items-center gap-1 text-sm leading-5 text-[#818181]" aria-label={t.car.breadcrumb}>
          <Link href="/" className="shrink-0 transition-colors duration-300 bx-ease hover:text-bx-blue">{t.nav.home}</Link>
          <ChevronRight className="size-3.5 shrink-0 rtl:-scale-x-100" strokeWidth={1.5} />
          <Link href="/acheter" className="shrink-0 transition-colors duration-300 bx-ease hover:text-bx-blue">{t.nav.buy}</Link>
          <ChevronRight className="size-3.5 shrink-0 rtl:-scale-x-100" strokeWidth={1.5} />
          <Link href={`/acheter?brand=${car.brandSlug}`} className="shrink-0 transition-colors duration-300 bx-ease hover:text-bx-blue">{car.brand}</Link>
          <ChevronRight className="size-3.5 shrink-0 rtl:-scale-x-100" strokeWidth={1.5} />
          <span className="truncate text-bx-navy">{car.model}</span>
        </nav>

        <div className="grid grid-cols-1 gap-[60px] bxd:grid-cols-[1fr_439px]">
          {/* LEFT */}
          <div className="flex min-w-0 flex-col gap-[30px] bxt:gap-[60px]">
            <Gallery photos={carPhotos(car)} alt={`${name} ${car.year}`} />

            {/* Mobile / tablet summary */}
            <div id="summary" className="scroll-mt-20 bxd:hidden"><Summary /></div>

            {highlights.length > 0 && (
              <Reveal as="section" y={24} className="flex flex-col gap-5">
                <h2 className={H5}>{t.car.whyTitle}</h2>
                <div className="grid grid-cols-1 gap-5 bxt:grid-cols-2">
                  {highlights.map(({ icon: Icon, t: title, d }) => (
                    <div key={title} className="flex gap-[15px]">
                      <span className="grid size-[42px] shrink-0 place-items-center rounded-2xl bg-bx-lavender">
                        <Icon size={18} strokeWidth={1.5} color="#050B20" aria-hidden />
                      </span>
                      <div className="flex flex-col gap-1">
                        <p className="text-base font-medium leading-[23.4px] text-bx-navy">{title}</p>
                        <p className="text-sm leading-5 text-bx-ink">{d}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Reveal>
            )}

            <Reveal as="section" id="etat" y={24} className="flex scroll-mt-28 flex-col gap-[30px] rounded-2xl bg-bx-lavender p-[30px]">
              <div className="flex flex-col items-start gap-5 bxt:flex-row bxt:items-end bxt:justify-between">
                <div className="flex flex-col items-start gap-2.5">
                  <Eyebrow>{t.car.conditionEyebrow}</Eyebrow>
                  <p className="text-[22px] font-medium leading-[1.3] text-bx-navy bxd:text-[26px] bxd:leading-[33.8px]">{car.condition ?? t.car.conditionDefault}</p>
                  <p className="text-[15px] leading-6 text-bx-ink">
                    {car.imperfections ? plural(car.imperfections, t.car.imperfections) : t.car.noImperfections}
                  </p>
                </div>
                {car.reportUrl ? (
                  <a href={car.reportUrl} target="_blank" rel="noreferrer" className={primaryA}>
                    <Download className="size-4" strokeWidth={1.5} /> {t.car.report}
                  </a>
                ) : (
                  <span className="shrink-0 rounded-[120px] bg-white px-[15px] py-[7px] text-sm leading-5 text-bx-navy">{t.car.reportOnRequest}</span>
                )}
              </div>
              <ul className="flex flex-col gap-[15px] bxt:flex-row bxt:flex-wrap bxt:gap-x-[30px]">
                {t.car.checks.map((check) => (
                  <li key={check} className="flex items-start gap-[5px] text-[15px] leading-6 text-bx-ink"><CheckBadge /> {check}</li>
                ))}
              </ul>
            </Reveal>

            <Reveal as="section" y={24} className="flex flex-col gap-5">
              <h2 className={H5}>{t.car.featuresTitle}</h2>
              <CarFeatures
                lang={locale}
                labels={{ ...t.car.featuresUi, yes: t.car.yes, no: t.car.no, groups: t.car.featureGroups }}
                specs={specs.filter(([, v]) => v !== undefined && v !== "" && v !== 0).map(([k, v, icon]) => ({ label: k, value: String(v), icon }))}
                features={car.features}
              />
            </Reveal>

            {car.description && (
              <Reveal as="section" y={24} className="flex flex-col gap-5">
                <h2 className={H5}>{t.car.description}</h2>
                <div className="whitespace-pre-line text-[15px] leading-6 text-bx-ink">{car.description}</div>
              </Reveal>
            )}

            {car.financeable && (
              <section id="financement" className="scroll-mt-[120px]">
                <Card className="flex flex-col gap-5 p-6">
                  <h2 className="text-xl font-semibold leading-[1.3] text-bx-navy">{t.car.simulate}</h2>
                  <LoanCalculator price={car.price} rate={settings.loanRate} defaultMonths={settings.loanMonths} />
                </Card>
              </section>
            )}

            <Reveal as="section" y={24} className="flex flex-col gap-5">
              <h2 className={H5}>{t.car.visitUs}</h2>
              <iframe
                src={`https://www.google.com/maps?q=${encodeURIComponent(settings.address)}&output=embed`}
                title={fmt(t.car.mapTitle, { address: settings.address })}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-[400px] w-full rounded-2xl border-0 bg-bx-soft"
              />
              <div className="grid grid-cols-1 gap-5 bxt:grid-cols-3">
                {([
                  [MapPin, t.car.address, settings.address, undefined],
                  [Clock, t.car.hours, settings.hours, undefined],
                  [Phone, t.car.phone, settings.phone, `tel:${settings.phone.replace(/\s/g, "")}`],
                ] as [LucideIcon, string, string, string | undefined][]).map(([Icon, label, value, href]) => (
                  <div key={label} className="flex flex-col items-start gap-2.5">
                    <span className="grid size-9 place-items-center rounded-full bg-bx-lavender">
                      <Icon size={16} strokeWidth={1.5} color="#405FF2" aria-hidden />
                    </span>
                    <div className="flex flex-col gap-1">
                      <p className="text-sm leading-5 text-[#818181]">{label}</p>
                      {href ? (
                        <a href={href} className="text-[15px] leading-6 text-bx-navy transition-colors duration-300 bx-ease hover:text-bx-blue">{value}</a>
                      ) : (
                        <p className="whitespace-pre-line text-[15px] leading-6 text-bx-navy">{value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div>
                <a href={mapsHref} target="_blank" rel="noreferrer" className={primaryA}>
                  <span>{t.car.directions}</span>
                  <span className="grid size-[11px] place-items-center"><ArrowIcon /></span>
                </a>
              </div>
            </Reveal>
          </div>

          {/* RIGHT — sticky summary */}
          <aside className="hidden bxd:sticky bxd:top-[100px] bxd:block bxd:self-start">
            <Summary />
          </aside>
        </div>
      </Container>

      <MobileCtaBar
        price={price(car.price)}
        carLabel={`${name} ${car.version} ${car.year} — ${price(car.price)}`}
        reference={`MZ-${String(car.id).padStart(5, "0")}`}
        whatsapp={settings.whatsapp}
      />

      {similar.length > 0 && (
        <section className={`bg-white ${SECTION_Y}`}>
          <Container className="flex flex-col gap-[30px] bxt:gap-10">
            <SectionHead
              eyebrow={t.car.similarEyebrow}
              title={t.car.similarTitle}
              right={<BxButton variant="link" href={`/acheter?body=${car.bodyType}`}>{t.car.seeAll}</BxButton>}
            />
            <Reveal y={24}>
              <div className="grid grid-cols-1 gap-5 bxt:grid-cols-2 bxd:grid-cols-4">
                {similar.map((c) => (
                  <VehicleCard key={c.id} car={toVehicleCard(c, settings.loanRate, settings.loanMonths, i18n)} />
                ))}
              </div>
            </Reveal>
          </Container>
        </section>
      )}

      <div className={similar.length > 0 ? "pb-[30px] bxt:pb-[60px] bxd:pb-[90px]" : SECTION_Y}>
        <CtaBanner />
      </div>
    </PageSheet>
  );

  /**
   * Sidebar card, SiaraCash order: price → badges + favourite/share → title → key specs →
   * report link → Prendre RDV / WhatsApp / call → reference; the city sits in its own card below.
   */
  function Summary() {
    const c = car!;
    const reference = `MZ-${String(c.id).padStart(5, "0")}`;
    const keySpecs: [LucideIcon, string][] = [
      [Gauge, km(c.mileage)],
      ...(owners ? [[Users, owners] as [LucideIcon, string]] : []),
      [Fuel, t.vehicle.fuel[c.fuel]],
      [Settings, gearbox],
    ];
    const badges = [
      c.certified
        ? { label: t.common.certified, icon: ShieldCheck, cls: "bg-ok-50 text-ok" }
        : { label: t.common.used, icon: Tag, cls: "bg-bx-soft text-bx-ink" },
      c.financeable && { label: t.car.financeable, icon: CircleDollarSign, cls: "bg-bx-lavender text-bx-blue" },
      c.privateSeller && { label: t.car.privateSeller, icon: BadgeCheck, cls: "bg-bx-navy text-white" },
    ].filter(Boolean) as { label: string; icon: LucideIcon; cls: string }[];

    return (
      <div className="flex flex-col gap-4">
        <Card className="flex flex-col gap-5 p-6 bxd:p-7">
          {/* Price */}
          <div className="flex flex-col gap-1 border-b border-bx-line pb-5">
            {c.oldPrice && c.oldPrice > c.price && (
              <p className="text-sm leading-5 text-[#818181] line-through">{price(c.oldPrice)}</p>
            )}
            <p className="text-[32px] font-bold leading-[1.15] tracking-[-0.02em] text-bx-navy">{price(c.price)}</p>
            {c.financeable && (
              <a href="#financement" className="w-fit text-[15px] font-semibold leading-6 text-bx-blue transition-colors duration-300 bx-ease hover:text-bx-blue-hover">
                {fmt(t.common.perMonthFull, { amount: price(monthly) })}
              </a>
            )}
          </div>

          {/* Badges + favourite / share, then title */}
          <div className="flex flex-col gap-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex flex-wrap gap-1.5">
                {badges.map(({ label, icon: Icon, cls }) => (
                  <span key={label} className={`inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold leading-5 ${cls}`}>
                    <Icon className="size-3.5" strokeWidth={2} aria-hidden />
                    {label}
                  </span>
                ))}
              </div>
              <FavShare title={`${name} ${c.year}`} />
            </div>
            <div className="flex flex-col gap-1">
              <h1 className="text-[26px] font-bold leading-[1.2] text-bx-navy">
                {name} {c.year}
              </h1>
              {c.version && <p className="text-[15px] leading-6 text-bx-ink/70"><bdi>{c.version}</bdi></p>}
            </div>
          </div>

          {/* Key specs + report */}
          <div className="flex flex-col gap-3">
            <ul className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm font-medium leading-5 text-bx-navy">
              {keySpecs.map(([Icon, v]) => (
                <li key={v} className="flex items-center gap-1">
                  <Icon className="size-4 text-bx-navy/70" strokeWidth={1.5} aria-hidden />
                  {v}
                </li>
              ))}
            </ul>
            {c.reportUrl ? (
              <a href={c.reportUrl} target="_blank" rel="noreferrer" className="w-fit text-[15px] font-semibold leading-6 text-bx-navy underline decoration-bx-navy/30 underline-offset-4 transition-colors duration-300 hover:text-bx-blue hover:decoration-bx-blue">
                {t.car.seeReport}
              </a>
            ) : (
              <a href="#etat" className="w-fit text-[15px] font-semibold leading-6 text-bx-navy underline decoration-bx-navy/30 underline-offset-4 transition-colors duration-300 hover:text-bx-blue hover:decoration-bx-blue">
                {t.car.seeCondition}
              </a>
            )}
          </div>

          <CarCtas
            carId={c.id}
            carLabel={`${name} ${c.version} ${c.year} — ${price(c.price)}`}
            reference={reference}
            phone={settings.phone}
            whatsapp={settings.whatsapp}
          />
        </Card>

        <Card className="flex items-center gap-3 px-6 py-4">
          <MapPin className="size-5 shrink-0 text-bx-navy" strokeWidth={1.5} aria-hidden />
          <span className="text-[15px] font-semibold leading-6 text-bx-navy">{c.city}</span>
        </Card>
      </div>
    );
  }
}
