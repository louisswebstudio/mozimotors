import type { MetadataRoute } from "next";
import { getCars } from "@/lib/cms";
import { INTL_LOCALE, LOCALES, localizePath } from "@/i18n/config";

/** Every page in every language, each entry listing its translations (hreflang) for search engines. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const cars = await getCars();
  const entry = (path: string, changeFrequency: "weekly" | "daily", priority: number) => {
    const languages = Object.fromEntries(LOCALES.map((l) => [INTL_LOCALE[l].split("-")[0], `${base}${localizePath(path, l)}`]));
    return LOCALES.map((l) => ({
      url: `${base}${localizePath(path, l)}`,
      changeFrequency,
      priority,
      alternates: { languages },
    }));
  };
  const pages = ["/", "/acheter", "/vendre", "/pourquoi-mozimotors", "/a-propos", "/contact", "/faq", "/conditions-generales", "/politique-de-confidentialite", "/cookies"];
  return [
    ...pages.flatMap((p) => entry(p, "weekly", p === "/" ? 1 : 0.8)),
    ...cars.flatMap((c) => entry(`/voiture/${c.slug}`, "daily", 0.7)),
  ];
}

