# BrandsSection + FeaturedVehicles Specification

## Overview
- **Target files:** `.../root-8a5edab2/BrandsSection.tsx`, `.../FeaturedVehicles.tsx` (server components; may use `Reveal` client wrapper)
- **Screenshots:** `desktop/02-premium-brands-section.png`, `desktop/03-featured-vehicles-section.png`, `mobile/_sheet-a.png` (columns 1-2)
- **Interaction model:** static + scroll reveal + hover.

## BrandsSection
- Section bg #F9FBFC, padding 30px 0 90px desktop (tablet 60px 0, mobile 30px 0). `Container` inner, column gap 40px (mobile 30px).
- Head: `SectionHead eyebrow={BRANDS.eyebrow} title={BRANDS.title} right={<BxButton variant="link" href=…>}`.
- List (reveal y 24): desktop = flex row of 8 cards, gap 20px, each flex:1 (145×186 at 1440). Tablet: grid 4 cols gap 20. Mobile: grid 2 cols gap 20 (155px each, height 172px).
- Card (Link to brand.href): bg white, radius 16px, padding 30px 40px (mobile 30px 20px), column centered; 1px #E1E1E1 border; transition .3s. Logo box 100×100 (mobile 80×80) centered containing the brand svg rendered as a CSS mask filled with #050B20 so any logo color becomes navy: `<span style={{mask:url(logo) center/60% no-repeat}} className="bg-bx-navy group-hover:bg-bx-blue"/>` (size the glyph ~56px inside the 100px box). If `logo` undefined, render the brand initials in 28px DM Sans 700 navy. Label 16px/26px DM Sans 500 #202124, centered, single line (`whitespace-nowrap`).
- Hover: `box-shadow: 0 2px 8px rgba(5,11,32,.08)`, border #405FF2, label + logo #405FF2.

## FeaturedVehicles
- Section bg white, padding 90px 0 (tablet 60, mobile 30). Container column gap 40px (mobile 30px).
- Head: `SectionHead eyebrow={FEATURED.eyebrow} title={FEATURED.title} right={<BxButton variant="link">}`.
- Grid (reveal y 24): desktop 4 cols gap 20 (309px); tablet 2 cols; mobile 1 col.
- Card (`<Link href>` whole card, `group`): radius 16, overflow hidden, transition .3s; hover shadow `0 2px 8px rgba(5,11,32,.08)`.
  - Image area: height 206px (tablet 206, mobile 206), radius 16 16 0 0, overflow hidden, `next/image fill object-cover`, sizes `(min-width:1200px) 309px, (min-width:810px) 50vw, 100vw`; image transitions `transform .4s`, hover scale 1.05.
  - Tag pill: absolute top 10px left 11px, bg white, radius 120px, padding 5px 10px, gap 4px: 4px navy dot + text 12px/20px 500 uppercase #050B20.
  - Content: bg white, padding 20px, column gap 15px, border 1px #E1E1E1 on left/right/bottom (radius 0 0 16 16).
    - Head gap 5px: title h6 18px/23.4px 500 #050B20 (mobile 16px, tablet 14px... use 16px below 1200), single line ellipsis; hover color #405FF2. Sub-row: `year • version` 14px/20px #202124 — rendered as two p's separated by a 3px navy dot, gap 5px, ellipsis.
    - Spec row: padding 15px 0, border-top and border-bottom 1px #E1E1E1, gap 10px, items: 16px lucide icon (Gauge, Fuel, Settings; strokeWidth 1.5, #050B20) + 3px gap + 14px/20px #202124 text.
    - Bottom row (justify-between, items-end): price column gap 5px: price 20px/26px 500 #050B20 (mobile 18px); line `dès 5 116 DH/mois` 14px/20px #202124. Right: "Voir le détail" 15px/24px 500 #050B20 + 9px arrow (8px gap) with underline grow on card hover (use `group-hover`), not a nested link.

## Props
```ts
BrandsSection({ brands }: { brands: BrandCardData[] })   // up to 8
FeaturedVehicles({ cars }: { cars: VehicleCardData[] }) // 4
```
Types from `./content`.
