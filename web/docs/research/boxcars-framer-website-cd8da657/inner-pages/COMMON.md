# Inner pages — common contract (Boxcars design, MoziMotors content)

Project: `web/` (Next.js 16.3 App Router, React 19, Tailwind v4, TS). Next 16: `next/image` uses `preload` (not `priority`); dynamic route props are Promises (`PageProps<"/route">`, `await params` / `await searchParams`).

Global chrome is already in `src/app/layout.tsx` (Boxcars Navbar — absolute, navy on inner pages — + SiteFooter + Lenis + WhatsApp FAB). Pages render ONLY their content.

## Building blocks (import, don't modify)
- `@/components/sites/boxcars-framer-website-cd8da657/shared/page` → `PageSheet` (wrap the whole page: navy band under the nav + white sheet with 70px rounded top), `PageIntro` (eyebrow + H1 + `aside` text right, or `lead` + `text` split layout; children render under the header inside the container), `FeatureRow` (image + lavender panel, 650px, sticky stacking), `CheckBadge`, `Card`, `H1`, `H5` class strings.
- `@/components/sites/boxcars-framer-website-cd8da657/root-8a5edab2/ui` → `BxButton` (primary|white|white-border|link), `Eyebrow`, `H3`, `SectionHead`, `Container` (max 1356, 30px padding), `SECTION_Y` (py 90/60/30), `SECTION_T`, `ArrowIcon`, `ASSETS` (image folder `/sites/boxcars-framer-website-cd8da657/root-8a5edab2`).
- `.../root-8a5edab2/reveal` → `Reveal` (fade-up on view; props y, x, delay, className, as).
- `.../root-8a5edab2/FeaturedVehicles` → `VehicleCard` ({ car: VehicleCardData, preload? }).
- `.../shared/vehicle` → `toVehicleCard(car, rate, months)`.
- Homepage sections are reusable as-is: `HowItWorks`, `TrustStory`, `Stats({stats})`, `Testimonials({reviews})`, `CtaBanner`, `Team`, `Faq` (homepage FAQ copy) and `FaqList({ items: {q,a}[] })` (client accordion) in `.../root-8a5edab2/`.
- `@/components/lead-form` → `LeadForm` (already Boxcars-styled; keep `type`/`fields`/`extra` API).

## Tokens (Tailwind)
bx-navy #050B20 · bx-ink #202124 (body text) · bx-blue #405FF2 · bx-blue-hover #0146A6 · bx-muted #A5ADCA · bx-line #E1E1E1 · bx-soft #F9FBFC · bx-lavender #EEF1FB · label grey #818181 · calculator grey bg #F4F6F9 · breakpoints `bxt:` ≥810, `bxd:` ≥1200 · fonts: DM Sans default, `font-bx-alt` Figtree.
Type scale: H1/H3 40/52 700 (32 tablet, 28 mobile) · card heading H5 26/33.8 500 · h6 18/23.4 500 · body 15/24 #202124 · small 14/20 · eyebrow 14/20 500 uppercase with 6px dot.
Radii: cards 16px, inputs/buttons 12px, pills 120px. Borders 1px #E1E1E1. Hover transitions .3s `bx-ease`.

## Rules
- Keep every existing feature, data source, link and SEO bit of the page (metadata, JSON-LD, generateStaticParams, URL filters, lead form types/fields).
- All copy French (MoziMotors voice). Reuse the page's current copy; write new French copy only where a Boxcars slot has no MoziMotors equivalent.
- Old orange design tokens (`brand`, `ink`, `sand`, `font-display`, `container-x`, `ring-line`…) must not be used in the pages you touch.
- Verify with `npx tsc --noEmit`; other builders edit other files concurrently — fix only your files. Do not run `next build`/`next dev`. Don't edit files outside your list.

Reference screenshots (Read tool): `docs/design-references/boxcars-framer-website-cd8da657/inner/view-*.png` (2-3 columns = one long page, left to right) and full-size `inner/*.png`. Raw computed-style dumps: `docs/research/boxcars-framer-website-cd8da657/root-8a5edab2/raw/inner-*-desktop/*.txt`.
