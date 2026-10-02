/** « Ce que nos clients disent de nous »: snap-scrolling review cards (siaracash.ma), fed with MoziMotors reviews. */
import type { Testimonial } from "@/lib/types";
import { getV2 } from "./server-locale";

const STAR =
  "M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z";

function Stars({ rating }: { rating: number }) {
  const r = Math.max(0, Math.min(5, Math.round(rating)));
  return (
    <div className="flex items-center gap-0.5" aria-label={`${r} / 5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <svg
          key={i}
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={i < r ? 0 : 1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`lucide lucide-star lg:size-5 ${i < r ? "size-[18px] fill-[#fabb06] text-[#fabb06]" : "size-[18px] fill-none text-[#fabb06]/40"}`}
          aria-hidden="true"
        >
          <path d={STAR} />
        </svg>
      ))}
    </div>
  );
}

/** One review card (also used by the car page « Ils nous ont fait confiance »). */
export function ReviewCard({ t }: { t: Testimonial }) {
  return (
    <figure className="flex h-[188px] w-[300px] flex-shrink-0 snap-start items-stretch gap-4 rounded-[18px] border border-[color:var(--color-line-soft)] bg-white p-5 shadow-[0_4px_18px_rgba(42,53,71,0.06)] transition-shadow hover:shadow-[0_8px_28px_rgba(42,53,71,0.10)] lg:h-[210px] lg:w-[360px] lg:gap-5 lg:p-6">
      <figcaption className="flex w-[92px] shrink-0 flex-col items-center justify-center gap-2 text-center lg:w-[104px]">
        <span className="relative block size-16 lg:size-[76px]">
          {t.avatar ? (
            <img alt={t.name} width="76" height="76" className="size-full rounded-full object-cover object-top" src={t.avatar} />
          ) : (
            <span className="grid size-full place-items-center rounded-full bg-[color:var(--color-brand-purple-soft)] text-[24px] font-bold text-[color:var(--color-brand-purple)]">
              {t.name.trim().charAt(0).toUpperCase()}
            </span>
          )}
        </span>
        <span className="min-w-0">
          <span className="block text-[14px] font-bold leading-tight text-[color:var(--color-brand-dark)] lg:text-[15px]">{t.name}</span>
          {t.city && <span className="mt-0.5 block text-[11.5px] leading-tight text-[color:var(--color-ink-muted)]">{t.city}</span>}
        </span>
      </figcaption>
      <div className="flex min-w-0 flex-1 flex-col">
        <Stars rating={t.rating} />
        <blockquote className="review-scroll mt-2 min-h-0 flex-1 overflow-y-auto pe-2 text-[13.5px] leading-relaxed text-[color:var(--color-brand-dark)] lg:text-[14.5px]">
          {t.text}
        </blockquote>
      </div>
    </figure>
  );
}

export async function Testimonials({ testimonials, title = "Ce que nos clients disent de nous" }: { testimonials: Testimonial[]; title?: string }) {
  if (!testimonials.length) return null;
  const { t } = await getV2();
  return (
    <section className="bg-white py-[24px] lg:py-[64px]">
      <div className="mx-auto w-full max-w-[362px] px-5 lg:px-12 lg:max-w-[1280px]">
        <div className="flex w-full flex-col items-center gap-[20px] lg:gap-[32px] py-[8px]">
          <h2 className="w-full text-center font-bold text-[18px] lg:text-[28px] leading-[1.1] text-[color:var(--color-brand-purple)]">{t(title)}</h2>
          <div className="w-full flex gap-[20px] overflow-x-auto scroll-smooth scrollbar-hide snap-x snap-mandatory pb-1">
            {testimonials.map((r) => (
              <ReviewCard key={r.id} t={r} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
