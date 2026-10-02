/**
 * /v2/acheter — car listing cloned from siaracash.ma/lists, on MoziMotors stock.
 * URL-driven filters (same params as /acheter, parsed by parseCarFilters) + extra sort orders.
 * Desktop (lg+) and mobile trees are separate, like the original.
 */
import type { Metadata } from "next";
import { buildFacets, filterCars, getCars, parseCarFilters } from "@/lib/wp";
import { getSettings } from "@/components/sites/siaracash-ma-449ca86b/root-8a5edab2/settings";
import { formatPrice } from "@/lib/format";
import { sortCars, toListed } from "@/components/sites/siaracash-ma-449ca86b/root-8a5edab2/listing";
import { FacetsProvider, type ListingFacets } from "@/components/sites/siaracash-ma-449ca86b/root-8a5edab2/ListingFilters";
import { DesktopListing, MobileListing, type PopularBrand } from "@/components/sites/siaracash-ma-449ca86b/root-8a5edab2/ListingView";
import { getV2 } from "@/components/sites/siaracash-ma-449ca86b/root-8a5edab2/server-locale";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getV2();
  return {
    title: t("Voitures d'occasion au Maroc | MoziMotors"),
    description: t("Trouvez des voitures d'occasion au Maroc : filtrez par marque, prix, ville, année, kilométrage et carburant."),
  };
}

export default async function V2Buy({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  const [cars, settings] = await Promise.all([getCars(), getSettings()]);
  const filters = parseCarFilters(sp);
  const sort = typeof sp.sort === "string" ? sp.sort : undefined;
  const results = sortCars(filterCars(cars, { ...filters, sort: undefined }), sort).map((c) => toListed(c));

  const facets = buildFacets(cars);
  const listingFacets: ListingFacets = {
    brands: facets.brands,
    cities: facets.cities.map((c) => String(c.value)),
    years: facets.years.map((y) => Number(y.value)),
  };
  const byCount = [...facets.brands].sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
  const popular: PopularBrand[] = byCount.slice(0, 3).map((b) => {
    const prices = cars.filter((c) => c.brandSlug === b.slug).map((c) => c.price);
    return { name: b.name, slug: b.slug, count: b.count, range: `${formatPrice(Math.min(...prices))} – ${formatPrice(Math.max(...prices))}` };
  });
  const chipBrands = byCount.slice(0, 8).map((b) => ({ slug: b.slug, name: b.name }));

  return (
    <FacetsProvider facets={listingFacets}>
      <div className="cc-root min-h-svh">
        <div className="hidden lg:block">
          <DesktopListing cars={results} popular={popular} />
        </div>
        <div className="lg:hidden">
          <MobileListing cars={results} popular={popular} chipBrands={chipBrands} whatsapp={settings.whatsapp} />
        </div>
      </div>
    </FacetsProvider>
  );
}
