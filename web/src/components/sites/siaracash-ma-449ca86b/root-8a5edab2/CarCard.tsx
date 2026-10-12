"use client";

/**
 * MoziMotors listing card (home, /acheter, /pourquoi-mozimotors): photo carousel with « Photo suivante »,
 * badges (Certifié / Particuliers), save heart, name + year, version, specs, price and city.
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

/** Inline lucide icons (stroke, currentColor). */
function Icon({ d, className = "mz-card-ico" }: { d: React.ReactNode; className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      {d}
    </svg>
  );
}

const SHIELD = (
  <>
    <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
    <path d="m9 12 2 2 4-4" />
  </>
);
const USER = (
  <>
    <circle cx="12" cy="8" r="4" />
    <path d="M6 21v-1a6 6 0 0 1 12 0v1" />
  </>
);
/** Spec icons, in the order of `chips`: mileage, gearbox, fuel. */
const SPEC_ICONS = [
  <>
    <path d="m12 14 4-4" />
    <path d="M3.34 19a10 10 0 1 1 17.32 0" />
  </>,
  <>
    <circle cx="6" cy="6" r="2" />
    <circle cx="12" cy="6" r="2" />
    <circle cx="18" cy="6" r="2" />
    <circle cx="6" cy="18" r="2" />
    <circle cx="12" cy="18" r="2" />
    <path d="M6 8v8M12 8v8M18 8v4H6" />
  </>,
  <>
    <path d="M3 22h12M4 9h10M14 22V4a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v18" />
    <path d="M14 13h2a2 2 0 0 1 2 2v2a2 2 0 0 0 4 0V9.83a2 2 0 0 0-.59-1.42L18 5" />
  </>,
];
const PIN = (
  <>
    <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
    <circle cx="12" cy="10" r="3" />
  </>
);

/** « Peugeot 208 2021 » → name + year (the year gets its own tag). */
function splitTitle(title: string) {
  const m = /^(.*\S)\s+(\d{4})$/.exec(title);
  return m ? { name: m[1], year: m[2] } : { name: title, year: "" };
}

/**
 * MoziMotors card: photo inset in a white frame with a segmented progress bar, seller / inspection
 * badges on the photo, then name + year tag, version, icon specs and a footer with the price
 * (burgundy) and the city. Styles live in mozi-theme.css (.mz-card*).
 */
export function CarCard({ car }: { car: CarCardData }) {
  const { t, href } = useV2();
  const photos = car.images.slice(0, 5);
  const [index, setIndex] = useState(0);
  const fav = useFavorites();
  const saved = fav.has(car.id);
  const { name, year } = splitTitle(car.title);

  const stop = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <a className="mz-card" href={href(car.href)}>
      <div className="mz-card-media">
        {photos.map((src, i) => (
          <div key={src + i} className={`mz-card-slide ${i === index ? "is-on" : ""}`}>
            {Math.abs(i - index) <= 1 && <img alt={`${car.title} ${i + 1}/${photos.length}`} loading="lazy" src={src} />}
          </div>
        ))}
        <span className="mz-card-shade" aria-hidden="true" />
        {photos.length > 1 && (
          <>
            <div className="mz-card-bars" aria-hidden="true">
              {photos.map((_, i) => (
                <span key={i} className={i === index ? "is-on" : ""} />
              ))}
            </div>
            <button
              type="button"
              aria-label={t("Photo suivante")}
              onClick={(e) => {
                stop(e);
                setIndex((i) => (i + 1) % photos.length);
              }}
              className="mz-card-next"
            >
              <Icon d={<path d="m9 18 6-6-6-6" />} className="mz-card-ico rtl:-scale-x-100" />
            </button>
          </>
        )}
        <button
          type="button"
          aria-label={t("Enregistrer")}
          aria-pressed={saved}
          onClick={(e) => {
            stop(e);
            fav.toggle(car.id);
          }}
          className={`mz-card-fav ${saved ? "is-on" : ""}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mz-card-ico" aria-hidden="true">
            <path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5" />
          </svg>
        </button>
        {(car.certified || car.privateSeller) && (
          <span className="mz-card-badges">
            {car.certified && (
              <span className="mz-card-badge is-cert" title={t("Badge « Certifié » affiché publiquement — la voiture a passé tous les contrôles MoziMotors.")}>
                <Icon d={SHIELD} />
                <span>{t("Certifié")}</span>
              </span>
            )}
            {car.privateSeller && (
              <span className="mz-card-badge">
                <Icon d={USER} />
                <span>{t("Particuliers")}</span>
              </span>
            )}
          </span>
        )}
      </div>
      <div className="mz-card-body">
        <div className="mz-card-head">
          <h3 className="mz-card-title">{name}</h3>
          {year && <span className="mz-card-year">{year}</span>}
        </div>
        <p className="mz-card-version">{car.version || " "}</p>
        <ul className="mz-card-specs">
          {car.chips.map((c, i) =>
            c ? (
              <li key={c + i}>
                {SPEC_ICONS[i] && <Icon d={SPEC_ICONS[i]} />}
                {t(c)}
              </li>
            ) : null,
          )}
        </ul>
        <div className="mz-card-foot">
          <p className="mz-card-price">{car.price}</p>
          <span className="mz-card-city">
            <Icon d={PIN} />
            {car.city}
          </span>
        </div>
      </div>
    </a>
  );
}
