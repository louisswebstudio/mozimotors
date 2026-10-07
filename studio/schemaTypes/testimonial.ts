import { defineField, defineType } from "sanity";
import { CommentIcon } from "@sanity/icons/Comment";

export const testimonial = defineType({
  name: "testimonial",
  title: "Témoignage",
  type: "document",
  icon: CommentIcon,
  fields: [
    defineField({ name: "name", title: "Nom du client", type: "string", validation: (r) => r.required() }),
    defineField({ name: "city", title: "Ville", type: "string" }),
    defineField({ name: "rating", title: "Note (1 à 5)", type: "number", initialValue: 5, options: { list: [5, 4, 3, 2, 1] }, validation: (r) => r.required().min(1).max(5) }),
    defineField({ name: "title", title: "Titre court (optionnel)", description: "Affiché au-dessus de l'avis sur l'accueil.", type: "string" }),
    defineField({ name: "text", title: "Avis", type: "text", rows: 4, validation: (r) => r.required() }),
    defineField({ name: "avatar", title: "Photo du client (optionnelle)", type: "image", options: { hotspot: true } }),
  ],
  preview: {
    select: { name: "name", city: "city", rating: "rating", media: "avatar" },
    prepare: ({ name, city, rating, media }) => ({ title: name, subtitle: [`${"★".repeat(rating ?? 0)}`, city].filter(Boolean).join(" · "), media }),
  },
});
