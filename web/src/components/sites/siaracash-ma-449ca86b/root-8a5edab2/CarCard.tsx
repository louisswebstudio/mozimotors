"use client";

/**
 * Listing card from siaracash.ma (`.cc-scope` card): 16:10 photo with « Photo suivante » arrow + dots,
 * badges (Particuliers / Certifié), save heart, then title, version, spec chips,
 * price and city. Fed with MoziMotors cars.
 */
import { useState } from "react";
import { useFavorites } from "./favorites";
import { useV2 } from "./V2Locale";

export type CarCardData = {
  /** Car slug — also the favorites key. */
  id: string;
  href: string;
  title: string;
  version: string;
  images: string[];
  chips: string[];
  price: string;
  city: string;
  privateSeller: boolean;
  certified: boolean;
};

const BADGE = "flex max-w-full items-center gap-1 whitespace-nowrap rounded-md px-1.5 py-0.5 text-[11px] font-bold [&>span]:truncate";

function ShieldCheck() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="lucide lucide-shield-check size-3 shrink-0"
      aria-hidden="true"
    >
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

export function CarCard({ car }: { car: CarCardData }) {
  const { t, href } = useV2();
  const photos = car.images.slice(0, 5);
  const [index, setIndex] = useState(0);
  const fav = useFavorites();
  const saved = fav.has(car.id);

  const stop = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <a className="cc-scope block" href={href(car.href)}>
      <div className="cc-hovercard overflow-hidden rounded-xl border border-[var(--cc-line)] bg-white">
        <div className="relative aspect-[16/10] bg-[var(--cc-soft)]">
          {photos.map((src, i) => (
            <div key={src + i} className={`absolute inset-0 transition-opacity duration-200 ${i === index ? "opacity-100" : "opacity-0"}`}>
              {Math.abs(i - index) <= 1 && (
                <img alt={`${car.title} ${i + 1}/${photos.length}`} loading="lazy" className="absolute inset-0 size-full object-cover" src={src} />
              )}
            </div>
          ))}
          {photos.length > 1 && (
            <>
              <button
                type="button"
                aria-label={t("Photo suivante")}
                onClick={(e) => {
                  stop(e);
                  setIndex((i) => (i + 1) % photos.length);
                }}
                className="absolute right-2 top-1/2 z-[2] grid size-7 -translate-y-1/2 place-items-center rounded-full bg-white/90 shadow"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-chevron-right size-4 text-[var(--cc-ink)]"
                  aria-hidden="true"
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </button>
              <div className="absolute bottom-2 left-1/2 z-[1] flex -translate-x-1/2 gap-1">
                {photos.map((_, i) => (
                  <span key={i} className={`size-1.5 rounded-full ${i === index ? "bg-white" : "bg-white/50"}`} />
                ))}
              </div>
            </>
          )}
          <span className="absolute z-[1] flex flex-col items-start gap-1 start-2 top-2 max-w-[calc(100%-3.25rem)]">
            {car.privateSeller && (
              <span className={`${BADGE} bg-[var(--cc-navy)] text-white`}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-badge-check size-3 shrink-0"
                  aria-hidden="true"
                >
                  <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" />
                  <path d="m9 12 2 2 4-4" />
                </svg>{" "}
                <span>{t("Particuliers")}</span>
              </span>
            )}
            {car.certified && (
              <span
                title={t("Badge « Certifié » affiché publiquement — la voiture a passé tous les contrôles MoziMotors.")}
                className={`${BADGE} bg-[var(--cc-success-bg)] text-[var(--cc-success-text)]`}
              >
                <ShieldCheck /> <span>{t("Certifié")}</span>
              </span>
            )}
          </span>
          <button
            type="button"
            aria-label={t("Enregistrer")}
            aria-pressed={saved}
            onClick={(e) => {
              stop(e);
              fav.toggle(car.id);
            }}
            className="absolute end-2 top-2 grid size-8 place-items-center rounded-full bg-white/90 shadow"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill={saved ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`lucide lucide-heart size-3.5 ${saved ? "text-[var(--cc-primary)]" : "text-[var(--cc-body)]"}`}
              aria-hidden="true"
            >
              <path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5" />
            </svg>
          </button>
        </div>
        <div className="p-3">
          <h3 className="truncate text-[13px] font-semibold text-[var(--cc-ink)]">{car.title}</h3>
          <p className="text-[11px] text-[var(--cc-muted)]">{car.version || " "}</p>
          <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
            {car.chips.map((c) => (
              <span key={c} className="rounded border border-[var(--cc-line)] px-1.5 py-0.5 text-[11px] text-[var(--cc-body)]">
                {t(c)}
              </span>
            ))}
          </div>
          <p className="mt-2 text-[15px] font-bold text-[var(--cc-ink)]">{car.price} </p>
          <div className="mt-2.5 flex items-center border-t border-[var(--cc-line)] pt-2.5">
            <span className="flex items-center gap-1 text-[12px] text-[var(--cc-body)]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-map-pin size-3.5 text-[var(--cc-primary)]"
                aria-hidden="true"
              >
                <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
                <circle cx="12" cy="10" r="3" />
              </svg>{" "}
              {car.city}
            </span>
          </div>
        </div>
      </div>
    </a>
  );
}
