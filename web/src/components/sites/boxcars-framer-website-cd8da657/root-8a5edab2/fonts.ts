import { DM_Sans, Figtree, Readex_Pro } from "next/font/google";

export const dmSans = DM_Sans({ variable: "--font-dm-sans", subsets: ["latin"], weight: ["400", "500", "600", "700"] });
export const figtree = Figtree({ variable: "--font-figtree", subsets: ["latin"], weight: ["400"] });
/**
 * Arabic companion to DM Sans (geometric, similar proportions). Arabic subset only: DM Sans keeps
 * rendering Latin (brands, numbers) and the browser falls back to Readex Pro per glyph, and only
 * downloads it on pages that contain Arabic text. Wired up in globals.css (`html[lang^="ar"]`).
 */
export const readexPro = Readex_Pro({ variable: "--font-arabic", subsets: ["arabic"], weight: "variable" });
