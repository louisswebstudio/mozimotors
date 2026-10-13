"use client";

/**
 * Sticky header from siaracash.ma: logo, centred nav, « Estimer ma voiture » button, language dropdown (lg+), menu button + right drawer (< lg).
 * Le Neuf, Financement and Devenir partenaire are left out on request; no « Se connecter » (the site has no accounts).
 */
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { A, HOME, Logo, waLink } from "./assets";
import { useV2 } from "./V2Locale";
import { localizeV2, v2BasePath, type V2Locale } from "./locale";

const NAV = [
  { label: "Acheter", href: "/acheter" },
  { label: "Vendre", href: "/vendre" },
  { label: "Notre expertise", href: "/pourquoi-mozimotors" },
  { label: "À propos", href: "/a-propos" },
];

const DRAWER_NAV = [
  { label: "Acheter", href: "/acheter" },
  { label: "Vendre", href: "/vendre" },
  { label: "Notre expertise", href: "/pourquoi-mozimotors" },
  { label: "À propos", href: "/a-propos" },
  { label: "FAQ", href: "/faq" },
];

const LANGS: { code: V2Locale; label: string; flag: string }[] = [
  { code: "fr", label: "Français", flag: "fr" },
  { code: "ar", label: "العربية", flag: "ma" },
  { code: "en", label: "English", flag: "gb" },
];

/** The current /v2 page in each language, never the v1 site. */
function useLangHrefs() {
  const base = v2BasePath(usePathname());
  return (code: V2Locale) => localizeV2(base, code);
}

/** Keep the filters (?brand=…) when switching language. */
const keepQuery = (e: React.MouseEvent<HTMLAnchorElement>) => {
  if (location.search) e.currentTarget.href += location.search;
};

const FOCUS = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-brand-teal)] focus-visible:ring-offset-2";
const MENU_PANEL =
  "absolute end-0 top-[calc(100%+8px)] z-50 overflow-hidden rounded-xl border border-[color:var(--color-line-soft)] bg-white py-1 shadow-[0_12px_40px_-12px_rgba(5,11,32,0.28)]";

/** Closes a dropdown on outside click / Escape. */
function useDismiss(open: boolean, close: () => void) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) close();
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, close]);
  return ref;
}

function ChevronDown({ className }: { className: string }) {
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
      className={className}
      aria-hidden="true"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function LanguageMenu() {
  const [open, setOpen] = useState(false);
  const ref = useDismiss(open, () => setOpen(false));
  const { locale } = useV2();
  const langHref = useLangHrefs();
  const current = LANGS.find((l) => l.code === locale)!;
  return (
    <div ref={ref} className="relative hidden lg:block">
      <button
        type="button"
        aria-label={current.label}
        aria-expanded={open}
        dir="ltr"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 rounded-full border border-[color:var(--color-line-soft)] py-1.5 px-2.5 text-[13px] font-semibold text-[color:var(--color-ink-strong)] transition-colors hover:bg-[color:var(--color-surface-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-brand-teal)]"
      >
        {}
        <img src={`${A}/assets/flags/${current.flag}.svg`} alt="" className="h-4 w-[22px] rounded-[2px] object-cover" />
        {locale.toUpperCase()}
        <ChevronDown className={`lucide lucide-chevron-down size-3.5 text-[color:var(--color-ink-muted)] transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <ul role="listbox" className={`${MENU_PANEL} w-44`}>
          {LANGS.map((l) => {
            const active = l.code === locale;
            return (
              <li key={l.code}>
                <a
                  hrefLang={l.code}
                  dir="ltr"
                  href={langHref(l.code)}
                  onClick={keepQuery}
                  className={`flex items-center gap-2.5 px-3 py-2 text-[14px] transition-colors hover:bg-[color:var(--color-surface-soft)] ${active ? "font-semibold text-[color:var(--color-ink-strong)]" : "text-[color:var(--color-ink-muted)]"}`}
                >
                  {}
                  <img alt="" className="h-4 w-[22px] rounded-[2px] object-cover" src={`${A}/assets/flags/${l.flag}.svg`} />
                  <span className="flex-1">{l.label}</span>
                  {active && <span className="size-1.5 rounded-full bg-[color:var(--color-brand-teal)]" aria-hidden="true" />}
                </a>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export function Drawer({ onClose, whatsapp }: { onClose: () => void; whatsapp: string }) {
  const { t, href, locale } = useV2();
  const langHref = useLangHrefs();
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[70] lg:hidden" role="dialog" aria-modal="true" aria-label={t("Menu")}>
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute inset-y-0 end-0 flex w-[88%] max-w-[360px] flex-col overflow-y-auto overscroll-contain bg-[color:var(--color-surface-mobile)] shadow-2xl animate-in slide-in-from-right duration-200">
        <div className="flex items-center justify-between px-4 pt-4 pb-2">
          <button
            onClick={onClose}
            aria-label={t("Fermer")}
            className="rounded-lg p-1.5 hover:bg-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-brand-teal)] focus-visible:ring-offset-2"
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
              className="lucide lucide-x size-5 text-[color:var(--color-ink-base)]"
              aria-hidden="true"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
          <a className={`rounded-sm ${FOCUS}`} href={href(HOME)}>
            <Logo height={36} />
          </a>
        </div>


        <div className="mx-4 mb-3 rounded-2xl border border-[color:var(--color-line-soft)] bg-white">
          {DRAWER_NAV.map((l, i) => {
            const first = i === 0;
            const last = i === DRAWER_NAV.length - 1;
            return (
              <a
                key={l.href}
                href={href(l.href)}
                className={`flex items-center justify-between px-4 py-2.5 text-[15px] leading-normal text-[color:var(--color-ink-strong)] transition-colors hover:bg-[color:var(--color-surface-soft)] ${FOCUS} ${last ? "rounded-b-2xl" : "border-b border-[color:var(--color-line-divider)]"} ${first ? "rounded-t-2xl" : ""}`}
              >
                <span>{t(l.label)}</span>
              </a>
            );
          })}
        </div>

        <div className="mx-4 mb-3">
          <p className="px-1 pb-1.5 text-xs font-semibold text-[color:var(--color-ink-muted)]">{t("Langue")}</p>
          <div className="overflow-hidden rounded-2xl border border-[color:var(--color-line-soft)] bg-white">
            {LANGS.map((l, i) => {
              const active = l.code === locale;
              const last = i === LANGS.length - 1;
              return (
                <a
                  key={l.code}
                  hrefLang={l.code}
                  dir="ltr"
                  href={langHref(l.code)}
                  onClick={keepQuery}
                  className={`flex items-center gap-2.5 px-4 py-2.5 text-[15px] ${FOCUS} ${last ? "" : "border-b border-[color:var(--color-line-divider)]"} ${active ? "bg-[color:var(--color-brand-teal-soft)] font-medium text-[color:var(--color-brand-teal)]" : "text-[color:var(--color-ink-strong)]"}`}
                >
                  {}
                  <img
                    alt=""
                    className="h-[16px] w-[23px] flex-shrink-0 rounded-[3px] border border-[color:var(--color-line-soft)] object-cover"
                    src={`${A}/assets/flags/${l.flag}.svg`}
                  />
                  <span className="flex-1">{l.label}</span>
                  {active && (
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
                      className="lucide lucide-check size-4"
                      aria-hidden="true"
                    >
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  )}
                </a>
              );
            })}
          </div>
        </div>

        <a
          href={waLink(whatsapp)}
          target="_blank"
          rel="noopener noreferrer"
          className="mx-4 mb-3 flex items-center justify-center gap-2 rounded-xl border border-[color:var(--color-brand-teal)]/30 bg-[color:var(--color-brand-teal-soft)] py-3.5 text-[15px] font-semibold text-[color:var(--color-brand-teal-text)] transition-colors hover:bg-[color:var(--color-brand-teal-soft-2,var(--color-brand-teal-soft))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-brand-teal)]"
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
            className="lucide lucide-message-circle size-4"
            aria-hidden="true"
          >
            <path d="M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719" />
          </svg>
          {t("Discuter sur WhatsApp")}
        </a>
        <div className="mx-4 space-y-3 pb-8">
          <a
            className="block w-full rounded-xl bg-[color:var(--color-brand-teal)] py-3.5 text-center text-[15px] font-semibold text-white transition-colors hover:bg-[color:var(--color-brand-teal-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            href={href("/acheter")}
          >
            {t("Acheter")}
          </a>
          <a
            className="block w-full rounded-xl border-2 border-[color:var(--color-brand-teal)] bg-white text-[color:var(--color-brand-teal)] hover:bg-[color:var(--color-brand-teal-soft)] py-3.5 text-center text-[15px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            href={href("/vendre")}
          >
            {t("Vendre")}
          </a>
        </div>
      </div>
    </div>
  );
}

/** On /v2/acheter and car pages the page brings its own mobile header (like siaracash.ma), so this one is lg+ only there. */
export function SiteHeader({ whatsapp }: { whatsapp: string }) {
  const [menu, setMenu] = useState(false);
  const { t, href } = useV2();
  const path = v2BasePath(usePathname());
  const listing = path.startsWith("/acheter") || path.startsWith("/voiture/");
  return (
    <header
      className={`${listing ? "hidden lg:block" : ""} sticky top-0 z-50 border-b border-[color:var(--color-line-soft)] bg-white text-[color:var(--color-brand-dark)]`}
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <div className="flex h-[72px] items-center gap-3 sm:gap-4 lg:gap-6">
          <a className={`shrink-0 rounded-sm ${FOCUS}`} href={href(HOME)} aria-label="MoziMotors">
            <Logo />
          </a>
          <nav className="hidden flex-1 items-center justify-center gap-[22px] lg:flex">
            {NAV.map((l) => {
              const active = path.startsWith(l.href);
              return (
                <a
                  key={l.href}
                  href={href(l.href)}
                  className={`relative inline-flex items-center gap-1.5 whitespace-nowrap py-1 text-[15px] font-semibold transition-colors ${active ? "text-[color:var(--color-brand-teal-text)]" : "text-[color:var(--color-brand-dark)] hover:text-[color:var(--color-brand-teal-text)]"}`}
                >
                  {t(l.label)}
                  {active && <span className="absolute -bottom-[26px] inset-x-0 h-0.5 rounded-full bg-[color:var(--color-brand-teal)]" />}
                </a>
              );
            })}
          </nav>
          <div className="ms-auto flex items-center gap-2 lg:gap-3.5">
            <a
              href={href("/vendre/demande")}
              className={`inline-flex h-10 items-center whitespace-nowrap rounded-full bg-[color:var(--color-brand-teal)] px-3 text-[12.5px] sm:px-4 sm:text-[13.5px] font-semibold text-white transition-colors hover:bg-[color:var(--color-brand-teal-hover)] lg:px-5 lg:text-[14.5px] ${FOCUS}`}
            >
              {t("Estimer ma voiture")}
            </a>
            <LanguageMenu />
            <button
              onClick={() => setMenu(true)}
              aria-label={t("Menu")}
              aria-expanded={menu}
              className={`grid size-[44px] place-items-center rounded-[15px] bg-[color:var(--color-brand-purple-soft)] text-[color:var(--color-brand-purple)] transition-colors hover:bg-[color:var(--color-brand-purple-soft-2)] ${FOCUS} lg:hidden`}
            >
              <svg width="20" height="15" viewBox="0 0 20 15" fill="none" aria-hidden="true" className="rtl:-scale-x-100">
                <path d="M1.2 1.5h17.6M1.2 7.5h17.6M6.8 13.5h12" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      {menu && <Drawer onClose={() => setMenu(false)} whatsapp={whatsapp} />}
    </header>
  );
}
