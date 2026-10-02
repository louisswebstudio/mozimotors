"use client";

import Link from "@/i18n/link";
import { useI18n } from "@/i18n/client";
import { useEffect, useRef, useState } from "react";
import { borrowingCapacity } from "@/lib/format";
import { ArrowIcon } from "@/components/sites/boxcars-framer-website-cd8da657/root-8a5edab2/ui";
import { Card } from "@/components/sites/boxcars-framer-website-cd8da657/shared/page";

const DEPOSITS = [0, 20000, 40000, 60000, 100000];

/**
 * Glides the displayed number to `target` (easeOutCubic). Each change restarts
 * from the value currently on screen, so dragging the slider stays fluid.
 */
function useTweened(target: number, duration = 600) {
  const [shown, setShown] = useState(target);
  const shownRef = useRef(target);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      shownRef.current = target;
      setShown(target);
      return;
    }
    const from = shownRef.current;
    if (from === target) return;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const v = from + (target - from) * (1 - Math.pow(1 - t, 3));
      shownRef.current = v;
      setShown(v);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);

  return Math.round(shown);
}

/** Budget calculator — Boxcars payment-calculator visual language. */
export function FinanceWidget({ rate, months }: { rate: number; months: number }) {
  const { t, fmt, price, decimal } = useI18n();
  const [monthly, setMonthly] = useState(3500);
  const [deposit, setDeposit] = useState(20000);
  const budget = Math.floor((borrowingCapacity(monthly, rate, months) + deposit) / 1000) * 1000;
  const shownMonthly = useTweened(monthly, 350);
  const shownBudget = Math.round(useTweened(budget, 700) / 100) * 100;
  const p = ((monthly - 1000) / (10000 - 1000)) * 100;

  return (
    <Card className="flex flex-col gap-5 p-5 bxt:p-6">
      <div className="flex flex-col gap-3">
        <div className="flex items-baseline justify-between gap-4">
          <label htmlFor="monthly" className="min-w-0 text-sm font-medium leading-5 text-[#6B7280]">
            {t.financeWidget.monthly}
          </label>
          <p className="shrink-0 whitespace-nowrap text-[18px] font-medium leading-[23.4px] text-bx-navy tabular-nums">
            {price(shownMonthly)} <span className="text-sm text-[#818181]">{t.common.perMonth}</span>
          </p>
        </div>
        <input
          id="monthly"
          type="range"
          min={1000}
          max={10000}
          step={100}
          value={monthly}
          onChange={(e) => setMonthly(+e.target.value)}
          className="range w-full"
          style={{ ["--p" as string]: `${p}%` }}
        />
        <div className="flex justify-between text-sm leading-5 text-[#818181]">
          <span>1 000</span>
          <span>10 000</span>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <p className="text-sm font-medium leading-5 text-[#6B7280]">{t.financeWidget.deposit}</p>
        {/* Mobile: 2-col grid ("no deposit" spans the row) instead of a ragged one-per-line wrap. */}
        <div className="grid grid-cols-2 gap-2 bxt:flex bxt:flex-wrap">
          {DEPOSITS.map((d) => {
            const active = deposit === d;
            return (
              <button
                key={d}
                type="button"
                aria-pressed={active}
                onClick={() => setDeposit(d)}
                className={`h-10 cursor-pointer whitespace-nowrap rounded-lg border px-3 text-sm font-medium tabular-nums transition-colors duration-300 bx-ease bxt:px-4 ${d === 0 ? "col-span-2" : ""} ${
                  active
                    ? "border-bx-blue bg-bx-blue text-white"
                    : "border-bx-line bg-[#F4F6F9] text-bx-navy hover:border-bx-blue"
                }`}
              >
                {d === 0 ? t.financeWidget.noDeposit : price(d)}
              </button>
            );
          })}
        </div>
      </div>

      <div className="rounded-xl bg-[#F4F6F9] p-[18px]">
        <p className="text-sm leading-5 text-[#6B7280]">{t.financeWidget.budget}</p>
        <p className="mt-1 whitespace-nowrap text-[30px] font-bold leading-[1.2] tracking-[-0.9px] text-bx-blue tabular-nums bxt:text-[36px] bxt:tracking-[-1.08px]">
          {price(shownBudget)}
        </p>
        <p className="mt-1 text-sm leading-5 text-[#6B7280]">
          {fmt(t.financeWidget.terms, { months, rate: decimal(rate, Number.isInteger(rate) ? 0 : 1) })}
        </p>
      </div>

      <Link
        href={`/acheter?maxPrice=${budget}&sort=price-desc`}
        className="flex min-h-12 w-full items-center justify-center gap-2.5 text-balance rounded-xl bg-bx-blue px-5 py-3 text-center text-[15px] font-medium leading-5 text-white bxt:min-h-11 bxt:px-6 transition-colors duration-300 bx-ease hover:bg-bx-blue-hover"
      >
        {t.financeWidget.cta}
        <ArrowIcon />
      </Link>
    </Card>
  );
}
