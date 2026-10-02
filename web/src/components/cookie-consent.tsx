"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import Link from "@/i18n/link";
import { useI18n } from "@/i18n/client";

const KEY = "mz-cookie-consent";
const OPEN_EVENT = "mz:open-cookies";
const MONTH = 30 * 24 * 3600 * 1000;

type Prefs = { analytics: boolean; marketing: boolean };
type Consent = Prefs & { ts: number };

function read(): Consent | null {
  try {
    const c = JSON.parse(localStorage.getItem(KEY) ?? "null") as Consent | null;
    return c && Date.now() - c.ts < 12 * MONTH ? c : null;
  } catch {
    return null;
  }
}

function write(p: Prefs) {
  const full: Consent = { ...p, ts: Date.now() };
  try {
    localStorage.setItem(KEY, JSON.stringify(full));
  } catch {}
  window.dispatchEvent(new CustomEvent("mz:cookie-consent", { detail: full }));
}

/** Footer button: opens the preference manager from anywhere. */
export function ManageCookiesButton({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <button type="button" className={className} onClick={() => window.dispatchEvent(new Event(OPEN_EVENT))}>
      {children}
    </button>
  );
}

function Toggle({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={() => onChange(!on)}
      className={`relative h-7 w-12 shrink-0 rounded-full transition-colors duration-300 ${on ? "bg-bx-blue" : "bg-bx-line"}`}
    >
      <span className={`absolute top-1 size-5 rounded-full bg-white shadow transition-all duration-300 ${on ? "start-6" : "start-1"}`} />
    </button>
  );
}

const BTN = "rounded-xl px-5 py-2.5 text-[15px] font-medium leading-6 transition-colors duration-300";
const ALL: Prefs = { analytics: true, marketing: true };
const NONE: Prefs = { analytics: false, marketing: false };

export function CookieConsent() {
  const { t } = useI18n();
  const c = t.legal;
  const [banner, setBanner] = useState(false);
  const [open, setOpen] = useState(false);
  const [prefs, setPrefs] = useState<Prefs>(NONE);
  const dialog = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = read();
    if (saved) setPrefs({ analytics: saved.analytics, marketing: saved.marketing });
    else setBanner(true);
    const openIt = () => {
      const s = read();
      if (s) setPrefs({ analytics: s.analytics, marketing: s.marketing });
      setOpen(true);
    };
    window.addEventListener(OPEN_EVENT, openIt);
    return () => window.removeEventListener(OPEN_EVENT, openIt);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    dialog.current?.focus();
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const commit = useCallback((p: Prefs) => {
    setPrefs(p);
    write(p);
    setBanner(false);
    setOpen(false);
  }, []);

  const toggles: (((v: boolean) => void) | null)[] = [
    null,
    (v) => setPrefs((p) => ({ ...p, analytics: v })),
    (v) => setPrefs((p) => ({ ...p, marketing: v })),
  ];
  const values = [true, prefs.analytics, prefs.marketing];

  return (
    <>
      {banner && !open && (
        <div
          role="region"
          aria-label={c.banner.title}
          className="fixed inset-x-4 bottom-4 z-[90] mx-auto max-w-[760px] animate-[bx-cookie-in_0.5s_cubic-bezier(0.44,0,0.56,1)_both] rounded-2xl border border-bx-line bg-white p-5 shadow-[0_24px_60px_-16px_rgba(5,11,32,0.35)] bxt:bottom-6 bxt:p-6"
        >
          <p className="text-lg font-semibold text-bx-navy">{c.banner.title}</p>
          <p className="mt-1 text-[15px] leading-6 text-bx-ink">
            {c.banner.text}{" "}
            <Link href="/cookies" className="font-medium text-bx-blue underline">
              {c.banner.learn}
            </Link>
          </p>
          <div className="mt-4 flex flex-col gap-2.5 bxt:flex-row bxt:flex-wrap">
            <button type="button" className={`${BTN} bg-bx-blue text-white hover:bg-bx-blue-hover`} onClick={() => commit(ALL)}>
              {c.banner.accept}
            </button>
            <button type="button" className={`${BTN} border border-bx-line text-bx-navy hover:bg-bx-soft`} onClick={() => commit(NONE)}>
              {c.banner.refuse}
            </button>
            <button type="button" className={`${BTN} text-bx-navy hover:text-bx-blue`} onClick={() => setOpen(true)}>
              {c.banner.customize}
            </button>
          </div>
        </div>
      )}

      {open && (
        <div className="fixed inset-0 z-[110] grid place-items-center p-4">
          <div className="absolute inset-0 bg-bx-navy/60 backdrop-blur-sm" onClick={() => setOpen(false)} aria-hidden />
          <div
            ref={dialog}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-label={c.manager.title}
            className="relative max-h-[90dvh] w-full max-w-[620px] animate-[bx-cookie-in_0.4s_cubic-bezier(0.44,0,0.56,1)_both] overflow-y-auto rounded-2xl bg-white p-6 shadow-[0_30px_80px_-20px_rgba(5,11,32,0.5)] outline-none bxt:p-8"
          >
            <button
              type="button"
              aria-label={c.manager.close}
              onClick={() => setOpen(false)}
              className="absolute end-4 top-4 grid size-9 place-items-center rounded-full text-bx-navy hover:bg-bx-soft"
            >
              <X className="size-5" strokeWidth={1.5} />
            </button>
            <h2 className="pe-10 text-2xl font-bold text-bx-navy">{c.manager.title}</h2>
            <p className="mt-2 text-[15px] leading-6 text-bx-ink">{c.manager.text}</p>
            <ul className="mt-5 flex flex-col gap-3">
              {c.manager.cats.map((cat, i) => (
                <li key={cat.name} className="flex items-start gap-4 rounded-xl border border-bx-line p-4">
                  <div className="flex-1">
                    <p className="font-medium text-bx-navy">{cat.name}</p>
                    <p className="mt-1 text-sm leading-5 text-bx-ink">{cat.text}</p>
                  </div>
                  {toggles[i] ? (
                    <Toggle on={values[i]} onChange={toggles[i]!} label={cat.name} />
                  ) : (
                    <span className="mt-0.5 whitespace-nowrap rounded-[120px] bg-bx-lavender px-3 py-1 text-xs font-medium text-bx-blue">
                      {c.manager.alwaysOn}
                    </span>
                  )}
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-col gap-2.5 bxt:flex-row bxt:flex-wrap">
              <button type="button" className={`${BTN} bg-bx-blue text-white hover:bg-bx-blue-hover`} onClick={() => commit(prefs)}>
                {c.manager.save}
              </button>
              <button type="button" className={`${BTN} border border-bx-line text-bx-navy hover:bg-bx-soft`} onClick={() => commit(ALL)}>
                {c.manager.acceptAll}
              </button>
              <button type="button" className={`${BTN} text-bx-navy hover:text-bx-blue`} onClick={() => commit(NONE)}>
                {c.manager.refuseAll}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
