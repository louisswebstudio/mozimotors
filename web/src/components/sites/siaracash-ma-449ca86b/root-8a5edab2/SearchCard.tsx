"use client";

/**
 * Search card from the siaracash.ma hero: Marque / Modèle / Ville comboboxes (popover flips above/below,
 * searchable list), « Rechercher », « Recherche vocale », « Recherche avancée », then the
 * « Trouvez votre voiture » body-type rail with a scroll arrow. Options come from MoziMotors stock.
 */
import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { Catalog } from "@/lib/cms";
import { A } from "./assets";
import { BRAND_LOGOS } from "./brands";
import { useV2 } from "./V2Locale";

const TRIGGER =
  "inline-flex items-center gap-2 whitespace-nowrap transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] shadow-xs hover:text-accent-foreground w-full justify-between bg-card font-normal hover:bg-card";
const ITEM =
  "data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none";

type Option = { value: string; label: string; logo?: string };

/** Searchable combobox (shadcn/cmdk look). The popover opens above the trigger, as on siaracash.ma. */
export function Combobox({
  placeholder,
  searchPlaceholder,
  options,
  value,
  onChange,
  disabled = false,
  triggerClass = "rounded-md border px-4 py-2 has-[>svg]:px-3 h-11 text-sm",
}: {
  placeholder: string;
  searchPlaceholder: string;
  options: Option[];
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
  /** Shape of the trigger (radius, border, height, text size). */
  triggerClass?: string;
}) {
  const { t } = useV2();
  const [open, setOpen] = useState(false);
  const popoverId = useId();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const btn = useRef<HTMLButtonElement>(null);
  // Popover is position:fixed (so the card's overflow-hidden can't clip it) and flips above/below depending on free space.
  const [pos, setPos] = useState<{ left: number; width: number; top?: number; bottom?: number; maxH: number } | null>(null);

  useLayoutEffect(() => {
    if (!open) return;
    const place = () => {
      const r = btn.current?.getBoundingClientRect();
      if (!r) return;
      const vh = window.innerHeight;
      const below = vh - r.bottom - 12;
      const above = r.top - 12;
      const down = below >= 260 || below >= above;
      const room = Math.max(160, Math.min(down ? below : above, 420));
      setPos(down ? { left: r.left, width: r.width, top: r.bottom + 4, maxH: room } : { left: r.left, width: r.width, bottom: vh - r.top + 4, maxH: room });
    };
    place();
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true);
    return () => {
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place, true);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return q ? options.filter((o) => o.label.toLowerCase().includes(q)) : options;
  }, [options, query]);
  const selected = options.find((o) => o.value === value);

  const pick = (v: string) => {
    onChange(v === value ? "" : v);
    setOpen(false);
    setQuery("");
  };

  return (
    <div ref={ref} className="relative">
      <button
        ref={btn}
        type="button"
        role="combobox"
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-controls={popoverId}
        disabled={disabled}
        data-state={open ? "open" : "closed"}
        onClick={() => {
          setOpen((o) => !o);
          setActive(0);
        }}
        className={`${TRIGGER} ${triggerClass} ${selected ? "text-foreground" : "text-muted-foreground"}`}
      >
        <span className="flex min-w-0 items-center gap-2 truncate">{selected?.label ?? placeholder}</span>
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
          className="lucide lucide-chevrons-up-down ms-2 size-4 shrink-0 opacity-50"
          aria-hidden="true"
        >
          <path d="m7 15 5 5 5-5" />
          <path d="m7 9 5-5 5 5" />
        </svg>
      </button>
      {open && pos && (
        <div
          id={popoverId}
          role="dialog"
          data-state="open"
          style={{ position: "fixed", left: pos.left, width: pos.width, top: pos.top, bottom: pos.bottom }}
          className="bg-popover text-popover-foreground z-50 rounded-md border shadow-md outline-hidden p-0 animate-in fade-in-0 zoom-in-95"
        >
          <div className="bg-popover text-popover-foreground flex h-full w-full flex-col overflow-hidden rounded-md">
            <div className="flex h-9 items-center gap-2 border-b px-3">
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
                className="lucide lucide-search size-4 shrink-0 opacity-50"
                aria-hidden="true"
              >
                <path d="m21 21-4.34-4.34" />
                <circle cx="11" cy="11" r="8" />
              </svg>
              <input
                autoFocus
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActive(0);
                }}
                onKeyDown={(e) => {
                  if (e.key === "ArrowDown") setActive((i) => Math.min(i + 1, filtered.length - 1));
                  else if (e.key === "ArrowUp") setActive((i) => Math.max(i - 1, 0));
                  else if (e.key === "Enter" && filtered[active]) pick(filtered[active].value);
                  else if (e.key === "Escape") setOpen(false);
                  else return;
                  e.preventDefault();
                }}
                placeholder={searchPlaceholder}
                className="placeholder:text-muted-foreground flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-hidden"
              />
            </div>
            <div role="listbox" style={{ maxHeight: pos.maxH - 40 }} className="scroll-py-1 overflow-x-hidden overflow-y-auto overscroll-contain">
              {filtered.length === 0 ? (
                <p className="py-6 text-center text-sm">{t("Aucun résultat.")}</p>
              ) : (
                <div className="text-foreground overflow-hidden p-1">
                  {filtered.map((o, i) => (
                    <div
                      key={o.value}
                      role="option"
                      aria-selected={i === active}
                      data-selected={i === active}
                      onMouseEnter={() => setActive(i)}
                      onClick={() => pick(o.value)}
                      className={ITEM}
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
                        className={`lucide lucide-check me-2 size-4 shrink-0 ${o.value === value ? "opacity-100" : "opacity-0"}`}
                        aria-hidden="true"
                      >
                        <path d="M20 6 9 17l-5-5" />
                      </svg>
                      {o.logo && <img alt="" aria-hidden="true" className="me-2 size-5 shrink-0 object-contain" src={o.logo} />}
                      <div className="flex min-w-0 flex-col">
                        <span className="truncate">{o.label}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const BODY_TYPES = [
  { label: "SUV & Pick-up", body: "suv", img: "suv" },
  { label: "Berline", body: "berline", img: "sedan" },
  { label: "Break", body: "break", img: "station-wagon" },
  { label: "Citadine", body: "citadine", img: "compact" },
  { label: "Monospace", body: "monospace", img: "van" },
  { label: "Coupé", body: "coupe", img: "coupe" },
  { label: "Cabriolet", body: "cabriolet", img: "convertible" },
  { label: "Utilitaire", body: "utilitaire", img: "transport" },
];

export function SearchCard({ catalog }: { catalog: Catalog }) {
  const router = useRouter();
  const { t, href } = useV2();
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const rail = useRef<HTMLDivElement>(null);

  const brandOptions = catalog.map((b) => ({
    value: b.slug,
    label: b.name,
    logo: BRAND_LOGOS.has(b.slug) ? `${A}/storage/brands/${b.slug}.png` : undefined,
  }));
  const modelOptions = (catalog.find((b) => b.slug === brand)?.models ?? []).map((m) => ({ value: m, label: m }));

  const search = () => {
    const p = new URLSearchParams();
    if (brand) p.set("brand", brand);
    if (brand && model) p.set("model", `${brand}~${model}`);
    const qs = p.toString();
    router.push(href(`/acheter${qs ? `?${qs}` : ""}`));
  };

  return (
    <div className="w-full overflow-hidden r bg-white">
      <div className="px-4 py-5 sm:px-8 sm:py-6">
        <div className="grid grid-cols-1 items-center gap-2.5 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_auto]">
          <Combobox
            placeholder={t("Marque")}
            searchPlaceholder={t("Rechercher une marque…")}
            options={brandOptions}
            value={brand}
            onChange={(v) => {
              setBrand(v);
              setModel("");
            }}
          />
          <Combobox placeholder={t("Modèle")} searchPlaceholder={t("Rechercher un modèle…")} options={modelOptions} value={model} onChange={setModel} disabled={!brand} />
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={search}
              className="inline-flex h-11 flex-1 min-w-[130px] items-center justify-center rounded-full bg-[color:var(--color-brand-teal)] px-6 text-sm font-semibold text-white shadow-sm transition-colors lg:flex-none hover:bg-[color:var(--color-brand-teal-hover)] active:scale-[0.98]"
            >
              {t("Rechercher")}
            </button>
            <div className="flex flex-col items-stretch gap-3">
              <div className="flex items-center gap-2">
                <VoiceSearch />
              </div>
            </div>
          </div>
        </div>
        <div className="mt-3 flex items-center">
          <a
            className="ms-auto text-sm font-bold text-[color:var(--color-brand-purple)] hover:text-[color:var(--color-brand-purple-hover)] hover:underline"
            href={href("/acheter")}
          >
            {t("Recherche avancée")}
          </a>
        </div>
      </div>
      <div className="border-t px-4 py-5 sm:px-7 sm:py-6">
        <h3 className="mb-4 text-sm font-bold text-foreground sm:text-base">{t("Trouvez votre voiture, d'occasion ou neuve")}</h3>
        <div className="relative">
          <div
            ref={rail}
            className="flex gap-3 overflow-x-auto scroll-smooth py-2 pe-12 [-ms-overflow-style:none] [scrollbar-width:none] sm:gap-5 [&::-webkit-scrollbar]:hidden motion-reduce:scroll-auto"
            aria-label={t("Types de carrosserie")}
          >
            {BODY_TYPES.map((b) => (
              <a
                key={b.body}
                className="group flex w-[148px] shrink-0 flex-col items-center gap-2 rounded-xl p-3 transition hover:bg-muted/40 active:scale-[0.97] sm:w-[176px]"
                aria-label={t(b.label)}
                href={href(`/acheter?body=${b.body}`)}
              >
                {}
                <img
                  src={`${A}/assets/body-types-v2/${b.img}_2x_car.webp`}
                  alt=""
                  aria-hidden="true"
                  draggable="false"
                  loading="lazy"
                  className="h-16 w-full object-contain transition-transform group-hover:scale-105 sm:h-20"
                />
                <span className="text-center text-sm font-bold text-foreground sm:text-base">{t(b.label)}</span>
              </a>
            ))}
          </div>
          <button
            type="button"
            aria-label={t("Voir plus de types de carrosserie")}
            onClick={() => {
              const el = rail.current;
              if (!el) return;
              const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
              el.scrollBy({ left: atEnd ? -el.scrollWidth : el.clientWidth * 0.8 });
            }}
            className="absolute end-2 top-1/2 -translate-y-1/2 flex size-11 items-center justify-center rounded-full bg-foreground/30 text-white shadow-md backdrop-blur-sm transition-all hover:bg-foreground/50 active:scale-95"
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
              className="lucide lucide-chevron-right size-5"
              aria-hidden="true"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

/** « Recherche vocale »: browser speech recognition (fr-FR) → /v2/acheter?q=…; hidden where unsupported. */
function VoiceSearch() {
  const router = useRouter();
  const { t, href, locale } = useV2();
  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState(true);
  useEffect(() => {
    const w = window as unknown as Record<string, unknown>;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- feature detection after mount
    setSupported(Boolean(w.SpeechRecognition || w.webkitSpeechRecognition));
  }, []);

  const start = () => {
    const w = window as unknown as Record<string, new () => SpeechRecognitionLike>;
    const Ctor = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!Ctor) return;
    const rec = new Ctor();
    rec.lang = { fr: "fr-FR", en: "en-GB", ar: "ar-MA" }[locale];
    rec.onresult = (e) => {
      const text = e.results[0]?.[0]?.transcript?.trim();
      if (text) router.push(href(`/acheter?q=${encodeURIComponent(text)}`));
    };
    rec.onend = () => setListening(false);
    setListening(true);
    rec.start();
  };

  return (
    <button
      type="button"
      aria-label={t("Recherche vocale")}
      aria-pressed={listening}
      disabled={!supported}
      onClick={start}
      className="group relative inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-brand-teal)] focus-visible:ring-offset-2 disabled:opacity-70 h-10 px-4 text-[13px] text-[color:var(--color-brand-teal-text)] bg-[color:var(--color-brand-teal-soft)] hover:bg-[color:var(--color-brand-teal-soft-2)]"
    >
      <span className="relative inline-flex items-center gap-2">
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
          className={`lucide lucide-mic size-4 ${listening ? "animate-pulse" : ""}`}
          aria-hidden="true"
        >
          <path d="M12 19v3" />
          <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
          <rect x="9" y="2" width="6" height="13" rx="3" />
        </svg>
        <span className="whitespace-nowrap">{t(listening ? "Je vous écoute…" : "Recherche vocale")}</span>
      </span>
    </button>
  );
}

type SpeechRecognitionLike = {
  lang: string;
  start: () => void;
  onresult: (e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void;
  onend: () => void;
};
