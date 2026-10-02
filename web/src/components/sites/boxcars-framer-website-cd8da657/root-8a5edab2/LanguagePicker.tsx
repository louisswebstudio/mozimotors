"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { useI18n } from "@/i18n/client";
import { LOCALES, localizePath, type Locale } from "@/i18n/config";
import { Flag } from "./flags";

const RING =
  "outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-bx-navy";

/** Display order (Moroccan audience: French, Arabic, English), limited to the enabled locales. */
const ORDER: Locale[] = (["fr", "ar", "en"] as const).filter((l): l is Locale => (LOCALES as readonly string[]).includes(l));

const OVERLAY_ID = "mz-lang-overlay";

/**
 * Full-screen veil (brand mark + progress bar) faded in while the new language loads. It lives on
 * document.body, outside React, so it survives the layout remount that a locale change causes and
 * can be faded out by the freshly mounted picker.
 */
function showLangOverlay() {
  if (document.getElementById(OVERLAY_ID)) return;
  const el = document.createElement("div");
  el.id = OVERLAY_ID;
  el.setAttribute("role", "status");
  el.setAttribute("aria-label", "Loading");
  el.className = "mz-route fixed inset-0 z-[9998] flex items-center justify-center bg-white";
  el.style.cssText = "opacity:0;transition:opacity 300ms cubic-bezier(.4,0,.2,1)";
  el.innerHTML = `<span class="mz-mark relative block w-40" style="aspect-ratio:900/198"><img src="/brand/mozi-logo-dark.png" alt="" aria-hidden="true" class="mz-logo block h-full w-full"/></span>`;
  document.body.appendChild(el);
  requestAnimationFrame(() => requestAnimationFrame(() => (el.style.opacity = "1")));
  // Failsafe: never leave the veil up if navigation stalls.
  window.setTimeout(hideLangOverlay, 8000);
}

function hideLangOverlay() {
  const el = document.getElementById(OVERLAY_ID);
  if (!el) return;
  el.style.opacity = "0";
  window.setTimeout(() => el.remove(), 350);
}

/**
 * Flag + code pill with a dropdown of the site's languages. Picking one opens the same page
 * (path, filters and anchor kept) in that language; each option's name is shown in its own language.
 */
export function LanguagePicker() {
  const { t, locale } = useI18n();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  // A locale change remounts the page: once the new language is on screen, lift the veil.
  useEffect(() => {
    const t = window.setTimeout(hideLangOverlay, 250);
    return () => clearTimeout(t);
  }, [locale]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const pick = (code: Locale) => {
    setOpen(false);
    if (code === locale) return;
    const { search, hash } = window.location;
    showLangOverlay();
    router.push(localizePath(`${pathname}${search}${hash}`, code));
  };

  return (
    <div ref={rootRef} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t.langs.choose}
        className={`flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 py-1.5 pe-2.5 ps-2 text-[13px] font-medium leading-5 text-white transition-colors duration-300 bx-ease hover:border-white/25 hover:bg-white/10 ${RING}`}
      >
        <span className="block h-[14px] w-5 shrink-0 overflow-hidden rounded-[3px]">
          <Flag code={locale} />
        </span>
        {locale.toUpperCase()}
        <ChevronDown
          size={14}
          strokeWidth={2}
          aria-hidden
          className={`shrink-0 text-white/60 transition-transform duration-300 bx-ease ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label={t.langs.choose}
          className="absolute end-0 top-[calc(100%+10px)] z-50 w-[220px] rounded-2xl border border-bx-line bg-white p-2 shadow-[0_16px_40px_rgba(5,11,32,0.18)]"
        >
          {ORDER.map((code) => {
            const active = code === locale;
            return (
              <li key={code}>
                <button
                  type="button"
                  role="option"
                  aria-selected={active}
                  lang={code}
                  onClick={() => pick(code)}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-start transition-colors duration-300 bx-ease hover:bg-bx-soft"
                >
                  <span className="block h-[18px] w-6 shrink-0 overflow-hidden rounded-[3px]">
                    <Flag code={code} />
                  </span>
                  <span className={`flex-1 text-[15px] leading-6 ${active ? "font-medium text-bx-navy" : "text-bx-ink"}`}>
                    {t.langs[code]}
                  </span>
                  {active && <span className="size-2 shrink-0 rounded-full bg-ok" aria-hidden />}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default LanguagePicker;
