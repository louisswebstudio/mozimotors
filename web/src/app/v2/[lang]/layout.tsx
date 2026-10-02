import type { Metadata } from "next";
import { getSettings } from "@/components/sites/siaracash-ma-449ca86b/root-8a5edab2/settings";
import { A } from "@/components/sites/siaracash-ma-449ca86b/root-8a5edab2/assets";
import { SiteHeader } from "@/components/sites/siaracash-ma-449ca86b/root-8a5edab2/SiteHeader";
import { SiteFooter } from "@/components/sites/siaracash-ma-449ca86b/root-8a5edab2/SiteFooter";
import { MobileTabBar } from "@/components/sites/siaracash-ma-449ca86b/root-8a5edab2/MobileTabBar";
import { CookieBanner, WhatsAppFab } from "@/components/sites/siaracash-ma-449ca86b/root-8a5edab2/Floating";
import { V2LocaleProvider } from "@/components/sites/siaracash-ma-449ca86b/root-8a5edab2/V2Locale";
import { getV2 } from "@/components/sites/siaracash-ma-449ca86b/root-8a5edab2/server-locale";
import { V2_LOCALES } from "@/components/sites/siaracash-ma-449ca86b/root-8a5edab2/locale";

/**
 * Root layout of the second version of the site (/v2): siaracash.ma UI with MoziMotors branding.
 * Separate root layout on purpose — it loads siaracash.ma's compiled stylesheet (+ mozi-theme.css) instead of
 * globals.css, so the main site (app/[lang]) is untouched. Crossing between the two is a full reload.
 * Languages: French at /v2/… (proxy rewrites to /v2/fr/…), English at /v2/en/…, Arabic (RTL) at /v2/ar/….
 * Research + raw captures: docs/research/siaracash-ma-449ca86b/root-8a5edab2/
 */
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

// No `dynamicParams = false`: on Cloudflare (OpenNext, no prerender cache) pages render on demand, and that flag
// turns them into 404s. Unknown languages still 404 through getV2Locale().
export function generateStaticParams() {
  return V2_LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getV2();
  return {
    metadataBase: new URL(SITE_URL),
    title: t("Vendez ou Achetez votre Voiture d’occasion | Mozi Motors"),
    description: t(
      "Achetez une voiture d'occasion inspectée et garantie ou vendez la vôtre au meilleur prix. Accompagnement complet, partout au Maroc.",
    ),
    // Draft version: keep it out of search results until it replaces the main site.
    robots: { index: false, follow: false },
  };
}

export default async function V2Layout({ children }: { children: React.ReactNode }) {
  const [settings, { locale, dir }] = await Promise.all([getSettings(), getV2()]);
  return (
    <html lang={locale} dir={dir}>
      <body className="__variable_cc19bf __variable_c29908 font-sans antialiased">
        <link rel="stylesheet" href={`${A}/siaracash.css`} precedence="default" />
        {/* MoziMotors colours over the SiaraCash palette (navy + blue, as on the main site). */}
        <link rel="stylesheet" href={`${A}/mozi-theme.css`} precedence="high" />
        {/* Barlow has no Arabic glyphs: Arabic text falls back to Tajawal. */}
        {locale === "ar" && <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800&display=swap" precedence="default" />}
        {/* Bottom tab bar height (< lg) — the original sets this from JS. */}
        <style>{"@media (max-width:1023.98px){:root{--bottom-nav-h:56px}}"}</style>
        <V2LocaleProvider locale={locale}>
          <div dir={dir} className="__variable_00de8e __variable_a0b47c" style={{ fontFamily: locale === "ar" ? "var(--font-barlow), Tajawal, sans-serif" : "var(--font-barlow)" }}>
            <SiteHeader whatsapp={settings.whatsapp} />
            <main className="min-h-[calc(100vh-160px)] pb-16 lg:pb-0">{children}</main>
            <SiteFooter settings={settings} />
            <MobileTabBar />
            <WhatsAppFab number={settings.whatsapp} />
            <CookieBanner />
          </div>
        </V2LocaleProvider>
      </body>
    </html>
  );
}
