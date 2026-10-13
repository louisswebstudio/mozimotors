"use client";

/**
 * « Sélectionné pour vous » / « Parcourir par budget » tabs + 4-column card grid (siaracash.ma).
 * Budget tab adds the price-range chips; each range shows up to 8 cars in that range.
 */
import { useState } from "react";
import { CarCard } from "./CarCard";
import { useV2 } from "./V2Locale";
import type { ListedCar } from "./listing";

const RANGES = [
  { label: "100 000 DH - 200 000 DH", min: 100_000, max: 200_000 },
  { label: "200 000 DH - 300 000 DH", min: 200_000, max: 300_000 },
  { label: "300 000 DH - 400 000 DH", min: 300_000, max: 400_000 },
  { label: "Plus de 400 000 DH", min: 400_000, max: Infinity },
];

const TAB =
  "relative flex-shrink-0 whitespace-nowrap pb-2 text-[14px] lg:text-[17px] font-semibold leading-[1.2] tracking-[-0.01em] transition-colors duration-200 focus-visible:outline-none";
const CHIP =
  "inline-flex flex-shrink-0 items-center whitespace-nowrap rounded-full border h-[53px] px-5 text-[18px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-brand-teal)] focus-visible:ring-offset-2";

export function CarListings({ featured, all }: { featured: ListedCar[]; all: ListedCar[] }) {
  const { t, href } = useV2();
  const [tab, setTab] = useState<"featured" | "budget">("featured");
  const [range, setRange] = useState(0);

  const r = RANGES[range];
  const cars = tab === "featured" ? featured : all.filter((c) => c.priceValue >= r.min && c.priceValue < r.max).slice(0, 8);
  const seeAll = href(tab === "featured" ? "/acheter" : `/acheter?minPrice=${r.min}${Number.isFinite(r.max) ? `&maxPrice=${r.max}` : ""}`);

  const tabs = [
    { id: "featured" as const, label: "Sélectionné pour vous" },
    { id: "budget" as const, label: "Parcourir par budget" },
  ];

  return (
    <section className="bg-white py-[24px] lg:py-[56px] px-4 lg:px-12">
      <div className="mx-auto w-full max-w-[362px] sm:max-w-3xl lg:max-w-[1280px] flex flex-col gap-[16px] lg:gap-[32px]">
        <div className="flex items-center justify-between gap-3">
          <div role="tablist" aria-label={t("Sélectionné pour vous")} className="flex items-center gap-5 lg:gap-7 overflow-x-auto scrollbar-hide -mx-1 px-1">
            {tabs.map((x) => {
              const on = tab === x.id;
              return (
                <button
                  key={x.id}
                  type="button"
                  role="tab"
                  aria-selected={on}
                  onClick={() => setTab(x.id)}
                  className={`${TAB} ${on ? "text-[color:var(--color-ink-strong)]" : "text-[color:var(--color-ink-muted)] hover:text-[color:var(--color-ink-strong)]"}`}
                >
                  {t(x.label)}
                  <span
                    aria-hidden="true"
                    className={`absolute inset-x-0 bottom-0 h-[2px] rounded-full transition-all duration-200 ${on ? "bg-[color:var(--color-brand-purple)] opacity-100" : "bg-transparent opacity-0"}`}
                  />
                </button>
              );
            })}
          </div>
          <a
            className="flex-shrink-0 text-[14px] font-medium text-[color:var(--color-brand-teal)] hover:underline lg:text-[22px] lg:font-semibold"
            href={seeAll}
          >
            {t("Afficher tout")}
          </a>
        </div>

        {tab === "budget" && (
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 -mx-1 px-1">
            {RANGES.map((x, i) => {
              const on = i === range;
              return (
                <button
                  key={x.label}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setRange(i)}
                  className={`${CHIP} ${on ? "bg-[color:var(--color-brand-purple-soft)] border-[color:var(--color-brand-purple)] font-semibold text-[color:var(--color-brand-purple)]" : "bg-white border-[color:var(--color-line-soft)] font-medium text-[color:var(--color-brand-dark)] hover:border-[color:var(--color-brand-purple-border)]"}`}
                >
                  {t(x.label)}
                </button>
              );
            })}
          </div>
        )}

        {cars.length > 0 ? (
          <div className="grid grid-cols-1 gap-[20px] sm:grid-cols-2 lg:grid-cols-4">
            {cars.map((c) => (
              <CarCard key={c.href} car={c} />
            ))}
          </div>
        ) : (
          <p className="py-10 text-center text-[15px] text-[color:var(--color-ink-muted)]">{t("Aucune voiture dans cette gamme de prix pour le moment.")}</p>
        )}
      </div>
    </section>
  );
}
