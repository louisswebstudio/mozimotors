import { brand } from "./brand";
import { car } from "./car";
import { lead } from "./lead";
import { model } from "./model";
import { settings } from "./settings";
import { siteTexts } from "./siteTexts";
import { testimonial } from "./testimonial";

export const schemaTypes = [car, brand, model, testimonial, lead, settings, siteTexts];

/** Documents that exist exactly once (fixed id = type name). */
export const SINGLETONS = new Set(["settings", "siteTexts"]);
