/** /faq — siaracash.ma/faq layout (buy / sell columns) with MoziMotors' FAQ (editable in Studio › Textes du site). */
import type { Metadata } from "next";
import { localeAlternates } from "@/i18n/seo";
import { getSettings } from "@/components/sites/siaracash-ma-449ca86b/root-8a5edab2/settings";
import { getDictionary } from "@/i18n/server";
import { getV2 } from "@/components/sites/siaracash-ma-449ca86b/root-8a5edab2/server-locale";
import { FaqTwoColumns } from "@/components/sites/siaracash-ma-449ca86b/root-8a5edab2/InfoPages";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getV2();
  return { title: t("Questions fréquentes | MoziMotors"), alternates: await localeAlternates("/faq") };
}

export default async function V2Faq() {
  const [{ dict: t }, fr, settings] = await Promise.all([getV2(), getDictionary("fr"), getSettings()]);
  const groups = t.faqPage.groups;
  // Selling questions go right; everything about buying (incl. financing, paperwork) goes left.
  // Groups are told apart on the French titles (same order in every language).
  const isSell = (i: number) => /vend/i.test(fr.faqPage.groups[i]?.title ?? "");
  const isFinance = (i: number) => /financ/i.test(fr.faqPage.groups[i]?.title ?? ""); // no financing offer
  const sell = groups.filter((_, i) => isSell(i)).flatMap((g) => g.items);
  const buy = groups.filter((_, i) => !isSell(i) && !isFinance(i)).flatMap((g) => g.items);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [...buy, ...sell].map((i) => ({ "@type": "Question", name: i.q, acceptedAnswer: { "@type": "Answer", text: i.a } })),
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\u003c") }} />
      <FaqTwoColumns buy={buy} sell={sell} phone={settings.phone} hours={settings.hours} />
    </>
  );
}
