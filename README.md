# MoziMotors — headless car marketplace

This is a used-car marketplace for Morocco (buy, sell, financing), with the same scope as siaracash.ma and a redesigned UI.

```
web/        Next.js 16 + Tailwind 4 frontend (SSR/ISR, SEO, forms)
wordpress/  mozimotors-core plugin — the client's back-office + REST API
```

## How it fits together

```
 WordPress admin ──(REST: /wp-json/mozi/v1/*)──▶ Next.js site
   Voitures, Marques,                              /, /acheter, /voiture/[slug],
   Témoignages, Réglages                           /vendre, /financement, /contact
        ▲                                                │
        └──── POST /mozi/v1/leads ◀── /api/leads ◀───────┘  (all forms)
        └──── save_post ──▶ /api/revalidate  (site updates instantly)
```

## Frontend (`web/`)

```bash
cd web
cp .env.example .env.local   # leave WP_API_URL empty to use demo data
npm install
npm run dev                  # http://localhost:3000
```

Trilingual (FR default, unprefixed URLs · `/en` · `/ar` RTL). Pages: `/`, `/acheter` (URL-driven filters), `/voiture/[slug]`, `/vendre` (+ `/vendre/demande`), `/pourquoi-mozimotors`, `/contact`, `/faq`, legal pages. `sitemap.xml` (with hreflang) and `robots.txt` are generated. `/financement` redirects to `/acheter`.

**Data rules** (`web/src/lib/wp.ts`)

- `WP_API_URL` empty → demo data (design work, no backend).
- `WP_API_URL` set → WordPress is the only source. Nothing falls back to demo cars; if WP is down Next keeps serving the last cached data. Only contact settings fall back to defaults.
- WP content (car data, reviews) is French; UI text is translated in `src/i18n/dictionaries`.

## Backend (`wordpress/mozimotors-core`)

1. Upload `wordpress/mozimotors-core.zip` under **Extensions › Ajouter**, activate it. No other plugins needed (no ACF).
2. **Réglages › Permaliens**: choose anything except "Simple" (the REST API needs pretty permalinks). Check `https://<wp>/wp-json/mozi/v1/settings` answers.
3. **Réglages › MoziMotors**: phone, WhatsApp, email, address, loan rate, lead email, **frontend URL** and **secret key** (same value as `WP_SHARED_SECRET`). Once the frontend URL is set, the public WP site redirects visitors to it.
4. **Voitures › Marques**: create the brands.
5. **Voitures › Ajouter**: pick a brand, fill in the details, add photos (drag to reorder, first = main, each has a category tab). Tick **Vendue** to hide a car without deleting it.
6. **Témoignages**: title = client name, content = review, excerpt (optional) = short headline, featured image (optional) = avatar.
7. Form submissions arrive under **Demandes** (status + Call/WhatsApp buttons) and are emailed to the lead address.

REST endpoints (public read, secret-protected write):

- `GET /wp-json/mozi/v1/cars`, `GET /cars/{slug}`, `GET /testimonials`, `GET /settings`
- `POST /leads` (header `X-Mozi-Secret`)

Saving/trashing a car, review, brand or the settings pings `POST {frontend}/api/revalidate`, so the site updates instantly (otherwise within `WP_REVALIDATE` seconds).

Tip: host WP on a subdomain (e.g. `admin.mozimotors.ma`), keep it on HTTPS, and let Next.js serve the public site.

## Deploy

- **Frontend:** Vercel (or any Node 20+ host). Set every variable from `web/.env.example`. `WP_API_URL` must be reachable from the server, and its domain is added to `images.remotePatterns` automatically.
- **WordPress:** any PHP 7.4+ host with `mbstring`. Make sure outgoing mail works (SMTP plugin recommended) so lead emails arrive.
- Go-live check: add a car in WP → it appears on `/acheter`; submit the contact form → a "Demande" appears in WP.
