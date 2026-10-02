# CtaBanner + Team + Faq + Guides Specification

## Overview
- **Target files:** `.../root-8a5edab2/CtaBanner.tsx`, `.../Team.tsx`, `.../Faq.tsx` (client accordion part), `.../Guides.tsx`
- **Screenshots:** `desktop/09-find-your-car-cta-section.png`, `desktop/10-expert-team-section.png`, `desktop/11-frequently-asked-questions-section.png`, `desktop/12-car-advice-blog-section.png`, mobile in `mobile/_sheet-b.png`
- **Interaction models:** CTA static+reveal; Team static+reveal; FAQ click accordion + sticky intro; Guides hover.

## CtaBanner
- Section no padding. Container → card height 500px (mobile 401px), radius 16, overflow hidden, relative; `next/image fill object-cover` CTA.image + overlay #050B20 opacity .5.
- Content absolute inset 0, column centered, gap 30px, padding 60px (mobile 30px), centered text.
  - Head gap 10px (reveal y 24): Eyebrow light; h3 `H3` white; p Figtree 15px/25.95px white max-width 470px.
  - Actions (reveal y 20): row gap 10px (mobile column), `BxButton primary` + `BxButton white`.

## Team
- Section padding 90px 0 0 (tablet 60 0 0, mobile 30 0 0). Container column gap 40px.
- `SectionHead` with link right (TEAM.link).
- List (reveal y 24, each card stagger .08s): desktop 4 cols gap 20 (309px); tablet grid 2 cols; mobile 1 col.
- Card: bg #F9FBFC, radius 16, overflow hidden, column; height 415px (mobile 386px). Top padding 30px, gap 5px: name h5 20px/26px 500 #050B20 (mobile 18px); role 15px/24px #202124. Image area flex 1 (330px tall), portrait PNG (transparent bg) `object-contain object-bottom` 315×330 anchored bottom center.
- NOTE: names/photos are placeholders (roles as names); keep the markup data-driven from TEAM.members.

## Faq (`id="faq"`)
- Section padding 90px 0 0 (tablet 60px 0 0, mobile 30px 0 0). Container desktop row items-start; mobile column gap 30px.
- Intro (flex 1): `position:sticky; top:50px` on ≥810; inner padding-right 180px desktop (tablet 30px), gap 30px. Head gap 10px: Eyebrow; h3 `H3`; p 15px/24px #202124. `BxButton primary` FAQ.cta.
- List (flex 1, reveal x 20): column gap 20px.
  - Item: radius 16, padding 26px 30px (mobile 20px 24px), cursor pointer, 1px border. Closed: bg #F9FBFC, border #F9FBFC. Open: bg white, border #E1E1E1. Transition bg/border .3s.
  - Header row (a `<button aria-expanded>`, full width, gap 20px, text-left): question 18px/23.4px 500 #050B20 (mobile 16px); icon 12px diagonal arrow (path below, fill #050B20) rotated 135deg when closed (points down), rotate(-45deg) when open (points up); transition transform .3s.
  - Answer: 15px/24px #202124, 20px below the question. Animate height (grid-rows 0fr→1fr trick, .35s) + opacity.
  - One open at a time; first item open by default? Source loads with all closed → start all closed.
- FAQ arrow path (viewBox 0 0 12.128 12.128): `M11.401 0H2.149a.5.5 0 0 0 0 1h8.272L.161 11.26a.5.5 0 1 0 .707.707L11.128 1.707v8.272a.5.5 0 0 0 1 0V.727A.727.727 0 0 0 11.401 0Z`

## Guides
- Section padding 90px 0 (tablet 60, mobile 30). Container column gap 40px. `SectionHead` + link GUIDES.link.
- Grid (reveal y 24): desktop 3 cols gap 20 (419px); tablet 2 cols; mobile 1 col (gap 30).
- Card (`Link` to item.href, `group`): column gap 20px.
  - Image box height 280px (mobile 206px), radius 16, overflow hidden; `next/image fill object-cover` transition .4s, group-hover scale 1.05. Tag pill top 10 left 11 (same as vehicle tag: white, radius 120, padding 5px 10px, 4px navy dot, 12px/20px 500 uppercase).
  - Inner padding-right 60px (mobile 0), gap 10px: meta row gap 10px: author 14px/20px #202124, 3px navy dot, meta 14px/20px #202124; title h5 20px/26px 500 #050B20 (mobile 18px), hover color #405FF2.

## Props
```ts
CtaBanner(); Team(); Faq(); Guides();   // copy from ./content (CTA, TEAM, FAQ, GUIDES)
```
