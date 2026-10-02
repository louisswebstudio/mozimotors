import type { Metadata } from "next";
import "../globals.css";
import { WhatsAppFab } from "@/components/whatsapp-fab";
import { CookieConsent } from "@/components/cookie-consent";
import { IntroLoader } from "@/components/brand-loader";
import { RouteLoader } from "@/components/route-loader";
import { INTRO_SEEN_SCRIPT } from "@/components/brand-loader-seen";
import { getCars, getSettings } from "@/lib/wp";
import { buildBuyMenu } from "@/lib/buy-menu";
import { dmSans, figtree, readexPro } from "@/components/sites/boxcars-framer-website-cd8da657/root-8a5edab2/fonts";
import { Navbar } from "@/components/sites/boxcars-framer-website-cd8da657/root-8a5edab2/Navbar";
import { SiteFooter } from "@/components/sites/boxcars-framer-website-cd8da657/root-8a5edab2/SiteFooter";
import { SmoothScroll } from "@/components/sites/boxcars-framer-website-cd8da657/root-8a5edab2/smooth-scroll";
import { LOCALES, OG_LOCALE, INTL_LOCALE } from "@/i18n/config";
import { I18nProvider } from "@/i18n/client";
import { getI18n } from "@/i18n/server";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata(): Promise<Metadata> {
  const { t, locale } = await getI18n();
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: t.meta.title, template: t.meta.titleTemplate },
    description: t.meta.description,
    openGraph: { siteName: "MoziMotors", locale: OG_LOCALE[locale], type: "website" },
    // No `alternates` here: a canonical set in the layout would be inherited by every page.
    // Each page sets its own via localeAlternates(path).
  };
}

/** Site chrome follows the Boxcars design (boxcars.framer.website) on every page. */
export default async function RootLayout({ children }: LayoutProps<"/[lang]">) {
  const [{ locale, dir, t: dict }, settings, cars] = await Promise.all([getI18n(), getSettings(), getCars()]);
  return (
    <html suppressHydrationWarning lang={INTL_LOCALE[locale]} dir={dir} className={`${dmSans.variable} ${figtree.variable} ${locale === "ar" ? readexPro.variable : ""} antialiased`}>
      <body className="bx relative flex min-h-dvh flex-col overflow-x-clip">
        <script dangerouslySetInnerHTML={{ __html: INTRO_SEEN_SCRIPT }} />
        <I18nProvider locale={locale} dict={dict}>
          <IntroLoader />
          <RouteLoader />
          <SmoothScroll />
          <Navbar
            phone={settings.phone}
            email={settings.email}
            buyMenu={await buildBuyMenu(cars)}
          />
          <main className="flex-1">{children}</main>
          <SiteFooter settings={settings} />
          <WhatsAppFab number={settings.whatsapp} />
          <CookieConsent />
        </I18nProvider>
      </body>
    </html>
  );
}

