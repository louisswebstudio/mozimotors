import { Star } from "lucide-react";
import type { Testimonial } from "@/lib/types";

function initials(name: string) {
  return name.split(/\s+/).map((p) => p[0]).slice(0, 2).join("").toUpperCase();
}

function Card({ t }: { t: Testimonial }) {
  return (
    <figure className="flex w-[340px] shrink-0 flex-col rounded-3xl bg-white p-6 shadow-card ring-1 ring-line">
      <div className="flex gap-0.5 text-amber-400">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} className={`size-4 ${i < t.rating ? "fill-current" : "text-line"}`} />
        ))}
      </div>
      <blockquote className="mt-4 line-clamp-6 text-[15px] leading-relaxed text-ink-2">“{t.text}”</blockquote>
      <figcaption className="mt-auto flex items-center gap-3 pt-5">
        <span className="grid size-10 place-items-center rounded-full bg-ink text-sm font-bold text-white">{initials(t.name)}</span>
        <span>
          <span className="block text-sm font-bold text-ink">{t.name}</span>
          {t.city && <span className="block text-xs text-muted">{t.city}</span>}
        </span>
      </figcaption>
    </figure>
  );
}

export function Testimonials({ items }: { items: Testimonial[] }) {
  if (!items.length) return null;
  const loop = [...items, ...items];
  return (
    <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]">
      <div className="flex w-max gap-5 py-2 animate-marquee">
        {loop.map((t, i) => (
          <Card key={`${t.id}-${i}`} t={t} />
        ))}
      </div>
    </div>
  );
}
