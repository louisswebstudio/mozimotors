import { defineField, defineType } from "sanity";
import { CarIcon } from "../components/icons";

export const model = defineType({
  name: "model",
  title: "Modèle",
  type: "document",
  icon: CarIcon,
  fields: [
    defineField({
      name: "brand",
      title: "Marque",
      type: "reference",
      to: [{ type: "brand" }],
      options: { disableNew: true },
      validation: (r) => r.required(),
    }),
    defineField({ name: "name", title: "Nom du modèle", description: "Sans la marque : « 3008 », « Classe A ».", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      title: "Identifiant URL",
      type: "slug",
      options: { source: "name" },
      validation: (r) => r.required(),
    }),
  ],
  orderings: [{ title: "Marque puis modèle", name: "brandName", by: [{ field: "brand.name", direction: "asc" }, { field: "name", direction: "asc" }] }],
  preview: {
    select: { name: "name", brand: "brand.name", media: "brand.logo" },
    prepare: ({ name, brand, media }) => ({ title: [brand, name].filter(Boolean).join(" "), media }),
  },
});
