import type { Metadata } from "next";
import { DEFAULT_LOCALE, INTL_LOCALE, LOCALES, localizePath } from "./config";
import { getLocale } from "./server";

/**
 * `alternates` for a page: canonical URL in the current language + hreflang links to every
 * translation, so search engines index each language and show the right one.
 * `path` is the non-localised path, e.g. "/acheter" or `/voiture/${slug}`.
 */
export async function localeAlternates(path: string): Promise<Metadata["alternates"]> {
  const locale = await getLocale();
  const languages: Record<string, string> = Object.fromEntries(
    LOCALES.map((l) => [INTL_LOCALE[l].split("-")[0], localizePath(path, l)]),
  );
  languages["x-default"] = localizePath(path, DEFAULT_LOCALE);
  return { canonical: localizePath(path, locale), languages };
}
