import Link from "@/i18n/link";
import { Reveal } from "@/components/sites/boxcars-framer-website-cd8da657/root-8a5edab2/reveal";
import { Container } from "@/components/sites/boxcars-framer-website-cd8da657/root-8a5edab2/ui";
import { PageIntro, PageSheet } from "@/components/sites/boxcars-framer-website-cd8da657/shared/page";
import { getSettings } from "@/lib/wp";
import { getI18n } from "@/i18n/server";

export type LegalKey = "terms" | "privacy" | "cookies";

export const LEGAL_HREFS: Record<LegalKey, string> = {
  terms: "/conditions-generales",
  privacy: "/politique-de-confidentialite",
  cookies: "/cookies",
};

/** Shared layout for the three legal pages: intro, sticky section index, numbered sections. */
export async function LegalDoc({ doc }: { doc: LegalKey }) {
  const [{ t }, s] = await Promise.all([getI18n(), getSettings()]);
  const d = t.legal.docs[doc];
  const others = (Object.keys(LEGAL_HREFS) as LegalKey[]).filter((k) => k !== doc);
  return (
    <PageSheet>
      <PageIntro eyebrow={d.eyebrow} title={d.title} aside={d.intro} />
      <section className="pb-[60px] bxd:pb-[90px]">
        <Container className="grid gap-10 bxd:grid-cols-[280px_1fr] bxd:gap-[60px]">
          <aside className="flex flex-col gap-4 bxd:sticky bxd:top-[100px] bxd:self-start">
            <p className="text-sm text-[#818181]">{t.legal.updated}</p>
            <nav className="flex flex-col gap-1 rounded-2xl border border-bx-line p-2" aria-label={d.title}>
              {d.sections.map((sec, i) => (
                <a
                  key={sec.h}
                  href={`#s${i + 1}`}
                  className="rounded-xl px-4 py-2.5 text-[15px] text-bx-ink transition-colors duration-300 hover:bg-bx-lavender hover:text-bx-blue"
                >
                  {sec.h}
                </a>
              ))}
            </nav>
          </aside>
          <div className="flex max-w-[780px] flex-col gap-10">
            {d.sections.map((sec, i) => (
              <Reveal key={sec.h} y={20} as="section" id={`s${i + 1}`} className="scroll-mt-[110px]">
                <h2 className="text-[22px] font-semibold text-bx-navy bxd:text-2xl">{sec.h}</h2>
                <div className="mt-3 flex flex-col gap-3">
                  {sec.p.map((p) => (
                    <p key={p} className="text-[16px] leading-7 text-bx-ink">
                      {p}
                    </p>
                  ))}
                </div>
              </Reveal>
            ))}
            <p className="rounded-2xl bg-bx-lavender p-6 text-[15px] leading-6 text-bx-ink">
              {t.legal.contactLead}{" "}
              <a href={`mailto:${s.email}`} className="font-medium text-bx-blue underline">
                {s.email}
              </a>
            </p>
            <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
              {others.map((k) => (
                <Link key={k} href={LEGAL_HREFS[k]} className="text-bx-blue hover:underline">
                  {t.legal[k]}
                </Link>
              ))}
            </nav>
          </div>
        </Container>
      </section>
    </PageSheet>
  );
}
