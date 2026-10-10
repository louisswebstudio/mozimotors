/** /pourquoi-mozimotors — « Notre expertise », cloned from siaracash.ma/why-siaracash. */
import type { Metadata } from "next";
import { localeAlternates } from "@/i18n/seo";
import { getCars, getTestimonials } from "@/lib/cms";
import { getSettings } from "@/components/sites/siaracash-ma-449ca86b/root-8a5edab2/settings";
import { toListed } from "@/components/sites/siaracash-ma-449ca86b/root-8a5edab2/listing";
import { AdminCheck, BrowseCars, Expertise, Journey, LabelBand, TwoThings, WhyHero } from "@/components/sites/siaracash-ma-449ca86b/root-8a5edab2/Why";
import { Testimonials } from "@/components/sites/siaracash-ma-449ca86b/root-8a5edab2/Testimonials";
import { ContactCards } from "@/components/sites/siaracash-ma-449ca86b/root-8a5edab2/ContactCards";
import { getV2 } from "@/components/sites/siaracash-ma-449ca86b/root-8a5edab2/server-locale";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getV2();
  return {
    title: t("Notre expertise — plus de 140 points de contrôle | MoziMotors"),
    description: t("Une voiture inspectée, fiable et accompagnée de A à Z : contrôle administratif, expertise 140+ points, essai avant achat et démarches simplifiées."),
    alternates: await localeAlternates("/pourquoi-mozimotors"),
  };
}

export default async function V2Why() {
  const [cars, settings, testimonials] = await Promise.all([getCars(), getSettings(), getTestimonials()]);
  const listed = cars.slice(0, 8).map((c) => toListed(c));
  return (
    <>
      <WhyHero />
      <LabelBand />
      <AdminCheck />
      <Expertise />
      <Journey />
      <TwoThings />
      <Testimonials testimonials={testimonials} title="Ce que nos clients disent" />
      <BrowseCars cars={listed} />
      <ContactCards settings={settings} />
    </>
  );
}
