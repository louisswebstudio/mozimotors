/** /v2 settings: shared WordPress/demo settings with MoziMotors' real contact details and coverage on top (v1 is left untouched). */
import { getSettings as getSharedSettings } from "@/lib/wp";
import type { SiteSettings } from "@/lib/types";

const CONTACT: Partial<SiteSettings> = {
  phone: "07 73 19 14 33",
  whatsapp: "212773191433",
  email: "contact@mozimotors.ma",
  instagram: "https://www.instagram.com/mozi.motors",
  facebook: "https://www.facebook.com/share/1EPEcYEkEN/",
  // Coverage (client, 2026-10-01): showroom and home inspection in Casablanca only.
  showroomCity: "Casablanca",
  homeInspectionCities: ["Casablanca"],
};

export async function getSettings(): Promise<SiteSettings> {
  return { ...(await getSharedSettings()), ...CONTACT };
}
