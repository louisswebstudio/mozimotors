"use client";

/** Small siaracash.ma (`.cc-*`) building blocks shared by the inner pages of /v2. */
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useV2 } from "./V2Locale";

/** Section wrapper: purple 17/20px title above a `cc-card`. */
export function Section({ id, title, cardClass = "", children }: { id?: string; title: string; cardClass?: string; children: React.ReactNode }) {
  return (
    <div id={id} className="scroll-mt-24">
      <h2 className="mb-2.5 pb-1.5 text-[17px] font-bold !text-[var(--cc-primary)] lg:mb-3 lg:text-[20px]">{title}</h2>
      <div className={`cc-card p-4 lg:p-5 ${cardClass}`}>{children}</div>
    </div>
  );
}

/** Accordion rows (`cc-acc-body` grid-rows animation). `defaultOpen` = index open on load, -1 for none. */
export function Accordion({ items, defaultOpen = 0 }: { items: { q: string; a: React.ReactNode }[]; defaultOpen?: number }) {
  const { t } = useV2();
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div>
      {items.map((item, i) => {
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
                <div className="pb-4 text-[14px] leading-relaxed text-[var(--cc-body)]">{typeof item.a === "string" ? t(item.a) : item.a}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/** Label / value row used by « Aperçu du véhicule » and « Caractéristiques ». */
export function SpecRow({ label, children }: { label: string; children: React.ReactNode }) {
  const { t } = useV2();
  return (
    <div className="flex items-center justify-between gap-3 border-b border-[var(--cc-line)] py-2.5 text-[13px] last:border-0">
      <span className="text-[var(--cc-muted)]">{t(label)}</span>
      <span className="text-right font-semibold text-[var(--cc-ink)]">{typeof children === "string" ? t(children) : children}</span>
    </div>
  );
}
