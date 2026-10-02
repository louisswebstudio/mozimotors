# SiteFooter Specification

## Overview
- **Target file:** `.../root-8a5edab2/SiteFooter.tsx` (server) + `.../NewsletterForm.tsx` (client)
- **Screenshots:** `desktop/13-footer.png`, `mobile/_sheet-b.png` (last column)
- **Interaction model:** static + hover + newsletter form submit.

## DOM / styles
- Root: bg #050B20, padding-top 70px (tablet 70, mobile 50px), relative, overflow hidden.
- Top bar: absolute top 0, height 70px (mobile 50px), full width, bg white, border-radius 0 0 70px 70px (mobile 0 0 50px 50px), z 4 — caps the white page above with a rounded bottom edge.
- Newsletter band (border-bottom 1px rgba(255,255,255,.1)): Container padding 60px 30px (mobile 50px 30px), desktop row gap 40px, mobile column items-stretch gap 30px.
  - Left (flex 1) gap 5px: h4 30px/39px 700 white (tablet 24px, mobile 22px/29px); p 14px/20px #A5ADCA.
  - Right (flex 1, justify-end): form max-width 502px width 100%: pill bg rgba(255,255,255,.07), radius 120px, height 65px, padding 10px 10px 10px 24px; input transparent 14px/19.6px, text white, placeholder #A5ADCA, `type="tel"`, name phone, required; submit button 45×45 circle bg #405FF2 (hover #0146A6), white lucide `Send` 16px stroke 1.5 which rotates 45deg on hover (.3s). Hidden honeypot input `name="website"`.
  - Submit: `fetch("/api/leads", {method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ type:"contact", name:"Alerte nouveaux arrivages", phone, message:"Inscription alerte nouveaux arrivages (newsletter WhatsApp)", website })})`. On ok → replace the form content with FOOTER.newsletterDone (14px #A5ADCA, white check). On 422 → show FOOTER.newsletterError under the pill (12px, #ff8a8a). Disable button while pending.
- Center: Container padding 60px 30px, desktop row items-start; tablet grid 2 cols gap 40px; mobile column gap 30px.
  - About (desktop width 392px = padding-right 90px): logo `LOGO.white` height 26px; p 14px/20px #A5ADCA max-width 302px (gap 20px); social row gap 5px: 40px circle links (padding 5px) with 18px icons stroke 1.5 #A5ADCA, hover bg rgba(255,255,255,.07) and icon white. Only render Instagram / Facebook when present in settings (inline svg paths given below).
  - Link columns (flex 1 each, 302px): title h5 20px/26px 500 white (mobile 18px); list gap 15px of 14px/20px #A5ADCA links; hover white + 1px white underline growing from 0 to 100% at the text baseline (top 19px).
  - Contact column: title FOOTER.contactTitle; items gap 20px, each row gap 10px: 42px tile (bg rgba(255,255,255,.05), radius 16, lucide icon 16px stroke 1.5 white: MapPin, Phone, Mail) + 14px/20px #A5ADCA text; phone and email are underlined links (hover white). Address from settings.address; also show settings.hours as a 4th row with lucide `Clock`.
- Bottom: Container padding 30px, row gap 40px (mobile column items-start gap 20px): copyright 14px/20px #A5ADCA flex 1; nav gap 20px of 14px links (#A5ADCA, hover white + underline).
- Brand watermark: Container padding 0 30px, height 200px (tablet 120px, mobile 70px), overflow hidden; `LogoWatermark` full width (gradient rgba(255,255,255,.07) → rgba(255,255,255,0)); wrap in `Reveal y={40}`.

## Social icon paths (viewBox 0 0 24 24, stroke currentColor, strokeWidth 1.5, fill none, round caps/joins)
- Instagram: `<rect x="3" y="3" width="18" height="18" rx="4.5"/><circle cx="12" cy="12" r="3.75"/><circle cx="17.1" cy="6.9" r=".6" fill="currentColor"/>`
- Facebook: `<circle cx="12" cy="12" r="9"/><path d="M15.75 8.25H14.25A2.25 2.25 0 0 0 12 10.5V21M9 13.5h6"/>`

## Props
```ts
SiteFooter({ settings }: { settings: SiteSettings })   // import type from "@/lib/types"
```
Copy from `FOOTER`, `LOGO` in `./content`.
