"use client";

/** Floating WhatsApp button + cookie banner from siaracash.ma. */
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { waLink } from "./assets";
import { useV2 } from "./V2Locale";
import { v2BasePath } from "./locale";

export function WhatsAppFab({ number }: { number: string }) {
  // Car and sell pages have their own bottom CTA bar on mobile.
  const { t } = useV2();
  const path = v2BasePath(usePathname());
  const carPage = path.startsWith("/v2/voiture/") || path.startsWith("/v2/vendre");
  return (
    <a
      href={waLink(number)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t("Discuter sur WhatsApp")}
      title={t("Discuter sur WhatsApp")}
      style={{ bottom: "calc(var(--bottom-nav-h, 0px) + 16px)" }}
      className={`${carPage ? "hidden lg:grid" : "grid"} fixed end-4 z-40 size-14 place-items-center rounded-full bg-[color:var(--color-brand-teal)] text-white mz-shadow-fab ring-1 ring-black/5 transition-transform duration-200 hover:scale-105 hover:brightness-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-brand-teal)] focus-visible:ring-offset-2 lg:end-6`}
    >
      <svg viewBox="0 0 32 32" className="size-7" fill="currentColor" aria-hidden="true">
        <path d="M16.003 3C9.38 3 4 8.38 4 15c0 2.1.55 4.16 1.6 5.98L4 29l8.24-1.56A11.9 11.9 0 0 0 16 27c6.62 0 12-5.38 12-12S22.62 3 16.003 3zm0 21.8c-1.78 0-3.53-.48-5.05-1.38l-.36-.21-4.9.93.93-4.78-.24-.38A9.77 9.77 0 0 1 6.2 15c0-5.4 4.4-9.8 9.8-9.8s9.8 4.4 9.8 9.8-4.4 9.8-9.8 9.8zm5.37-7.34c-.29-.15-1.73-.85-2-.95-.27-.1-.46-.15-.66.15-.19.29-.76.95-.93 1.15-.17.19-.34.22-.63.07-.29-.15-1.24-.46-2.36-1.46-.87-.78-1.46-1.74-1.63-2.03-.17-.29-.02-.45.13-.6.13-.13.29-.34.44-.51.15-.17.19-.29.29-.48.1-.19.05-.36-.02-.51-.07-.15-.66-1.6-.9-2.19-.24-.57-.48-.5-.66-.51h-.56c-.19 0-.51.07-.77.36-.27.29-1.01.99-1.01 2.41 0 1.42 1.04 2.8 1.18 2.99.15.19 2.04 3.12 4.95 4.38.69.3 1.23.48 1.65.61.69.22 1.32.19 1.82.12.56-.08 1.73-.71 1.97-1.39.24-.68.24-1.27.17-1.39-.07-.12-.26-.19-.55-.34z" />
      </svg>
    </a>
  );
}

const KEY = "mozi-v2-cookie-consent";

export function CookieBanner() {
  const { t, href } = useV2();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let seen = false;
    try {
      seen = Boolean(localStorage.getItem(KEY));
    } catch {}
    // eslint-disable-next-line react-hooks/set-state-in-effect -- read consent after mount
    if (!seen) setOpen(true);
    const reopen = () => setOpen(true);
    window.addEventListener("mozi:v2-cookies", reopen);
    return () => window.removeEventListener("mozi:v2-cookies", reopen);
  }, []);

  const decide = (value: "all" | "none") => {
    try {
      localStorage.setItem(KEY, value);
    } catch {}
    setOpen(false);
  };

  if (!open) return null;
  return (
    <div
      role="dialog"
      aria-labelledby="cookie-consent-title"
      className="consent-banner-mobile fixed inset-x-0 z-[70] p-2 transition-[bottom] duration-300 ease-out sm:left-4 sm:right-auto sm:max-w-md sm:p-3"
    >
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl border border-[color:var(--color-line-soft)] p-3.5 sm:p-5">
        <h2 id="cookie-consent-title" className="hidden sm:block text-base font-bold text-[color:var(--color-ink-strong)] mb-2">
          {t("Aidez-nous à améliorer votre expérience")}
        </h2>
        <p className="text-[13px] sm:text-sm leading-snug sm:leading-relaxed text-[color:var(--color-ink-muted)] mb-3 sm:mb-4">
          {t("Les cookies nous permettent de vous proposer du contenu adapté à vos préférences et d'améliorer MoziMotors chaque jour. En acceptant, vous contribuez à une expérience plus pertinente — uniquement pour vous.")}{" "}
          <a className="text-[color:var(--color-brand-purple)] font-medium underline" href={href("/v2/cookies")}>
            {t("En savoir plus")}
          </a>
        </p>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => decide("none")}
              className="text-sm font-medium text-[color:var(--color-ink-muted)] hover:text-[color:var(--color-ink-strong)] px-2 py-1.5"
            >
              {t("Refuser")}
            </button>
            <a href={href("/v2/cookies")} className="text-sm font-medium text-[color:var(--color-ink-muted)] hover:text-[color:var(--color-ink-strong)] px-2 py-1.5">
              {t("Personnaliser")}
            </a>
          </div>
          <button
            type="button"
            onClick={() => decide("all")}
            className="text-sm font-semibold bg-[color:var(--color-brand-teal)] hover:bg-[color:var(--color-brand-teal-hover)] text-white px-5 py-2.5 rounded-full"
          >
            {t("Tout accepter")}
          </button>
        </div>
      </div>
    </div>
  );
}
