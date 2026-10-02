"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, Expand, X } from "lucide-react";
import { ASSETS } from "@/components/sites/boxcars-framer-website-cd8da657/root-8a5edab2/ui";
import { useI18n } from "@/i18n/client";
import { scrollEdges } from "@/lib/scroll";
import type { CarPhoto, PhotoCategory } from "@/lib/types";

/* ------------------------------------------------------------------ tab scroller */

/**
 * Horizontal scroller that fades whichever edge has hidden content, so an
 * overflowing tab bar reads as "scroll for more" instead of a hard clip.
 */
function FadeScroller({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ start: false, end: false, rtl: false });

  const update = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    // scrollEdges reports "at the edge"; here we fade the edges that still hide content.
    const at = scrollEdges(el, 2);
    setEdges({ start: !at.start, end: !at.end, rtl: getComputedStyle(el).direction === "rtl" });
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [update]);

  const fade = 28;
  const mask = `linear-gradient(to ${edges.rtl ? "left" : "right"}, ${edges.start ? "transparent" : "#000"} 0, #000 ${edges.start ? fade : 0}px, #000 calc(100% - ${edges.end ? fade : 0}px), ${edges.end ? "transparent" : "#000"} 100%)`;

  return (
    <div
      ref={ref}
      onScroll={update}
      className={`no-scrollbar overflow-x-auto ${className}`}
      style={{ maskImage: mask, WebkitMaskImage: mask }}
    >
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ gallery */

const ORDER: PhotoCategory[] = ["exterieur", "interieur", "moteur", "tableau-de-bord", "pneus", "imperfections"];
type Tab = "all" | PhotoCategory;

/**
 * Boxcars vehicle gallery with SiaraCash-style photo tabs (Toutes / Extérieur / Intérieur /
 * Moteur / Tableau de bord / Pneus / Imperfections — only categories that have photos),
 * arrows, dots, counter, thumbnails and a fullscreen overlay (Esc / ← / →).
 */
export function Gallery({ photos, alt }: { photos: CarPhoto[]; alt: string }) {
  const { t, fmt, plural } = useI18n();
  const catLabel = (c: PhotoCategory) => t.gallery.categories[c];
  const [tab, setTab] = useState<Tab>("all");
  const [i, setI] = useState(0);
  const [full, setFull] = useState(false);

  const tabs = useMemo(() => {
    const present = ORDER.filter((c) => photos.some((p) => p.category === c));
    return present.length > 1 || present[0] !== "exterieur" ? present : [];
  }, [photos]);
  const visible = useMemo(() => (tab === "all" ? photos : photos.filter((p) => p.category === tab)), [photos, tab]);
  const n = visible.length;
  const current = visible[Math.min(i, n - 1)];
  const go = useCallback((d: number) => setI((x) => (x + d + n) % n), [n]);
  const pick = (t: Tab) => {
    setTab(t);
    setI(0);
  };

  useEffect(() => {
    if (!full) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFull(false);
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [full, go]);

  if (!photos.length) return <div className="h-[260px] rounded-2xl bg-bx-soft bxt:h-[420px] bxd:h-[486px]" />;

  const arrowCls =
    "absolute top-1/2 z-[2] grid size-10 -translate-y-1/2 place-items-center rounded-full border border-bx-line bg-white transition-colors duration-300 bx-ease hover:border-bx-blue";

  const arrows = (big = false) =>
    n > 1 ? (
      <>
        <button onClick={() => go(-1)} aria-label={t.gallery.prev} className={`${arrowCls} ${big ? "start-5 bxt:start-8" : "start-5"}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`${ASSETS}/icons/arrow-prev.svg`} alt="" className="size-4 rtl:-scale-x-100" />
        </button>
        <button onClick={() => go(1)} aria-label={t.gallery.next} className={`${arrowCls} ${big ? "end-5 bxt:end-8" : "end-5"}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`${ASSETS}/icons/arrow-next.svg`} alt="" className="size-4 rtl:-scale-x-100" />
        </button>
      </>
    ) : null;

  const allTabs = ["all", ...tabs] as Tab[];
  const tabLabel = (x: Tab) => (x === "all" ? t.gallery.all : catLabel(x));
  const tabCount = (x: Tab) => (x === "all" ? photos.length : photos.filter((p) => p.category === x).length);

  /**
   * Phones: only ~4 of 7 tabs fit, so show one pill with the current category that
   * opens the native picker listing every category (+ photo count). Tablet+: tab bar.
   */
  const tabPicker = (dark = false) =>
    tabs.length > 0 && (
      <label
        className={`relative inline-flex h-10 items-center gap-1.5 rounded-full ps-4 pe-3 text-[13px] font-medium backdrop-blur-md bxt:hidden ${
          dark ? "bg-white/10 text-white" : "bg-white/85 text-bx-navy shadow-[0_2px_8px_rgba(5,11,32,0.08)]"
        }`}
      >
        <span className="sr-only">{t.gallery.category}</span>
        <span aria-hidden>
          {tabLabel(tab)} <span className={dark ? "text-white/60" : "text-bx-ink/50"}>· {tabCount(tab)}</span>
        </span>
        <ChevronDown aria-hidden className="size-4 opacity-70" strokeWidth={2} />
        <select
          value={tab}
          onChange={(e) => pick(e.target.value as Tab)}
          className="absolute inset-0 cursor-pointer appearance-none opacity-0"
        >
          {allTabs.map((x) => (
            <option key={x} value={x}>
              {tabLabel(x)} ({tabCount(x)})
            </option>
          ))}
        </select>
      </label>
    );

  const tabBar = (dark = false) =>
    tabs.length > 0 && (
      <div
        className={`hidden w-fit max-w-full overflow-hidden rounded-[120px] p-1 backdrop-blur-md bxt:block ${
          dark ? "bg-white/10" : "bg-white/85 shadow-[0_2px_8px_rgba(5,11,32,0.08)]"
        }`}
      >
        <FadeScroller className="rounded-[120px]">
          <div role="tablist" aria-label={t.gallery.categories_label} className="flex w-max items-center gap-1">
            {allTabs.map((x) => {
              const active = tab === x;
              const count = tabCount(x);
              return (
                <button
                  key={x}
                  role="tab"
                  aria-selected={active}
                  title={plural(count, t.gallery.photos)}
                  onClick={() => pick(x)}
                  className={`h-8 shrink-0 whitespace-nowrap rounded-[120px] px-3.5 text-[13px] font-medium transition-colors duration-300 bx-ease bxt:h-9 bxt:px-4 bxt:text-sm ${
                    active
                      ? "bg-bx-blue text-white"
                      : dark
                        ? "text-white hover:bg-white/15"
                        : "text-bx-navy hover:bg-bx-lavender"
                  }`}
                >
                  {tabLabel(x)}
                </button>
              );
            })}
          </div>
        </FadeScroller>
      </div>
    );

  return (
    <div className="flex flex-col gap-2.5">
      <div className="relative h-[260px] overflow-hidden rounded-2xl bg-bx-soft bxt:h-[420px] bxd:h-[486px]">
        {current && (
          <Image
            key={current.url}
            src={current.url}
            alt={`${alt} — ${catLabel(current.category)} ${i + 1}`}
            fill
            preload
            sizes="(min-width:1200px) 797px, 100vw"
            className="object-cover"
          />
        )}

        {/* Top overlay: photo tabs (centered) */}
        <div className="absolute inset-x-3 top-3 z-[3] flex items-center justify-between gap-3 bxt:inset-x-4 bxt:top-4">
          <div className="min-w-0 flex-1 bxt:flex bxt:justify-center">
            {tabPicker()}
            {tabBar()}
          </div>
        </div>

        {arrows()}
        {n > 1 && (
          <div className="absolute bottom-4 left-1/2 z-[2] hidden -translate-x-1/2 items-center gap-1.5 rounded-[120px] bg-bx-navy/30 px-2.5 py-2 backdrop-blur-sm bxt:flex">
            {visible.slice(0, 12).map((p, k) => (
              <button
                key={p.url + k}
                onClick={() => setI(k)}
                aria-label={fmt(t.gallery.showPhoto, { n: k + 1 })}
                className={`size-1.5 rounded-full transition-colors duration-300 bx-ease ${k === i ? "bg-white" : "bg-white/50 hover:bg-white/80"}`}
              />
            ))}
          </div>
        )}
        <div className="absolute bottom-4 start-4 z-[2] rounded-[120px] bg-bx-navy/70 px-3 py-1 text-xs font-medium leading-5 text-white backdrop-blur-sm">
          {Math.min(i + 1, n)} / {n}
        </div>
        <button
          onClick={() => setFull(true)}
          className="absolute bottom-4 end-4 z-[2] inline-flex items-center gap-1.5 rounded-xl bg-white px-3 py-1.5 text-sm font-medium leading-5 text-bx-navy transition-colors duration-300 bx-ease hover:bg-bx-blue hover:text-white"
        >
          <Expand className="size-3.5" strokeWidth={1.5} /> {t.gallery.fullscreen}
        </button>
      </div>

      {n > 1 && (
        <div className="no-scrollbar flex gap-2.5 overflow-x-auto p-0.5">
          {visible.map((p, k) => (
            <button
              key={p.url + k}
              onClick={() => setI(k)}
              aria-label={fmt(t.gallery.thumb, { n: k + 1, category: catLabel(p.category) })}
              className={`relative h-[72px] w-24 shrink-0 overflow-hidden rounded-xl ring-2 transition duration-300 bx-ease ${k === i ? "ring-bx-blue" : "opacity-70 ring-transparent hover:opacity-100"}`}
            >
              <Image src={p.url} alt="" fill sizes="96px" className="object-cover" />
            </button>
          ))}
        </div>
      )}

      {full && current && (
        <div className="fixed inset-0 z-[60] bg-bx-navy/95" role="dialog" aria-modal aria-label={alt}>
          <div className="absolute inset-x-4 top-4 z-10 flex items-center justify-between gap-3">
            <div className="min-w-0 flex-1 bxt:flex bxt:justify-center">
              {tabPicker(true)}
              {tabBar(true)}
            </div>
            <button
              onClick={() => setFull(false)}
              aria-label={t.common.close}
              className="grid size-11 shrink-0 place-items-center rounded-full bg-white/10 text-white transition-colors duration-300 bx-ease hover:bg-white/20"
            >
              <X className="size-5" strokeWidth={1.5} />
            </button>
          </div>
          <div className="relative h-full w-full">
            <Image src={current.url} alt={alt} fill sizes="100vw" className="object-contain" />
            {arrows(true)}
          </div>
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-[120px] bg-white/10 px-3 py-1 text-xs font-medium leading-5 text-white">
            {Math.min(i + 1, n)} / {n}
          </div>
        </div>
      )}
    </div>
  );
}
