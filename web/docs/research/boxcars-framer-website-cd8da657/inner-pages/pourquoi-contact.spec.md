# /pourquoi-mozimotors (Boxcars /about) + /contact (Boxcars /contact) + 404 Specification

Files: `src/app/pourquoi-mozimotors/page.tsx`, `src/app/contact/page.tsx`, `src/app/not-found.tsx`.
Screenshots: `inner/view-about.png`, `inner/view-contact.png`; raw `raw/inner-about-desktop/02-page-intro-section.txt`, `raw/inner-contact-desktop/01-main.txt`.

## /pourquoi-mozimotors (about)
1. `PageSheet` + `PageIntro` split: eyebrow "Pourquoi nous", title "L'occasion, avec les garanties du neuf", lead "Nous avons repensé l'achat et la vente de voitures d'occasion autour d'une idée simple : la transparence totale.", text = 2 sentences on inspection / prix / démarches (from existing copy).
   Children = Boxcars photo mosaic (Reveal y 24): desktop grid 4 cols × 2 rows, gap 10, height 470: tile 1 (col 1 row 1) = blue #405FF2 card radius 16 with "140+" 52px 700 white centered + "points d'inspection" 18px white; tile 2 (col 2, rows 1-2) image step-1.jpg; tile 3 (cols 3-4 row 1) image step-3.jpg; row 2: col 1 banner-buy.jpg, col 3 step-4.jpg, col 4 blog-2.jpg. All radius 16, object-cover. Mobile: 2 cols, auto rows 160px.
2. "Ce que nos experts contrôlent" — INSPECTION list (existing 6 items): section padding 90/60/30, `SectionHead` eyebrow "Inspection" title "Ce que nos experts contrôlent"; grid 3/2/1 cols gap 20 of cards bg #F9FBFC radius 16 padding 30: number "01" 40px 700 #405FF2, h6 20px 500 navy, 15px #202124.
3. Homepage `HowItWorks` (reuse as-is).
4. Homepage `TrustStory`.
5. Comparison "MoziMotors vs. petites annonces" (existing COMPARE): section padding 90/60/30; `SectionHead` eyebrow "Comparatif" title "MoziMotors vs. petites annonces"; table Card (radius 16, 1px #E1E1E1, overflow hidden): header row bg #050B20 white 15px 500 (cols: label / MoziMotors / Annonces at 60% white); rows padding 15px 20px, border-bottom 1px #E1E1E1, 15px #202124; MoziMotors cell = CheckBadge (blue stroke #405FF2 — you can wrap with a class or render lucide `BadgeCheck` 20px #405FF2), Annonces cell = lucide `X` 18px #A5ADCA.
6. `Stats` with the same stats as the homepage (140+ points d'inspection, 4,8★, 24h pour une offre ferme, N+ voitures disponibles — N = cars.length from getCars()).
7. `Testimonials` with reviews built like src/app/page.tsx `toReviewCard` (copy that small mapper locally; testimonials from getTestimonials()).
8. Homepage `Team`, then homepage `CtaBanner` (add bottom padding 90/60/30 below CtaBanner).
Keep metadata.

## /contact
1. `PageSheet` + `PageIntro` (aside variant): eyebrow "On vous répond vite", title "Parlons de votre projet", aside "Achat, vente, financement ou simple question : notre équipe vous répond rapidement.", children = map: Google Maps iframe `https://www.google.com/maps?q=${encodeURIComponent(s.address)}&output=embed`, full width, height 510 (mobile 320), radius 16, border 0, `loading="lazy"`, title "Plan d'accès MoziMotors".
2. Contact form section: padding 0 0 90/60/30. Container row ≥1200: left (flex 1, max 704): eyebrow "Écrivez-nous", H3 "Comment pouvons-nous vous aider ?", 15px text "Laissez-nous vos coordonnées et votre demande : un conseiller vous rappelle dans la journée.", gap 30, existing `LeadForm type="contact"` with existing fields. Right (439px, gap 60 between): `Card` padding 30px gap 20: eyebrow "Visite ou appel", H5 "Sans rendez-vous", 15px text "Passez au showroom aux heures d'ouverture, ou appelez-nous : on prépare la voiture qui vous intéresse."; then items gap 30: 24px lucide icon stroke 1.5 navy (MapPin, Headphones, Hourglass), h6 18px 500 navy (Adresse / Contact / Horaires), 15px #202124 values (address with link to mapsUrl if set; email + phone as links underlined on hover; hours). Also a WhatsApp line (`https://wa.me/${s.whatsapp}`) in the Contact item.
Keep metadata.

## not-found
`PageSheet` → Container centered text, padding 90px 0 120px: "404" 120px 700 #405FF2 (mobile 80px), H1 "Cette page a pris la route sans nous." (H1 class), 15px #202124 "La voiture a peut-être déjà trouvé preneur.", buttons row gap 10: `BxButton primary` "Voir les voitures" → /acheter, `BxButton` link "Accueil" → /.
