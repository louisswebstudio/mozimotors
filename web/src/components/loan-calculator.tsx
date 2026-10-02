"use client";

import { useState } from "react";
import { monthlyPayment } from "@/lib/format";
import { useI18n } from "@/i18n/client";

const DURATIONS = [24, 36, 48, 60, 72, 84];

/** Boxcars "Estimate your monthly payment" calculator (deposit range, term buttons, result box). */
export function LoanCalculator({ price, rate, defaultMonths = 60 }: { price: number; rate: number; defaultMonths?: number }) {
  const { t, fmt, price: money, decimal } = useI18n();
  const rateLabel = decimal(rate, Number.isInteger(rate) ? 0 : 1);
  const [deposit, setDeposit] = useState(Math.round((price * 0.2) / 1000) * 1000);
  const [months, setMonths] = useState(defaultMonths);
  const principal = Math.max(price - deposit, 0);
  const m = monthlyPayment(principal, rate, months);
  const total = m * months;
  const max = Math.round(price * 0.7);
  const p = max ? (deposit / max) * 100 : 0;
  const pct = price ? Math.round((deposit / price) * 100) : 0;

  const labelRow = "flex items-baseline justify-between gap-2.5 text-sm font-medium leading-5 text-[#6B7280]";

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2.5">
        <div className={labelRow}>
          <label htmlFor="deposit">{t.loan.deposit}</label>
          <span className="text-bx-navy">
            {money(deposit)} <span className="text-[#6B7280]">· {pct}%</span>
          </span>
        </div>
        <input
          id="deposit"
          type="range"
          className="range w-full"
          min={0}
          max={max}
          step={1000}
          value={deposit}
          onChange={(e) => setDeposit(+e.target.value)}
          style={{ ["--p" as string]: `${p}%` }}
        />
      </div>
      <div className="flex flex-col gap-2.5">
        <div className={labelRow}>
          <span>{t.loan.duration}</span>
          <span className="text-bx-navy">{fmt(t.loan.months, { n: months })}</span>
        </div>
        <div className="flex flex-wrap gap-2" role="group" aria-label={t.loan.durationGroup}>
          {DURATIONS.map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setMonths(d)}
              aria-pressed={months === d}
              className={`h-10 min-w-[64px] flex-1 rounded-lg border px-3 text-sm font-medium transition-colors duration-300 bx-ease ${
                months === d
                  ? "border-bx-blue bg-bx-blue text-white"
                  : "border-bx-line bg-[#F4F6F9] text-bx-navy hover:border-bx-blue"
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>
      <div className={labelRow}>
        <span>{t.loan.rate}</span>
        <span className="text-bx-navy">{fmt(t.loan.ratePct, { rate: rateLabel })}</span>
      </div>
      <div className="flex flex-col gap-1 rounded-xl bg-[#F4F6F9] p-[18px]">
        <p className="text-sm leading-5 text-[#6B7280]">{t.loan.estimate}</p>
        <p className="flex items-baseline gap-1">
          <span className="text-[36px] font-bold leading-[39.6px] tracking-[-1.08px] text-bx-blue">{money(m)}</span>
          <span className="text-sm leading-5 text-[#6B7280]">{t.common.perMonth}</span>
        </p>
        <p className="text-sm leading-5 text-[#6B7280]">
          {fmt(t.loan.financedTotal, { financed: money(principal), total: money(total) })}
        </p>
      </div>
      <p className="text-sm leading-5 text-[#6B7280]">
        {fmt(t.loan.disclaimer, { rate: rateLabel })}
      </p>
    </div>
  );
}
