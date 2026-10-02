import Image from "next/image";
import type { CSSProperties } from "react";
import { BxButton, Eyebrow, LogoWatermark } from "./ui";
import { HERO_IMAGE, HERO_VIDEO } from "./content";
import { HeroVideo } from "./HeroVideo";
import { getI18n } from "@/i18n/server";

/**
 * Split the title into nowrap words of blur-in letters (CSS-only stagger via --i).
 * `byWord`: animate whole words instead — splitting Arabic into letters breaks the joined script.
 */
function AnimatedTitle({ text, byWord = false }: { text: string; byWord?: boolean }) {
  let i = 0;
  const words = text.split(" ");
  if (byWord)
    return (
      <>
        {words.map((word, w) => (
          <span key={w}>
            <span aria-hidden className="bx-letter" style={{ "--i": w * 2 } as CSSProperties}>
              {word}
            </span>
            {w < words.length - 1 ? " " : null}
          </span>
        ))}
      </>
    );
  return (
    <>
      {words.map((word, w) => (
        <span key={w}>
          <span aria-hidden className="inline-block whitespace-nowrap">
            {Array.from(word).map((ch, c) => (
              <span key={c} className="bx-letter" style={{ "--i": i++ } as CSSProperties}>
                {ch}
              </span>
            ))}
          </span>
          {w < words.length - 1 ? " " : null}
        </span>
      ))}
    </>
  );
}

export async function Hero({ count }: { count: number }) {
  const { t, plural, dir } = await getI18n();
  return (
    <section className="relative h-[600px] overflow-hidden bg-bx-navy font-bx bxt:h-[700px] bxd:h-[760px]">
      <Image
        src={HERO_IMAGE}
        alt={t.hero.imageAlt}
        fill
        preload
        sizes="100vw"
        className="bx-kenburns object-cover"
      />
      <HeroVideo poster={HERO_IMAGE} webm={HERO_VIDEO.webm} mp4={HERO_VIDEO.mp4} />
      <div aria-hidden className="absolute inset-0 z-[1] bg-bx-navy opacity-50" />

      {/* Giant logo watermark */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-[108px] z-[1] h-[126px] overflow-hidden px-[30px] py-[30px] bxt:h-[199px] bxd:h-[352px] bxd:px-[120px]"
      >
        <LogoWatermark />
      </div>

      {/* Main content */}
      {/* Main content — mobile: 12px inside a group, 24px between groups; pt clears the fixed nav. */}
      <div className="absolute inset-0 z-[2] flex flex-col items-center justify-center gap-6 px-[30px] pb-10 pt-[76px] bxt:gap-[30px] bxt:pb-0 bxt:pt-0">
        <div className="flex flex-col items-center gap-3 text-center bxt:gap-2.5">
          <Eyebrow light>{plural(count, t.hero.eyebrow)}</Eyebrow>
          <h1
            aria-label={t.hero.title}
            className="max-w-[1100px] text-balance text-center text-[38px] font-bold leading-[1.1] tracking-[-0.01em] text-white bxt:text-[50px] bxt:leading-[50px] bxd:text-[70px] bxd:leading-[70px]"
          >
            <AnimatedTitle text={t.hero.title} byWord={dir === "rtl"} />
          </h1>
        </div>
        <p className="max-w-[340px] text-center font-bx-alt text-[15px] font-normal leading-6 text-white/90 bxt:max-w-[618px] bxt:leading-[25.95px] bxt:text-white">
          {t.hero.text}
        </p>
        {/* Equal-width CTAs: stacked full-width on phones, two equal columns from tablet up. */}
        <div className="grid w-full max-w-[320px] grid-cols-1 gap-3 bxt:w-auto bxt:max-w-none bxt:grid-cols-2 bxt:gap-2.5">
          <BxButton href="/acheter" variant="primary" className="w-full">
            {t.common.seeCars}
          </BxButton>
          <BxButton href="/vendre" variant="white" className="w-full">
            {t.common.sellMyCar}
          </BxButton>
        </div>
      </div>

      {/* Rounded bottom bar */}
      <div
        aria-hidden
        className="absolute inset-x-0 -bottom-px z-[4] h-[33px] rounded-t-[32px] bg-bx-soft bxt:h-[71px] bxt:rounded-t-[70px]"
      />
    </section>
  );
}

export default Hero;
