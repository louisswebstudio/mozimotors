/** « Contactez-nous »: three cards with a teal edge (call / email / visit), MoziMotors contact settings. */
import type { SiteSettings } from "@/lib/types";
import { Mail, MapPin, Phone } from "lucide-react";
import { telLink } from "./assets";
import { getV2 } from "./server-locale";

const CARD = "group relative flex flex-col justify-center overflow-hidden rounded-[16px] border bg-white ps-6 pe-4 py-5 md:rounded-[20px] md:ps-8 md:py-6";

export async function ContactCards({ settings }: { settings: SiteSettings }) {
  const { t } = await getV2();
  const mapsUrl = settings.mapsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(settings.address)}`;
  const cards = [
    { icon: Phone, title: t("Appelez-nous"), value: settings.phone, href: telLink(settings.phone) },
    { icon: Mail, title: t("Écrivez-nous"), value: settings.email, href: `mailto:${settings.email}` },
    { icon: MapPin, title: t("Venez nous rendre visite"), value: settings.address, href: mapsUrl, external: true },
  ];
  return (
    <section className="bg-white py-6 lg:py-14">
      <section className="pb-10 md:pb-14">
        <div className="container mx-auto max-w-6xl px-5 sm:px-6">
          <h2 className="text-[18px] font-bold tracking-tight md:text-2xl" style={{ color: "#050B20" }}>
            {t("Contactez-nous")}
          </h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3 md:mt-5 md:gap-5">
            {cards.map((c) => (
              <a
                key={c.title}
                href={c.href}
                aria-label={`${c.title} — ${c.value}`}
                className={CARD}
                style={{ borderColor: "var(--color-line-soft)" }}
                {...(c.external ? { target: "_blank", rel: "noopener" } : {})}
              >
                <span aria-hidden="true" className="absolute inset-y-4 start-0 w-1.5 rounded-e-full bg-[color:var(--color-brand-teal)]" />
                <span className="flex items-center gap-4">
                  <span
                    aria-hidden="true"
                    className="grid size-12 shrink-0 place-items-center rounded-full bg-[color:var(--color-brand-teal-soft)] text-[color:var(--color-brand-teal)] mz-icon-hover transition-colors"
                  >
                    <c.icon className="size-5" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[17px] font-bold md:text-[20px]" style={{ color: "#050B20" }}>
                      {c.title}
                    </span>
                    <span className="mt-1 block truncate text-[14px] md:text-[15px] group-hover:underline" style={{ color: "var(--color-ink-muted)" }}>
                      {c.value}
                    </span>
                  </span>
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>
    </section>
  );
}
