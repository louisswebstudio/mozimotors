import type { BodyType, Car, CarPhoto, Fuel, PhotoCategory } from "./types";

const nf = new Intl.NumberFormat("fr-FR");

export const formatPrice = (n: number) => `${nf.format(Math.round(n))} DH`;
export const formatKm = (n: number) => `${nf.format(n)} km`;
export const formatNumber = (n: number) => nf.format(Math.round(n));

/** Standard amortised loan payment. */
export function monthlyPayment(
  principal: number,
  annualRatePct: number,
  months: number,
) {
  if (principal <= 0) return 0;
  const r = annualRatePct / 100 / 12;
  if (r === 0) return principal / months;
  return (principal * r) / (1 - Math.pow(1 + r, -months));
}

/** Inverse: how much can be borrowed for a given monthly payment. */
export function borrowingCapacity(
  monthly: number,
  annualRatePct: number,
  months: number,
) {
  const r = annualRatePct / 100 / 12;
  if (r === 0) return monthly * months;
  return (monthly * (1 - Math.pow(1 + r, -months))) / r;
}

export const carTitle = (c: Car) => `${c.brand} ${c.model}`;

export const FUEL_LABELS: Record<Fuel, string> = {
  essence: "Essence",
  diesel: "Diesel",
  hybride: "Hybride",
  electrique: "Électrique",
};

export const BODY_LABELS: Record<BodyType, string> = {
  suv: "SUV",
  berline: "Berline",
  break: "Break",
  citadine: "Citadine",
  compacte: "Compacte",
  monospace: "Monospace",
  coupe: "Coupé",
  cabriolet: "Cabriolet",
  pickup: "Pick-up",
  utilitaire: "Utilitaire",
};

export const CITIES = [
  "Casablanca",
  "Rabat",
  "Marrakech",
  "Tanger",
  "Fès",
  "Agadir",
  "Kénitra",
  "Meknès",
  "Oujda",
  "Témara",
];

export const PHOTO_CATEGORY_LABELS: Record<PhotoCategory, string> = {
  exterieur: "Extérieur",
  interieur: "Intérieur",
  moteur: "Moteur",
  "tableau-de-bord": "Tableau de bord",
  pneus: "Pneus",
  imperfections: "Imperfections",
};

/** Categorised photos; uncategorised galleries fall back to « Extérieur ». */
export function carPhotos(car: Car): CarPhoto[] {
  if (car.photos?.length) return car.photos;
  return car.images.map((url) => ({ url, category: "exterieur" as const }));
}
