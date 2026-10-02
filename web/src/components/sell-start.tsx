"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { MapPin } from "lucide-react";
import { ArrowIcon } from "@/components/sites/boxcars-framer-website-cd8da657/root-8a5edab2/ui";
import { OTHER_CITY, SELL_CITIES } from "@/lib/sell";
import { useI18n } from "@/i18n/client";

/** Hero entry point: pick a city → /vendre/demande?ville=… (SiaraCash « Choisir votre ville »). */
export function SellStart({ dark = false }: { dark?: boolean }) {
  const router = useRouter();
  const { t, href } = useI18n();
  const [city, setCity] = useState("");
  const start = () => router.push(href(`/vendre/demande${city ? `?ville=${encodeURIComponent(city)}` : ""}`));
  return (
    <div className={`flex w-full max-w-[560px] flex-col gap-2.5 rounded-2xl p-2 bxt:flex-row ${dark ? "bg-white/10" : "border border-bx-line bg-white shadow-[0_8px_30px_rgba(5,11,32,0.08)]"}`}>
      <label className="relative flex-1">
        <span className="sr-only">{t.sellStart.chooseCity}</span>
        <MapPin className="pointer-events-none absolute start-4 top-1/2 size-4 -translate-y-1/2 text-bx-blue" strokeWidth={1.5} />
        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="h-12 w-full appearance-none rounded-xl bg-white pe-4 ps-11 text-[15px] text-bx-navy outline-none"
        >
          <option value="">{t.sellStart.chooseCity}</option>
          {[...SELL_CITIES, OTHER_CITY].map((c) => (
            <option key={c} value={c}>
              {c === OTHER_CITY ? t.sellWizard.otherCity : c}
            </option>
          ))}
        </select>
      </label>
      <button
        type="button"
        onClick={start}
        className="flex h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-bx-blue px-6 text-[15px] font-medium text-white transition-colors duration-300 bx-ease hover:bg-bx-blue-hover"
      >
        {t.common.sellMyCar} <ArrowIcon />
      </button>
    </div>
  );
}
