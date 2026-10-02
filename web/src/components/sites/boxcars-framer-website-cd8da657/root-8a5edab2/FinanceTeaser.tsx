import Image from "next/image";
import { CheckCircle2 } from "lucide-react";
import { FinanceWidget } from "@/components/finance-widget";
import { getI18n } from "@/i18n/server";
import { FINANCE_IMAGE } from "./content";
import { Reveal } from "./reveal";
import { Container, H3 } from "./ui";

/**
 * Budget-calculator promo (siaracash.ma pattern) in place of the trust-story
 * video we don't have footage for yet: checklist copy over a dark showroom
 * photo next to the real FinanceWidget calculator — a working tool beats a
 * staged video anyway. TrustStory/TrustVideo are kept for when real video exists.
 */
export async function FinanceTeaser({ rate, months }: { rate: number; months: number }) {
  const { t } = await getI18n();
  return (
    <section className="bg-white">
      <Container>
        <div className="relative isolate overflow-hidden rounded-[32px] bg-bx-navy">
          <Image
            src={FINANCE_IMAGE}
            alt=""
            fill
            sizes="(min-width:1356px) 1296px, 100vw"
            className="bx-parallax -z-20 object-cover object-[70%_50%]"
          />
          {/* Navy wash: solid behind the copy, clearing toward the car so it still reads. */}
          <div
            aria-hidden
            className="absolute inset-0 -z-10 bg-linear-to-b from-bx-navy/90 via-bx-navy/75 to-bx-navy/90 bxd:bg-linear-to-r bxd:from-bx-navy/95 bxd:via-bx-navy/60 bxd:to-bx-navy/20 rtl:bxd:bg-linear-to-l"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-40 -start-40 -z-10 h-[420px] w-[420px] rounded-full bg-bx-blue/35 blur-[120px]"
          />

          {/* Mobile: slimmer padding so the nested card → glass → widget doesn't squeeze the form. */}
          <div className="flex flex-col items-center gap-8 px-4 py-8 bxt:gap-10 bxt:p-[30px] bxd:flex-row bxd:justify-between bxd:gap-[60px] bxd:p-[72px]">
            <Reveal y={24} className="flex flex-col items-center gap-[22px] text-center bxd:max-w-[440px] bxd:items-start bxd:text-start">
              <h3 className={`${H3} text-white`}>{t.financeTeaser.title}</h3>
              <ul className="flex flex-col gap-4 text-start">
                {t.financeTeaser.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-3">
                    <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-bx-blue/20 ring-1 ring-bx-blue/50">
                      <CheckCircle2 size={16} strokeWidth={2} className="text-[#9DB0FF]" aria-hidden />
                    </span>
                    <span className="text-[17px] leading-[26px] text-white/85">{b}</span>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal y={20} className="w-full bxd:w-[400px] bxd:shrink-0">
              <div className="rounded-[22px] bg-white/10 p-1 bxt:p-1.5 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)] ring-1 ring-white/20 backdrop-blur-md">
                <FinanceWidget rate={rate} months={months} />
              </div>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default FinanceTeaser;
