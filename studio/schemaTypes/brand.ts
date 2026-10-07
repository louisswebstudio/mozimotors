import { defineField, defineType } from "sanity";
import { TagIcon } from "@sanity/icons/Tag";

export const brand = defineType({
  name: "brand",
  title: "Marque",
  type: "document",
  icon: TagIcon,
  fields: [
    defineField({ name: "name", title: "Nom", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      title: "Identifiant URL",
      description: "Utilisé dans les filtres du site (/acheter?brand=…). À ne pas modifier une fois des voitures publiées.",
      type: "slug",
      options: { source: "name" },
      validation: (r) => r.required(),
    }),
    defineField({ name: "logo", title: "Logo (optionnel)", type: "image" }),
  ],
  orderings: [{ title: "Nom", name: "name", by: [{ field: "name", direction: "asc" }] }],
  preview: { select: { title: "name", media: "logo" } },
});
