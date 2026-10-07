/**
 * Option lists shared by the schemas. Values must match the website's types (web/src/lib/types.ts):
 * they end up in URLs and filters (/acheter?fuel=diesel), so only the titles may be changed freely.
 */
import { FEATURE_CATALOG, type FeatureGroup } from "../../web/src/lib/feature-catalog";

export const FUELS = [
  { title: "Essence", value: "essence" },
  { title: "Diesel", value: "diesel" },
  { title: "Hybride", value: "hybride" },
  { title: "Électrique", value: "electrique" },
];

export const GEARBOXES = [
  { title: "Automatique", value: "automatique" },
  { title: "Manuelle", value: "manuelle" },
];

export const BODY_TYPES = [
  { title: "SUV", value: "suv" },
  { title: "Berline", value: "berline" },
  { title: "Break", value: "break" },
  { title: "Citadine", value: "citadine" },
  { title: "Compacte", value: "compacte" },
  { title: "Monospace", value: "monospace" },
  { title: "Coupé", value: "coupe" },
  { title: "Cabriolet", value: "cabriolet" },
  { title: "Pick-up", value: "pickup" },
  { title: "Utilitaire", value: "utilitaire" },
];

export const DRIVETRAINS = [
  { title: "2 roues motrices", value: "2WD" },
  { title: "4x4 / AWD", value: "4WD" },
  { title: "Propulsion", value: "RWD" },
];

export const CONDITIONS = ["Comme neuf", "Excellent état", "Très bon état", "Bon état", "État correct"].map((c) => ({ title: c, value: c }));

export const PHOTO_CATEGORIES = [
  { title: "Extérieur", value: "exterieur" },
  { title: "Intérieur", value: "interieur" },
  { title: "Moteur", value: "moteur" },
  { title: "Tableau de bord", value: "tableau-de-bord" },
  { title: "Pneus", value: "pneus" },
  { title: "Imperfections", value: "imperfections" },
];

export const FEATURE_GROUPS: { name: FeatureGroup; title: string }[] = [
  { name: "multimedia", title: "Multimédia" },
  { name: "confort", title: "Confort" },
  { name: "securite", title: "Sécurité" },
  { name: "exterieur", title: "Extérieur" },
];

/** Checkbox options for one equipment group: the site shows each of them as a Oui / Non row. */
export const featureOptions = (group: FeatureGroup) => FEATURE_CATALOG[group].map((i) => ({ title: i.fr, value: i.fr }));

export const LEAD_TYPES = [
  { title: "Réservation", value: "reservation" },
  { title: "Estimation (vendre)", value: "estimation" },
  { title: "Financement", value: "financement" },
  { title: "Contact", value: "contact" },
  { title: "Essai", value: "essai" },
];

export const LEAD_STATUSES = [
  { title: "🆕 Nouveau", value: "nouveau" },
  { title: "📞 En cours", value: "en-cours" },
  { title: "✅ Traité", value: "traite" },
  { title: "❌ Sans suite", value: "sans-suite" },
];
