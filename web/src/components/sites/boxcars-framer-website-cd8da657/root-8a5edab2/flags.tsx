/** Flags for every language we may offer (Arabic uses Morocco's flag — the site's market). */
export type FlagCode = "fr" | "en" | "ar";

/**
 * Small inline flag SVGs for the language picker. Flag emoji (🇫🇷 etc.) render
 * as boxed two-letter codes on Windows without a color-emoji font, so this
 * draws them instead — reliable everywhere, no font dependency.
 */
function FlagFr({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 3 2" className={className} aria-hidden>
      <rect width="1" height="2" fill="#002395" />
      <rect x="1" width="1" height="2" fill="#fff" />
      <rect x="2" width="1" height="2" fill="#ED2939" />
    </svg>
  );
}

function FlagMa({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 3 2" className={className} aria-hidden>
      <rect width="3" height="2" fill="#C1272D" />
      <g transform="translate(1.5 1)" fill="none" stroke="#006233" strokeWidth="0.09">
        <path d="M0,-0.5 L0.14,-0.17 L0.5,-0.15 L0.22,0.07 L0.31,0.42 L0,0.22 L-0.31,0.42 L-0.22,0.07 L-0.5,-0.15 L-0.14,-0.17 Z" />
      </g>
    </svg>
  );
}

function FlagGb({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 40" className={className} aria-hidden>
      <rect width="60" height="40" fill="#012169" />
      <path d="M0,0 60,40 M60,0 0,40" stroke="#fff" strokeWidth="7" />
      <path d="M0,0 60,40 M60,0 0,40" stroke="#C8102E" strokeWidth="3" />
      <path d="M30,0 V40 M0,20 H60" stroke="#fff" strokeWidth="11" />
      <path d="M30,0 V40 M0,20 H60" stroke="#C8102E" strokeWidth="6" />
    </svg>
  );
}

const FLAGS: Record<FlagCode, (props: { className?: string }) => React.ReactElement> = {
  fr: FlagFr,
  ar: FlagMa,
  en: FlagGb,
};

export function Flag({ code, className = "size-full" }: { code: FlagCode; className?: string }) {
  const Cmp = FLAGS[code];
  return <Cmp className={className} />;
}
