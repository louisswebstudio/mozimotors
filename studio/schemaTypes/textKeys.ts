/**
 * Texts the client can replace from « Textes du site ». Read from the website's French dictionary, so the
 * list always matches the code. Only sections the site renders from the dictionary are listed; the rest of
 * the copy is written in the page components.
 */
import { fr } from "../../web/src/i18n/dictionaries/fr";

const SECTIONS: Record<string, string> = {
  faqPage: "FAQ",
  legal: "Pages légales",
  sellWizard: "Vendre — formulaire",
  leadForm: "Formulaires",
  notFound: "Page introuvable (404)",
};

const DEFAULTS = new Map<string, string>();

function walk(node: unknown, path: string) {
  if (typeof node === "string") DEFAULTS.set(path, node);
  else if (node && typeof node === "object") for (const [k, v] of Object.entries(node)) walk(v, `${path}.${k}`);
}
for (const s of Object.keys(SECTIONS)) walk((fr as Record<string, unknown>)[s], s);

const short = (s: string) => (s.length > 90 ? `${s.slice(0, 87)}…` : s);

export const TEXT_KEYS = [...DEFAULTS].map(([key, text]) => ({ value: key, title: `${SECTIONS[key.split(".")[0]]} — ${short(text)}` }));

export const defaultText = (key?: string) => (key ? DEFAULTS.get(key) : undefined);
