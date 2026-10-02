import type { Metadata } from "next";
import { Suspense } from "react";
import { SearchX } from "lucide-react";
import { FilterSidebar, MobileFilters, SearchPill, SortSelect } from "@/components/filters";
import { buildFacets, filterCars, getCars, getSettings, parseCarFilters } from "@/lib/wp";
import { getI18n } from "@/i18n/server";
import { localeAlternates } from "@/i18n/seo";
import type { BodyType } from "@/lib/types";
import { Card, PageIntro, PageSheet } from "@/components/sites/boxcars-framer-website-cd8da657/shared/page";
import { toVehicleCard } from "@/components/sites/boxcars-framer-website-cd8da657/shared/vehicle";
import { VehicleCard } from "@/components/sites/boxcars-framer-website-cd8da657/root-8a5edab2/FeaturedVehicles";
import { BxButton } from "@/components/sites/boxcars-framer-website-cd8da657/root-8a5edab2/ui";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t.buy.metaTitle, description: t.buy.metaDescription, alternates: await localeAlternates("/acheter") };
}

export default async function BuyPage({ searchParams }: PageProps<"/[lang]/acheter">) {
  const filters = parseCarFilters(await searchParams);
  const [cars, settings, i18n] = await Promise.all([getCars(), getSettings(), getI18n()]);
  const { t, fmt, plural, num } = i18n;
  const results = filterCars(cars, filters);
  const facets = buildFacets(cars);
  const onlyBody = filters.body?.length === 1 ? t.vehicle.body[filters.body[0] as BodyType] : undefined;
  const heading = onlyBody ? fmt(t.buy.titleBody, { body: onlyBody }) : t.buy.title;

  return (
    <PageSheet>
      <div className="pb-[30px] bxt:pb-[60px] bxd:pb-[90px]">
        <PageIntro
          tight
          eyebrow={plural(results.length, t.buy.eyebrow)}
          title={heading}
          aside={t.buy.aside}
        >
          <div className="flex items-start gap-[30px]">
            <Suspense>
              <FilterSidebar facets={facets} />
            </Suspense>

            <div className="flex min-w-0 flex-1 flex-col gap-5">
              <div className="flex flex-wrap items-center gap-2.5">
                <Suspense>
                  <MobileFilters facets={facets} resultCount={results.length} />
                  <SearchPill />
                  <p className="hidden text-sm text-bx-ink bxt:block bxt:ms-auto">
                    <span className="font-medium text-bx-navy">{num(results.length)}</span> {plural(results.length, t.buy.results)}
                  </p>
                  <SortSelect />
                </Suspense>
              </div>

              {results.length ? (
                <div className="grid grid-cols-1 gap-5 bxt:grid-cols-2 bxd:grid-cols-3">
                  {results.map((c, i) => (
                    <VehicleCard key={c.id} car={toVehicleCard(c, settings.loanRate, settings.loanMonths, i18n)} preload={i < 3} />
                  ))}
                </div>
              ) : (
                <Card className="flex flex-col items-center px-6 py-20 text-center">
                  <SearchX className="size-10 text-bx-muted" strokeWidth={1.5} />
                  <p className="mt-4 text-xl font-medium text-bx-navy">{t.buy.emptyTitle}</p>
                  <p className="mt-2 max-w-sm text-[15px] leading-6 text-bx-ink">
                    {t.buy.emptyText}
                  </p>
                  <div className="mt-6 flex flex-wrap items-center justify-center gap-5">
                    <BxButton href="/acheter">{t.buy.reset}</BxButton>
                    <BxButton href="/contact" variant="link">{t.buy.createAlert}</BxButton>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </PageIntro>
      </div>
    </PageSheet>
  );
}
