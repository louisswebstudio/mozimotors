import Image from "next/image";
import { HOW_AVATARS, HOW_ID, HOW_STEP_IMAGES } from "./content";
import { getI18n } from "@/i18n/server";
import { Reveal } from "./reveal";
import { BxButton, Container, Eyebrow, H3 } from "./ui";

const AVATAR_LEFT = ["0px", "35.5px", "73px"];

/**
 * "How it works": sticky intro on the left, four step cards on the right that are
 * each sticky at top 100px so later cards slide over earlier ones (CSS only).
 * No ancestor may clip (overflow hidden) or sticky breaks.
 */
export async function HowItWorks() {
  const { t } = await getI18n();
  return (
    <section
      id={HOW_ID}
      className="scroll-mt-10 py-[30px] bxt:py-[60px] bxd:py-[90px]"
      style={{ background: "linear-gradient(#EEF1FB 0%, #FFFFFF 100%)" }}
    >
      <Container className="flex flex-col gap-[30px] bxt:flex-row bxt:items-start bxt:gap-0">
        {/* Left: intro */}
        <div className="flex-[1_1_0] bxt:sticky bxt:top-[100px]">
          <div className="flex flex-col items-center gap-[30px] pe-0 text-center bxt:items-start bxt:pe-[30px] bxt:text-start bxd:pe-[180px]">
            <Reveal y={24} className="flex flex-col items-center gap-[15px] bxt:items-start">
              <Eyebrow>{t.how.eyebrow}</Eyebrow>
              <h3 className={`${H3} text-bx-navy`}>{t.how.title}</h3>
              <p className="text-[15px] leading-6 text-bx-ink">{t.how.text}</p>
            </Reveal>
            <Reveal y={20} className="flex flex-col items-center gap-[30px] bxt:items-start">
              <div className="flex items-center gap-[15px]">
                <div className="relative h-[49px] w-[122px] shrink-0">
                  {HOW_AVATARS.map((src, i) => (
                    <div
                      key={src}
                      className="absolute top-0 size-[49px] overflow-hidden rounded-full border-2 border-white"
                      style={{ left: AVATAR_LEFT[i] }}
                    >
                      <Image src={src} alt="" fill sizes="49px" className="object-cover" />
                    </div>
                  ))}
                </div>
                <p className="text-[15px] leading-6 text-bx-ink">{t.how.teamLabel}</p>
              </div>
              <BxButton variant="primary" href="/pourquoi-mozimotors">
                {t.common.whyUs}
              </BxButton>
            </Reveal>
          </div>
        </div>

        {/* Right: stacking step cards */}
        <Reveal x={20} y={0} className="flex flex-[1_1_0] flex-col gap-[30px] bxt:items-end">
          {t.how.steps.map((s, i) => (
            <div key={i} className="w-full bxt:sticky bxt:top-[100px] bxd:w-[500px]">
              <div className="flex flex-col rounded-2xl bg-white px-1.5 pt-1.5">
                <div className="relative h-[224px] overflow-hidden rounded-xl bxt:h-[241px]">
                  <Image
                    src={HOW_STEP_IMAGES[i]}
                    alt={s.title}
                    fill
                    sizes="(min-width: 1200px) 488px, 100vw"
                    className="bx-parallax object-cover"
                  />
                  <h2 className="absolute end-5 top-5 z-[1] text-[40px] font-bold leading-[52px] text-white bxd:text-[52px] bxd:leading-[67.6px]">
                    {String(i + 1).padStart(2, "0")}
                  </h2>
                </div>
                <div className="flex flex-col gap-2.5 p-5 bxt:pe-[60px]">
                  <h5 className="text-lg font-medium leading-[26px] text-bx-navy bxt:text-[17px] bxd:text-xl">
                    {s.title}
                  </h5>
                  <p className="text-[15px] leading-6 text-bx-ink">{s.text}</p>
                </div>
              </div>
            </div>
          ))}
        </Reveal>
      </Container>
    </section>
  );
}
