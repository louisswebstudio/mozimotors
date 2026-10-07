import { defineArrayMember, defineField, defineType, type SlugSourceContext } from "sanity";
import { CarIcon } from "../components/icons";
import { BODY_TYPES, CONDITIONS, DRIVETRAINS, FEATURE_GROUPS, FUELS, GEARBOXES, PHOTO_CATEGORIES, featureOptions } from "./options";

const API_VERSION = "2025-02-19";

type CarDoc = { brand?: { _ref?: string }; model?: { _ref?: string }; version?: string; year?: number; city?: string };

/** « Peugeot 3008 1.5 BlueHDi 2021 Casablanca » → slug, from the referenced brand and model names. */
async function slugSource(doc: CarDoc, { getClient }: SlugSourceContext) {
  const names = await getClient({ apiVersion: API_VERSION }).fetch<{ brand?: string; model?: string }>(
    `{ "brand": *[_id == $b][0].name, "model": *[_id == $m][0].name }`,
    { b: doc.brand?._ref ?? "", m: doc.model?._ref ?? "" },
  );
  return [names.brand, names.model, doc.version, doc.year, doc.city].filter(Boolean).join(" ");
}

export const car = defineType({
  name: "car",
  title: "Voiture",
  type: "document",
  icon: CarIcon,
  groups: [
    { name: "essentiel", title: "Essentiel", default: true },
    { name: "photos", title: "Photos" },
    { name: "details", title: "Détails" },
    { name: "equipements", title: "Équipements" },
    { name: "statut", title: "Statut & badges" },
  ],
  fields: [
    // --- Essentiel -------------------------------------------------------
    defineField({
      name: "sold",
      title: "Vendue",
      description: "Cochez pour retirer la voiture du site sans la supprimer.",
      type: "boolean",
      initialValue: false,
      group: ["essentiel", "statut"],
    }),
    defineField({
      name: "brand",
      title: "Marque",
      type: "reference",
      to: [{ type: "brand" }],
      group: "essentiel",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "model",
      title: "Modèle",
      description: "Choisissez d'abord la marque. Modèle absent ? Créez-le ici avec « Créer » ou dans Marques & modèles.",
      type: "reference",
      to: [{ type: "model" }],
      group: "essentiel",
      options: {
        filter: ({ document }) => {
          const b = (document as CarDoc).brand?._ref;
          return b ? { filter: "brand._ref == $b", params: { b } } : { filter: "false" };
        },
      },
      validation: (r) =>
        r.required().custom(async (value, context) => {
          const b = (context.document as CarDoc | undefined)?.brand?._ref;
          if (!value?._ref || !b) return true;
          const brandOfModel = await context
            .getClient({ apiVersion: API_VERSION })
            .fetch<string | null>(`*[_id == $m][0].brand._ref`, { m: value._ref });
          return brandOfModel === b || "Ce modèle n'appartient pas à la marque choisie.";
        }),
    }),
    defineField({ name: "version", title: "Version / finition", description: "Ex. : 1.5 BlueHDi 130 EAT8 Allure", type: "string", group: "essentiel" }),
    defineField({
      name: "year",
      title: "Année",
      type: "number",
      group: "essentiel",
      validation: (r) => r.required().integer().min(1980).max(new Date().getFullYear() + 1),
    }),
    defineField({ name: "mileage", title: "Kilométrage (km)", type: "number", group: "essentiel", validation: (r) => r.required().integer().min(0) }),
    defineField({ name: "price", title: "Prix (DH)", type: "number", group: "essentiel", validation: (r) => r.required().integer().positive() }),
    defineField({
      name: "oldPrice",
      title: "Ancien prix (DH)",
      description: "Optionnel : affiche une baisse de prix sur le site.",
      type: "number",
      group: "essentiel",
      validation: (r) =>
        r.integer().positive().custom((v, ctx) => {
          const price = (ctx.document as { price?: number } | undefined)?.price;
          return v == null || price == null || v > price || "L'ancien prix doit être supérieur au prix actuel.";
        }),
    }),
    defineField({ name: "fuel", title: "Carburant", type: "string", group: "essentiel", options: { list: FUELS, layout: "radio", direction: "horizontal" }, validation: (r) => r.required() }),
    defineField({ name: "gearbox", title: "Boîte", type: "string", group: "essentiel", options: { list: GEARBOXES, layout: "radio", direction: "horizontal" }, validation: (r) => r.required() }),
    defineField({ name: "bodyType", title: "Carrosserie", type: "string", group: "essentiel", options: { list: BODY_TYPES }, validation: (r) => r.required() }),
    defineField({ name: "city", title: "Ville", type: "string", group: "essentiel", initialValue: "Casablanca", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      title: "Adresse de la page",
      description: "Générée à partir de la marque, du modèle, de la version, de l'année et de la ville — cliquez sur « Generate ».",
      type: "slug",
      group: "essentiel",
      options: { source: slugSource as never, maxLength: 120 },
      validation: (r) => r.required(),
    }),

    // --- Photos ----------------------------------------------------------
    defineField({
      name: "photos",
      title: "Photos",
      description: "Glissez pour réordonner — la première est la photo principale. Choisissez l'onglet de chaque photo (Extérieur, Intérieur…).",
      type: "array",
      group: "photos",
      options: { layout: "grid" },
      of: [
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({ name: "category", title: "Onglet", type: "string", options: { list: PHOTO_CATEGORIES }, initialValue: "exterieur" }),
          ],
        }),
      ],
      validation: (r) => r.min(1).error("Ajoutez au moins une photo."),
    }),

    // --- Détails ---------------------------------------------------------
    defineField({ name: "description", title: "Description", type: "text", rows: 5, group: "details" }),
    defineField({ name: "fiscalPower", title: "Puissance fiscale (CV)", type: "number", group: "details" }),
    defineField({ name: "doors", title: "Portes", type: "number", group: "details" }),
    defineField({ name: "seats", title: "Places", type: "number", group: "details" }),
    defineField({ name: "cylinders", title: "Cylindres", type: "number", group: "details" }),
    defineField({ name: "drivetrain", title: "Transmission", type: "string", group: "details", options: { list: DRIVETRAINS } }),
    defineField({ name: "owners", title: "Nombre de mains", type: "number", group: "details" }),
    defineField({ name: "origin", title: "Origine", description: "Ex. : WW Maroc / Importée", type: "string", group: "details" }),
    defineField({ name: "condition", title: "État général", type: "string", group: "details", options: { list: CONDITIONS } }),
    defineField({ name: "imperfections", title: "Imperfections signalées", type: "number", group: "details" }),
    defineField({ name: "report", title: "Rapport d'expertise (PDF)", type: "file", group: "details", options: { accept: "application/pdf" } }),
    defineField({ name: "reportUrl", title: "…ou lien vers le rapport", description: "Utilisé seulement si aucun PDF n'est importé.", type: "url", group: "details" }),

    // --- Équipements -----------------------------------------------------
    defineField({
      name: "features",
      title: "Équipements",
      description: "Cochez les équipements présents : le site affiche chaque ligne en Oui / Non.",
      type: "object",
      group: "equipements",
      fields: FEATURE_GROUPS.map((g) =>
        defineField({ name: g.name, title: g.title, type: "array", of: [{ type: "string" }], options: { list: featureOptions(g.name), layout: "grid" } }),
      ),
    }),
    defineField({
      name: "otherFeatures",
      title: "Autres équipements",
      description: "Équipements absents des listes ci-dessus.",
      type: "array",
      group: "equipements",
      of: [
        defineArrayMember({
          type: "object",
          name: "otherFeature",
          fields: [
            defineField({ name: "group", title: "Catégorie", type: "string", options: { list: FEATURE_GROUPS.map((g) => ({ title: g.title, value: g.name })) }, validation: (r) => r.required() }),
            defineField({ name: "label", title: "Équipement", type: "string", validation: (r) => r.required() }),
          ],
          preview: { select: { title: "label", subtitle: "group" } },
        }),
      ],
    }),

    // --- Statut & badges -------------------------------------------------
    defineField({ name: "featured", title: "Mise en avant (accueil)", type: "boolean", initialValue: false, group: "statut" }),
    defineField({ name: "certified", title: "Certifiée (inspectée)", type: "boolean", initialValue: true, group: "statut" }),
    defineField({ name: "financeable", title: "Finançable", type: "boolean", initialValue: true, group: "statut" }),
    defineField({ name: "noDefects", title: "Sans imperfection", type: "boolean", initialValue: false, group: "statut" }),
    defineField({ name: "negotiable", title: "Prix négociable", type: "boolean", initialValue: false, group: "statut" }),
    defineField({ name: "privateSeller", title: "Vendeur particulier", description: "Sinon : disponible au showroom MoziMotors.", type: "boolean", initialValue: false, group: "statut" }),
  ],
  orderings: [
    { title: "Ajoutées récemment", name: "createdDesc", by: [{ field: "_createdAt", direction: "desc" }] },
    { title: "Prix croissant", name: "priceAsc", by: [{ field: "price", direction: "asc" }] },
  ],
  preview: {
    select: { brand: "brand.name", model: "model.name", version: "version", year: "year", price: "price", sold: "sold", photo: "photos.0", logo: "brand.logo" },
    prepare: ({ brand, model, version, year, price, sold, photo, logo }) => ({
      title: [brand, model, version].filter(Boolean).join(" ") || "Nouvelle voiture",
      subtitle: [sold ? "VENDUE" : null, year, price ? `${Number(price).toLocaleString("fr-FR")} DH` : null].filter(Boolean).join(" · "),
      // Main photo, or the brand logo while no photo is uploaded.
      media: photo?.asset ? photo : logo,
    }),
  },
});
