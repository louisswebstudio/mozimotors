import type { Metadata } from "next";
import { SellWizard } from "@/components/sell-wizard";
import { getCars, getSettings } from "@/lib/wp";
import { getI18n } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t.sellWizard.metaTitle, description: t.sellWizard.metaDescription, robots: { index: false } };
}

export default async function SellRequestPage({ searchParams }: PageProps<"/[lang]/vendre/demande">) {
  const { ville } = await searchParams;
  const [settings, cars] = await Promise.all([getSettings(), getCars()]);
  // Models seen in stock, as suggestions for the « Modèle » field.
  const models: Record<string, string[]> = {};
  for (const c of cars) {
    const list = (models[c.brand] ??= []);
    if (!list.includes(c.model)) list.push(c.model);
  }

  return (
    <SellWizard
      initialCity={typeof ville === "string" ? ville : undefined}
      settings={{
        showroomCity: settings.showroomCity,
        homeInspectionCities: settings.homeInspectionCities,
        address: settings.address,
        phone: settings.phone,
      }}
      models={models}
    />
  );
}
