"use client";

import { useMemo, useState } from "react";
import {
  Activity, ArrowUpDown, Armchair, BatteryCharging, Bluetooth, Calendar, Camera, Car, CarFront, Check, Circle, CircleCheck, CircleDollarSign,
  CircleDot, Cog, Contrast, Disc, Disc3, DoorOpen, Flag, FlipHorizontal2, Flame, Fuel, Gauge, Hash, Key, KeyRound, LayoutList, Lightbulb,
  MapPin, MonitorSmartphone, Mountain, Navigation, OctagonAlert, Radar, Route, Rows3, Search, Settings, ShieldCheck, ShieldPlus, Smartphone,
  Snowflake, Speaker, Sun, Tablet, Tag, Usb, Users, Zap, type LucideIcon,
} from "lucide-react";
import { FEATURE_CATALOG, FEATURE_GROUPS, featureKey, type FeatureGroup } from "@/lib/feature-catalog";
import type { Locale } from "@/i18n/config";

type Row = { label: string; icon?: string; value?: string; has?: boolean };

const ICONS: Record<string, LucideIcon> = {
  Activity, ArrowUpDown, Armchair, BatteryCharging, Bluetooth, Calendar, Camera, Car, Check, CircleDollarSign, CircleDot, Cog, Contrast, Disc, Disc3,
  DoorOpen, Flag, FlipHorizontal2, Flame, Fuel, Gauge, Hash, Key, KeyRound, Lightbulb, MapPin, Mountain, Navigation, OctagonAlert, Radar, Route,
  Rows3, Settings, ShieldPlus, Smartphone, Snowflake, Speaker, Sun, Tablet, Tag, Usb, Users, Zap,
};
const TAB_ICONS: Record<string, LucideIcon> = {
  summary: LayoutList, multimedia: MonitorSmartphone, confort: Armchair, securite: ShieldCheck, exterieur: CarFront,
};
type Labels = {
  search: string; summary: string; seeAll: string; seeLess: string; noResults: string; yes: string; no: string;
  groups: Record<string, string>;
};

const COLLAPSED = 8;

export function CarFeatures({
  lang, labels, specs, features,
}: {
  lang: Locale;
  labels: Labels;
  specs: { label: string; value: string; icon: string }[];
  features: Partial<Record<FeatureGroup, string[]>>;
}) {
  const [tab, setTab] = useState<"summary" | FeatureGroup>("summary");
  const [q, setQ] = useState("");
  const [expanded, setExpanded] = useState(false);

  const groupRows = useMemo(() => {
    const out = {} as Record<FeatureGroup, Row[]>;
    for (const g of FEATURE_GROUPS) {
      const owned = features[g] ?? [];
      const ownedKeys = new Set(owned.map(featureKey));
      const catalogKeys = new Set(FEATURE_CATALOG[g].map((i) => featureKey(i.fr)));
      out[g] = [
        ...FEATURE_CATALOG[g].map((i) => ({ label: i[lang as "fr" | "en" | "ar"] ?? i.fr, icon: i.icon, has: ownedKeys.has(featureKey(i.fr)) })),
        // Items the API sends that aren't in our catalog are still shown, as "Oui".
        ...owned.filter((f) => !catalogKeys.has(featureKey(f))).map((f) => ({ label: f, icon: "Check", has: true })),
      ];
    }
    return out;
  }, [features, lang]);

  const summaryRows: Row[] = specs.map((s) => ({ label: s.label, value: s.value, icon: s.icon }));
  const query = q.trim().toLowerCase();

  const rows: Row[] = query
    ? [...summaryRows, ...FEATURE_GROUPS.flatMap((g) => groupRows[g])].filter((r) => r.label.toLowerCase().includes(query))
    : tab === "summary" ? summaryRows : groupRows[tab];

  const canCollapse = !query && rows.length > COLLAPSED;
  const visible = canCollapse && !expanded ? rows.slice(0, COLLAPSED) : rows;

  const pick = (t: "summary" | FeatureGroup) => { setTab(t); setQ(""); setExpanded(false); };
  const tabs: ["summary" | FeatureGroup, string][] = [["summary", labels.summary], ...FEATURE_GROUPS.map((g) => [g, labels.groups[g] ?? g] as [FeatureGroup, string])];

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-bx-line p-4 bxt:p-5">
      <label className="flex items-center gap-2.5 rounded-xl border border-bx-line px-4 py-3 focus-within:border-bx-blue">
        <Search className="size-4 shrink-0 text-bx-ink" strokeWidth={1.5} aria-hidden />
        <input
          type="search" value={q} onChange={(e) => { setQ(e.target.value); setExpanded(false); }}
          placeholder={labels.search} aria-label={labels.search}
          className="w-full bg-transparent text-[15px] leading-6 text-bx-navy outline-none placeholder:text-bx-ink/60"
        />
      </label>

      <div className="flex gap-2 overflow-x-auto pb-1" role="tablist">
        {tabs.map(([id, label]) => {
          const active = !query && tab === id;
          return (
            <button
              key={id} type="button" role="tab" aria-selected={active} onClick={() => pick(id)}
              className={`inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium leading-5 transition-colors duration-300 ${
                active ? "bg-bx-blue text-white" : "bg-bx-lavender text-bx-navy hover:bg-bx-lavender/70"
              }`}
            >
              {(() => { const I = TAB_ICONS[id]; return <I className="size-4" strokeWidth={1.5} aria-hidden />; })()}
              {label}
            </button>
          );
        })}
      </div>

      {visible.length ? (
        <ul className="grid grid-cols-1 gap-x-10 bxt:grid-cols-2">
          {visible.map((r, i) => (
            <li key={`${r.label}-${i}`} className="flex items-center justify-between gap-4 border-b border-bx-line py-3 text-[15px] leading-6 text-bx-ink">
              <span className="flex items-center gap-2.5">
                {(() => { const I = ICONS[r.icon ?? "Check"] ?? Check; return <I className="size-[18px] shrink-0 text-bx-navy" strokeWidth={1.5} aria-hidden />; })()}
                {r.label}
              </span>
              {r.value !== undefined ? (
                <span className="text-end font-medium text-bx-navy"><bdi>{r.value}</bdi></span>
              ) : r.has ? (
                <span className="flex shrink-0 items-center gap-1.5 font-semibold text-emerald-700">
                  <CircleCheck className="size-[18px]" strokeWidth={1.5} aria-hidden /> {labels.yes}
                </span>
              ) : (
                <span className="flex shrink-0 items-center gap-1.5 font-semibold text-bx-ink/70">
                  <Circle className="size-[18px]" strokeWidth={1.5} aria-hidden /> {labels.no}
                </span>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="py-4 text-center text-[15px] text-bx-ink">{labels.noResults}</p>
      )}

      {canCollapse && (
        <button
          type="button" onClick={() => setExpanded((v) => !v)} aria-expanded={expanded}
          className="rounded-xl border border-bx-blue px-6 py-2.5 text-[15px] font-medium leading-6 text-bx-blue transition-colors duration-300 hover:bg-bx-blue hover:text-white"
        >
          {expanded ? labels.seeLess : labels.seeAll}
        </button>
      )}
    </div>
  );
}
