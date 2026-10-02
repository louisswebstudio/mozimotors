/**
 * « Avis clients » — cloned from the Reviews section of drivio.framer.website:
 * centred title + subtitle, two infinite ticker rows (row 1 → left, row 2 → right) with
 * faded edges, translucent cards with a rating pill and a grey customer block.
 * Values: docs/research (Drivio extraction, section "Reviews").
 */
import Image from "next/image";
import { Star } from "lucide-react";
import type { Testimonial } from "@/lib/types";
import { Reveal } from "./reveal";
import { getI18n } from "@/i18n/server";
import type { I18n } from "@/i18n/core";

const initials = (name: string) =>
  name
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

function ReviewCard({ t, i18n }: { t: Testimonial; i18n: I18n }) {
  return (
    <li className="w-[320px] shrink-0 bxt:w-[363px]">
      <figure dir="auto" className="flex h-full flex-col gap-4 rounded-[10px] border border-[#e4e4ee] bg-white/80 p-3 backdrop-blur-[3px]">
        <div className="flex items-center justify-between gap-3 px-2">
          <p className="truncate text-xs leading-[19.2px] text-[#636982]">
            {i18n.t.reviews.clientIn} <strong className="font-bold text-bx-navy/80">{t.city ?? "MoziMotors"}</strong>
          </p>
          <span className="flex shrink-0 items-center gap-1 rounded-[99px] border border-[#e4e4ee] bg-white px-2.5 py-[5px] text-xs leading-[19.2px] text-black">
            <Star className="size-[15px] fill-[#f8a414] text-[#f8a414]" strokeWidth={1.5} aria-hidden />
            {i18n.decimal(t.rating)}
          </span>
        </div>
        <blockquote className="line-clamp-3 flex-1 px-2 text-base leading-[25.6px] text-black">{t.title ? `${t.title}. ` : ""}{t.text}</blockquote>
        <figcaption className="flex items-center gap-3 rounded-[10px] bg-[#f7f7fa] px-3 py-2">
          {t.avatar ? (
            <Image src={t.avatar} alt="" width={34} height={34} className="size-[34px] rounded-full object-cover" />
          ) : (
            <span className="grid size-[34px] shrink-0 place-items-center rounded-full bg-bx-blue text-xs font-medium text-white">
              {initials(t.name)}
            </span>
          )}
          <span className="min-w-0">
            <span className="block truncate text-sm leading-[22.4px] text-black">{t.name}</span>
            <span className="block text-xs leading-[19.2px] text-[#636982]">{i18n.t.reviews.verified}</span>
          </span>
        </figcaption>
      </figure>
    </li>
  );
}

/** One infinite row: the list is repeated to fill the track, then doubled for a seamless loop. */
function Row({ items, reverse = false, i18n }: { items: Testimonial[]; reverse?: boolean; i18n: I18n }) {
  const filled: Testimonial[] = [];
  while (filled.length < Math.max(6, items.length)) filled.push(...items);
  const loop = [...filled, ...filled];
  return (
    // The ticker's translateX(-50%) loop assumes left-to-right, so the track stays ltr; each card
    // re-detects its own text direction (dir="auto") so Arabic reviews still read correctly.
    <div dir="ltr" className="w-full max-w-[1140px] overflow-hidden [mask-image:linear-gradient(to_right,transparent_0%,black_12.5%,black_87.5%,transparent_100%)]">
      <ul
        className="animate-marquee flex w-max gap-6 py-2.5"
        style={{ animationDuration: `${filled.length * 9}s`, animationDirection: reverse ? "reverse" : "normal" }}
      >
        {loop.map((t, i) => (
          <ReviewCard key={`${t.id}-${i}`} t={t} i18n={i18n} />
        ))}
      </ul>
    </div>
  );
}

export async function ReviewsMarquee({
  testimonials,
  title,
  subtitle,
}: {
  testimonials: Testimonial[];
  title?: string;
  subtitle?: string;
}) {
  if (!testimonials.length) return null;
  const i18n = await getI18n();
  title ??= i18n.t.reviews.title;
  subtitle ??= i18n.t.reviews.subtitle;
  const second = [...testimonials].reverse();
  return (
    <section className="overflow-hidden bg-white px-[30px] py-[30px] bxt:py-[60px] bxd:py-24">
      <div className="mx-auto flex max-w-[1356px] flex-col items-center gap-12">
        <Reveal y={24} className="flex flex-col items-center gap-0.5 text-center">
          <h2 className="text-[28px] font-semibold leading-[1.4] text-black bxt:text-[36px] bxt:leading-[50.4px]">{title}</h2>
          <p className="text-base leading-[25.6px] text-[#636982]">{subtitle}</p>
        </Reveal>
        <div className="flex w-full flex-col items-center gap-6">
          <Row items={testimonials} i18n={i18n} />
          <Row items={second} reverse i18n={i18n} />
        </div>
      </div>
    </section>
  );
}
