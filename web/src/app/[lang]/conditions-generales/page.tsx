/** /conditions-generales — siaracash.ma legal-article layout with MoziMotors' own legal text (dictionary of the current language). */
import type { Metadata } from "next";
import { localeAlternates } from "@/i18n/seo";
import { getSettings } from "@/components/sites/siaracash-ma-449ca86b/root-8a5edab2/settings";
import { getDictionary } from "@/i18n/server";
import { getV2 } from "@/components/sites/siaracash-ma-449ca86b/root-8a5edab2/server-locale";
import { LegalArticle } from "@/components/sites/siaracash-ma-449ca86b/root-8a5edab2/InfoPages";

export async function generateMetadata(): Promise<Metadata> {
  const { dict: t } = await getV2();
  return { title: `${t.legal.docs.terms.metaTitle} | MoziMotors`, description: t.legal.docs.terms.metaDescription, alternates: await localeAlternates("/conditions-generales") };
}

export default async function Page() {
  const [{ dict: t }, fr, settings] = await Promise.all([getV2(), getDictionary("fr"), getSettings()]);
  const d = t.legal.docs.terms;
  // No financing offer: drop that clause (found on the French heading, same order in every language) and renumber.
  const frSections = fr.legal.docs.terms.sections;
  const sections = d.sections.filter((_, i) => !/financ/i.test(frSections[i]?.h ?? "")).map((s) => ({ ...s, h: s.h.replace(/^\d+\.\s*/, "") }));
  return <LegalArticle title={d.title} intro={d.intro} sections={sections} updated={t.legal.updated} email={settings.email} />;
}
