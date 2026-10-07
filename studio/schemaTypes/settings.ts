import { defineField, defineType } from "sanity";
import { CogIcon } from "@sanity/icons/Cog";

/** Singleton (document id « settings »): contact details shown across the site. */
export const settings = defineType({
  name: "settings",
  title: "Réglages",
  type: "document",
  icon: CogIcon,
  groups: [
    { name: "contact", title: "Contact", default: true },
    { name: "inspection", title: "Inspection" },
    { name: "credit", title: "Crédit" },
    { name: "demandes", title: "Demandes" },
  ],
  fields: [
    defineField({ name: "phone", title: "Téléphone affiché", type: "string", group: "contact", placeholder: "07 73 19 14 33" }),
    defineField({
      name: "whatsapp",
      title: "Numéro WhatsApp",
      description: "Format international, chiffres uniquement : 212773191433",
      type: "string",
      group: "contact",
      validation: (r) => r.regex(/^\d{8,15}$/, { name: "chiffres" }).error("Chiffres uniquement, avec l'indicatif (212…)."),
    }),
    defineField({ name: "email", title: "Email de contact", type: "string", group: "contact", validation: (r) => r.email() }),
    defineField({ name: "address", title: "Adresse du showroom", type: "string", group: "contact" }),
    defineField({ name: "mapsUrl", title: "Lien Google Maps", type: "url", group: "contact" }),
    defineField({ name: "hours", title: "Horaires", type: "string", group: "contact", placeholder: "Lun – Sam · 9h00 – 19h00" }),
    defineField({ name: "instagram", title: "URL Instagram", type: "url", group: "contact" }),
    defineField({ name: "facebook", title: "URL Facebook", type: "url", group: "contact" }),
    defineField({ name: "showroomCity", title: "Ville du showroom", description: "Inspection au showroom.", type: "string", group: "inspection" }),
    defineField({
      name: "homeInspectionCities",
      title: "Villes avec inspection à domicile",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
      group: "inspection",
    }),
    defineField({ name: "loanRate", title: "Taux de crédit indicatif (%)", type: "number", group: "credit", initialValue: 6.9 }),
    defineField({ name: "loanMonths", title: "Durée de crédit par défaut (mois)", type: "number", group: "credit", initialValue: 60 }),
    defineField({
      name: "leadEmail",
      title: "Email qui reçoit les demandes",
      description: "Chaque formulaire envoyé sur le site arrive dans « Demandes » et par email à cette adresse (à défaut : l'email de contact).",
      type: "string",
      group: "demandes",
      validation: (r) => r.email(),
    }),
  ],
  preview: { prepare: () => ({ title: "Réglages du site" }) },
});
