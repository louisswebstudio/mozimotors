/**
 * Shared primitives for the Boxcars-style homepage.
 * Values come from docs/research/boxcars-framer-website-cd8da657/root-8a5edab2.
 */
import Link from "@/i18n/link";
import { Reveal } from "./reveal";

export const ASSETS = "/sites/boxcars-framer-website-cd8da657/root-8a5edab2";

/** 9×9 diagonal arrow used in every Boxcars button; mirrored (↖) in right-to-left pages. */
export function ArrowIcon({ className = "size-[9px]" }: { className?: string }) {
  return (
    <svg viewBox="0 0 9.096 9.096" className={`${className} rtl:-scale-x-100`} fill="currentColor" aria-hidden>
      <path d="M8.551 0H1.612a.375.375 0 0 0 0 .75h6.204L.121 8.445a.375.375 0 1 0 .53.53l7.695-7.695v6.204a.375.375 0 0 0 .75 0V.545A.545.545 0 0 0 8.551 0Z" />
    </svg>
  );
}

type Variant = "primary" | "white" | "white-border" | "link";

/**
 * Boxcars button.
 * - primary: #405FF2 → #0146A6 on hover, white text
 * - white: white bg, navy text → #405FF2 bg, white text on hover
 * - white-border: transparent, 1px #E1E1E1 border, white text → white bg, navy text
 * - link ("No-Bg"): navy text → #405FF2 + 1px underline that grows from 0 to full width
 * 10px 24px padding, 12px radius, 15px/24px DM Sans 500, 8px gap to the arrow.
 */
export function BxButton({
  href,
  children,
  variant = "primary",
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
}) {
  const base =
    "group/btn relative inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap text-[15px] font-medium leading-6 transition-colors duration-300 bx-ease";
  const styles: Record<Variant, string> = {
    primary: "rounded-xl bg-bx-blue px-6 py-2.5 text-white hover:bg-bx-blue-hover",
    white: "rounded-xl bg-white px-6 py-2.5 text-bx-navy hover:bg-bx-blue hover:text-white",
    "white-border":
      "rounded-xl border border-bx-line bg-white/0 px-6 py-2.5 text-white hover:bg-white hover:text-bx-navy",
    link: "text-bx-navy hover:text-bx-blue",
  };
  return (
    <Link href={href} className={`${base} ${styles[variant]} ${className}`}>
      <span>{children}</span>
      <span className="grid size-[11px] place-items-center">
        <ArrowIcon />
      </span>
      {variant === "link" && (
        <span className="absolute start-0 top-[23px] h-px w-0 bg-bx-blue opacity-0 transition-all duration-300 bx-ease group-hover/btn:w-full group-hover/btn:opacity-100" />
      )}
    </Link>
  );
}

/** "• LABEL" eyebrow: 6px dot, 7px gap, 14px/20px 500 uppercase. */
export function Eyebrow({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <div className={`flex items-center gap-[7px] ${light ? "text-white" : "text-bx-navy"}`}>
      <span className={`size-1.5 rounded-full ${light ? "bg-white" : "bg-bx-navy"}`} />
      <p className="text-sm font-medium uppercase leading-5">{children}</p>
    </div>
  );
}

/** Section heading size: 40/52 desktop, 32/42 tablet, 28/36.4 mobile, 700, capitalize-free. */
export const H3 =
  "text-[28px] font-bold leading-[1.3] bxt:text-[32px] bxt:leading-[1.3] bxd:text-[40px] bxd:leading-[52px]";

/**
 * Standard section header, centred: eyebrow + H3, then the link (or subtitle) underneath.
 * Title group fades up 24px, the slot below fades up 20px.
 */
export function SectionHead({
  eyebrow,
  title,
  right,
}: {
  eyebrow: string;
  title: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="flex w-full flex-col items-center gap-4 text-center">
      <Reveal className="flex flex-col items-center gap-2.5" y={24}>
        <Eyebrow>{eyebrow}</Eyebrow>
        <h3 className={`${H3} max-w-[820px] text-balance text-bx-navy`}>{title}</h3>
      </Reveal>
      {right && (
        <Reveal y={20} className="flex justify-center">
          {right}
        </Reveal>
      )}
    </div>
  );
}

/** Centered 1356px container with 30px side padding (= 1296px content). */
export function Container({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return <div className={`mx-auto w-full max-w-[1356px] px-[30px] ${className}`}>{children}</div>;
}

/**
 * Giant brand watermark: the MoziMotors logo used as a mask over a vertical
 * gradient (Boxcars uses white 7% → 0%). Width fills its parent; keeps logo ratio.
 */
export function LogoWatermark({
  className = "",
  from = "rgba(255,255,255,0.07)",
  to = "rgba(255,255,255,0)",
}: {
  className?: string;
  from?: string;
  to?: string;
}) {
  const mask = "url(/brand/mozi-logo-white.png) center / contain no-repeat";
  return (
    <div
      aria-hidden
      className={`w-full ${className}`}
      style={{
        aspectRatio: "900 / 198",
        background: `linear-gradient(${from}, ${to})`,
        WebkitMask: mask,
        mask,
      }}
    />
  );
}

/** Section vertical rhythm: 90px desktop, 60px tablet, 30px mobile. */
export const SECTION_Y = "py-[30px] bxt:py-[60px] bxd:py-[90px]";
export const SECTION_T = "pt-[30px] bxt:pt-[60px] bxd:pt-[90px]";
