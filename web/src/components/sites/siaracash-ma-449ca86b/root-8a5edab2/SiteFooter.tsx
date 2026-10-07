"use client";

/**
 * Purple footer from siaracash.ma: logo + tagline + socials, « Nos services », « À propos », « Contact »,
 * then legal links + copyright. Financement / Devenir partenaire links are left out on request.
 */
import type { SiteSettings } from "@/lib/types";
import { Mail, MapPin, Phone } from "lucide-react";
import { Logo, telLink, waLink } from "./assets";
import { useV2 } from "./V2Locale";

const LINK = "font-medium text-[14px] leading-[20px] text-white/90 tracking-[-0.42px] transition-opacity hover:opacity-70";
const HEAD = "mb-[16px] text-[13px] font-bold uppercase leading-[18px] tracking-[0.08em] mz-on-dark-accent";
const SOCIAL = "grid size-[42px] place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-[color:var(--color-brand-teal)]";
const ICON = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

const SERVICES = [
  { label: "Vente de voiture", href: "/vendre" },
  { label: "Achat de voiture", href: "/acheter" },
  { label: "Certifié MoziMotors", href: "/pourquoi-mozimotors" },
  { label: "Offres de la semaine", href: "/acheter" },
];
const ABOUT = [
  { label: "À propos de nous", href: "/pourquoi-mozimotors" },
  { label: "Comment ça marche", href: "/pourquoi-mozimotors" },
  { label: "FAQ", href: "/faq" },
];

export function SiteFooter({ settings }: { settings: SiteSettings }) {
  const { t, href } = useV2();
  return (
    <footer className="bg-[color:var(--color-brand-purple)] text-white pb-16 lg:pb-0">
      <div className="mx-auto w-full max-w-[402px] lg:max-w-[1280px] px-[22px] lg:px-12 py-[36px] lg:py-[56px]">
        <div className="grid grid-cols-2 gap-x-[24px] gap-y-[28px] lg:grid-cols-[minmax(260px,1.3fr)_1fr_1fr_1.2fr] lg:gap-x-[48px] lg:gap-y-[36px]">
          <div className="col-span-2 lg:col-span-1">
            <h2 className="text-start">
              <Logo white height={40} />
            </h2>
            <p className="mt-[20px] max-w-[360px] text-[14px] font-medium leading-[22px] text-white/85 tracking-[-0.42px]">
              {t("La plateforme de confiance pour acheter et vendre des voitures d'occasion au Maroc.")}
            </p>
            <div className="mt-[22px] flex items-center gap-[12px]">
              {settings.facebook && (
                <a href={settings.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className={SOCIAL}>
                  <svg {...ICON} className="lucide lucide-facebook size-[18px]">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                </a>
              )}
              {settings.whatsapp && (
                <a href={waLink(settings.whatsapp)} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className={SOCIAL}>
                  <svg viewBox="0 0 32 32" fill="currentColor" className="size-[18px]" aria-hidden="true">
                    <path d="M16.003 3C9.38 3 4 8.38 4 15c0 2.1.55 4.16 1.6 5.98L4 29l8.24-1.56A11.9 11.9 0 0 0 16 27c6.62 0 12-5.38 12-12S22.62 3 16.003 3zm0 21.8c-1.78 0-3.53-.48-5.05-1.38l-.36-.21-4.9.93.93-4.78-.24-.38A9.77 9.77 0 0 1 6.2 15c0-5.4 4.4-9.8 9.8-9.8s9.8 4.4 9.8 9.8-4.4 9.8-9.8 9.8zm5.37-7.34c-.29-.15-1.73-.85-2-.95-.27-.1-.46-.15-.66.15-.19.29-.76.95-.93 1.15-.17.19-.34.22-.63.07-.29-.15-1.24-.46-2.36-1.46-.87-.78-1.46-1.74-1.63-2.03-.17-.29-.02-.45.13-.6.13-.13.29-.34.44-.51.15-.17.19-.29.29-.48.1-.19.05-.36-.02-.51-.07-.15-.66-1.6-.9-2.19-.24-.57-.48-.5-.66-.51h-.56c-.19 0-.51.07-.77.36-.27.29-1.01.99-1.01 2.41 0 1.42 1.04 2.8 1.18 2.99.15.19 2.04 3.12 4.95 4.38.69.3 1.23.48 1.65.61.69.22 1.32.19 1.82.12.56-.08 1.73-.71 1.97-1.39.24-.68.24-1.27.17-1.39-.07-.12-.26-.19-.55-.34z" />
                  </svg>
                </a>
              )}
              {settings.instagram && (
                <a href={settings.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className={SOCIAL}>
                  <svg {...ICON} className="lucide lucide-instagram size-[18px]">
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </svg>
                </a>
              )}
            </div>
          </div>
          <nav aria-label={t("Nos services")}>
            <h3 className={HEAD}>{t("Nos services")}</h3>
            <ul className="flex flex-col gap-[12px]">
              {SERVICES.map((l) => (
                <li key={l.label}>
                  <a className={LINK} href={href(l.href)}>
                    {t(l.label)}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-label={t("À propos")}>
            <h3 className={HEAD}>{t("À propos")}</h3>
            <ul className="flex flex-col gap-[12px]">
              {ABOUT.map((l) => (
                <li key={l.label}>
                  <a className={LINK} href={href(l.href)}>
                    {t(l.label)}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="col-span-2 lg:col-span-1">
            <h3 className={HEAD}>{t("Contact")}</h3>
            <ul className="flex flex-col gap-[16px]">
              <li className="flex min-w-0 items-start gap-3">
                <span aria-hidden="true" className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-full bg-white/10 mz-on-dark-accent">
                  <Phone className="size-4" />
                </span>
                <span className="min-w-0">
                  <span className="block text-[13px] font-medium text-white/70 tracking-[-0.39px]">{t("Appelez-nous")}</span>
                  <a href={telLink(settings.phone)} className="block text-[15px] font-bold text-white tracking-[-0.45px] transition-opacity hover:opacity-70">
                    {settings.phone}
                  </a>
                </span>
              </li>
              <li className="flex min-w-0 items-start gap-3">
                <span aria-hidden="true" className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-full bg-white/10 mz-on-dark-accent">
                  <Mail className="size-4" />
                </span>
                <span className="min-w-0">
                  <span className="block text-[13px] font-medium text-white/70 tracking-[-0.39px]">{t("Écrivez-nous")}</span>
                  <a href={`mailto:${settings.email}`} className="block break-all text-[15px] font-bold text-white tracking-[-0.45px] transition-opacity hover:opacity-70">
                    {settings.email}
                  </a>
                </span>
              </li>
              <li className="flex min-w-0 items-start gap-3">
                <span aria-hidden="true" className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-full bg-white/10 mz-on-dark-accent">
                  <MapPin className="size-4" />
                </span>
                <span className="min-w-0">
                  <span className="block text-[13px] font-medium text-white/70 tracking-[-0.39px]">{t("Nos centres")}</span>
                  <span className="block text-[15px] font-bold text-white tracking-[-0.45px]">{settings.address}</span>
                </span>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-[36px] flex flex-col gap-[16px] border-t border-white/10 pt-[24px] text-[14px] font-medium leading-[18px] tracking-[-0.42px] text-white/80 lg:mt-[48px] lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-x-[28px] gap-y-[10px]">
            <a className="transition-opacity hover:opacity-70" href={href("/conditions-generales")}>
              {t("Conditions générales")}
            </a>
            <a className="transition-opacity hover:opacity-70" href={href("/politique-de-confidentialite")}>
              {t("Politique de confidentialité")}
            </a>
            <a className="transition-opacity hover:opacity-70" href={href("/cookies")}>
              {t("Cookies")}
            </a>
            <button type="button" className="transition-opacity hover:opacity-70" onClick={() => window.dispatchEvent(new Event("mozi:v2-cookies"))}>
              {t("Gérer mes cookies")}
            </button>
          </div>
          <div className="flex flex-wrap items-center gap-x-[20px] gap-y-[10px] lg:justify-end">
            <p className="text-start lg:text-end">© {new Date().getFullYear()} MoziMotors — {t("Tous droits réservés.")}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
