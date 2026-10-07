export type Fuel = "essence" | "diesel" | "hybride" | "electrique";
export type Gearbox = "automatique" | "manuelle";
export type BodyType =
  | "suv"
  | "berline"
  | "break"
  | "citadine"
  | "compacte"
  | "monospace"
  | "coupe"
  | "cabriolet"
  | "pickup"
  | "utilitaire";

/** Photo tabs on the car page (set per photo in Studio › Voiture › Photos). */
export type PhotoCategory = "exterieur" | "interieur" | "moteur" | "tableau-de-bord" | "pneus" | "imperfections";

export interface CarPhoto {
  url: string;
  category: PhotoCategory;
}

export interface Car {
  id: number;
  slug: string;
  brand: string;
  brandSlug: string;
  model: string;
  version: string;
  year: number;
  mileage: number;
  fuel: Fuel;
  gearbox: Gearbox;
  bodyType: BodyType;
  city: string;
  price: number;
  oldPrice?: number;
  fiscalPower?: number;
  doors?: number;
  seats?: number;
  cylinders?: number;
  drivetrain?: string;
  owners?: number;
  origin?: string;
  negotiable?: boolean;
  condition?: string;
  imperfections?: number;
  certified: boolean;
  financeable: boolean;
  privateSeller: boolean;
  noDefects: boolean;
  featured: boolean;
  images: string[];
  /** Same photos as `images`, with their category. Older API responses may omit it. */
  photos?: CarPhoto[];
  reportUrl?: string;
  description?: string;
  features: {
    multimedia: string[];
    confort: string[];
    securite: string[];
    exterieur: string[];
  };
}

export interface Testimonial {
  id: number;
  name: string;
  city?: string;
  rating: number;
  /** Optional short headline shown above the review on the homepage. */
  title?: string;
  text: string;
  avatar?: string;
}

export interface SiteSettings {
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  mapsUrl?: string;
  hours: string;
  instagram?: string;
  facebook?: string;
  loanRate: number; // annual %, e.g. 6.9
  loanMonths: number; // default duration
  /** City of the showroom — inspection at the showroom (Studio › Réglages). */
  showroomCity?: string;
  /** Cities where an expert can inspect the car at home (Studio › Réglages). */
  homeInspectionCities?: string[];
}

/** Listing-type tiles on /acheter (derived from existing car flags). */
export type ListingType = "certifie" | "non-certifie" | "financable" | "sans-imperfection";
/** Availability tiles on /acheter: MoziMotors showroom vs private seller. */
export type Availability = "showroom" | "particulier";

/**
 * Filters read from the /acheter URL. Multi-value params are comma-separated
 * (`?fuel=diesel,hybride`), so single-value links like `?body=suv` keep working.
 * Models are namespaced by brand: `model=peugeot~3008`.
 */
export interface CarFilters {
  type?: ListingType[];
  dispo?: Availability[];
  brand?: string[];
  model?: string[];
  city?: string[];
  body?: string[];
  fuel?: string[];
  gearbox?: string[];
  year?: number[];
  minPrice?: number;
  maxPrice?: number;
  minMileage?: number;
  maxMileage?: number;
  minYear?: number;
  q?: string;
  sort?: "recent" | "price-asc" | "price-desc" | "km-asc";
}
