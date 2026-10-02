# TrustStory + Stats + Testimonials Specification

## Overview
- **Target files:** `.../root-8a5edab2/TrustStory.tsx`, `.../Stats.tsx`, `.../Testimonials.tsx` (client pieces as needed)
- **Screenshots:** `desktop/06-trust-story-section.png`, `desktop/07-business-statistics-section.png` (captured mid count-up), `desktop/08-customer-testimonials-section.png`, mobile in `mobile/_sheet-a.png` (column 5) 
- **Interaction models:** TrustStory click-to-play video; Stats scroll-triggered count-up; Testimonials click-driven slideshow (prev/next), no autoplay.

## TrustStory
- Section bg white, no vertical padding. Container desktop row (items stretch), height 650px; mobile column.
- Video half (flex 1): radius 16 0 0 16 (mobile 16 16 0 0), overflow hidden, height 650px (mobile 371px). `<video src={TRUST.video} muted loop playsInline preload="metadata" className="object-cover size-full">`. Centered play button: 60×60 white circle, radius 120, lucide `Play` 24px stroke 1.5 #050B20 (nudge +2px right). Click → `video.play()`, hide the button (fade .3s); clicking the video again pauses and shows it.
- Content half (flex 1): bg #EEF1FB, radius 0 16 16 0 (mobile 0 0 16 16), padding 60px (mobile 30px), column justify-center gap 30px.
  - Head gap 15px (reveal y 24): Eyebrow TRUST.eyebrow; h3 `H3`; p 15px/24px #202124.
  - List gap 15px (reveal y 20): each row gap 5px: lucide `BadgeCheck` 18px stroke 1.5 #050B20 + 15px/24px #202124 text (mobile: icon above text is how Framer wrapped; use a row with items-start instead).
  - `BxButton primary` TRUST.cta (reveal y 20).

## Stats
- Section padding 50px 0 (tablet 60, mobile 30). Container: desktop row justify-between (4 equal columns 324px); mobile grid 2×2 gap 30px 0.
- Each stat (reveal y 24, stagger .1s): column centered gap 10px. Value row: number 40px/40px DM Sans 600 #1A1A1A; if `star`, a 20px star (#405FF2, path below) 10px after the number. Label 15px/24px 400 #202124 uppercase.
- Count-up: when in view (IntersectionObserver, once), animate 0 → value over 2s ease-out with requestAnimationFrame; format with `decimals` (French decimal comma: `4,8`) and append suffix. Use `tabular-nums`? No — source is proportional.
- Star path (viewBox 0 0 20 19.97): `M4.645 12.77 3.589 19.242c-.084.514.465.9.919.648L10 16.855l5.492 3.036c.45.25 1.004-.129.919-.648l-1.056-6.472 4.467-4.579c.354-.362.151-.977-.353-1.054l-6.148-.939L10.565.329c-.206-.439-.925-.439-1.131 0L6.679 6.198l-6.148.939c-.505.078-.707.692-.353 1.054Z`

## Testimonials
- Section padding 90px 0 (tablet 60, mobile 30); border-top 1px #E1E1E1? No — the thin line at the very top of the screenshot is the Stats section edge; do not add. Container column gap 40px.
- Head: `SectionHead eyebrow title right={<p className="text-[15px] leading-6 text-bx-ink">subtitle</p>}` (desktop subtitle right-aligned; mobile left-aligned under the title).
- Slider: viewport overflow hidden; track flex gap 20px, translateX by index × (cardWidth + 20) with `transition: transform .5s cubic-bezier(.44,0,.56,1)`. Card width: desktop (1296−20)/2 = 638px (2 visible); tablet 100% (1 visible); mobile 100%. Measure with ResizeObserver or use CSS `calc((100% - 20px)/2)` and move by that + 20px. Loop: next from last goes to 0, prev from 0 goes to last page. Also support pointer drag/swipe (threshold 50px) with `cursor:grab`.
- Card: bg #EEF1FB, radius 16, padding 6px, row (mobile: column-reverse? no — mobile hides the image; show content only), height 355px desktop.
  - Content (flex 1): padding 20px 60px 20px 20px (mobile 20px), column justify-between gap 10px.
    - Top gap 10px: rating row: 5 stars 11px (#405FF2, gap 7px) + 10px + rating text 15px/24px #405FF2; title h6 18px/23.4px 500 #050B20 (mobile 16px); text 15px/24px #202124 (clamp 5 lines).
    - User row gap 10px: 50px circle avatar (img cover) or, if no avatar, a 50px circle bg #405FF2 white 16px 500 initials; name 16px/26px 500 #202124; meta 14px/20px #202124.
  - Image (desktop/tablet only): width 273px, radius 12, overflow hidden, `next/image fill object-cover`.
- Controls under the slider (margin-top 40px, left aligned, gap 10px): two 40px buttons using `<img>` of `${ASSETS}/icons/arrow-prev.svg` / `arrow-next.svg` (white circle with #E1E1E1 border and navy chevron), aria-labels REVIEWS.prev / REVIEWS.next.
- 11px star path (viewBox 0 0 11 10.983): `M2.555 7.023 1.974 10.583c-.046.283.256.495.506.356L5.5 9.27l3.021 1.67c.247.137.552-.071.505-.356l-.581-3.56 2.457-2.518c.195-.2.083-.538-.194-.58L7.327 3.409 5.811.181c-.113-.241-.509-.241-.622 0L3.674 3.409.292 3.925c-.278.043-.389.381-.194.58Z`

## Props
```ts
TrustStory()
Stats({ stats }: { stats: StatData[] })
Testimonials({ reviews }: { reviews: ReviewCardData[] })
```
