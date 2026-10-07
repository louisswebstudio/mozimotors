import { defineConfig, type DocumentActionComponent } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { LaunchIcon } from "@sanity/icons/Launch";
import { SINGLETONS, schemaTypes } from "./schemaTypes";
import { structure } from "./structure";

const SITE_URL = (process.env.SANITY_STUDIO_SITE_URL || "https://www.mozimotors.ma").replace(/\/$/, "");

/** « Voir sur le site » on a published car. */
const ViewOnSite: DocumentActionComponent = ({ published }) => {
  const slug = (published as { slug?: { current?: string } } | null)?.slug?.current;
  return {
    label: "Voir sur le site",
    icon: LaunchIcon,
    disabled: !slug,
    title: slug ? undefined : "Publiez d'abord la voiture",
    onHandle: () => {
      window.open(`${SITE_URL}/voiture/${slug}`, "_blank", "noopener");
    },
  };
};

export default defineConfig({
  name: "default",
  title: "MoziMotors",
  projectId: process.env.SANITY_STUDIO_PROJECT_ID!,
  dataset: process.env.SANITY_STUDIO_DATASET || "production",

  plugins: [structureTool({ structure }), visionTool({ defaultApiVersion: "2025-02-19" })],

  schema: {
    types: schemaTypes,
    templates: (prev) => [
      // Singletons and leads are never created from the « + » menu.
      ...prev.filter((t) => !SINGLETONS.has(t.schemaType) && t.schemaType !== "lead"),
      {
        id: "model-by-brand",
        title: "Modèle de cette marque",
        schemaType: "model",
        parameters: [{ name: "brandId", type: "string" }],
        value: ({ brandId }: { brandId: string }) => ({ brand: { _type: "reference", _ref: brandId } }),
      },
    ],
  },

  document: {
    newDocumentOptions: (prev) => prev.filter((t) => t.templateId !== "model-by-brand"),
    actions: (prev, { schemaType }) => {
      // Singletons: no duplicate / delete / unpublish.
      if (SINGLETONS.has(schemaType)) return prev.filter(({ action }) => action === "publish" || action === "discardChanges" || action === "restore");
      if (schemaType === "lead") return prev.filter(({ action }) => action !== "duplicate");
      if (schemaType === "car") return [...prev, ViewOnSite];
      return prev;
    },
  },
});
