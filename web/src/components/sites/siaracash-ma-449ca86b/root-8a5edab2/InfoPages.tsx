"use client";

/**
 * siaracash.ma /faq layout (two themed columns of accordion cards + help band) and
 * /terms-conditions-style legal article, filled with MoziMotors' own content (French dictionary).
 */
import { useState } from "react";
import { ArrowRight, ChevronDown, Headset } from "lucide-react";
import { telLink } from "./assets";
import { useV2 } from "./V2Locale";

type QA = { q: string; a: string };

function FaqColumn({ title, lead, items, head, button }: { title: string; lead: string; items: QA[]; head: string; button: string }) {
  const { t } = useV2();
  const [open, setOpen] = useState<number | null>(null);
  const [all, setAll] = useState(false);
  const shown = all ? items : items.slice(0, 6);
  return (
    <div>
      <div className={`${head} rounded-2xl p-6 sm:p-8 mb-6`}>
        <h2 className="text-xl sm:text-2xl font-bold text-white">{t(title)}</h2>
        <p className="text-sm text-white/70 mt-1">{t(lead)}</p>
      </div>
      <div className="space-y-3">
        {shown.map((item, i) => {
          const on = open === i;
          return (
            <div
              key={item.q}
              className={`border rounded-xl overflow-hidden transition-colors ${on ? "border-[color:var(--color-brand-teal)]" : "border-[color:var(--color-line-soft)]"}`}
            >
              <button aria-expanded={on} onClick={() => setOpen(on ? null : i)} className="w-full flex items-center justify-between px-5 py-4 text-start">
                <span className="text-[14px] font-medium text-[color:var(--color-ink-strong)] pe-4">{item.q}</span>
                <ChevronDown
                  className={`size-4 text-[color:var(--color-ink-muted)] flex-shrink-0 transition-transform ${on ? "rotate-180" : ""}`}
                  aria-hidden="true"
                />
              </button>
              {on && <div className="px-5 pb-4 text-[14px] leading-relaxed text-[color:var(--color-ink-base)]">{item.a}</div>}
            </div>
          );
        })}
      </div>
      {items.length > 6 && (
        <button
          onClick={() => setAll((a) => !a)}
          className={`mt-6 w-full flex items-center justify-center gap-2 py-4 ${button} text-white font-semibold rounded-xl transition-colors`}
        >
          {t(all ? "Moins de questions" : "Parcourir toutes les questions")} <ArrowRight className={`size-4 ${all ? "-rotate-90" : ""}`} aria-hidden="true" />
        </button>
      )}
    </div>
  );
}

export function FaqTwoColumns({ buy, sell, phone, hours }: { buy: QA[]; sell: QA[]; phone: string; hours?: string }) {
  const { t } = useV2();
  return (
    <div className="bg-white">
      <section className="relative overflow-hidden bg-[color:var(--color-surface-soft)] border-b border-[color:var(--color-line-soft)]">
        <div className="mx-auto max-w-[1920px] px-4 sm:px-8 lg:px-12 py-14 sm:py-20 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-[color:var(--color-ink-strong)]">{t("Questions fréquentes")}</h1>
        </div>
      </section>
      <section className="mx-auto max-w-[1920px] px-4 sm:px-8 lg:px-12 py-12 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <FaqColumn
            title={t("Acheter une voiture chez MoziMotors ?")}
            lead="Tout sur l'inspection, les essais, les démarches, etc."
            items={buy}
            head="bg-gradient-to-r from-[color:var(--color-brand-navy)] to-[color:var(--color-brand-teal)]"
            button="bg-[color:var(--color-brand-teal)] hover:bg-[color:var(--color-brand-teal-hover)]"
          />
          <FaqColumn
            title={t("Vendre votre voiture à MoziMotors ?")}
            lead="Tout sur les inspections, l'évaluation, le paiement, le transfert de propriété, etc."
            items={sell}
            head="bg-gradient-to-r from-[color:var(--color-ink-strong)] to-[color:var(--color-ink-base)]"
            button="bg-[color:var(--color-brand-teal)] hover:bg-[color:var(--color-brand-teal-hover)]"
          />
        </div>
      </section>
      <section className="mx-auto max-w-[1920px] px-4 sm:px-8 lg:px-12 pb-12">
        <div className="bg-[color:var(--color-brand-teal-soft)] rounded-2xl py-4 px-6 flex items-center justify-center gap-3 text-center">
          <Headset className="size-5 text-[color:var(--color-brand-navy)] flex-shrink-0" aria-hidden="true" />
          <p className="text-sm text-[color:var(--color-ink-base)]">
            {t("Nous sommes là pour vous aider")}{hours ? ` (${hours})` : ""}, {t("appelez-nous au")}{" "}
            <a href={telLink(phone)} className="font-semibold text-[color:var(--color-brand-navy)] underline">
              {phone}
            </a>
          </p>
        </div>
      </section>
    </div>
  );
}

export function LegalArticle({
  title,
  intro,
  sections,
  updated,
  email,
}: {
  title: string;
  intro?: string;
  sections: { h: string; p: string[] }[];
  updated: string;
  email: string;
}) {
  const { t } = useV2();
  const p = "text-[15px] leading-[1.75] text-[color:var(--color-ink-base)] mb-4";
  return (
    <div className="bg-white">
      <article className="mx-auto max-w-3xl px-5 lg:px-0 py-10 lg:py-16 text-[color:var(--color-ink-strong)]">
        <h1 className="text-3xl lg:text-4xl font-bold text-[color:var(--color-brand-purple)] mb-6">{title}</h1>
        {intro && <p className={p}>{intro}</p>}
        {sections.map((s, i) => (
          <section key={s.h}>
            <h2 className="text-2xl lg:text-3xl font-bold text-[color:var(--color-brand-purple)] mt-12 mb-4">{/^\d/.test(s.h) ? s.h : `${i + 1}. ${s.h}`}</h2>
            {s.p.map((para) => (
              <p key={para} className={p}>
                {para}
              </p>
            ))}
          </section>
        ))}
        <p className={`${p} mt-12`}>
          {t("Une question sur ce document ? Écrivez-nous à")}{" "}
          <a className="text-[color:var(--color-brand-teal)] underline hover:opacity-80" href={`mailto:${email}`}>
            {email}
          </a>
          .
        </p>
        <p className={p}>
          <em>{updated}</em>
        </p>
      </article>
    </div>
  );
}
