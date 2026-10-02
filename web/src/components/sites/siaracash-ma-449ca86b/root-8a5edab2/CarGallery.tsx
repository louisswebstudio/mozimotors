"use client";

/**
 * Car photo gallery from siaracash.ma/voiture/…
 * - Desktop: category pill bar over a 4:3 photo, prev/next, save heart, thumbnail strip.
 * - Mobile: full-width swipe carousel with « 1 / n » counter, round category buttons underneath.
 * Categories come from WordPress (Extérieur, Intérieur, Moteur, Tableau de bord, Pneus, Imperfections);
 * « Toutes » shows every photo. Empty categories are hidden.
 */
import { useEffect, useMemo, useRef, useState } from "react";
import { Armchair, ChevronLeft, ChevronRight, CircleDot, Cog, Gauge, Image as ImageIcon, Images, TriangleAlert, type LucideIcon } from "lucide-react";
import type { CarPhoto, PhotoCategory } from "@/lib/types";
import { PHOTO_CATEGORY_LABELS } from "@/lib/format";
import { FavButton } from "./CarActions";
import { useV2 } from "./V2Locale";

type Cat = "all" | PhotoCategory;
const ORDER: PhotoCategory[] = ["exterieur", "interieur", "moteur", "tableau-de-bord", "pneus", "imperfections"];
const ICONS: Record<Cat, LucideIcon> = {
  all: Images,
  exterieur: ImageIcon,
  interieur: Armchair,
  moteur: Cog,
  "tableau-de-bord": Gauge,
  pneus: CircleDot,
  imperfections: TriangleAlert,
};

function useGallery(photos: CarPhoto[]) {
  const { t } = useV2();
  const [cat, setCat] = useState<Cat>("all");
  const [index, setIndex] = useState(0);
  const cats = useMemo(() => ORDER.filter((c) => photos.some((p) => p.category === c)), [photos]);
  const shown = cat === "all" ? photos : photos.filter((p) => p.category === cat);
  const pick = (c: Cat) => {
    setCat(c);
    setIndex(0);
  };
  const label = (c: Cat) => t(c === "all" ? "Toutes" : PHOTO_CATEGORY_LABELS[c]);
  return { cat, cats, shown, index, setIndex, pick, label };
}

export function DesktopGallery({ photos, carId }: { photos: CarPhoto[]; carId: string }) {
  const { t } = useV2();
  const g = useGallery(photos);
  const n = g.shown.length;
  const go = (d: number) => g.setIndex((i) => (i + d + n) % n);
  const thumbs = useRef<HTMLDivElement>(null);
  useEffect(() => {
    thumbs.current?.children[g.index]?.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "smooth" });
  }, [g.index]);

  return (
    <div className="cc-card overflow-hidden">
      <div className="relative">
        {g.cats.length > 1 && (
          <div className="absolute left-1/2 top-3 z-10 flex max-w-[92%] -translate-x-1/2 gap-1 overflow-x-auto rounded-full bg-white/90 p-1 shadow-sm backdrop-blur cc-noscroll">
            {(["all", ...g.cats] as Cat[]).map((c) => (
              <button
                key={c}
                onClick={() => g.pick(c)}
                className={`flex items-center gap-1 whitespace-nowrap rounded-full px-4 py-1.5 text-[13px] font-semibold transition-colors ${g.cat === c ? "bg-[var(--cc-primary)] text-white" : "text-[var(--cc-body)] hover:bg-black/5"}`}
              >
                {g.label(c)}
              </button>
            ))}
          </div>
        )}
        <div className="relative aspect-[4/3] w-full bg-[var(--cc-soft)]">
          {g.shown[g.index] && (
            <div key={g.shown[g.index].url} className="absolute inset-0 animate-[fadeIn_.2s_ease]">
              <img alt={t("Photo du véhicule")} className="absolute inset-0 size-full object-cover" src={g.shown[g.index].url} />
            </div>
          )}
          <div className="pointer-events-none absolute bottom-4 left-1/2 h-6 w-3/4 -translate-x-1/2 rounded-[50%] bg-black/10 blur-md" />
          {n > 1 && (
            <>
              <button
                aria-label={t("Précédent")}
                onClick={() => go(-1)}
                className="absolute left-3 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-white shadow-md transition hover:scale-105"
              >
                <ChevronLeft className="size-5 text-[var(--cc-ink)]" aria-hidden="true" />
              </button>
              <button
                aria-label={t("Suivant")}
                onClick={() => go(1)}
                className="absolute right-3 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-white shadow-md transition hover:scale-105"
              >
                <ChevronRight className="size-5 text-[var(--cc-ink)]" aria-hidden="true" />
              </button>
            </>
          )}
          <FavButton
            id={carId}
            className="absolute right-3 top-3 grid size-9 place-items-center rounded-full bg-white shadow-md"
            iconClass="size-4 text-[var(--cc-body)]"
          />
        </div>
      </div>
      <div ref={thumbs} className="flex gap-2 overflow-x-auto p-3 cc-noscroll">
        {g.shown.map((p, i) => (
          <button
            key={p.url + i}
            aria-label={`${t("Photo")} ${i + 1}`}
            onClick={() => g.setIndex(i)}
            className={`relative size-16 shrink-0 overflow-hidden rounded-lg border-2 transition ${i === g.index ? "border-[var(--cc-primary)]" : "border-transparent"}`}
          >
            <img src={p.url} alt="" loading="lazy" className="absolute inset-0 size-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}

export function MobileGallery({ photos }: { photos: CarPhoto[] }) {
  const { t } = useV2();
  const g = useGallery(photos);
  const track = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(0);

  const pick = (c: Cat) => {
    g.pick(c);
    setPos(0);
    track.current?.scrollTo({ left: 0 });
  };

  return (
    <div>
      <div className="relative -mx-4">
        <div
          ref={track}
          onScroll={(e) => {
            const el = e.currentTarget;
            setPos(Math.round(el.scrollLeft / el.clientWidth));
          }}
          className="flex snap-x snap-mandatory overflow-x-auto cc-noscroll"
        >
          {g.shown.map((p, i) => (
            <div key={p.url + i} className="relative aspect-[16/10] w-full shrink-0 snap-center bg-[var(--cc-soft)]">
              <img alt={t("Photo du véhicule")} loading={i < 2 ? "eager" : "lazy"} className="absolute inset-0 size-full object-cover" src={p.url} />
            </div>
          ))}
        </div>
        <span className="absolute bottom-3 start-3 rounded-full px-2.5 py-0.5 text-[13px] font-bold text-white" style={{ background: "rgba(5, 11, 32, 0.6)" }}>
          {Math.min(pos + 1, g.shown.length)} / {g.shown.length}
        </span>
      </div>
      {g.cats.length > 1 && (
        <div className="cc-track mt-4 !gap-2 px-1">
          {(["all", ...g.cats] as Cat[]).map((c) => {
            const Icon = ICONS[c];
            const on = g.cat === c;
            const thumb = c === "all" ? photos[0] : photos.find((p) => p.category === c);
            return (
              <button key={c} onClick={() => pick(c)} className="flex w-16 shrink-0 flex-col items-center gap-2">
                <span
                  className={`relative grid size-14 place-items-center overflow-hidden rounded-full bg-[var(--cc-navy)] text-white transition ${on ? "ring-2 ring-[var(--cc-primary)] ring-offset-2 ring-offset-white" : ""}`}
                >
                  {thumb && <img alt="" loading="lazy" className="absolute inset-0 size-full object-cover" src={thumb.url} />}
                  <span className="absolute inset-0 bg-black/45" />
                  <Icon className="relative size-6" aria-hidden="true" />
                </span>
                <span className={`text-center text-[12px] font-semibold leading-tight ${on ? "text-[var(--cc-primary)]" : "text-[var(--cc-ink)]"}`}>
                  {g.label(c)}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
