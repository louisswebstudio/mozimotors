/**
 * Locales. French is the default and lives at the unprefixed URLs (`/acheter`), so existing
 * links and SEO keep working; the others are prefixed (`/en/acheter`). src/proxy.ts rewrites
 * unprefixed requests to the internal `/fr/...` route and redirects `/fr/...` back.
 * Shared by server and client code — no server-only imports here.
 */
export const LOCALES = ["fr", "en", "ar"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "fr";

export const isLocale = (x: string | undefined): x is Locale => !!x && (LOCALES as readonly string[]).includes(x);

/** BCP-47 tags for Intl formatting and <html lang>. */
export const INTL_LOCALE: Record<Locale, string> = { fr: "fr-FR", en: "en-US", ar: "ar-MA" };
export const OG_LOCALE: Record<Locale, string> = { fr: "fr_MA", en: "en_US", ar: "ar_MA" };
export const DIR: Record<Locale, "ltr" | "rtl"> = { fr: "ltr", en: "ltr", ar: "rtl" };

const PREFIX_RE = new RegExp(`^/(${LOCALES.join("|")})(?=/|$|\\?|#)`);

/** "/en/acheter?x=1" → "/acheter?x=1" (non-localised path). */
export function stripLocale(path: string): string {
  const m = path.match(PREFIX_RE);
  if (!m) return path;
  const rest = path.slice(m[0].length);
  return rest.startsWith("/") ? rest : `/${rest}`;
}

/** Internal path in `locale`: French unprefixed, others prefixed. External/anchor hrefs are left alone. */
export function localizePath(path: string, locale: Locale): string {
  if (!path.startsWith("/") || path.startsWith("//")) return path;
  const clean = stripLocale(path);
  if (locale === DEFAULT_LOCALE) return clean;
  return clean === "/" ? `/${locale}` : clean.startsWith("/?") || clean.startsWith("/#") ? `/${locale}${clean.slice(1)}` : `/${locale}${clean}`;
}
