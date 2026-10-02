import { getI18n } from "@/i18n/server";
import { FaqList } from "./FaqList";
import { Reveal } from "./reveal";
import { BxButton, Container, Eyebrow, H3, SECTION_Y } from "./ui";

/** FAQ: sticky intro on the left (≥810px), accordion on the right. */
export async function Faq() {
  const { t } = await getI18n();
  return (
    <section id="faq" className={SECTION_Y}>
      <Container className="flex flex-col gap-[30px] bxt:flex-row bxt:items-start bxt:gap-0">
        <div className="flex-[1_1_0] bxt:sticky bxt:top-[100px]">
          <div className="flex flex-col items-center gap-[30px] pe-0 text-center bxt:items-start bxt:pe-[30px] bxt:text-start bxd:pe-[180px]">
            <Reveal y={24} className="flex flex-col items-center gap-2.5 bxt:items-start">
              <Eyebrow>{t.faq.eyebrow}</Eyebrow>
              <h3 className={`${H3} text-bx-navy`}>{t.faq.title}</h3>
              <p className="text-[15px] leading-6 text-bx-ink">{t.faq.text}</p>
            </Reveal>
            <Reveal y={20}>
              <BxButton href="/contact" variant="primary">
                {t.common.contactUs}
              </BxButton>
            </Reveal>
          </div>
        </div>
        <Reveal x={20} y={0} className="w-full flex-[1_1_0]">
          <FaqList items={t.faq.items} />
        </Reveal>
      </Container>
    </section>
  );
}
