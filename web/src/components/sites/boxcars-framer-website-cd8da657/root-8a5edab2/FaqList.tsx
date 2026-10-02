"use client";

import { useId, useState } from "react";

/** Single-open accordion. Closed: soft bg; open: white + #E1E1E1 border, grid-rows 0fr → 1fr. */
export function FaqList({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const base = useId();

  return (
    <div className="flex flex-col gap-5">
      {items.map((item, i) => {
        const isOpen = open === i;
        const panelId = `${base}-faq-${i}`;
        return (
          <div
            key={item.q}
            className={`rounded-2xl border px-6 py-5 transition-[background-color,border-color] duration-300 bx-ease bxt:px-[30px] bxt:py-[26px] ${
              isOpen ? "border-bx-line bg-white" : "border-bx-soft bg-bx-soft"
            }`}
          >
            <button
              type="button"
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => setOpen(isOpen ? null : i)}
              className="flex w-full cursor-pointer items-center gap-5 text-start"
            >
              <span className="flex-1 text-base font-medium leading-[21px] text-bx-navy bxt:text-[18px] bxt:leading-[23.4px]">
                {item.q}
              </span>
              <svg
                viewBox="0 0 12.128 12.128"
                className="size-3 shrink-0 transition-transform duration-300 bx-ease"
                style={{ transform: `rotate(${isOpen ? -45 : 135}deg)` }}
                fill="#050B20"
                aria-hidden
              >
                <path d="M11.401 0H2.149a.5.5 0 0 0 0 1h8.272L.161 11.26a.5.5 0 1 0 .707.707L11.128 1.707v8.272a.5.5 0 0 0 1 0V.727A.727.727 0 0 0 11.401 0Z" />
              </svg>
            </button>
            <div
              id={panelId}
              role="region"
              aria-hidden={!isOpen}
              className={`grid transition-[grid-template-rows,opacity] duration-[350ms] bx-ease ${
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <p className="pt-5 text-[15px] leading-6 text-bx-ink">{item.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
