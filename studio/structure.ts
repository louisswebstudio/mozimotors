import type { StructureResolver } from "sanity/structure";
import { CogIcon } from "@sanity/icons/Cog";
import { CommentIcon } from "@sanity/icons/Comment";
import { InboxIcon } from "@sanity/icons/Inbox";
import { TagIcon } from "@sanity/icons/Tag";
import { TranslateIcon } from "@sanity/icons/Translate";
import { CarIcon } from "./components/icons";

const API_VERSION = "2025-02-19";

/** Left-hand menu of the Studio, in the client's language and order of daily use. */
export const structure: StructureResolver = (S) =>
  S.list()
    .title("MoziMotors")
    .items([
      S.listItem()
        .title("Voitures en vente")
        .icon(CarIcon)
        .child(
          S.documentList()
            .title("Voitures en vente")
            .apiVersion(API_VERSION)
            .schemaType("car")
            .filter('_type == "car" && sold != true')
            .defaultOrdering([{ field: "_createdAt", direction: "desc" }])
            .initialValueTemplates([S.initialValueTemplateItem("car")]),
        ),
      S.listItem()
        .title("Voitures vendues")
        .icon(CarIcon)
        .child(
          S.documentList()
            .title("Voitures vendues")
            .apiVersion(API_VERSION)
            .schemaType("car")
            .filter('_type == "car" && sold == true')
            .defaultOrdering([{ field: "_updatedAt", direction: "desc" }]),
        ),
      S.divider(),
      S.listItem()
        .title("Demandes")
        .icon(InboxIcon)
        .child(
          S.list()
            .title("Demandes")
            .items([
              S.listItem()
                .title("À traiter")
                .child(
                  S.documentList()
                    .title("À traiter")
                    .apiVersion(API_VERSION)
                    .schemaType("lead")
                    .filter('_type == "lead" && status in ["nouveau", "en-cours"]')
                    .defaultOrdering([{ field: "receivedAt", direction: "desc" }])
                    .initialValueTemplates([]),
                ),
              S.listItem()
                .title("Toutes les demandes")
                .child(
                  S.documentList()
                    .title("Toutes les demandes")
                    .apiVersion(API_VERSION)
                    .schemaType("lead")
                    .filter('_type == "lead"')
                    .defaultOrdering([{ field: "receivedAt", direction: "desc" }])
                    .initialValueTemplates([]),
                ),
            ]),
        ),
      S.divider(),
      S.listItem()
        .title("Marques & modèles")
        .icon(TagIcon)
        .child(
          S.list()
            .title("Marques & modèles")
            .items([
              S.listItem()
                .title("Modèles par marque")
                .child(
                  S.documentTypeList("brand")
                    .title("Choisir une marque")
                    .defaultOrdering([{ field: "name", direction: "asc" }])
                    .child((brandId) =>
                      S.documentList()
                        .title("Modèles")
                        .apiVersion(API_VERSION)
                        .schemaType("model")
                        .filter('_type == "model" && brand._ref == $brandId')
                        .params({ brandId })
                        .defaultOrdering([{ field: "name", direction: "asc" }])
                        .initialValueTemplates([S.initialValueTemplateItem("model-by-brand", { brandId })]),
                    ),
                ),
              S.documentTypeListItem("brand")
                .title("Toutes les marques")
                .child(S.documentTypeList("brand").title("Toutes les marques").defaultOrdering([{ field: "name", direction: "asc" }])),
              S.documentTypeListItem("model")
                .title("Tous les modèles")
                .child(
                  S.documentTypeList("model")
                    .title("Tous les modèles")
                    .defaultOrdering([{ field: "brand.name", direction: "asc" }, { field: "name", direction: "asc" }]),
                ),
            ]),
        ),
      S.documentTypeListItem("testimonial").title("Témoignages").icon(CommentIcon),
      S.divider(),
      S.listItem().title("Réglages").icon(CogIcon).child(S.document().schemaType("settings").documentId("settings").title("Réglages")),
      S.listItem().title("Textes du site").icon(TranslateIcon).child(S.document().schemaType("siteTexts").documentId("siteTexts").title("Textes du site")),
    ]);
