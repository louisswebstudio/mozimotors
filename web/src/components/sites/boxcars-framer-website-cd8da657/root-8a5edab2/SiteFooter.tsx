/**
 * Boxcars-style footer: about + link columns + contact,
 * and a copyright bar.
 */
import Link from "@/i18n/link";
import { getI18n } from "@/i18n/server";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import type { SiteSettings } from "@/lib/types";
import { FOOTER_BUY_HREFS, FOOTER_SERVICES_HREFS, LOGO } from "./content";
import { Container } from "./ui";
import { ManageCookiesButton } from "@/components/cookie-consent";
import { LEGAL_HREFS } from "@/components/legal-doc";

/** Muted link that turns white with a 1px underline growing 0 → 100% at top 19px. */
function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="group/fl relative w-fit text-sm leading-5 text-bx-muted transition-colors duration-300 bx-ease hover:text-white"
    >
      {children}
      <span className="absolute start-0 top-[19px] h-px w-0 bg-white transition-all duration-300 bx-ease group-hover/fl:w-full" />
    </Link>
  );
}

const SOCIAL_SVG = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-[18px]" aria-hidden {...SOCIAL_SVG}>
      <rect x="3" y="3" width="18" height="18" rx="4.5" />
      <circle cx="12" cy="12" r="3.75" />
      <circle cx="17.1" cy="6.9" r=".6" fill="currentColor" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-[18px]" aria-hidden {...SOCIAL_SVG}>
      <circle cx="12" cy="12" r="9" />
      <path d="M15.75 8.25H14.25A2.25 2.25 0 0 0 12 10.5V21M9 13.5h6" />
    </svg>
  );
}

function ContactRow({ icon: Icon, children }: { icon: typeof Phone; children: React.ReactNode }) {
  return (
    <li className="flex items-center gap-2.5">
      <span className="grid size-[42px] shrink-0 place-items-center rounded-2xl bg-white/5 text-white">
        <Icon className="size-4" strokeWidth={1.5} aria-hidden />
      </span>
      <div className="text-sm leading-5 text-bx-muted">{children}</div>
    </li>
  );
}

const CONTACT_LINK = "underline transition-colors duration-300 bx-ease hover:text-white";
const COL_TITLE = "text-lg font-medium leading-[23px] text-white bxt:text-xl bxt:leading-[26px]";

export async function SiteFooter({ settings }: { settings: SiteSettings }) {
  const { t, fmt } = await getI18n();
  const columns = [
    { title: t.footer.buyTitle, links: t.footer.buyLinks.map((label, i) => ({ label, href: FOOTER_BUY_HREFS[i] })) },
    { title: t.footer.servicesTitle, links: t.footer.servicesLinks.map((label, i) => ({ label, href: FOOTER_SERVICES_HREFS[i] })) },
  ];
  const bottomLinks = [
    { label: t.legal.terms, href: LEGAL_HREFS.terms },
    { label: t.legal.privacy, href: LEGAL_HREFS.privacy },
    { label: t.legal.cookies, href: LEGAL_HREFS.cookies },
  ];
  const socials = [
    settings.instagram && { href: settings.instagram, label: "Instagram", icon: <InstagramIcon /> },
    settings.facebook && { href: settings.facebook, label: "Facebook", icon: <FacebookIcon /> },
  ].filter(Boolean) as { href: string; label: string; icon: React.ReactNode }[];

  return (
    <footer className="relative overflow-hidden bg-bx-navy pt-[50px] bxt:pt-[70px]">
      {/* white cap with rounded bottom edge */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 z-[4] h-[50px] rounded-b-[50px] bg-white bxt:h-[70px] bxt:rounded-b-[70px]"
      />

      {/* center */}
      <Container className="flex flex-col gap-[30px] py-[60px] bxt:grid bxt:grid-cols-2 bxt:gap-10 bxd:flex bxd:flex-row bxd:items-start bxd:gap-0">
        {/* about */}
        <div className="flex flex-col gap-5 bxd:w-[392px] bxd:shrink-0 bxd:pe-[90px]">
          <Link href="/" aria-label={t.footer.homeAria} className="w-fit">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={LOGO.white} alt="" className="h-[36px] w-auto" />
          </Link>
          <p className="max-w-[302px] text-sm leading-5 text-bx-muted">{t.footer.about}</p>
          {socials.length > 0 && (
            <div className="flex gap-[5px]">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.label}
                  className="grid size-10 place-items-center rounded-full p-[5px] text-bx-muted transition-colors duration-300 bx-ease hover:bg-white/[0.07] hover:text-white"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          )}
        </div>

        {/* link columns */}
        {columns.map((col) => (
          <div key={col.title} className="flex flex-col gap-5 bxd:flex-1">
            <h5 className={COL_TITLE}>{col.title}</h5>
            <ul className="flex flex-col gap-[15px]">
              {col.links.map((l) => (
                <li key={l.href + l.label} className="flex">
                  <FooterLink href={l.href}>{l.label}</FooterLink>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* contact */}
        <div className="flex flex-col gap-5 bxd:flex-1">
          <h5 className={COL_TITLE}>{t.footer.contactTitle}</h5>
          <ul className="flex flex-col gap-5">
            <ContactRow icon={MapPin}>
              {settings.mapsUrl ? (
                <a href={settings.mapsUrl} target="_blank" rel="noreferrer" className="transition-colors duration-300 bx-ease hover:text-white">
                  {settings.address}
                </a>
              ) : (
                settings.address
              )}
            </ContactRow>
            <ContactRow icon={Phone}>
              <a href={`tel:${settings.phone.replace(/[^\d+]/g, "")}`} className={CONTACT_LINK}>
                {settings.phone}
              </a>
            </ContactRow>
            <ContactRow icon={Mail}>
              <a href={`mailto:${settings.email}`} className={CONTACT_LINK}>
                {settings.email}
              </a>
            </ContactRow>
            <ContactRow icon={Clock}>{settings.hours}</ContactRow>
          </ul>
        </div>
      </Container>

      {/* bottom bar */}
      <Container className="flex flex-col items-start gap-5 py-[30px] bxt:flex-row bxt:items-center bxt:gap-10">
        <p className="flex-1 text-sm leading-5 text-bx-muted">{fmt(t.footer.copyright, { year: new Date().getFullYear() })}</p>
        <nav className="flex flex-wrap gap-x-5 gap-y-2" aria-label={t.footer.bottomNav}>
          {bottomLinks.map((l) => (
            <FooterLink key={l.href} href={l.href}>
              {l.label}
            </FooterLink>
          ))}
          <ManageCookiesButton className="group/fl relative w-fit text-sm leading-5 text-bx-muted transition-colors duration-300 bx-ease hover:text-white">
            {t.legal.manage}
            <span className="absolute start-0 top-[19px] h-px w-0 bg-white transition-all duration-300 bx-ease group-hover/fl:w-full" />
          </ManageCookiesButton>
        </nav>
      </Container>
    </footer>
  );
}

