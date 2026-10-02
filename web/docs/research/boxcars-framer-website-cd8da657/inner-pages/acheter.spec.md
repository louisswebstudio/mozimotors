# /acheter (Boxcars /vehicles) Specification

Files: `src/app/acheter/page.tsx`, `src/components/filters.tsx` (restyle; keep all URL-param logic and exports `Filters`, `SortSelect`).
Screenshot: `inner/view-vehicles.png`, raw `raw/inner-vehicles-desktop/01-main.txt`.
Interaction: click (filter selects update URL via router.replace), static grid.

## Layout
- `<PageSheet>` → section padding 20px 0 (bottom 90/60/30). Container column gap 40px.
- Head (like PageIntro `aside` variant): eyebrow `${results.length} voiture(s) disponible(s)`; H1 = existing dynamic heading ("Voitures d'occasion" / "SUV d'occasion"…); right 15px/24px #202124: "Inspectées sur 140+ points, prix affichés, financement possible." You may use `PageIntro` with `tight` and pass the filter row + grid as children.
- Filter row (under the head): flex-wrap, gap 15px (Boxcars shows 6 pills in one row). Each filter = pill select: height 44px, radius 120px, 1px #E1E1E1 border, bg white, 14px/16.8px #050B20 text, padding 12px 40px 12px 16px, custom chevron (16px, stroke 1.5, navy) at right 16px, `appearance-none`. Active (has value) → border #050B20. Pills: Marque (with count), Modèle (only when a brand is set), Carrosserie, Carburant, Boîte, Prix max, Kilométrage max, Année min, Ville. Plus a search pill input (same style, 200px, placeholder "Rechercher…", magnifier icon left) and, right-aligned (ml-auto), the `SortSelect` restyled as the same pill. "Effacer les filtres (n)" appears as a `BxButton variant="link"`-style text button when filters are active.
- Keep min price select too (put Prix min + Prix max as two pills).
- Mobile (<810): show a single "Filtres (n)" pill button (navy border) + sort pill; tapping opens the existing bottom sheet, restyled: white, radius 16 top, navy title 20px 500, the same pill controls stacked full width, and a full-width primary button "Voir les résultats" (bg #405FF2, radius 10, 44px).
- Grid: `VehicleCard` via `toVehicleCard(car, settings.loanRate, settings.loanMonths)`; desktop 4 cols gap 20; tablet 2; mobile 1. `preload` for first 4.
- Empty state: Card (1px #E1E1E1, radius 16) centered, padding 80px 24px: lucide `SearchX` 40px #A5ADCA, h6 20px 500 navy "Aucune voiture ne correspond", 15px text, buttons `BxButton primary` "Réinitialiser" → /acheter and `BxButton link` "Créer une alerte" → /contact.
- Below the grid: reuse homepage `CtaBanner` (optional, Boxcars detail page has it; for /vehicles skip it).
