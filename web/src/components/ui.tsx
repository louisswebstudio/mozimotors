import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function SectionHead({
  eyebrow,
  title,
  sub,
  href,
  cta = "Tout afficher",
  center = false,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  sub?: string;
  href?: string;
  cta?: string;
  center?: boolean;
}) {
  return (
    <div className={`mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between ${center ? "sm:flex-col sm:items-center text-center" : ""}`}>
      <div className={center ? "mx-auto max-w-2xl" : "max-w-2xl"}>
        {eyebrow && <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-brand">{eyebrow}</p>}
        <h2 className="font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">{title}</h2>
        {sub && <p className="mt-3 text-base leading-relaxed text-muted">{sub}</p>}
      </div>
      {href && (
        <Link href={href} className="group inline-flex shrink-0 items-center gap-1.5 text-sm font-bold text-ink hover:text-brand">
          {cta} <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  );
}

export function Button({
  href,
  children,
  variant = "primary",
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "dark" | "ghost" | "light";
  className?: string;
}) {
  const styles = {
    primary: "bg-brand text-white hover:bg-brand-600 shadow-[0_10px_24px_-10px_var(--color-brand)]",
    dark: "bg-ink text-white hover:bg-ink-2",
    ghost: "bg-transparent text-ink ring-1 ring-ink/15 hover:bg-white",
    light: "bg-white text-ink hover:bg-sand",
  }[variant];
  return (
    <Link href={href} className={`inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-[15px] font-bold transition ${styles} ${className}`}>
      {children}
    </Link>
  );
}
