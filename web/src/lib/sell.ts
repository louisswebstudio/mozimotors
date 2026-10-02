import type { SiteSettings } from "./types";

/** Cities offered in the sell wizard's search (major Moroccan cities + « Autre ville »). */
export const SELL_CITIES = [
  "Agadir", "Aïn Harrouda", "Al Hoceïma", "Azemmour", "Béni Mellal", "Benslimane", "Berkane", "Berrechid",
  "Bouskoura", "Bouznika", "Casablanca", "Dakhla", "Dar Bouazza", "El Jadida", "Errachidia", "Essaouira",
  "Fès", "Guelmim", "Ifrane", "Kénitra", "Khémisset", "Khénifra", "Khouribga", "Laâyoune", "Larache",
  "Marrakech", "Meknès", "Mohammadia", "Nador", "Ouarzazate", "Oujda", "Rabat", "Safi", "Salé", "Settat",
  "Sidi Kacem", "Sidi Slimane", "Skhirat", "Tanger", "Taza", "Témara", "Tétouan", "Tiznit",
];

export const OTHER_CITY = "Autre ville";

export type Coverage = "showroom" | "domicile" | "none";

const norm = (s: string) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

/** What inspection we can offer in a city (showroom city also gets home inspection if listed). */
export function coverageFor(city: string, s: Pick<SiteSettings, "showroomCity" | "homeInspectionCities">) {
  const atShowroom = Boolean(s.showroomCity && norm(city) === norm(s.showroomCity));
  const atHome = (s.homeInspectionCities ?? []).some((c) => norm(c) === norm(city));
  return { atShowroom, atHome, level: (atShowroom ? "showroom" : atHome ? "domicile" : "none") as Coverage };
}

/** Brands offered in the wizard (Moroccan market). */
export const SELL_BRANDS = [
  "Alfa Romeo", "Audi", "BMW", "BYD", "Chery", "Chevrolet", "Citroën", "Cupra", "Dacia", "DS", "Fiat", "Ford",
  "Geely", "Honda", "Hyundai", "Jaguar", "Jeep", "Kia", "Land Rover", "Lexus", "Mazda", "Mercedes-Benz", "MG",
  "Mini", "Mitsubishi", "Nissan", "Opel", "Peugeot", "Porsche", "Renault", "Seat", "Skoda", "Suzuki", "Toyota",
  "Volkswagen", "Volvo", "Autre",
];

export const CONDITIONS = [
  { value: "excellent", label: "Excellent", hint: "Aucun défaut visible" },
  { value: "bon", label: "Bon", hint: "Quelques traces d'usage" },
  { value: "moyen", label: "Moyen", hint: "Défauts ou réparations à prévoir" },
] as const;

export const SELL_DOCUMENTS = ["Carte grise", "Carnet d'entretien", "Double des clés", "Procuration"];

/** Morocco phone → "+2126XXXXXXXX", or null if invalid (06/07/05 + 8 digits). */
export function normalizeMaPhone(input: string) {
  const d = input.replace(/\D/g, "");
  const local = d.startsWith("212") ? d.slice(3) : d.startsWith("0") ? d.slice(1) : d;
  return /^[5-7]\d{8}$/.test(local) ? `+212${local}` : null;
}

/** Next working days (Mon–Sat) starting tomorrow, for the inspection slot picker. */
export function nextInspectionDays(count = 8, from = new Date()) {
  const days: Date[] = [];
  const d = new Date(from);
  d.setHours(12, 0, 0, 0);
  while (days.length < count) {
    d.setDate(d.getDate() + 1);
    if (d.getDay() !== 0) days.push(new Date(d));
  }
  return days;
}
