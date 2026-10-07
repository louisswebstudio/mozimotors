import { cache } from "react";
import { lang } from "next/root-params";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "./config";
import { makeI18n } from "./core";
import { fr } from "./dictionaries/fr";
import { en } from "./dictionaries/en";
import { ar } from "./dictionaries/ar";
import { applyOverrides } from "./overrides";
import { getTextOverrides } from "@/lib/cms";

/** Server side: every dictionary is available; only the current one is sent to the client. */
export const DICTIONARIES = { fr, en, ar } satisfies Record<Locale, typeof fr>;

/** Current locale from the `[lang]` root segment (no prop drilling — see next/root-params). */
export async function getLocale(): Promise<Locale> {
  const l = await lang();
  if (!isLocale(l)) notFound();
  return l;
}

/** The dictionary for `locale` with the client's edits from Studio › Textes du site applied (deduplicated per request). */
export const getDictionary = cache(async (locale: Locale) =>
  applyOverrides(DICTIONARIES[locale] as typeof fr, await getTextOverrides(locale)),
);

/** `const { t, price, href } = await getI18n()` in any Server Component or server utility. */
export async function getI18n() {
  const locale = await getLocale();
  return makeI18n(locale, await getDictionary(locale));
}
