/** /vendre/demande — sell request flow in the siaracash.ma/sell/demande look (copy from the dictionary of the current language). */
import type { Metadata } from "next";
import { localeAlternates } from "@/i18n/seo";
import { getAllBrands, getCars } from "@/lib/cms";
import { SELL_BRANDS } from "@/lib/sell";
import { getSettings } from "@/components/sites/siaracash-ma-449ca86b/root-8a5edab2/settings";
import { getDictionary } from "@/i18n/server";
import { I18nProvider } from "@/i18n/client";
import { V2SellWizard } from "@/components/sites/siaracash-ma-449ca86b/root-8a5edab2/SellWizard";
import { getV2Locale } from "@/components/sites/siaracash-ma-449ca86b/root-8a5edab2/server-locale";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getDictionary(await getV2Locale());
  return { title: `${t.sellWizard.metaTitle} | MoziMotors`, description: t.sellWizard.metaDescription, robots: { index: false }, alternates: await localeAlternates("/vendre/demande") };
}

export default async function V2SellRequest({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const { ville } = await searchParams;
  const locale = await getV2Locale();
  const [settings, cars, brands, dict] = await Promise.all([getSettings(), getCars(), getAllBrands(), getDictionary(locale)]);
  // Brand → models offered in the form: the whole Studio catalog (not only the stock, unlike the buy side).
  // Without a catalog (demo mode): SELL_BRANDS, with the models seen in stock as suggestions.
  const models: Record<string, string[]> = {};
  if (brands.length) for (const b of brands) models[b.name] = b.models;
  else {
    for (const b of SELL_BRANDS) if (b !== "Autre") models[b] = [];
    for (const c of cars) {
      const list = (models[c.brand] ??= []);
      if (!list.includes(c.model)) list.push(c.model);
    }
  }
  return (
    <I18nProvider locale={locale} dict={dict}>
      <V2SellWizard
        initialCity={typeof ville === "string" ? ville : undefined}
        settings={{
          showroomCity: settings.showroomCity,
          homeInspectionCities: settings.homeInspectionCities,
          address: settings.address,
          phone: settings.phone,
        }}
        models={models}
      />
    </I18nProvider>
  );
}
