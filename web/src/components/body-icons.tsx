import type { BodyType } from "@/lib/types";

/** Minimal line silhouettes, one per body type. */
const PATHS: Record<BodyType, string> = {
  suv: "M6 30h52M8 30v-8l6-9h26l10 9h6v8M16 13v9M30 13v9",
  berline: "M4 30h56M6 30v-6l10-3 8-7h16l10 7 8 2v7M24 14l-2 7M40 14l2 7",
  break: "M4 30h56M6 30v-6l10-3 8-8h30v17M24 13l-2 8M40 13v8",
  citadine: "M10 30h44M12 30v-7l8-9h18l10 9h4v7M28 14v9",
  compacte: "M8 30h48M10 30v-6l9-3 7-8h18l8 8h4v9M28 13v8",
  monospace: "M6 30h52M8 30v-8l10-10h32l6 10v8M26 12v10M40 12v10",
  coupe: "M4 30h56M6 30v-5l14-4 10-7h12l12 7 6 2v7M32 14v7",
  cabriolet: "M4 30h56M6 30v-6l14-3h6l4-5M30 21h24l4 2v7",
  pickup: "M4 30h56M6 30v-8l6-9h18v9h28v8M30 13v9",
  utilitaire: "M4 30h56M6 30v-8l8-12h42v20M18 10v12M36 10v20",
};

export function BodyIcon({ type, className = "" }: { type: BodyType; className?: string }) {
  return (
    <svg viewBox="0 0 64 40" className={className} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d={PATHS[type]} />
      <circle cx="18" cy="30" r="4.5" fill="var(--color-cream, #fff)" />
      <circle cx="46" cy="30" r="4.5" fill="var(--color-cream, #fff)" />
    </svg>
  );
}
