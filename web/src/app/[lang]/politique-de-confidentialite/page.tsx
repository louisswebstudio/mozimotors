import type { Metadata } from "next";
import { LegalDoc } from "@/components/legal-doc";
import { getI18n } from "@/i18n/server";
import { localeAlternates } from "@/i18n/seo";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t.legal.docs.privacy.metaTitle, description: t.legal.docs.privacy.metaDescription, alternates: await localeAlternates("/politique-de-confidentialite") };
}

export default function Page() {
  return <LegalDoc doc="privacy" />;
}
