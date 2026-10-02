import Image from "next/image";
import { BANNERS } from "./content";
import { getI18n } from "@/i18n/server";
import { Reveal } from "./reveal";
import { BxButton, Container } from "./ui";

/**
 * Buyer / seller banner pair: two 400px image cards with a navy 50% overlay
 * and centered heading, text and white button.
 */
export async function BuySellBanners() {
  const { t } = await getI18n();
  const banners = t.banners.map((b, i) => ({ ...b, ...BANNERS[i] }));
  return (
    <section className="pb-[30px] bxt:pb-[60px] bxd:pb-[90px]">
      <Container className="flex flex-col gap-5 bxt:flex-row">
        {banners.map((b) => (
          <div
            key={b.title}
            className="relative h-[325px] w-full overflow-hidden rounded-2xl bxt:h-[400px] bxt:flex-1"
          >
            <Image
              src={b.image}
              alt={b.imageAlt}
              fill
              sizes="(min-width: 810px) 50vw, 100vw"
              className="bx-parallax object-cover"
              style={{ objectPosition: b.objectPosition }}
            />
            <div className="absolute inset-0 bg-bx-navy opacity-50" aria-hidden />
            <div className="absolute inset-0 z-[2] flex flex-col items-center justify-center gap-[30px] px-5 text-center">
              <Reveal y={24} className="flex flex-col items-center gap-2.5">
                <h4 className="text-[22px] font-bold leading-[29px] text-white bxt:text-2xl bxt:leading-[31px] bxd:text-[30px] bxd:leading-[39px]">
                  {b.title}
                </h4>
                <p className="text-sm leading-5 text-white">{b.text}</p>
              </Reveal>
              <Reveal y={20}>
                <BxButton variant="white" href={b.href}>
                  {b.cta}
                </BxButton>
              </Reveal>
            </div>
          </div>
        ))}
      </Container>
    </section>
  );
}
