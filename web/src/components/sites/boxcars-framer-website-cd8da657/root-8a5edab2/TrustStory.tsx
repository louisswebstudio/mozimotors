import { BadgeCheck } from "lucide-react";
import { TRUST_VIDEO } from "./content";
import { getI18n } from "@/i18n/server";
import { Reveal } from "./reveal";
import { TrustVideo } from "./TrustVideo";
import { BxButton, Container, Eyebrow, H3 } from "./ui";

/** Video + lavender content panel ("The trust story"). */
export async function TrustStory() {
  const { t } = await getI18n();
  return (
    <section className="bg-white">
      <Container className="flex flex-col bxt:h-[650px] bxt:flex-row">
        <TrustVideo src={TRUST_VIDEO} playLabel={t.trust.playVideo} />
        <div className="flex flex-1 flex-col justify-center gap-[30px] rounded-b-2xl bg-bx-lavender p-[30px] bxt:rounded-e-2xl bxt:rounded-es-none bxt:p-[60px]">
          <Reveal y={24} className="flex flex-col gap-[15px]">
            <Eyebrow>{t.trust.eyebrow}</Eyebrow>
            <h3 className={`${H3} text-bx-navy`}>{t.trust.title}</h3>
            <p className="text-[15px] leading-6 text-bx-ink">{t.trust.text}</p>
          </Reveal>
          <Reveal y={20} className="flex flex-col gap-[15px]">
            <ul className="flex flex-col gap-[15px]">
              {t.trust.bullets.map((b) => (
                <li key={b} className="flex items-start gap-[5px]">
                  <BadgeCheck size={18} strokeWidth={1.5} color="#050B20" className="mt-[3px] shrink-0" aria-hidden />
                  <span className="text-[15px] leading-6 text-bx-ink">{b}</span>
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal y={20}>
            <BxButton href="/pourquoi-mozimotors">{t.common.whyUs}</BxButton>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
