import { Building2, Mail, Phone } from "lucide-react";
import { getI18n } from "@/i18n/server";
import { Reveal } from "./reveal";
import { Container, H3, SECTION_Y } from "./ui";

const ICON_COLOR = "#636982";

/** White/80 + blur "glass" card shared by the three info tiles. */
const TILE = "rounded-[10px] border border-bx-line/60 bg-white/80 backdrop-blur-md";

function InfoRow({
  icon: Icon,
  label,
  caption,
  href,
}: {
  icon: typeof Phone;
  label: string;
  caption: string;
  href: string;
}) {
  return (
    <a
      href={href}
      className={`${TILE} flex items-center justify-between gap-4 px-6 py-[19px] transition-colors duration-300 bx-ease hover:bg-white`}
    >
      <div className="flex flex-col gap-[3px]">
        <span className="text-base font-bold leading-[26px] text-bx-navy">{label}</span>
        <span className="text-sm leading-[22px] text-bx-ink">{caption}</span>
      </div>
      <Icon size={20} strokeWidth={1.5} color={ICON_COLOR} aria-hidden className="shrink-0" />
    </a>
  );
}

/**
 * "Comfort and performance await" section, cloned from boxcars.framer.website:
 * centered heading over a desaturated Google Maps embed (grayscale + raised
 * brightness/contrast — mix-blend-mode is unreliable on cross-origin iframes),
 * with office/phone/email tiles
 * overlapping the bottom, centered as a group.
 */
export async function MapVisit({
  address,
  phone,
  email,
}: {
  address: string;
  phone: string;
  email: string;
}) {
  const { t } = await getI18n();
  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;
  const tel = `tel:${phone.replace(/\s+/g, "")}`;
  const addressLines = address.split(",").map((l) => l.trim());

  return (
    <section className={`bg-white ${SECTION_Y}`}>
      <Container className="flex flex-col gap-10">
        <Reveal y={24} className="flex flex-col items-center gap-2.5 text-center">
          <h3 className={`${H3} text-bx-navy`}>{t.visit.title}</h3>
          <p className="text-[15px] leading-6 text-bx-ink">{t.visit.subtitle}</p>
        </Reveal>

        <Reveal y={20}>
          <div className="relative h-[520px] overflow-hidden rounded-2xl bg-bx-soft bxt:h-[600px] bxd:h-[622px]">
            <iframe
              src={mapSrc}
              title={t.visit.mapTitle}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 h-full w-full border-0 grayscale contrast-75 brightness-125"
            />

            {/* Tiles: stacked full-width on mobile, centered overlapping group from bxd up. */}
            <div className="absolute inset-x-0 bottom-0 flex flex-col gap-4 p-4 bxd:inset-x-auto bxd:left-1/2 bxd:w-[678px] bxd:-translate-x-1/2 bxd:flex-row bxd:gap-6 bxd:p-0">
              <div className={`${TILE} flex flex-1 flex-col gap-1 p-6 bxd:w-[351px] bxd:flex-none`}>
                <span className="text-base font-bold leading-[26px] text-bx-navy">{t.visit.officeLabel}</span>
                <div className="flex flex-col text-sm leading-[22px] text-bx-ink">
                  {addressLines.map((line) => (
                    <span key={line}>{line}</span>
                  ))}
                </div>
                <Building2 size={20} strokeWidth={1.5} color={ICON_COLOR} aria-hidden className="mt-1" />
              </div>

              <div className="flex flex-1 flex-col gap-4 bxd:w-[303px] bxd:flex-none">
                <InfoRow icon={Phone} label={phone} caption={t.visit.callLabel} href={tel} />
                <InfoRow icon={Mail} label={email} caption={t.visit.emailLabel} href={`mailto:${email}`} />
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

export default MapVisit;
