"use client";

/**
 * siaracash.ma/lists layout for /v2/acheter.
 * - DesktopListing (lg+): filter card, results grid
 *   (2→5 columns) with a « Vendez votre voiture » banner every 12 cars, « Trier par » dropdown.
 * - MobileListing (< lg): own sticky header (logo, menu, search, favourites), quick brand chips,
 *   horizontal cards, full-screen filter sheet and « Trier par » bottom sheet.
 */
import { Fragment, useEffect, useState } from "react";
import { ArrowDownWideNarrow, ArrowRight, ChevronDown, Heart, Menu, Search, SlidersHorizontal, Tag } from "lucide-react";
import { HOME, Logo } from "./assets";
import { CarCard } from "./CarCard";
import { useFavorites } from "./favorites";
import { FilterPanel, FilterSheet, useFilters } from "./ListingFilters";
import { Drawer } from "./SiteHeader";
import { ListingExtras } from "./ListingExtras";
import type { ListedCar } from "./listing";
import { useV2 } from "./V2Locale";

const SORTS = [
  { value: "", label: "Recommandé" },
  { value: "price-asc", label: "Prix croissant" },
  { value: "price-desc", label: "Prix décroissant" },
  { value: "km-asc", label: "Kilométrage croissant" },
  { value: "km-desc", label: "Kilométrage décroissant" },
  { value: "year-desc", label: "Année récente" },
  { value: "year-asc", label: "Année ancienne" },
];

export type PopularBrand = { name: string; slug: string; count: number; range: string };

/* ---------- shared bits ---------- */

/** Title + « Lire plus » SEO text (expands with the popular-brands table). */
function Intro({ popular, children, mobile = false }: { popular: PopularBrand[]; children: React.ReactNode; mobile?: boolean }) {
  const { t, tf, href } = useV2();
  const [more, setMore] = useState(false);
  return (
    <div className={mobile ? "" : "mb-4"}>
      <div className={`flex justify-between ${mobile ? "items-start gap-3" : "items-end gap-4"}`}>
        <h1 className={mobile ? "text-[15px] font-bold leading-5 text-[var(--cc-ink)]" : "text-[18px] font-bold text-[var(--cc-ink)]"}>
          {t("Trouvez des voitures d'occasion au Maroc")}
        </h1>
        {children}
      </div>
      {more ? (
        <div className="mt-1 space-y-3">
          <p className="text-[12px] leading-relaxed text-[var(--cc-muted)] lg:text-[13px]">
            {t("Vous cherchez une voiture fiable au juste prix ? Parcourez notre large sélection de voitures d'occasion certifiées. Chez MoziMotors, nous avons transformé l'achat de voitures d'occasion au Maroc en alliant technologie, transparence et un large stock de véhicules inspectés, disponibles en quelques clics.")}
          </p>
          <p className="text-[12px] leading-relaxed text-[var(--cc-muted)] lg:text-[13px]">
            {t("Chaque voiture du stock MoziMotors est livrée avec un rapport d'expertise complet, une garantie et un accompagnement au financement. Acheter une voiture devient aussi simple qu'un achat en ligne : recherchez, sélectionnez et réservez en toute confiance.")}
          </p>
          {popular.length > 0 && (
            <div>
              <h2 className="mb-3 text-[16px] font-bold text-[var(--cc-ink)]">{t("Voitures d'occasion populaires au Maroc")}</h2>
              <div className="overflow-hidden rounded-lg border border-[var(--cc-line)] bg-white">
                <table className="w-full text-[13px]">
                  <thead>
                    <tr className="bg-[var(--cc-soft)] text-left text-[12px] text-[var(--cc-muted)]">
                      <th className="px-3 py-2 font-semibold">{t("Marque")}</th>
                      <th className="px-3 py-2 text-center font-semibold">{t("Annonces")}</th>
                      <th className="px-3 py-2 text-right font-semibold">{t("Prix")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {popular.map((b) => (
                      <tr key={b.slug} className="cursor-pointer border-t border-[var(--cc-line)] transition hover:bg-[var(--cc-primary-tint)]">
                        <td className="px-3 py-2.5 font-semibold text-[var(--chart-3)] underline">
                          <a href={href(`/acheter?brand=${b.slug}`)}>{tf("{name} d'occasion", { name: b.name })}</a>
                        </td>
                        <td className="px-3 py-2.5 text-center text-[var(--cc-body)]">{b.count}</td>
                        <td className="whitespace-nowrap px-3 py-2.5 text-right font-medium text-[var(--cc-ink)]">{b.range}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          <button onClick={() => setMore(false)} className="text-[13px] font-semibold text-[var(--cc-primary-text)] underline">
            {t("Lire moins")}
          </button>
        </div>
      ) : (
        <p className="mt-1 max-w-[760px] text-[12px] text-[var(--cc-muted)] lg:text-[13px]">
          {t("Vous cherchez une voiture fiable au juste prix ? Parcourez notre large sélection de voitures d'occasion certifiées…")}{" "}
          <button onClick={() => setMore(true)} className="font-semibold text-[var(--cc-primary-text)] underline">
            {t("Lire plus")}
          </button>
        </p>
      )}
    </div>
  );
}

function SortDropdown() {
  const { t } = useV2();
  const f = useFilters();
  const [open, setOpen] = useState(false);
  const current = SORTS.find((s) => s.value === f.one("sort")) ?? SORTS[0];
  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [open]);
  return (
    <div className="relative shrink-0">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpen((o) => !o);
        }}
        aria-expanded={open}
        className="flex items-center gap-2 text-[14px]"
      >
        <span className="text-[var(--cc-muted)]">{t("Trier par :")}</span>
        <span className="font-bold text-[var(--cc-ink)]">{t(current.label)}</span>
        <ChevronDown className="size-4 text-[var(--cc-muted)]" aria-hidden="true" />
      </button>
      {open && (
        <div className="absolute right-0 top-8 z-20 w-56 overflow-hidden rounded-lg border border-[var(--cc-line)] bg-white shadow-lg">
          {SORTS.map((s) => (
            <button
              key={s.value}
              onClick={() => f.set({ sort: s.value || undefined })}
              className={`block w-full px-4 py-2.5 text-left text-[13px] hover:bg-[var(--cc-soft)] ${s.value === current.value ? "font-bold text-[var(--cc-primary)]" : "text-[var(--cc-body)]"}`}
            >
              {t(s.label)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function SellBanner() {
  const { t, href } = useV2();
  return (
    <a
      className="col-span-full flex flex-col items-start gap-4 rounded-2xl p-6 text-white sm:flex-row sm:items-center"
      href={href("/vendre")}
      style={{ background: "#551f26" }}
    >
      <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-white/15">
        <Tag className="size-6" aria-hidden="true" />
      </span>
      <div className="flex-1">
        <p className="text-[18px] font-extrabold leading-tight">{t("Vendez votre voiture")}</p>
        <p className="mt-0.5 text-[13.5px] text-white/85">{t("Expertise gratuite et paiement rapide, sans y passer vos week-ends.")}</p>
      </div>
      <span className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-[14px] font-bold text-[var(--cc-ink)]">
        {t("Vendre ma voiture")} <ArrowRight className="size-4" aria-hidden="true" />
      </span>
    </a>
  );
}

function Empty() {
  const { t } = useV2();
  return (
    <div className="cc-card grid place-items-center p-12 text-center text-[14px] text-[var(--cc-muted)]">
      {t("Aucune voiture ne correspond à vos filtres. Essayez d'élargir votre recherche.")}
    </div>
  );
}

/* ---------- desktop ---------- */

export function DesktopListing({ cars, popular }: { cars: ListedCar[]; popular: PopularBrand[] }) {
  const f = useFilters();
  return (
    <main className={`w-full px-5 py-5 transition-opacity ${f.pending ? "opacity-60" : ""}`}>
      <div className="flex gap-6">
        <FilterPanel />
        <div className="min-w-0 flex-1">
          <Intro popular={popular}>
            <SortDropdown />
          </Intro>
          {cars.length === 0 ? (
            <Empty />
          ) : (
            <div className="grid grid-flow-row-dense grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-4">
              {cars.map((c, i) => (
                <Fragment key={c.id}>
                  <CarCard car={c} />
                  {(i + 1) % 12 === 0 && i < cars.length - 1 && <SellBanner />}
                </Fragment>
              ))}
            </div>
          )}
          <div className="h-1" />
          <ListingExtras />
        </div>
      </div>
    </main>
  );
}

/* ---------- mobile ---------- */

function SortSheet({ onClose }: { onClose: () => void }) {
  const { t } = useV2();
  const f = useFilters();
  const current = f.one("sort");
  return (
    <div className="fixed inset-0 z-[80]" role="dialog" aria-modal="true" aria-label={t("Trier par")}>
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute inset-x-0 bottom-0 rounded-t-2xl bg-white pb-6 shadow-2xl animate-in slide-in-from-bottom duration-200">
        <p className="border-b border-[var(--cc-line)] px-5 py-4 text-[16px] font-bold text-[var(--cc-ink)]">{t("Trier par")}</p>
        <ul className="px-5 pt-2" role="radiogroup">
          {SORTS.map((s) => {
            const on = s.value === current;
            return (
              <li key={s.value}>
                <button
                  role="radio"
                  aria-checked={on}
                  onClick={() => {
                    f.set({ sort: s.value || undefined });
                    onClose();
                  }}
                  className={`flex w-full items-center gap-3 py-3 text-left text-[15px] ${on ? "font-bold text-[var(--cc-primary)]" : "text-[var(--cc-body)]"}`}
                >
                  <span
                    className={`grid size-5 shrink-0 place-items-center rounded-full border-2 ${on ? "border-[var(--cc-primary)]" : "border-[var(--cc-line)]"}`}
                  >
                    {on && <span className="size-2.5 rounded-full bg-[var(--cc-primary)]" />}
                  </span>
                  {t(s.label)}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export function MobileListing({
  cars,
  popular,
  chipBrands,
  whatsapp,
}: {
  cars: ListedCar[];
  popular: PopularBrand[];
  chipBrands: { slug: string; name: string }[];
  whatsapp: string;
}) {
  const { t, href } = useV2();
  const f = useFilters();
  const fav = useFavorites();
  const [menu, setMenu] = useState(false);
  const [sheet, setSheet] = useState<"filters" | "sort" | null>(null);
  const [favOnly, setFavOnly] = useState(false);
  const [q, setQ] = useState(f.one("q"));
  const brands = f.list("brand");
  const shown = favOnly ? cars.filter((c) => fav.has(c.id)) : cars;

  return (
    <>
      <header className="sticky top-0 z-[60] border-b border-[var(--cc-line)] bg-white">
        <div className="flex h-[60px] items-center gap-3 px-4">
          <a aria-label="MoziMotors" href={href(HOME)}>
            <Logo />
          </a>
          <div className="flex-1" />
          <button aria-label={t("Menu")} onClick={() => setMenu(true)} className="grid size-9 place-items-center">
            <Menu className="size-6 text-[var(--cc-ink)]" aria-hidden="true" />
          </button>
        </div>
        <div className="flex items-center gap-2 px-4 pb-3 pt-2">
          <form
            className="flex flex-1 items-center gap-2 rounded-xl border border-[var(--cc-line)] px-3 py-2.5"
            onSubmit={(e) => {
              e.preventDefault();
              f.set({ q: q.trim() || undefined });
            }}
          >
            <Search className="size-5 text-[var(--cc-muted)]" aria-hidden="true" />
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={t("Rechercher une voiture…")}
              aria-label={t("Rechercher une voiture")}
              className="w-full bg-transparent text-[14px] text-[var(--cc-ink)] outline-none placeholder:text-[var(--cc-muted)]"
            />
          </form>
          <button
            aria-label={t("Mes favoris")}
            aria-pressed={favOnly}
            onClick={() => setFavOnly((v) => !v)}
            className={`relative grid size-10 shrink-0 place-items-center rounded-full border ${favOnly ? "border-[var(--cc-primary)] bg-[var(--cc-primary-tint)]" : "border-[var(--cc-line)]"}`}
          >
            <Heart className={`size-5 ${favOnly ? "fill-current text-[var(--cc-primary)]" : "text-[var(--cc-body)]"}`} aria-hidden="true" />
          </button>
        </div>
        <div className="flex gap-2 overflow-x-auto px-4 py-2 cc-noscroll">
          <button
            onClick={() => setSheet("filters")}
            className="flex shrink-0 items-center gap-1.5 rounded-lg border border-[var(--cc-primary)] bg-white px-3 py-2 text-[13px] font-semibold text-[var(--cc-primary-text)]"
          >
            <SlidersHorizontal className="size-4" aria-hidden="true" />
            {t("Tous les filtres")}
          </button>
          {chipBrands.map((b) => {
            const on = brands.includes(b.slug);
            return (
              <button
                key={b.slug}
                aria-pressed={on}
                onClick={() => f.toggle("brand", b.slug)}
                className={`shrink-0 rounded-lg border px-3 py-2 text-[13px] font-semibold ${on ? "border-[var(--cc-primary)] bg-[var(--cc-primary-tint)] text-[var(--cc-primary)]" : "border-[var(--cc-line)] bg-white text-[var(--cc-ink)]"}`}
              >
                {b.name}
              </button>
            );
          })}
        </div>
      </header>
      <main className={`cc-stack px-4 pb-24 pt-3 transition-opacity ${f.pending ? "opacity-60" : ""}`}>
        <Intro popular={popular} mobile>
          <button onClick={() => setSheet("sort")} className="flex shrink-0 items-center gap-1 text-[14px] font-bold text-[var(--cc-ink)]">
            <ArrowDownWideNarrow className="size-4" aria-hidden="true" /> {t("TRIER")}
          </button>
        </Intro>
        {shown.length === 0 ? (
          favOnly ? (
            <div className="cc-card grid place-items-center p-12 text-center text-[14px] text-[var(--cc-muted)]">
              {t("Aucune voiture enregistrée pour le moment.")}
            </div>
          ) : (
            <Empty />
          )
        ) : (
          <div className="cc-stack">
            {shown.map((c, i) => (
              <Fragment key={c.id}>
                <CarCard car={c} />
                {(i + 1) % 12 === 0 && i < shown.length - 1 && <SellBanner />}
              </Fragment>
            ))}
          </div>
        )}
        <ListingExtras />
      </main>
      {menu && <Drawer onClose={() => setMenu(false)} whatsapp={whatsapp} />}
      {sheet === "filters" && <FilterSheet onClose={() => setSheet(null)} resultCount={cars.length} />}
      {sheet === "sort" && <SortSheet onClose={() => setSheet(null)} />}
    </>
  );
}
