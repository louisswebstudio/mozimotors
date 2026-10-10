"use client";

/** Below the results on siaracash.ma/lists: « Les engagements » and the FAQ accordion. */
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { A } from "./assets";
import { useV2 } from "./V2Locale";

const EDGE = [
  { img: "edge-inspection", label: "Inspection 140+ points" },
  { img: "edge-rapport", label: "Rapport sur l'état du véhicule" },
  { img: "edge-immatriculation", label: "Contrôle d'opposition (NARSA)" },
  { img: "edge-financement", label: "Essai avant achat" },
  { img: "edge-demarches", label: "Accompagnement dans les démarches administratives" },
  { img: "edge-garantie", label: "Paiement 100% sécurisé" },
];

const FAQ = [
  {
    q: "Quel est le prix de départ d'une voiture d'occasion chez MoziMotors ?",
    a: "Nos voitures d'occasion certifiées démarrent à partir de quelques dizaines de milliers de dirhams, avec de nouvelles annonces ajoutées chaque jour.",
  },
  { q: "Puis-je essayer la voiture avant de l'acheter ?", a: "Oui — réservez un essai dans le showroom MoziMotors le plus proche." },
  { q: "La carte grise est-elle incluse ?", a: "Oui, le transfert de carte grise est inclus pour les voitures du stock MoziMotors." },
  { q: "Les prix sont-ils négociables ?", a: "Nos prix sont étudiés et alignés sur le marché : vous payez le juste prix, sans négociation interminable." },
  { q: "Puis-je voir le rapport d'expertise avant d'acheter ?", a: "Oui, chaque voiture du stock MoziMotors est livrée avec un rapport d'expertise complet." },
  { q: "L'achat se fait-il en ligne ?", a: "Vous pouvez réserver en ligne et finaliser au showroom, en toute sécurité." },
];

const H2 = "mb-2.5 pb-1.5 text-[17px] font-bold !text-[var(--cc-primary)] lg:mb-3 lg:text-[20px]";

function Faq() {
  const { t } = useV2();
  const [open, setOpen] = useState(0);
  return (
    <div>
      <h2 className={H2}>{t("Questions fréquentes")}</h2>
      <div className="cc-card p-4 lg:p-5">
        <div>
          {FAQ.map((item, i) => {
            const on = open === i;
            return (
              <div key={item.q} className="border-b border-[var(--cc-line)] last:border-0">
                <button
                  className="flex w-full items-center justify-between gap-3 py-4 text-left text-[15px] font-semibold text-[var(--cc-ink)]"
                  aria-expanded={on}
                  onClick={() => setOpen(on ? -1 : i)}
                >
                  {t(item.q)}
                  <ChevronDown className={`cc-chev size-5 shrink-0 text-[var(--cc-muted)] ${on ? "cc-open" : ""}`} aria-hidden="true" />
                </button>
                <div className={`cc-acc-body ${on ? "cc-open" : ""}`}>
                  <div>
                    <div className="pb-4 text-[14px] leading-relaxed text-[var(--cc-body)]">{t(item.a)}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function ListingExtras() {
  const { t } = useV2();
  return (
    <>
      <div className="mt-8">
        <h2 className={H2}>{t("Les engagements MoziMotors")}</h2>
        <div className="cc-card p-4 lg:p-5">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4">
            {EDGE.map((e) => (
              <div key={e.img} className="flex items-center gap-3.5 rounded-[14px] px-4 py-3.5 transition-colors bg-[color:var(--color-surface-soft)]">
                <span className="flex size-14 shrink-0 items-center justify-center rounded-[14px] bg-[color:var(--color-brand-purple-soft)]">
                  <img
                    alt=""
                    aria-hidden="true"
                    loading="lazy"
                    width="40"
                    height="40"
                    className="size-10 object-contain"
                    src={`${A}/assets/${e.img === "edge-financement" ? "sell2/exp-essai" : `home/${e.img}`}-mozi.webp`}
                  />
                </span>
                <p className="text-start text-[14.5px] font-semibold leading-[1.3] text-[color:var(--color-ink-strong)]">{t(e.label)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="cc-stack mt-8">
        <Faq />
      </div>
    </>
  );
}
