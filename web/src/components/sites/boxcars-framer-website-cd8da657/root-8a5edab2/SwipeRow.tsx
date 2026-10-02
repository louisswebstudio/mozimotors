"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useI18n } from "@/i18n/client";
import { inlineSign, scrollEdges } from "@/lib/scroll";

/**
 * Phone carousel for the homepage car teaser: scroll-snap row + a controls row
 * (`footer`, e.g. the "see all" CTA, next to prev/next buttons). From `bxt` up the
 * list turns into the grid given by `className`; the footer stays, centred, without arrows.
 */
export function SwipeRow({
  label,
  className = "",
  footer,
  children,
}: {
  label: string;
  className?: string;
  footer?: React.ReactNode;
  children: React.ReactNode;
}) {
  const { t } = useI18n();
  const ref = useRef<HTMLUListElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });

  const update = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    setEdges(scrollEdges(el));
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [update]);

  /** One card per press: first slide's width + the row gap. */
  const go = (dir: 1 | -1) => {
    const el = ref.current;
    const first = el?.firstElementChild as HTMLElement | null;
    if (!el || !first) return;
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
    el.scrollBy({ left: dir * inlineSign(el) * (first.offsetWidth + gap), behavior: "smooth" });
  };

  const btn =
    "grid size-11 shrink-0 place-items-center rounded-full border border-bx-line bg-white text-bx-navy transition-[opacity,border-color,background-color] duration-300 bx-ease enabled:hover:border-bx-blue enabled:active:bg-bx-soft disabled:opacity-40";

  return (
    <>
      <ul ref={ref} onScroll={update} aria-label={label} className={className}>
        {children}
      </ul>
      <div className="flex items-center gap-2.5 bxt:justify-center">
        <div className="min-w-0 flex-1 bxt:flex-none">{footer}</div>
        <button type="button" onClick={() => go(-1)} disabled={edges.start} aria-label={t.featured.prev} className={`${btn} bxt:hidden`}>
          <ChevronLeft className="size-5 rtl:-scale-x-100" strokeWidth={1.75} aria-hidden />
        </button>
        <button type="button" onClick={() => go(1)} disabled={edges.end} aria-label={t.featured.next} className={`${btn} bxt:hidden`}>
          <ChevronRight className="size-5 rtl:-scale-x-100" strokeWidth={1.75} aria-hidden />
        </button>
      </div>
    </>
  );
}
