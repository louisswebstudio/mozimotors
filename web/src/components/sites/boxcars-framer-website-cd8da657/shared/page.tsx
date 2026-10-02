/**
 * Inner-page template from boxcars.framer.website (/vehicles, /contact, /services…):
 * navy band under the absolute nav, then a white sheet with 70px rounded top corners.
 * Research: docs/research/boxcars-framer-website-cd8da657/root-8a5edab2/raw/inner-*
 */
import Image from "next/image";
import { Reveal } from "../root-8a5edab2/reveal";
import { BxButton, Container, Eyebrow } from "../root-8a5edab2/ui";

/** Navy spacer for the nav (86px mobile / 104px ≥810) + rounded white sheet. */
export function PageSheet({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-bx-navy pt-[86px] bxt:pt-[104px]">
      <div className="rounded-t-[50px] bg-white pt-[50px] bxt:rounded-t-[70px] bxt:pt-[70px]">{children}</div>
    </div>
  );
}

/** Page H1: same scale as section H3 (40/52 desktop, 32 tablet, 28 mobile). */
export const H1 =
  "text-[28px] font-bold leading-[1.3] text-bx-navy bxt:text-[32px] bxd:text-[40px] bxd:leading-[52px]";

/** Card-level heading used on detail pages ("Car Overview"): 26px/33.8px 500. */
export const H5 = "text-[22px] font-medium leading-[1.3] text-bx-navy bxd:text-[26px] bxd:leading-[33.8px]";

/**
 * Page intro. Two layouts from Boxcars:
 * - `aside` (short text): eyebrow + H1 left, 15px paragraph bottom-right (/vehicles, /contact).
 * - `lead` + `text`: eyebrow + H1 left half, 20px/26px lead + 15px paragraph right half (/services, /about).
 * Padding 20px 0 (+ bottom 90/60/30 unless `tight`).
 */
export function PageIntro({
  eyebrow,
  title,
  aside,
  lead,
  text,
  tight = false,
  children,
}: {
  eyebrow: string;
  title: string;
  aside?: React.ReactNode;
  lead?: string;
  text?: React.ReactNode;
  tight?: boolean;
  children?: React.ReactNode;
}) {
  const split = Boolean(lead || text);
  return (
    <section className={`bg-white pt-5 ${tight ? "pb-0" : "pb-[30px] bxt:pb-[60px] bxd:pb-[90px]"}`}>
      <Container className="flex flex-col gap-[30px] bxt:gap-10">
        {/* Centred: eyebrow + H1, then the aside / lead + text underneath. */}
        <div className="flex flex-col items-center gap-4 text-center">
          <Reveal y={24} className="flex flex-col items-center gap-2.5">
            <Eyebrow>{eyebrow}</Eyebrow>
            <h1 className={`${H1} max-w-[900px] text-balance`}>{title}</h1>
          </Reveal>
          {split ? (
            <Reveal y={20} className="flex max-w-[680px] flex-col gap-4">
              {lead && <p className="text-lg font-medium leading-[1.3] text-bx-navy bxd:text-xl bxd:leading-[26px]">{lead}</p>}
              {text && <div className="text-[15px] leading-6 text-bx-ink">{text}</div>}
            </Reveal>
          ) : (
            aside && (
              <Reveal y={20} className="max-w-[560px] text-[15px] leading-6 text-bx-ink">
                {aside}
              </Reveal>
            )
          )}
        </div>
        {children}
      </Container>
    </section>
  );
}

/**
 * Services row (Boxcars /services "Financing", "Trade-in"…): image half + lavender content half,
 * 650px tall on desktop, sticky at top 100px on ≥810 so consecutive rows stack like cards.
 */
export function FeatureRow({
  image,
  imageAlt,
  eyebrow,
  title,
  text,
  bullets,
  cta,
  reverse = false,
  sticky = true,
}: {
  image: string;
  imageAlt: string;
  eyebrow: string;
  title: string;
  text: React.ReactNode;
  bullets?: string[];
  cta?: { label: string; href: string };
  reverse?: boolean;
  sticky?: boolean;
}) {
  return (
    <section className={`bg-white ${sticky ? "bxt:sticky bxt:top-[100px]" : ""}`}>
      <Container>
        <div className={`flex flex-col overflow-hidden rounded-2xl bxt:h-[650px] bxt:flex-row ${reverse ? "bxt:flex-row-reverse" : ""}`}>
          <div className="relative h-[300px] bxt:h-auto bxt:flex-1">
            <Image src={image} alt={imageAlt} fill sizes="(min-width:810px) 50vw, 100vw" className="bx-parallax object-cover" />
          </div>
          <div className="flex flex-col justify-center gap-[30px] bg-bx-lavender p-[30px] bxt:flex-1 bxd:p-[60px]">
            <div className="flex flex-col items-start gap-[15px]">
              <Eyebrow>{eyebrow}</Eyebrow>
              <h2 className={H1}>{title}</h2>
              <div className="text-[15px] leading-6 text-bx-ink">{text}</div>
            </div>
            {bullets && bullets.length > 0 && (
              <ul className="flex flex-col gap-[15px]">
                {bullets.map((b) => (
                  <li key={b} className="flex items-start gap-[5px] text-[15px] leading-6 text-bx-ink">
                    <CheckBadge />
                    {b}
                  </li>
                ))}
              </ul>
            )}
            {cta && (
              <div>
                <BxButton href={cta.href}>{cta.label}</BxButton>
              </div>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}

/** 18px badge-check (Boxcars benefit bullet). */
export function CheckBadge({ className = "mt-[3px] size-[18px] shrink-0" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="#050B20" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

/** White card with 1px #E1E1E1 border and 16px radius (detail sidebar, contact info, calculator). */
export function Card({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return <div className={`rounded-2xl border border-bx-line bg-white ${className}`}>{children}</div>;
}
