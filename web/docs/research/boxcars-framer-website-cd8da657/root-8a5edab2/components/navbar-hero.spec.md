# Navbar + Hero Specification

## Overview
- **Target files:** `src/components/sites/boxcars-framer-website-cd8da657/root-8a5edab2/Navbar.tsx` (client), `.../Hero.tsx` (server, may import client `HeroTitle`)
- **Screenshots:** `docs/design-references/boxcars-framer-website-cd8da657/root-8a5edab2/desktop/01-hero-section.png`, `mobile/01-hero-section.png`, `tablet/_menu-open.png`, `mobile/_menu-open.png`
- **Interaction model:** Navbar static + hover + click (hamburger). Hero time-driven (letter blur-in on load).

## Navbar DOM / styles
- Wrapper: `position:absolute; top:0; left:0; right:0; z-index:30` (sits over the hero; NOT sticky). Container padding 30px, content row height 44px, `justify-content:space-between; align-items:center; gap:30px`.
- Desktop (≥1200) three equal columns (`flex:1` each):
  - left: logo (MoziMotors white logo PNG `LOGO.white`, height 26px → width ≈118px) + 20px gap + search link: 18px search icon (lucide `Search`, strokeWidth 1.5, white) + 5px gap + text 15px/24px DM Sans 500 white. Links to `NAV_SEARCH.href`.
  - center: links row gap 20px, each 15px/24px 500 white. Hover: 1px white underline at top:23px grows from width 0/opacity 0 to 100%/opacity 1 (0.3s).
  - right (justify-end, gap 20px): phone (lucide `Phone` 18px, stroke 1.5, white + 10px gap + number 15px/24px 500 white, `tel:` link) and CTA button `BxButton variant="white-border"` (1px #E1E1E1 border, radius 12, padding 10px 24px; hover bg white, text #050B20).
- Tablet 810–1199: left = logo + search text; right = hamburger + CTA button (center links + phone hidden).
- Mobile <810: padding 30px, row height 26px; left = logo + 18px search icon only (no text); right = hamburger.
- Hamburger: 25×25 button, two 2px white bars: top bar 25px wide at top 6px; bottom bar 20px wide at top 16px, right-aligned. Open state: bars become an X (19px, rotated ±45°).
- Open panel (tablet & mobile): whole nav gets bg #050B20, column layout, gap 30px, padding 30px. Below the top row: list of links (gap 10px), each full-width, padding 14px 18px, radius 16px, text 17px/22.1px DM Sans 500 white (hover bg rgba(255,255,255,.05)). Then a "Get in touch" block with top border 1px rgba(255,255,255,.1), padding-top 30px, gap 20px: heading 21px/27.3px 500 white "Nous contacter", then row of items: 42px icon tile (bg rgba(255,255,255,.05), radius 16, 16px lucide icon stroke 1.5 white) + 14px/20px text #A5ADCA — phone and email (from props). Close menu on link click and on route change. Lock nothing else.

## Hero DOM / styles
- `section` height 900px on desktop and tablet, 900px on mobile too (min-height 100svh is not used). `overflow:hidden; position:relative`, bg image fill `object-fit:cover` (HERO.image, `preload`), overlay `#050B20` opacity .5 (z 1).
- Watermark (z 1, above overlay): absolutely positioned at top 108px, left/right 0, padding 30px 120px (mobile/tablet: 30px 30px), `overflow:hidden`, height 352px desktop (tablet 199, mobile 126). Inside: `LogoWatermark` (from ui.tsx) full width. Gradient white .07→0.
- Content (z 2): absolute inset 0, flex column centered, gap 30px.
  - Head (gap 10px, centered): `Eyebrow light` with text `HERO.eyebrow(count)`; h1: DM Sans 700, 70px/70px desktop, 50px/50px tablet & mobile, white, centered, max-width ~1000px desktop (mobile width = 330px). Letters animated: split into words (keep words together with `white-space:nowrap` inline spans, normal spaces between) and each letter in `<span class="bx-letter" style="--i:n">`. Use aria-label on h1 with the full text and aria-hidden on the letter spans.
  - Paragraph: Figtree 400 15px/25.95px white centered, max-width 618px (mobile 330px, 2–3 lines).
  - Actions: row gap 10px centered: `BxButton primary` (HERO.primary) and `BxButton white` (HERO.secondary). Wrap on mobile if needed (both fit at 390).
- Vehicle type links: absolute, bottom 0, left/right 0, padding-bottom 110px (mobile 100px), column centered gap 20px. Label Figtree 15px/25.95px white "Ou parcourir par type". Pills row gap 10px: each pill `bg rgba(255,255,255,.2)`, `backdrop-filter: blur(6px)`, 1px border rgba(255,255,255,.15), radius 60px, padding 8px 20px, gap 7px: 24px icon img (white svg from HERO.types[i].icon) + label 15px/24px DM Sans 400 white. Hidden on mobile (<810) — the mobile screenshot shows no pills.
- Bottom bar: absolute bottom 0, height 70px, full width, bg #F9FBFC, border-radius 70px 70px 0 0 (mobile 50px 50px 0 0), z 4 — this is the rounded top of the next section.

## Props
```ts
Navbar({ phone, email }: { phone: string; email: string })
Hero({ count }: { count: number })
```
Copy: import `NAV_LINKS, NAV_SEARCH, NAV_CTA, HERO, LOGO` from `./content`.

## Responsive summary
- Desktop 1440: as above. Tablet 810: h1 50px one line, pills visible. Mobile 390: h1 50px on 2-3 lines, paragraph 330px, pills hidden.
