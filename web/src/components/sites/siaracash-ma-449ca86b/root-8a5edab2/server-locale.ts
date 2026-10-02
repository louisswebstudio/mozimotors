import "server-only";
/** Server access to the /v2 language, from the `[lang]` root param of app/v2/[lang]. */
import { lang } from "next/root-params";
import { notFound } from "next/navigation";
import { getDictionary } from "@/i18n/server";
import { isV2Locale, makeV2, type V2Locale } from "./locale";

export async function getV2Locale(): Promise<V2Locale> {
  const l = await lang();
  if (!l || !isV2Locale(l)) notFound();
  return l;
}

/** `const v = await getV2()` → { locale, tx, href, dict } where dict is the main site's dictionary for that language. */
export async function getV2() {
  const locale = await getV2Locale();
  return { ...makeV2(locale), dict: await getDictionary(locale) };
}
