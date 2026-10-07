/**
 * Master list of equipment shown on a car page as Oui/Non rows.
 * `fr` is the canonical label: CMS values stay French, so a car "has" an item
 * when its French feature string matches (accent/case-insensitive). `en` / `ar` are display translations only.
 */
export type FeatureGroup = "multimedia" | "confort" | "securite" | "exterieur";

export interface CatalogItem { icon: string; fr: string; en: string; ar: string }

export const FEATURE_CATALOG: Record<FeatureGroup, CatalogItem[]> = {
  multimedia: [
    { icon: "Tablet", fr: "Écran tactile", en: "Touchscreen", ar: "شاشة لمس" },
    { icon: "Smartphone", fr: "Apple CarPlay / Android Auto", en: "Apple CarPlay / Android Auto", ar: "Apple CarPlay / Android Auto" },
    { icon: "Bluetooth", fr: "Bluetooth", en: "Bluetooth", ar: "بلوتوث" },
    { icon: "Usb", fr: "Prises USB", en: "USB ports", ar: "منافذ USB" },
    { icon: "Navigation", fr: "GPS", en: "GPS navigation", ar: "نظام ملاحة GPS" },
    { icon: "Speaker", fr: "Système audio premium", en: "Premium sound system", ar: "نظام صوت متميز" },
    { icon: "BatteryCharging", fr: "Recharge smartphone sans fil", en: "Wireless phone charger", ar: "شاحن هاتف لاسلكي" },
  ],
  confort: [
    { icon: "Snowflake", fr: "Climatisation automatique", en: "Automatic climate control", ar: "تكييف أوتوماتيكي" },
    { icon: "ArrowUpDown", fr: "Vitres électriques", en: "Electric windows", ar: "نوافذ كهربائية" },
    { icon: "Gauge", fr: "Régulateur de vitesse", en: "Cruise control", ar: "مثبت السرعة" },
    { icon: "Key", fr: "Démarrage sans clé", en: "Keyless start", ar: "تشغيل بدون مفتاح" },
    { icon: "Flame", fr: "Sièges chauffants", en: "Heated seats", ar: "مقاعد مدفأة" },
    { icon: "Armchair", fr: "Sièges en cuir", en: "Leather seats", ar: "مقاعد جلدية" },
    { icon: "CircleDot", fr: "Volant multifonction", en: "Multifunction steering wheel", ar: "مقود متعدد الوظائف" },
  ],
  securite: [
    { icon: "Disc", fr: "ABS", en: "ABS", ar: "ABS" },
    { icon: "Activity", fr: "ESP", en: "ESP", ar: "ESP" },
    { icon: "ShieldPlus", fr: "6 airbags", en: "6 airbags", ar: "6 وسائد هوائية" },
    { icon: "Radar", fr: "Radar de recul", en: "Parking sensors", ar: "حساسات ركن" },
    { icon: "Camera", fr: "Caméra de recul", en: "Rear camera", ar: "كاميرا خلفية" },
    { icon: "Mountain", fr: "Aide au démarrage en côte", en: "Hill-start assist", ar: "مساعدة الانطلاق على المنحدرات" },
    { icon: "Route", fr: "Alerte de franchissement de ligne", en: "Lane departure warning", ar: "تنبيه مغادرة المسار" },
    { icon: "OctagonAlert", fr: "Freinage d'urgence automatique", en: "Automatic emergency braking", ar: "فرملة طوارئ أوتوماتيكية" },
  ],
  exterieur: [
    { icon: "Sun", fr: "Toit ouvrant", en: "Sunroof", ar: "سقف بانورامي" },
    { icon: "Disc3", fr: "Jantes alliage", en: "Alloy wheels", ar: "جنوط ألمنيوم" },
    { icon: "Rows3", fr: "Barres de toit", en: "Roof rails", ar: "قضبان السقف" },
    { icon: "Contrast", fr: "Vitres teintées", en: "Tinted windows", ar: "زجاج معتم" },
    { icon: "Lightbulb", fr: "Feux LED", en: "LED headlights", ar: "مصابيح LED" },
    { icon: "FlipHorizontal2", fr: "Rétroviseurs rabattables électriquement", en: "Power-folding mirrors", ar: "مرايا قابلة للطي كهربائيًا" },
  ],
};

export const FEATURE_GROUPS = Object.keys(FEATURE_CATALOG) as FeatureGroup[];

/** Accent-, case- and punctuation-insensitive key used to match CMS feature strings to the catalog. */
export const featureKey = (s: string) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9؀-ۿ]+/g, "");
