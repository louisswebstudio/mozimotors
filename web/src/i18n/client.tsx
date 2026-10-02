"use client";

import { createContext, useContext, useMemo } from "react";
import type { Locale } from "./config";
import { makeI18n, type I18n } from "./core";
import type { Dict } from "./dictionaries/fr";

const Ctx = createContext<I18n | null>(null);

/** Mounted once in the root layout with the current locale's dictionary (plain, serialisable data). */
export function I18nProvider({ locale, dict, children }: { locale: Locale; dict: Dict; children: React.ReactNode }) {
  const value = useMemo(() => makeI18n(locale, dict), [locale, dict]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

/** `const { t, price, href } = useI18n()` in any Client Component. */
export function useI18n(): I18n {
  const v = useContext(Ctx);
  if (!v) throw new Error("useI18n must be used inside <I18nProvider>");
  return v;
}
