# BuySellBanners + HowItWorks Specification

## Overview
- **Target files:** `.../root-8a5edab2/BuySellBanners.tsx`, `.../HowItWorks.tsx`
- **Screenshots:** `desktop/04-buyer-and-seller-banner-section.png`, `desktop/05-how-it-works-section.png`, mobile in `mobile/_sheet-a.png` (columns 3-4)
- **Interaction model:** banners static + reveal; How It Works **scroll-driven with CSS `position:sticky`** (no JS).

## BuySellBanners
- Section padding 0 0 90px (tablet 0 0 60, mobile 0 0 30). Container: desktop row gap 20px; mobile column gap 20px (tablet stays row).
- Each card (flex:1): height 400px (mobile 325px), radius 16, overflow hidden, relative.
  - `next/image fill object-cover` with `objectPosition` from BANNERS[i].
  - Overlay #050B20 opacity .5.
  - Content absolute inset 0, column centered, gap 30px, padding 0 20px, text centered:
    - Head gap 10px (reveal y 24): h4 30px/39px DM Sans 700 white (tablet 24px/31px, mobile 22px/29px); p 14px/20px 400 white.
    - Action (reveal y 20): `BxButton white`.

## HowItWorks (`id={HOW.id}` on section)
- Section: `background: linear-gradient(#EEF1FB 0%, #FFFFFF 100%)`, padding 90px 0 (tablet 60, mobile 30). Container desktop/tablet = row, items-start; mobile = column gap 30px.
- Left column (flex 1, i.e. 648px at 1440; tablet ~half): `position:sticky; top:50px` (only ≥810px; static on mobile). Inner padding-right 180px desktop (tablet 30px, mobile 0), column gap 30px. Reveal y 24 for the head, y 20 for the avatar row + button.
  - Head gap 15px: `Eyebrow` HOW.eyebrow; h3 using `H3` class (40/52 desktop); p 15px/24px #202124.
  - Avatar row gap 15px: stack of 3 circles 49×49, overlapping (left offsets 0, 35.5px, 73px → container 122px wide), each with 2px white border, object-cover; then text 15px/24px #202124 HOW.teamLabel.
  - `BxButton primary` HOW.cta.
- Right column (flex 1): column, items-end (desktop/tablet), gap 30px. Reveal with x 20 (slide from right).
  - Each step: wrapper `position:sticky; top:50px` (≥810px only) width 500px desktop (tablet 100%, mobile 100%).
  - Card: bg white, radius 16, padding 6px 6px 0, column. Image box: height 241px (mobile 224px), radius 12, overflow hidden, `next/image fill object-cover`. Number h2 absolutely top 20px right 20px: 52px/67.6px DM Sans 700 white (tablet & mobile 40px/52px).
  - Content padding 20px 60px 20px 20px (mobile 20px), gap 10px: h5 20px/26px 500 #050B20 (mobile 18px, tablet 17px); p 15px/24px #202124.
  - The stacking effect: all 4 wrappers are sticky at the same top (50px) inside the right column, so later cards scroll over earlier ones. Give each card a subtle `box-shadow: 0 -2px 20px rgba(5,11,32,.04)` is NOT in the source — do not add. Keep bg white so covering is opaque.

## Props
```ts
BuySellBanners()   // uses BANNERS
HowItWorks()       // uses HOW
```
