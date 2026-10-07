/** Server-side helpers shared by /v2 and /v2/acheter: MoziMotors `Car` → siaracash.ma card data, sorting. */
import { BODY_LABELS, carPhotos, formatKm, formatPrice, FUEL_LABELS } from "@/lib/format";
import { FEATURE_CATALOG, featureKey, type FeatureGroup } from "@/lib/feature-catalog";
import type { Car } from "@/lib/types";
import type { CarCardData } from "./CarCard";
import type { FeatureTab, Highlight } from "./CarSections";

export type ListedCar = CarCardData & {
  priceValue: number;
  fuel: string;
  gearbox: string;
  km: string;
};

export function toListed(c: Car): ListedCar {
  const gearbox = c.gearbox === "automatique" ? "Automatique" : "Manuelle";
  return {
    id: c.slug,
    href: `/voiture/${c.slug}`,
    title: `${c.brand} ${c.model} ${c.year}`,
    version: c.version,
    images: c.images,
    chips: [formatKm(c.mileage), gearbox, FUEL_LABELS[c.fuel]],
    fuel: FUEL_LABELS[c.fuel],
    gearbox,
    km: formatKm(c.mileage),
    price: formatPrice(c.price),
    priceValue: c.price,
    city: c.city,
    privateSeller: c.privateSeller,
    certified: c.certified,
  };
}

/** « Trier par » (see ListingView). Empty / unknown = « Recommandé » = newest first. */
const SORTERS: Record<string, (a: Car, b: Car) => number> = {
  recommande: (a, b) => b.id - a.id,
  "price-asc": (a, b) => a.price - b.price,
  "price-desc": (a, b) => b.price - a.price,
  "km-asc": (a, b) => a.mileage - b.mileage,
  "km-desc": (a, b) => b.mileage - a.mileage,
  "year-desc": (a, b) => b.year - a.year || b.id - a.id,
  "year-asc": (a, b) => a.year - b.year || b.id - a.id,
};

export const sortCars = (cars: Car[], sort?: string) => [...cars].sort(SORTERS[sort ?? ""] ?? SORTERS.recommande);

/* ---------- car page ---------- */

const GROUP_LABELS: Record<FeatureGroup, string> = { multimedia: "Multimédia", confort: "Confort", securite: "Sécurité", exterieur: "Extérieur" };
const ownersLabel = (n?: number) => (!n ? undefined : n === 1 ? "1ère main" : `${n}ème main`);

/** Everything the siaracash.ma-style car page needs, from a MoziMotors car. */
export function toDetail(car: Car, cars: Car[]) {
  const listed = toListed(car);
  const photos = carPhotos(car);
  const fiscal = car.fiscalPower ? `${car.fiscalPower} CV` : undefined;
  const owners = ownersLabel(car.owners);

  const overview = (
    [
      ["Marque", car.brand],
      ["Modèle", car.model],
      ["Finition", car.version],
      ["Année", String(car.year)],
      ["Kilométrage", formatKm(car.mileage)],
      ["Carburant", FUEL_LABELS[car.fuel]],
      ["Boîte", listed.gearbox],
      ["Type de transmission", car.drivetrain],
      ["Carrosserie", BODY_LABELS[car.bodyType]],
      ["Puissance", fiscal],
    ] as [string, string | undefined][]
  ).filter((r): r is [string, string] => Boolean(r[1]));

  const summary: FeatureTab["rows"] = [
    ...overview.map(([label, value]) => ({ label, value })),
    ...(
      [
        ["Nombre de cylindres", car.cylinders && String(car.cylinders)],
        ["Portes", car.doors && String(car.doors)],
        ["Places", car.seats && String(car.seats)],
        ["Propriétaires", owners],
        ["État", car.condition],
        ["Origine", car.origin],
        ["Ville", car.city],
      ] as [string, string | undefined | 0][]
    )
      .filter((r): r is [string, string] => Boolean(r[1]))
      .map(([label, value]) => ({ label, value })),
    ...(car.negotiable == null ? [] : [{ label: "Prix négociable", value: car.negotiable }]),
  ];

  const tabs: FeatureTab[] = [
    { id: "resume", label: "Résumé", rows: summary },
    ...(Object.keys(FEATURE_CATALOG) as FeatureGroup[]).map((g) => {
      const have = new Set((car.features?.[g] ?? []).map(featureKey));
      const known = new Set(FEATURE_CATALOG[g].map((i) => featureKey(i.fr)));
      const rows = [
        ...FEATURE_CATALOG[g].map((i) => ({ label: i.fr, value: have.has(featureKey(i.fr)) })),
        // Equipment added in Studio (« Autres équipements ») that isn't in the catalog: shown as « Oui ».
        ...(car.features?.[g] ?? []).filter((f) => !known.has(featureKey(f))).map((f) => ({ label: f, value: true })),
      ];
      return { id: g, label: GROUP_LABELS[g], rows };
    }),
  ];

  const hasComfort = (car.features?.confort?.length ?? 0) + (car.features?.multimedia?.length ?? 0) >= 3;
  const highlights: Highlight[] = [
    {
      icon: "badge",
      title: "Bon prix du marché",
      text: "Un prix juste, calculé selon la cote du marché automobile marocain, pour acheter en toute confiance.",
    },
    ...(car.certified
      ? [
          {
            icon: "check" as const,
            title: "Inspectée",
            text: "Ce véhicule a été inspecté sur plus de 140 points par nos experts MoziMotors avant sa mise en vente.",
          },
        ]
      : []),
    ...(car.mileage < 100_000 ? [{ icon: "shield" as const, title: "Faible kilométrage", text: "Roulez plus, dépensez moins." }] : []),
    ...(car.owners === 1
      ? [{ icon: "car" as const, title: "Première main", text: "Ce véhicule n'a eu qu'un seul propriétaire depuis sa première mise en circulation." }]
      : []),
    ...(hasComfort
      ? [
          {
            icon: "gauge" as const,
            title: "Équipements essentiels",
            text: "Climatisation, vitres électriques et système multimédia : tout le confort essentiel au quotidien.",
          },
        ]
      : []),
  ];

  const similar = cars
    .filter((c) => c.id !== car.id && (c.brandSlug === car.brandSlug || c.bodyType === car.bodyType))
    .slice(0, 8)
    .map((c) => toListed(c));

  return {
    listed,
    photos,
    overview,
    tabs,
    highlights,
    similar,
    owners,
    serenity: car.certified ? ["Aucun accident majeur", "Kilométrage vérifié"] : [],
    condition: car.condition || (car.noDefects ? "Très bon état" : "Bon état"),
    imperfections: car.noDefects ? 0 : (car.imperfections ?? 0),
    rdv: { id: car.slug, title: listed.title, version: car.version, price: listed.price, image: photos[0]?.url, city: car.city },
  };
}
export type CarDetail = ReturnType<typeof toDetail>;
