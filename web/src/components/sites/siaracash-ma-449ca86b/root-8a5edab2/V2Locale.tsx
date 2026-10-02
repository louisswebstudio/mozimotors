"use client";

/** Client access to the /v2 language: `const { tx, href, locale } = useV2()`. */
import { createContext, useContext, useMemo } from "react";
import { makeV2, type V2, type V2Locale } from "./locale";

const Ctx = createContext<V2>(makeV2("fr"));

export function V2LocaleProvider({ locale, children }: { locale: V2Locale; children: React.ReactNode }) {
  const value = useMemo(() => makeV2(locale), [locale]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useV2 = () => useContext(Ctx);
