import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { Logo } from "./logo";
import type { SiteSettings } from "@/lib/types";

const COLS = [
  {
    title: "Acheter",
    links: [
      ["Toutes les voitures", "/acheter"],
      ["SUV", "/acheter?body=suv"],
      ["Berlines", "/acheter?body=berline"],
      ["Hybrides & électriques", "/acheter?fuel=hybride"],
      ["Moins de 150 000 DH", "/acheter?maxPrice=150000"],
    ],
  },
  {
    title: "Services",
    links: [
      ["Vendre ma voiture", "/vendre"],
      ["Financement", "/financement"],
      ["Inspection 140 points", "/pourquoi-mozimotors"],
      ["Contact", "/contact"],
    ],
  },
];

export function Footer({ settings }: { settings: SiteSettings }) {
  return (
    <footer className="bg-ink text-white/80">
      <div className="container-x grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.3fr]">
        <div className="space-y-5">
          <Logo light />
          <p className="max-w-sm text-sm leading-relaxed text-white/60">
            La façon la plus simple et la plus sûre d&apos;acheter ou de vendre une voiture d&apos;occasion au Maroc.
            Inspection, financement et démarches&nbsp;: on s&apos;occupe de tout.
          </p>
          <div className="flex gap-3 text-sm">
            {settings.instagram && (
              <a href={settings.instagram} className="rounded-full border border-white/15 px-4 py-2 hover:bg-white/10" target="_blank" rel="noreferrer">
                Instagram
              </a>
            )}
            {settings.facebook && (
              <a href={settings.facebook} className="rounded-full border border-white/15 px-4 py-2 hover:bg-white/10" target="_blank" rel="noreferrer">
                Facebook
              </a>
            )}
          </div>
        </div>
        {COLS.map((col) => (
          <div key={col.title}>
            <h3 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-white">{col.title}</h3>
            <ul className="space-y-2.5 text-sm">
              {col.links.map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="hover:text-white">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div>
          <h3 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-white">Nous contacter</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex gap-3">
              <Phone className="size-4 mt-0.5 text-brand shrink-0" />
              <a href={`tel:${settings.phone.replace(/\s/g, "")}`} className="hover:text-white">{settings.phone}</a>
            </li>
            <li className="flex gap-3">
              <Mail className="size-4 mt-0.5 text-brand shrink-0" />
              <a href={`mailto:${settings.email}`} className="hover:text-white">{settings.email}</a>
            </li>
            <li className="flex gap-3">
              <MapPin className="size-4 mt-0.5 text-brand shrink-0" />
              <span>
                {settings.address}
                <br />
                <span className="text-white/50">{settings.hours}</span>
              </span>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-x flex flex-col gap-2 py-6 text-xs text-white/40 sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} MoziMotors. Tous droits réservés.</p>
          <p>Mentions légales · Confidentialité · CGU</p>
        </div>
      </div>
    </footer>
  );
}
