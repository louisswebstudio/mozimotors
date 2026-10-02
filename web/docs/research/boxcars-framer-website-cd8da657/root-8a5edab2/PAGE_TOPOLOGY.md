# Page topology — boxcars.framer.website → MoziMotors `/`

Source: https://boxcars.framer.website/ (captured 2026-09-27). Output route: `src/app/page.tsx` (replaces the previous MoziMotors homepage, as requested by the user: "clone the design, keep MoziMotors content, only change copywriting").

Breakpoints (Framer): mobile < 810px, tablet 810–1199px (`bxt:`), desktop ≥ 1200px (`bxd:`).
Content width: container max 1356px with 30px padding → 1296px content.
Page bg white; body font DM Sans; Figtree 400 only for hero/CTA paragraph.

| # | Section (Framer name) | Desktop y/h | Layer | Interaction model |
|---|---|---|---|---|
| 0 | Navigation | 0 / 104 | `position:absolute` over hero, z 3, scrolls away (not sticky) | hover underline; tablet/mobile hamburger → navy panel |
| 1 | Hero Section | 0 / 900 | flow | time-driven (letter blur-in on load) |
| 2 | Premium Brands | 900 / 428 | flow, bg #F9FBFC | scroll reveal, hover cards |
| 3 | Featured Vehicles | 1328 / 728 | flow, white | scroll reveal, hover (shadow, img scale 1.05, title blue) |
| 4 | Buyer & Seller banners | 2056 / 490 | flow | scroll reveal, button hover |
| 5 | How It Works | 2546 / 1754 | flow, gradient #EEF1FB→#FFF | **scroll-driven**: left column `sticky top:50`; each step card wrapper `sticky top:50` so cards stack over each other |
| 6 | Trust Story | 4300 / 650 | flow | click play → video plays (muted, loop) |
| 7 | Business Statistics | 4950 / 174 | flow | scroll-triggered count-up |
| 8 | Customer Testimonials | 5124 / 738 | flow | click-driven slideshow (prev/next, drag), no autoplay |
| 9 | Find Your Car CTA | 5862 / 500 | flow | scroll reveal |
| 10 | Expert Team | 6362 / 627 | flow | scroll reveal |
| 11 | FAQ | 6989 / 547 | flow; left column `sticky top:50` | click accordion (one open at a time) |
| 12 | Car Advice Blog | 7536 / 684 | flow | hover image scale 1.05 |
| 13 | Footer | 8220 / 961 | flow, navy; white "top-bar" 70px with rounded *bottom* corners (radius 70) caps the page above | hover links |

Global: Lenis smooth scroll (`html.lenis`). "Made in Framer" badge is Framer chrome, not cloned.
