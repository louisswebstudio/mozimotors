# MoziMotors — headless car marketplace

This is a used-car marketplace for Morocco (buy, sell, financing), with the same scope as siaracash.ma and a redesigned UI.

```
web/      Next.js 16 frontend (SSR/ISR, SEO, forms) — deployed on Cloudflare Workers
studio/   Sanity Studio — the client's back-office (mozimotors.sanity.studio)
```

## How it fits together

```
 Sanity Studio ──(GROQ over HTTPS, token)──▶ Next.js site
   Voitures, Marques & modèles,                 /, /acheter, /voiture/[slug],
   Témoignages, Réglages, Textes                /vendre, /contact, /faq …
        ▲                                             │
        ├──── create « Demande » ◀── /api/leads ◀─────┘  (all forms) ──▶ email (Resend)
        └──── webhook on publish ──▶ /api/revalidate  (site updates instantly)
```

## Frontend (`web/`)

```bash
cd web
cp .env.example .env.local   # leave SANITY_PROJECT_ID empty to use demo data
npm install
npm run dev                  # http://localhost:3000
```

UI: siaracash.ma layout with MoziMotors branding (components in `src/components/sites/siaracash-ma-449ca86b/`). It was previewed under `/v2` before going live; old `/v2/...` links now 308-redirect to the same page without `/v2`.

Trilingual (FR default, unprefixed URLs · `/en` · `/ar` RTL). Pages: `/`, `/acheter` (URL-driven filters), `/voiture/[slug]`, `/vendre` (+ `/vendre/demande`), `/pourquoi-mozimotors`, `/contact`, `/faq`, legal pages. `sitemap.xml` (with hreflang) and `robots.txt` are generated. `/financement` redirects to `/acheter`.

**Data rules** (`web/src/lib/cms.ts`)

- `SANITY_PROJECT_ID` empty → demo data (design work, no backend).
- `SANITY_PROJECT_ID` set → Sanity is the only source. Nothing falls back to demo cars; if Sanity is down Next keeps serving the last cached data. Only contact settings fall back to defaults (`DEFAULT_SETTINGS`).
- Only published, unsold cars appear. CMS content (car data, reviews) is French; UI text is translated in `src/i18n/dictionaries`.
- The dataset is **private** (it stores leads with names and phone numbers), so the site reads with `SANITY_READ_TOKEN`. Uploaded photos are still served publicly by `cdn.sanity.io`.

## Back-office (`studio/`)

What the client manages, in French:

- **Voitures en vente / vendues** — tabs Essentiel, Photos (drag to reorder, first = main, a tab per photo), Détails (PDF inspection report), Équipements (checkboxes = the Oui/Non rows of the car page, plus free « Autres équipements »), Statut & badges. Tick **Vendue** to hide a car without deleting it. « Voir sur le site » opens the published page.
- **Marques & modèles** — 62 brands and 297 models sold new in Morocco, from [leguideauto.ma](https://www.leguideauto.ma/le-neuf/les-marques). When adding a car, the model list is filtered by the chosen brand; missing (older) models can be created on the spot.
- **Demandes** — every form submission, with status, internal notes and Call / WhatsApp / email buttons.
- **Témoignages**, **Réglages** (contact details, inspection cities, credit defaults, lead email) and **Textes du site** (replace FAQ, legal, sell-form texts in fr/en/ar).

```bash
cd studio
cp .env.example .env         # SANITY_STUDIO_PROJECT_ID=…
npm install
npm run dev                  # http://localhost:3333
npm run deploy               # → https://mozimotors.sanity.studio
npm run seed                 # brands, models, starter settings (safe to re-run)
npm run catalog              # refresh seed/catalog.json from leguideauto.ma, then `npm run seed`
```

The Studio imports the site's equipment list and French dictionary from `../web`, so the checkboxes and editable texts always match the code.

### First-time setup

1. `npx sanity login`, then create a project (dataset `production`, **private**).
2. `studio/.env`: project id → `npm run seed` → `npm run deploy`.
3. sanity.io/manage › API › Tokens: a **Viewer** token (`SANITY_READ_TOKEN`) and an **Editor** token (`SANITY_WRITE_TOKEN`, used to save leads).
4. sanity.io/manage › API › Webhooks › Create:
   - URL `https://www.mozimotors.ma/api/revalidate`, trigger on create / update / delete, method POST
   - Filter `_type in ["car", "brand", "model", "testimonial", "settings", "siteTexts"]`
   - Projection `{"tags": select(_type == "car" => ["cars", "car-" + slug.current], _type in ["brand", "model"] => ["cars"], _type == "testimonial" => ["testimonials"], _type == "settings" => ["settings"], _type == "siteTexts" => ["texts"], [])}`
   - HTTP header `X-Mozi-Secret: <REVALIDATE_SECRET>`; drafts off.
5. Resend: verify the sender domain, create an API key (`RESEND_API_KEY`, `LEAD_EMAIL_FROM`).
6. Invite the client under sanity.io/manage › Members (role **Editor**).

## Deploy

- **Frontend:** Cloudflare Workers (`npm run deploy` in `web/`, via OpenNext) or any Node 20+ host. Set every variable from `web/.env.example` (tokens and keys as secrets).
- **Studio:** `npm run deploy` in `studio/` (free Sanity hosting).
- Go-live check: publish a car in the Studio → it appears on `/acheter` within seconds; submit the contact form → a « Demande » appears in the Studio and the email arrives.
