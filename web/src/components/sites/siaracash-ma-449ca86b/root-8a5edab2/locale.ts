/**
 * Languages of the /v2 version: French (default, unprefixed: /v2/acheter), English (/v2/en/acheter)
 * and Arabic (/v2/ar/acheter, right-to-left).
 * Copy is written in French in the components and wrapped in `t("…")`; en.ts / ar.ts map each French
 * string to its translation (missing → French). Shared content (FAQ, legal, sell wizard, vehicle labels)
 * comes from the main site's dictionaries for the same language.
 * Every internal link goes through `href()` so it stays in /v2 and in the current language.
 */
import { FEATURE_CATALOG } from "@/lib/feature-catalog";
import { EN } from "./en";
import { AR } from "./ar";

export type V2Locale = "fr" | "en" | "ar";
export const V2_LOCALES: V2Locale[] = ["fr", "en", "ar"];

export const isV2Locale = (l: string): l is V2Locale => (V2_LOCALES as string[]).includes(l);

/** Equipment names already have en/ar in the shared catalog; the /v2 maps win when both define a string. */
const catalog = (l: "en" | "ar") => Object.fromEntries(Object.values(FEATURE_CATALOG).flat().map((i) => [i.fr, i[l]]));
const MAPS: Record<V2Locale, Record<string, string> | null> = { fr: null, en: { ...catalog("en"), ...EN }, ar: { ...catalog("ar"), ...AR } };

/** Prefix a /v2 path with a language: ("/v2/acheter", "en") → "/v2/en/acheter". Non-/v2 links are left alone. */
export function localizeV2(path: string, locale: V2Locale) {
  if (locale === "fr" || !(path === "/v2" || path.startsWith("/v2/") || path.startsWith("/v2?") || path.startsWith("/v2#"))) return path;
  return `/v2/${locale}${path.slice(3)}`;
}

export function makeV2(locale: V2Locale) {
  const map = MAPS[locale];
  // French typography: a non-breaking space before ? ! : ; » (and after «) so the mark never wraps onto a line of its own.
  const t = (fr: string) => (map ? (map[fr] ?? fr) : fr.replace(/ ([?!:;»])/g, " $1").replace(/(«) /g, "$1 "));
  return {
    locale,
    en: locale === "en",
    ar: locale === "ar",
    dir: (locale === "ar" ? "rtl" : "ltr") as "rtl" | "ltr",
    /** Translate a French source string (see en.ts / ar.ts); falls back to French when missing. */
    t,
    /** `t()` then fill `{name}` placeholders: tf("{n} voitures", { n: 3 }). */
    tf: (fr: string, vars: Record<string, string | number>) => t(fr).replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? "")),
    /** Localise an internal /v2 link: "/v2/acheter" → "/v2/en/acheter" in English. */
    href: (path: string) => localizeV2(path, locale),
    /** Number formatting stays Moroccan (« 150 000 DH ») in every language. */
    intl: "fr-FR",
  };
}
export type V2 = ReturnType<typeof makeV2>;

/** Strip the language prefix from a /v2 pathname (for the language switcher / active nav state). */
export const v2BasePath = (pathname: string) => pathname.replace(/^\/v2\/(en|fr|ar)(?=\/|$)/, "/v2");
