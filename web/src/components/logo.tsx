import Link from "next/link";

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2 shrink-0" aria-label="MoziMotors — accueil">
      <span className="grid size-9 place-items-center rounded-xl bg-brand text-white shadow-[0_6px_16px_-6px_var(--color-brand)]">
        <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 17V7l8 7 8-7v10" />
        </svg>
      </span>
      <span className={`font-display text-xl font-bold tracking-tight ${light ? "text-white" : "text-ink"}`}>
        Mozi<span className="text-brand">Motors</span>
      </span>
    </Link>
  );
}
