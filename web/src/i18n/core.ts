import { DIR, INTL_LOCALE, localizePath, type Locale } from "./config";
import type { Dict, Plural } from "./dictionaries/fr";

/** "{n} voitures" + { n: 3 } → "3 voitures". Unknown placeholders are left as-is. */
export function fmt(template: string, vars: Record<string, string | number> = {}): string {
  return template.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? String(vars[k]) : m));
}

/**
 * Everything a component needs for one locale: the dictionary, direction, plural + number/price
 * formatting and a path localiser. Built identically on the server (src/i18n/server.ts) and the
 * client (src/i18n/client.tsx), so both render the same markup.
 */
export function makeI18n(locale: Locale, t: Dict) {
  const tag = INTL_LOCALE[locale];
  const nf = new Intl.NumberFormat(tag, { maximumFractionDigits: 0 });
  const rules = new Intl.PluralRules(tag);
  const num = (n: number) => nf.format(Math.round(n));
  return {
    locale,
    t,
    dir: DIR[locale],
    fmt,
    num,
    /** "259 000 DH" / "259,000 DH" / "259٬000 درهم" */
    price: (n: number) => fmt(t.common.priceFormat, { n: num(n) }),
    /** Picks the plural form for n (Intl rules, so Arabic's six forms work) and fills {n}. */
    plural: (n: number, forms: Plural, vars: Record<string, string | number> = {}) =>
      fmt(forms[rules.select(n)] ?? forms.other, { n: num(n), ...vars }),
    /** Decimal with a fixed number of digits, e.g. ratings "4,8" / "4.8". */
    decimal: (n: number, digits = 1) =>
      new Intl.NumberFormat(tag, { minimumFractionDigits: digits, maximumFractionDigits: digits }).format(n),
    href: (path: string) => localizePath(path, locale),
  };
}

export type I18n = ReturnType<typeof makeI18n>;
