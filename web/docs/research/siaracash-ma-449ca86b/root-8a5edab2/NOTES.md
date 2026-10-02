# siaracash.ma homepage → /v2

- Route: `src/app/v2` (own root layout, French only, `noindex`). Main site (`app/[lang]`) untouched; `src/proxy.ts` skips `/v2`.
- Styling: siaracash.ma's compiled Tailwind v4 CSS + Barlow fonts, served from `public/sites/siaracash-ma-449ca86b/root-8a5edab2/siaracash.css` and linked only by the v2 layout. Only use classes that exist in that file (it is not rebuilt).
- Components: `src/components/sites/siaracash-ma-449ca86b/root-8a5edab2/`. Desktop (lg+) and mobile trees are separate, like the original.
- Kept verbatim: layout, copy, images. Changed: logo → MoziMotors; "SiaraCash" in copy → "MoziMotors"; certified seal redrawn as `mozimotors-certified.svg`.
- Data: cars, reviews, phone/email/WhatsApp/address come from MoziMotors (`src/lib/wp.ts`), not SiaraCash's inventory.
- Removed on client request: Le Neuf, Financement, Devenir partenaire (nav, drawer, footer, tab bars, mobile "capacité de financement" card). Also dropped: Blog link, Payzone badge, "Espace partenaire".
- raw/: rendered DOM (desktop.html) + interaction states (drawer, dropdowns, budget chips, finance widget).

## /v2/acheter ← siaracash.ma/lists
- `src/app/v2/acheter/page.tsx` (dynamic, URL-driven). Same params as the main /acheter (`parseCarFilters`), plus sorts km-desc / year-desc / year-asc (`listing.ts`).
- Components: ListingFilters (desktop accordion + mobile sheet), ListingView (desktop grid / mobile layout with its own header), ListingExtras (avantage, FAQ, SEO links).
- Needs the extra stylesheet `0f9d595ef4f8e4b7.css` (`.cc-root` tokens, `.cc-acc-body`, `.cc-btn`) — bundled in siaracash.css.
- Differences: Type d'annonce tiles limited to what MoziMotors data has (Non certifié, Certifié, Sans imperfection, Finançable); no « Chez nos partenaires »; promo banners only « Vendez votre voiture » (no Financement / Neuf); « Stock MoziMotors » tab works (= showroom cars) instead of « Bientôt disponible »; hearts save to localStorage, mobile heart shows saved cars.
- raw/lists/: captured states (filters selected, sort, lire plus, empty, mobile sheet/sort).

## Other pages
| /v2 route | siaracash.ma source | notes |
|---|---|---|
| /v2/voiture/[slug] | /voiture/… | gallery by WP photo category, RDV / pré-accord modal → /api/leads (type essai / financement), loan calc, features Oui/Non from feature-catalog. Detail CSS: 97198621078a6e2d + cb8544a4ef612ecd (bundled). |
| /v2/vendre | /sell | hero photo = own `assets/car sell.jpg` (theirs shows a SiaraCash sign); hub map from WP showroomCity / homeInspectionCities; every CTA → main-site wizard /vendre/demande?ville= |
| /v2/pourquoi-mozimotors | /why-siaracash | sample-report PDF dropped (theirs), « 1 000+ véhicules dans 32 villes » → real stock counts, financing link → /v2/acheter?type=financable |
| /v2/faq | /faq | MoziMotors FAQ (fr dictionary + WP overrides) split buy / sell |
| /v2/contact | /contact | cards + Google Maps embed of settings.address |
| /v2/conditions-generales, /politique-de-confidentialite, /cookies | /terms-conditions… | their layout, MoziMotors' own legal text (theirs has SiaraCash's RC/ICE/address) |
| /v2/vendre/demande | /sell/demande | same 4-step logic as src/components/sell-wizard.tsx (city → contact → car → inspection slot → "estimation" lead), restyled; copy from fr dictionary via I18nProvider. Only steps 1–2 of the original were captured (no personal data entered on siaracash.ma); steps 3–4 reuse the same card/field styles. |
