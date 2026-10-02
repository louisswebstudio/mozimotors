import Image from "next/image";
import { CTA_IMAGE } from "./content";
import { getI18n } from "@/i18n/server";
import { Reveal } from "./reveal";
import { BxButton, Container, Eyebrow, H3 } from "./ui";

/** Full-bleed photo card with navy overlay, centered eyebrow/title/text and two CTAs. */
export async function CtaBanner({
  image = CTA_IMAGE,
  objectPosition = "75% 100%",
  eyebrow,
  title,
  text,
}: {
  image?: string;
  objectPosition?: string;
  eyebrow?: string;
  title?: string;
  text?: string;
} = {}) {
  const { t } = await getI18n();
  return (
    <section>
      <Container>
        <div className="relative overflow-hidden rounded-2xl bxt:h-[500px]">
          <Image
            src={image}
            alt=""
            fill
            sizes="(min-width:1356px) 1296px, 100vw"
            className="bx-parallax object-cover"
            style={{ objectPosition }}
          />
          <div className="absolute inset-0 bg-bx-navy opacity-40" aria-hidden />
          {/* Mobile: in flow with a min height, so long copy + stacked buttons grow the banner instead of clipping. */}
          <div className="relative z-[2] flex min-h-[401px] flex-col items-center justify-center gap-[30px] px-5 py-10 text-center bxt:absolute bxt:inset-0 bxt:min-h-0 bxt:p-[60px]">
            <Reveal y={24} className="flex flex-col items-center gap-2.5">
              <Eyebrow light>{eyebrow ?? t.cta.eyebrow}</Eyebrow>
              <h3 className={`${H3} text-white`}>{title ?? t.cta.title}</h3>
              <p className="max-w-[470px] font-bx-alt text-[15px] leading-[25.95px] text-white">{text ?? t.cta.text}</p>
            </Reveal>
            {/* Equal-width CTAs (same as the hero): stacked full-width on phones, two equal columns from tablet up. */}
            <Reveal y={20} className="grid w-full max-w-[320px] grid-cols-1 gap-3 bxt:w-auto bxt:max-w-none bxt:grid-cols-2 bxt:gap-2.5">
              <BxButton href="/acheter" variant="primary" className="w-full">
                {t.common.seeCars}
              </BxButton>
              <BxButton href="/contact" variant="white" className="w-full">
                {t.common.contactUs}
              </BxButton>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
