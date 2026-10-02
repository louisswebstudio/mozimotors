# Behaviors — boxcars.framer.website (raw data: raw/behaviors-raw.txt)

## Load / time
- Hero h1: each letter is an inline-block span: opacity 0.001, blur(10px), translateY(10px) → rest. ~0.5s per letter, ~40ms stagger (letter 1 done at ~400ms, letter 6 starting at ~400ms).
- Nav search tooltip button: opacity 0, translateY(-11px) (hidden overlay, not rendered visually).

## Scroll
- Nav is `position:absolute` at top — it scrolls away; no sticky/fixed header.
- Appear effects (Framer "appear", fire once when in view): title groups opacity 0 + translateY(24px); right-side links/subtitles and button rows translateY(20px); card lists translateY(24px); How-it-works steps column and FAQ list slide from translateX(20px); stats each translateY(24px); footer big logo translateY(40px).
- How It Works: left "How It Works Content" `position:sticky; top:50px`. Each of the 4 step card wrappers is `position:sticky; top:50px`, 30px gap — so while scrolling each card slides up and covers the previous one (stacked cards). At scrollY 3000 cards 1+2 both at top 50.
- FAQ: left intro `position:sticky; top:50px`.
- Stats count up from 0 to final values when in view: 500+, 4.8★, 15+, 98% (MoziMotors: 140+, 4.8★, 24h, N+).
- Lenis smooth scrolling active on the whole page.

## Hover (transition ~0.3s ease)
- Nav links: 1px white underline at top 23px grows from width 1px/opacity 0 to full width/opacity 1.
- "Book a Visit" (white-border): bg transparent → white, text white → #050B20.
- Primary button: bg #405FF2 → #0146A6.
- White button: bg white → #405FF2, text #050B20 → white.
- No-Bg link: text #050B20 → #405FF2, 1px #405FF2 underline grows to full width.
- Brand card: shadow none → `0 2px 8px rgba(5,11,32,.08)`, border #E1E1E1 → #405FF2, label #202124 → #405FF2.
- Vehicle card: shadow → `0 2px 8px rgba(5,11,32,.08)`, image scale 1.05, title #050B20 → #405FF2, "View Details" underline.
- Blog card: image scale 1.05.
- Footer links: #A5ADCA → white + underline grows. Social icon: bg transparent → rgba(255,255,255,.07). Newsletter send button: bg → #0146A6 and paper-plane icon rotates 45°.
- Hero type pills: no hover change.

## Click
- FAQ: accordion; open item bg white + 1px #E1E1E1 border; closed bg #F9FBFC with border same color as bg. Arrow icon (12px diagonal arrow) rotated: closed = pointing down (rotate 135°), open = pointing up-right (rotate -45°… i.e. matrix(.707,-.707,.707,.707) = rotate(-45deg)). Answer text 15px/24px #202124, 20px below question. Framer opens only the clicked item (others close).
- Testimonials: prev/next buttons (40px white circles with #E1E1E1 border, chevron) move by one card (638px + 20px gap). Infinite loop, draggable (cursor grab). No autoplay.
- Trust video: 60px white circle play button centered; video muted + loop, not autoplay; click plays.
- Mobile/tablet hamburger (2 lines 25px & 20px) → full-width navy (#050B20) panel with 17px links (padding 14px 18px, radius 16) and "Get in touch" block; icon becomes an X.

## Responsive
- Desktop ≥1200: as captured at 1440.
- Tablet 810–1199: section padding 60px; H3 32px; brands 4-col grid; vehicles 2-col; team 2-col; blog 2-col; how-it-works still 2 columns; nav shows hamburger + CTA.
- Mobile <810: section padding 30px; H3 28px; hero h1 50px/50px; brands 2-col; vehicles/team/blog 1-col; banners stacked; how-it-works stacked (no sticky); trust story stacked (video on top); stats 2×2; nav = logo + search icon + hamburger; footer columns stacked.
