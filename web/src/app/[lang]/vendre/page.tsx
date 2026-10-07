/** /vendre — sell landing cloned from siaracash.ma/sell (desktop and mobile trees, like the original). */
import type { Metadata } from "next";
import { localeAlternates } from "@/i18n/seo";
import { getSettings } from "@/components/sites/siaracash-ma-449ca86b/root-8a5edab2/settings";
import { ContactCards } from "@/components/sites/siaracash-ma-449ca86b/root-8a5edab2/ContactCards";
import {
  ExpertiseDesktop,
  ExpertiseMobile,
  Formulas,
  Prepare,
  SellBottomCta,
  SellFloatingCta,
  SellHeroDesktop,
  SellHeroMobile,
  SellKnowHow,
  SellStepsDesktop,
  SellStepsMobile,
} from "@/components/sites/siaracash-ma-449ca86b/root-8a5edab2/Sell";
import { getV2 } from "@/components/sites/siaracash-ma-449ca86b/root-8a5edab2/server-locale";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getV2();
  return {
    title: t("Vendre sa voiture au Maroc — Expertise auto gratuite & le juste prix | MoziMotors"),
    description: t("Vendez votre voiture au meilleur prix : expertise gratuite, offre sous 24h, paiement sécurisé — sans engagement."),
    alternates: await localeAlternates("/vendre"),
  };
}

export default async function V2Sell() {
  const settings = await getSettings();
  const hubs = settings.showroomCity ? [settings.showroomCity] : [];
  const home = settings.homeInspectionCities ?? [];
  return (
    <>
      <div className="hidden lg:block">
        <SellHeroDesktop />
        <SellStepsDesktop />
        <Formulas />
        <ExpertiseDesktop />
        <Prepare hubs={hubs} home={home} />
        <SellKnowHow />
        <div className="bg-white px-4 pt-10 pb-8 lg:px-12 lg:pt-16 lg:pb-16">
          <ContactCards settings={settings} />
        </div>
        <SellBottomCta />
      </div>
      <div className="lg:hidden">
        <SellHeroMobile />
        <SellStepsMobile />
        <Formulas mobile />
        <ExpertiseMobile />
        <Prepare hubs={hubs} home={home} />
        <SellKnowHow />
        <ContactCards settings={settings} />
        <SellBottomCta mobile />
      </div>
      <SellFloatingCta />
    </>
  );
}
