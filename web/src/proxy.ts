import { NextResponse, type NextRequest } from "next/server";
import { DEFAULT_LOCALE, LOCALES } from "./i18n/config";

/**
 * Locale routing. All pages live under app/[lang]; French (default) keeps the unprefixed URLs:
 * - `/acheter`      → rewritten to `/fr/acheter` (URL bar unchanged)
 * - `/en/acheter`   → served as is
 * - `/fr/acheter`   → 308 to `/acheter`, so each page has exactly one French URL
 * - `/v2/...`       → 308 to the same page without `/v2` (the redesign was previewed there before going live)
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const parts = pathname.split("/");

  if (parts[1] === "v2") {
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice(3) || "/";
    return NextResponse.redirect(url, 308);
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
