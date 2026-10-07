import { defineArrayMember, defineField, defineType } from "sanity";
import { InboxIcon } from "@sanity/icons/Inbox";
import { EmailActions, PhoneActions } from "../components/PhoneActions";
import { LEAD_STATUSES, LEAD_TYPES } from "./options";

/** A form submission from the website (created by web/src/app/api/leads). Only status and notes are edited here. */
export const lead = defineType({
  name: "lead",
  title: "Demande",
  type: "document",
  icon: InboxIcon,
  fields: [
    defineField({ name: "status", title: "Statut", type: "string", options: { list: LEAD_STATUSES, layout: "radio", direction: "horizontal" }, initialValue: "nouveau" }),
    defineField({ name: "notes", title: "Notes internes", type: "text", rows: 3 }),
    defineField({ name: "type", title: "Type", type: "string", options: { list: LEAD_TYPES }, readOnly: true }),
    defineField({ name: "name", title: "Nom", type: "string", readOnly: true }),
    defineField({ name: "phone", title: "Téléphone", type: "string", readOnly: true, components: { input: PhoneActions } }),
    defineField({ name: "email", title: "Email", type: "string", readOnly: true, components: { input: EmailActions } }),
    defineField({ name: "car", title: "Voiture concernée", type: "string", readOnly: true }),
    defineField({ name: "message", title: "Message", type: "text", rows: 4, readOnly: true }),
    defineField({
      name: "details",
      title: "Autres informations du formulaire",
      type: "array",
      readOnly: true,
      of: [
        defineArrayMember({
          type: "object",
          name: "detail",
          fields: [
            defineField({ name: "label", type: "string" }),
            defineField({ name: "value", type: "string" }),
          ],
          preview: { select: { title: "value", subtitle: "label" } },
        }),
      ],
    }),
    defineField({ name: "receivedAt", title: "Reçue le", type: "datetime", readOnly: true }),
  ],
  orderings: [{ title: "Plus récentes", name: "receivedDesc", by: [{ field: "receivedAt", direction: "desc" }] }],
  preview: {
    select: { name: "name", phone: "phone", type: "type", status: "status", car: "car", receivedAt: "receivedAt" },
    prepare: ({ name, phone, type, status, car, receivedAt }) => {
      const typeLabel = LEAD_TYPES.find((t) => t.value === type)?.title ?? "Demande";
      const statusIcon = LEAD_STATUSES.find((s) => s.value === status)?.title.split(" ")[0] ?? "";
      const date = receivedAt ? new Date(receivedAt).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }) : "";
      return { title: `${statusIcon} ${name ?? "?"} — ${phone ?? ""}`, subtitle: [typeLabel, car, date].filter(Boolean).join(" · ") };
    },
  },
});
