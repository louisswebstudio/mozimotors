/**
 * /faq — grouped questions. Same inner-page shell as the other pages: PageSheet + PageIntro,
 * sticky category index on the left (≥810px), one accordion per category on the right.
 */
import type { Metadata } from "next";
import { getI18n } from "@/i18n/server";
import { localeAlternates } from "@/i18n/seo";
import { PageIntro, PageSheet } from "@/components/sites/boxcars-framer-website-cd8da657/shared/page";
import { ASSETS, Container, H3 } from "@/components/sites/boxcars-framer-website-cd8da657/root-8a5edab2/ui";
import { FaqList } from "@/components/sites/boxcars-framer-website-cd8da657/root-8a5edab2/FaqList";
import { CtaBanner } from "@/components/sites/boxcars-framer-website-cd8da657/root-8a5edab2/CtaBanner";
import { Reveal } from "@/components/sites/boxcars-framer-website-cd8da657/root-8a5edab2/reveal";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t.faqPage.metaTitle, description: t.faqPage.metaDescription, alternates: await localeAlternates("/faq") };
}

export default async function FaqPage() {
  const { t } = await getI18n();
  const { groups } = t.faqPage;

  // FAQPage structured data for search engines.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: groups.flatMap((g) =>
      g.items.map((i) => ({ "@type": "Question", name: i.q, acceptedAnswer: { "@type": "Answer", text: i.a } })),
    ),
  };

  return (
    <PageSheet>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\u003c") }} />
      <PageIntro eyebrow={t.faqPage.eyebrow} title={t.faqPage.title} aside={t.faqPage.aside} />

      <section className="bg-white pb-[30px] bxt:pb-[60px] bxd:pb-[90px]">
        <Container className="flex flex-col gap-10 bxt:flex-row bxt:items-start bxt:gap-[60px]">
          <nav aria-label={t.faqPage.title} className="bxt:sticky bxt:top-[100px] bxt:w-[240px] bxt:shrink-0">
            <ul className="flex flex-wrap gap-2.5 bxt:flex-col bxt:gap-1">
              {groups.map((g, i) => (
                <li key={g.title}>
                  <a
                    href={`#faq-${i}`}
                    className="block rounded-xl bg-bx-soft px-4 py-2.5 text-[15px] font-medium leading-6 text-bx-navy transition-colors duration-300 bx-ease hover:bg-bx-lavender bxt:bg-transparent"
                  >
                    {g.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex min-w-0 flex-1 flex-col gap-[60px]">
            {groups.map((g, i) => (
              <Reveal key={g.title} y={24}>
                <section id={`faq-${i}`} className="flex scroll-mt-[110px] flex-col gap-5">
                  <h2 className={`${H3} text-bx-navy`}>{g.title}</h2>
                  <FaqList items={g.items} />
                </section>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <div className="pb-[30px] bxt:pb-[60px] bxd:pb-[90px]">
        <CtaBanner
          image={`${ASSETS}/images/cta-bg.jpg`}
          objectPosition="50% 40%"
          eyebrow={t.faqPage.eyebrow}
          title={t.faqPage.ctaTitle}
          text={t.faqPage.ctaText}
        />
      </div>
    </PageSheet>
  );
}
