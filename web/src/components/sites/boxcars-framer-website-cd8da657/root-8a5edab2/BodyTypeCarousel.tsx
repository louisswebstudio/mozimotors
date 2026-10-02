"use client";

/**
 * « Trouvez votre voiture » body-type carousel — modelled on the siaracash.ma homepage
 * (white card, side-view car cut-outs, horizontal scroll with arrow buttons).
 * Car images: public/sites/siaracash/body-types (copied from siaracash.ma at the client's request).
 */
import Image from "next/image";
import Link from "@/i18n/link";
import { useI18n } from "@/i18n/client";
import { inlineSign, scrollEdges } from "@/lib/scroll";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Container } from "./ui";
import { Reveal } from "./reveal";

const IMG = "/sites/siaracash/body-types";

/** Labels come from t.bodyCarousel.types (index-aligned). */
const TYPES = [
  { img: "suv", href: "/acheter?body=suv,pickup" },
  { img: "sedan", href: "/acheter?body=berline" },
  { img: "station-wagon", href: "/acheter?body=break" },
  { img: "compact", href: "/acheter?body=citadine,compacte" },
  { img: "van", href: "/acheter?body=monospace" },
  { img: "coupe", href: "/acheter?body=coupe" },
  { img: "convertible", href: "/acheter?body=cabriolet" },
  { img: "transport", href: "/acheter?body=utilitaire" },
];

export function BodyTypeCarousel() {
  const { t } = useI18n();
  const types = TYPES.map((x, i) => ({ ...x, label: t.bodyCarousel.types[i] }));
  const track = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });

  const update = useCallback(() => {
    const el = track.current;
    if (!el) return;
    setEdges(scrollEdges(el));
  }, []);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [update]);

  const scrollBy = (dir: 1 | -1) => {
    const el = track.current;
    if (el) el.scrollBy({ left: dir * inlineSign(el) * el.clientWidth * 0.8, behavior: "smooth" });
  };

  const arrow = "absolute top-1/2 z-10 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-bx-navy/60 text-white shadow-[0_4px_14px_rgba(5,11,32,0.25)] backdrop-blur-sm transition-[opacity,background-color] duration-300 hover:bg-bx-navy/80";

  return (
    <section className="bg-bx-soft pt-0 bxt:pt-0">
      <Container>
        <Reveal y={24}>
          <div className="rounded-2xl border border-bx-line bg-white px-5 py-6 bxt:px-8 bxt:py-7">
            <h2 className="text-center text-lg font-semibold leading-6 text-bx-navy">{t.bodyCarousel.title}</h2>
            <div className="relative mt-4">
              <div
                ref={track}
                onScroll={update}
                className="no-scrollbar flex snap-x snap-mandatory gap-2 overflow-x-auto scroll-smooth bxt:gap-4"
              >
                {types.map((type) => (
                  <Link
                    key={type.href}
                    href={type.href}
                    className="group flex w-[140px] shrink-0 snap-start flex-col items-center gap-3 rounded-xl px-2 py-4 transition-colors duration-300 hover:bg-bx-soft bxt:w-[172px]"
                  >
                    <Image
                      src={`${IMG}/${type.img}.webp`}
                      alt=""
                      width={240}
                      height={146}
                      className="h-[73px] w-[120px] object-contain transition-transform duration-300 bx-ease group-hover:scale-105 bxt:h-[85px] bxt:w-[140px]"
                    />
                    <span className="text-[15px] font-semibold text-bx-navy transition-colors duration-300 group-hover:text-bx-blue">
                      {type.label}
                    </span>
                  </Link>
                ))}
              </div>
              <button
                type="button"
                aria-label={t.bodyCarousel.prev}
                onClick={() => scrollBy(-1)}
                className={`${arrow} -start-2 ${edges.start ? "pointer-events-none opacity-0" : "opacity-100"}`}
              >
                <ChevronLeft className="size-5 rtl:-scale-x-100" strokeWidth={2} />
              </button>
              <button
                type="button"
                aria-label={t.bodyCarousel.next}
                onClick={() => scrollBy(1)}
                className={`${arrow} -end-2 ${edges.end ? "pointer-events-none opacity-0" : "opacity-100"}`}
              >
                <ChevronRight className="size-5 rtl:-scale-x-100" strokeWidth={2} />
              </button>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
