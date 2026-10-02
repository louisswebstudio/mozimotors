import { NextResponse, type NextRequest } from "next/server";
import { DEFAULT_LOCALE, LOCALES } from "./i18n/config";

/** Locales of the siaracash.ma-style version (app/v2/[lang]). */
const V2_LOCALES = ["fr", "en", "ar"];

/**
 * Locale routing. All pages live under app/[lang]; French (default) keeps the unprefixed URLs:
 * - `/acheter`      → rewritten to `/fr/acheter` (URL bar unchanged)
 * - `/en/acheter`   → served as is
 * - `/fr/acheter`   → 308 to `/acheter`, so each page has exactly one French URL
 * The /v2 version (app/v2/[lang]) follows the same scheme below /v2: `/v2/acheter` (fr), `/v2/en/acheter`, `/v2/ar/acheter`.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const parts = pathname.split("/");

  if (parts[1] === "v2") {
    const seg = parts[2];
    if (seg === DEFAULT_LOCALE) {
      const url = request.nextUrl.clone();
      url.pathname = `/v2${pathname.slice(`/v2/${DEFAULT_LOCALE}`.length)}`;
      return NextResponse.redirect(url, 308);
    }
    if (V2_LOCALES.includes(seg)) return NextResponse.next();
    const url = request.nextUrl.clone();
    url.pathname = `/v2/${DEFAULT_LOCALE}${pathname.slice(3)}`;
    return NextResponse.rewrite(url);
  }

  const first = parts[1];
  if (first === DEFAULT_LOCALE) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice(DEFAULT_LOCALE.length + 1) || "/";
    return NextResponse.redirect(url, 308);
  }
  if ((LOCALES as readonly string[]).includes(first)) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = `/${DEFAULT_LOCALE}${pathname === "/" ? "" : pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  // Pages only: skip Next internals, API routes and any file with an extension (images, sitemap.xml…).
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
