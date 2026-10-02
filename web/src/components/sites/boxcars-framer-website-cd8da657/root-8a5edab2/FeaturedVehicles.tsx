import Image from "next/image";
import Link from "@/i18n/link";
import { getI18n } from "@/i18n/server";
import { Fuel, Gauge, Settings } from "lucide-react";
import type { VehicleCardData } from "./content";
import { Reveal } from "./reveal";
import { SwipeRow } from "./SwipeRow";
import { ArrowIcon, BxButton, Container, SECTION_Y, SectionHead } from "./ui";

/** "2022 • 1.5 BlueHDi 130" → ["2022", "1.5 BlueHDi 130"] */
function splitSubtitle(subtitle: string): [string, string] {
  const i = subtitle.indexOf("•");
  if (i === -1) return [subtitle.trim(), ""];
  return [subtitle.slice(0, i).trim(), subtitle.slice(i + 1).trim()];
}

/** One cell of the spec strip: icon above value, so each fact gets equal width at any card size. */
function Spec({ icon: Icon, children, title }: { icon: typeof Gauge; children: React.ReactNode; title?: string }) {
  return (
    <span title={title} className="flex min-w-0 flex-col items-center gap-1 px-0.5 text-center">
      <Icon size={16} strokeWidth={1.5} aria-hidden className="shrink-0 text-bx-navy/60" />
      <span className="w-full truncate text-[12.5px] font-medium leading-4 text-bx-navy">{children}</span>
    </span>
  );
}


/**
 * Boxcars vehicle card — shared by the homepage, /acheter and similar-car lists.
 * Hierarchy: image → title/version → spec chips → price (strongest) with the
 * monthly payment highlighted as the financing hook. The whole card is the link,
 * so the CTA is a quiet arrow button rather than competing text.
 */
export async function VehicleCard({ car, preload = false }: { car: VehicleCardData; preload?: boolean }) {
  const { t } = await getI18n();
  const [year, version] = splitSubtitle(car.subtitle);
  return (
    <Link
      href={car.href}
      aria-label={`${car.title}, ${car.subtitle}, ${car.price}`}
      className="group flex min-w-0 flex-col overflow-hidden rounded-2xl border border-bx-line bg-white transition-[box-shadow,transform] duration-300 bx-ease hover:-translate-y-0.5 hover:shadow-[0_12px_32px_-12px_rgba(5,11,32,0.22)]"
    >
      <div className="relative aspect-[16/10] shrink-0 overflow-hidden">
        <Image
          src={car.image}
          alt=""
          fill
          sizes="(min-width:1200px) 309px, (min-width:810px) 50vw, 100vw"
          preload={preload}
          className="object-cover transition-transform duration-500 bx-ease group-hover:scale-105"
        />
        <span className="absolute start-3 top-3 z-[1] flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 backdrop-blur-sm">
          <span className="size-1 rounded-full bg-bx-navy" />
          <span className="text-[11px] font-semibold uppercase leading-4 tracking-[0.04em] text-bx-navy">{car.tag}</span>
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-col gap-1">
          <h6 className="truncate text-[17px] font-semibold leading-6 text-bx-navy transition-colors duration-300 bx-ease group-hover:text-bx-blue">
            {car.title}
          </h6>
          <p className="truncate text-[13px] leading-5 text-bx-ink/70">
            {year}
            {version && <> · <bdi>{version}</bdi></>}
          </p>
        </div>

        <div className="flex-1">
          <div className="mt-4 grid grid-cols-3 divide-x divide-bx-line rounded-xl bg-bx-soft py-2.5">
            <Spec icon={Gauge}>{car.mileage}</Spec>
            <Spec icon={Fuel}>{car.fuel}</Spec>
            <Spec icon={Settings} title={car.gearbox}>
              {car.gearboxShort}
            </Spec>
          </div>
        </div>

        <div className="mt-4 flex items-end justify-between gap-3">
          <div className="flex min-w-0 flex-col gap-0.5">
            <span className="text-[22px] font-bold leading-7 tracking-[-0.02em] text-bx-navy">{car.price}</span>
            <span className="text-[13px] leading-5 text-bx-ink/70">
              {t.card.orFrom}{" "}
              <span className="font-semibold text-bx-blue">
                {car.monthly}
                {t.common.perMonth}
              </span>
            </span>
          </div>
          <span
            aria-hidden
            className="grid size-10 shrink-0 place-items-center rounded-full border border-bx-line text-bx-navy transition-colors duration-300 bx-ease group-hover:border-bx-blue group-hover:bg-bx-blue group-hover:text-white"
          >
            <ArrowIcon className="size-[10px]" />
          </span>
        </div>
      </div>
    </Link>
  );
}

/**
 * Homepage teaser. Phones: one swipeable row (scroll-snap) with the next card peeking in,
 * so 8 cars cost one screen of scroll instead of ~5 and the sections below stay reachable;
 * the "see all" CTA comes after the cards on every screen size. Tablet/desktop: plain grid.
 * (/acheter keeps a vertical list — people there scan and compare.)
 */
export async function FeaturedVehicles({ cars }: { cars: VehicleCardData[] }) {
  const { t } = await getI18n();
  return (
    <section className={`bg-white ${SECTION_Y}`}>
      <Container className="flex flex-col gap-6 bxt:gap-10">
        <SectionHead eyebrow={t.featured.eyebrow} title={t.featured.title} />
        <Reveal y={24} className="flex flex-col gap-6">
          <SwipeRow
            label={t.featured.title}
            className="no-scrollbar -mx-[30px] flex snap-x snap-mandatory scroll-px-[30px] gap-4 overflow-x-auto px-[30px] pb-1 bxt:mx-0 bxt:grid bxt:grid-cols-2 bxt:gap-5 bxt:overflow-visible bxt:px-0 bxt:pb-0 bxd:grid-cols-4"
            footer={
              <BxButton variant="primary" href="/acheter" className="w-full bxt:w-auto">
                {t.common.seeAllCars}
              </BxButton>
            }
          >
            {cars.map((car) => (
              <li key={car.href} className="flex w-[82%] max-w-[340px] shrink-0 snap-start *:w-full bxt:w-auto bxt:max-w-none">
                <VehicleCard car={car} />
              </li>
            ))}
          </SwipeRow>
        </Reveal>
      </Container>
    </section>
  );
}

export default FeaturedVehicles;
