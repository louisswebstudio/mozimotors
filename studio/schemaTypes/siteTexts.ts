import { defineArrayMember, defineField, defineType } from "sanity";
import { TranslateIcon } from "@sanity/icons/Translate";
import { TEXT_KEYS, defaultText } from "./textKeys";

/**
 * Singleton (document id « siteTexts »): replaces built-in texts of the site (FAQ, legal pages, sell form…).
 * Each entry targets one text by its key; empty languages keep the built-in text.
 */
export const siteTexts = defineType({
  name: "siteTexts",
  title: "Textes du site",
  type: "document",
  icon: TranslateIcon,
  fields: [
    defineField({
      name: "overrides",
      title: "Textes modifiés",
      description: "Ajoutez un élément, choisissez le texte à remplacer, puis saisissez la nouvelle version. Laissez une langue vide pour garder le texte d'origine.",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "textOverride",
          fields: [
            defineField({
              name: "key",
              title: "Texte à remplacer",
              type: "string",
              options: { list: TEXT_KEYS },
              validation: (r) =>
                r.required().custom((key, ctx) => {
                  const all = ((ctx.document as { overrides?: { key?: string }[] })?.overrides ?? []).filter((o) => o.key === key);
                  return all.length <= 1 || "Ce texte est déjà modifié plus haut dans la liste.";
                }),
            }),
            defineField({ name: "fr", title: "Français", type: "text", rows: 3 }),
            defineField({ name: "en", title: "English", type: "text", rows: 3 }),
            defineField({ name: "ar", title: "العربية", type: "text", rows: 3 }),
          ],
          preview: {
            select: { key: "key", fr: "fr" },
            prepare: ({ key, fr }) => ({ title: fr || defaultText(key) || key, subtitle: TEXT_KEYS.find((k) => k.value === key)?.title.split(" — ")[0] }),
          },
        }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "Textes du site" }) },
});
