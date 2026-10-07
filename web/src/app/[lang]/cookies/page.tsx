/** /cookies — siaracash.ma legal-article layout with MoziMotors' own legal text (dictionary of the current language). */
import type { Metadata } from "next";
import { localeAlternates } from "@/i18n/seo";
import { getSettings } from "@/components/sites/siaracash-ma-449ca86b/root-8a5edab2/settings";
import { getV2 } from "@/components/sites/siaracash-ma-449ca86b/root-8a5edab2/server-locale";
import { LegalArticle } from "@/components/sites/siaracash-ma-449ca86b/root-8a5edab2/InfoPages";

export async function generateMetadata(): Promise<Metadata> {
  const { dict: t } = await getV2();
  return { title: `${t.legal.docs.cookies.metaTitle} | MoziMotors`, description: t.legal.docs.cookies.metaDescription, alternates: await localeAlternates("/cookies") };
}

export default async function Page() {
  const [{ dict: t }, settings] = await Promise.all([getV2(), getSettings()]);
  const d = t.legal.docs.cookies;
  return <LegalArticle title={d.title} intro={d.intro} sections={d.sections} updated={t.legal.updated} email={settings.email} />;
}
