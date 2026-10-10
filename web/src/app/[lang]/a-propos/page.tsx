/** /a-propos — who MoziMotors is, above the contact cards. */
import type { Metadata } from "next";
import { localeAlternates } from "@/i18n/seo";
import { getSettings } from "@/components/sites/siaracash-ma-449ca86b/root-8a5edab2/settings";
import { About } from "@/components/sites/siaracash-ma-449ca86b/root-8a5edab2/About";
import { ContactCards } from "@/components/sites/siaracash-ma-449ca86b/root-8a5edab2/ContactCards";
import { getV2 } from "@/components/sites/siaracash-ma-449ca86b/root-8a5edab2/server-locale";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getV2();
  return {
    title: t("À propos de MoziMotors — l'occasion en confiance | MoziMotors"),
    description: t("Basés à Casablanca, nous réunissons expertise automobile et service de proximité pour simplifier l'achat et la vente de véhicules d'occasion."),
    alternates: await localeAlternates("/a-propos"),
  };
}

export default async function V2About() {
  const settings = await getSettings();
  return (
    <>
      <About />
      <ContactCards settings={settings} />
    </>
  );
}
