"use client";

import Image from "next/image";
import Link from "@/i18n/link";
import { useI18n } from "@/i18n/client";
import { Car, Landmark, ShieldCheck, Tags, Truck, Wallet, type LucideIcon } from "lucide-react";
import type { BuyMenu, BuyMenuLink } from "@/lib/buy-menu";
import { ArrowIcon } from "./ui";

/*
 * "Acheter" mega menu content (data from src/lib/buy-menu.ts — real stock, counts match /acheter).
 * Desktop: body-type tiles · budget tiles · brand logo tiles (double column)
 * over a trust strip + main CTA. Mobile: the same shortcuts, adapted to the dark burger panel.
 */

export const hasBuyLinks = (m: BuyMenu) => m.bodies.length + m.budgets.length + m.brands.length > 0;

/** Icons for t.buyMenu.trust, index-aligned. */
const TRUST_ICONS: LucideIcon[] = [ShieldCheck, Landmark, Truck];


function SectionTitle({ icon: Icon, children }: { icon: LucideIcon; children: React.ReactNode }) {
  return (
    <p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase leading-5 tracking-[0.08em] text-bx-ink/55">
      <span className="grid size-6 place-items-center rounded-md bg-bx-lavender text-bx-blue">
        <Icon className="size-3.5" strokeWidth={2} aria-hidden />
      </span>
      {children}
    </p>
  );
}

const tile =
  "group/t flex flex-col rounded-xl border border-transparent bg-bx-soft p-3 transition-[background-color,border-color,box-shadow] duration-200 bx-ease hover:border-bx-line hover:bg-white hover:shadow-[0_8px_20px_-10px_rgba(5,11,32,0.25)] focus-visible:border-bx-blue focus-visible:bg-white focus-visible:outline-none";

function Count({ n }: { n: number }) {
  const { t, plural } = useI18n();
  return <span className="text-xs tabular-nums text-bx-ink/55">{plural(n, t.common.cars)}</span>;
}

function BodyTile({ l, onNavigate }: { l: BuyMenuLink; onNavigate: () => void }) {
  return (
    <Link href={l.href} onClick={onNavigate} className={tile}>
      <span className="relative mb-2 block h-11 w-full">
        {l.image ? (
          <Image src={l.image} alt="" fill sizes="120px" className="object-contain transition-transform duration-300 bx-ease group-hover/t:scale-105" />
        ) : (
          <Car className="mx-auto size-8 text-bx-navy/40" strokeWidth={1.25} aria-hidden />
        )}
      </span>
      <span className="text-sm font-semibold leading-5 text-bx-navy transition-colors group-hover/t:text-bx-blue">{l.label}</span>
      <Count n={l.count} />
    </Link>
  );
}

function BrandTile({ l, onNavigate }: { l: BuyMenuLink; onNavigate: () => void }) {
  return (
    <Link href={l.href} onClick={onNavigate} className={`${tile} flex-row items-center gap-3`}>
      <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-white ring-1 ring-bx-line">
        {l.logo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={l.logo} alt="" className="size-6 object-contain opacity-80 transition-opacity group-hover/t:opacity-100" />
        ) : (
          <span className="text-sm font-bold text-bx-navy">{l.label.slice(0, 2).toUpperCase()}</span>
        )}
      </span>
      <span className="flex min-w-0 flex-col">
        <span className="truncate text-sm font-semibold leading-5 text-bx-navy transition-colors group-hover/t:text-bx-blue">{l.label}</span>
        <Count n={l.count} />
      </span>
    </Link>
  );
}

function BudgetTile({ l, onNavigate }: { l: BuyMenuLink; onNavigate: () => void }) {
  return (
    <Link href={l.href} onClick={onNavigate} className={`${tile} flex-row items-center gap-3`}>
      <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-white ring-1 ring-bx-line transition-colors duration-200 group-hover/t:bg-bx-lavender">
        <Wallet className="size-[18px] text-bx-navy/70 transition-colors group-hover/t:text-bx-blue" strokeWidth={1.5} aria-hidden />
      </span>
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="whitespace-nowrap text-sm font-semibold leading-5 text-bx-navy transition-colors group-hover/t:text-bx-blue">{l.label}</span>
        <Count n={l.count} />
      </span>
      <ArrowIcon className="size-[10px] shrink-0 text-bx-navy/30 transition-colors group-hover/t:text-bx-blue" />
    </Link>
  );
}

export function BuyMegaPanel({ menu, href, onNavigate }: { menu: BuyMenu; href: string; onNavigate: () => void }) {
  const { t, fmt, plural } = useI18n();
  const cols = [
    menu.bodies.length > 0 && (
      <div key="bodies">
        <SectionTitle icon={Car}>{t.buyMenu.bodies}</SectionTitle>
        <div className="grid grid-cols-2 gap-2">
          {menu.bodies.map((l) => <BodyTile key={l.href} l={l} onNavigate={onNavigate} />)}
        </div>
      </div>
    ),
    menu.budgets.length > 0 && (
      <div key="budgets">
        <SectionTitle icon={Wallet}>{t.buyMenu.budget}</SectionTitle>
        <div className="flex flex-col gap-2">
          {menu.budgets.map((l) => <BudgetTile key={l.href} l={l} onNavigate={onNavigate} />)}
        </div>
      </div>
    ),
    menu.brands.length > 0 && (
      <div key="brands">
        <SectionTitle icon={Tags}>{t.buyMenu.brands}</SectionTitle>
        <div className="grid grid-cols-2 gap-2">
          {menu.brands.map((l) => <BrandTile key={l.href} l={l} onNavigate={onNavigate} />)}
        </div>
      </div>
    ),
  ].filter(Boolean);
  const template = [
    menu.bodies.length > 0 && "minmax(0, 1fr)",
    menu.budgets.length > 0 && "minmax(0, 1fr)",
    menu.brands.length > 0 && "minmax(0, 2fr)",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="overflow-hidden rounded-3xl border border-bx-line bg-white shadow-[0_32px_64px_-20px_rgba(5,11,32,0.4)]">
      {/* Brands take a double-width column (two tiles per row). */}
      <div className="grid gap-7 p-6" style={{ gridTemplateColumns: template }}>
        {cols}
      </div>
      <div className="flex items-center justify-between gap-6 border-t border-bx-line bg-bx-soft px-6 py-4">
        <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
          {t.buyMenu.trust.map((label, i) => {
            const Icon = TRUST_ICONS[i];
            return (
              <li key={label} className="flex items-center gap-2 text-[13px] font-medium text-bx-navy/80">
                <Icon className="size-4 text-ok" strokeWidth={2} aria-hidden />
                {label}
              </li>
            );
          })}
        </ul>
        <Link
          href={href}
          onClick={onNavigate}
          className="inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-xl bg-bx-blue px-5 py-2.5 text-sm font-semibold text-white transition-colors duration-300 bx-ease hover:bg-bx-blue-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bx-blue/50 focus-visible:ring-offset-2"
        >
          {fmt(t.buyMenu.seeAll, { cars: plural(menu.total, t.common.cars) })}
          <ArrowIcon className="size-[9px]" />
        </Link>
      </div>
    </div>
  );
}

/** Mobile/tablet burger version: body tiles with cut-outs, budget + brand chips, "see all" link. */
export function BuyMobilePanel({ menu, href, onNavigate }: { menu: BuyMenu; href: string; onNavigate: () => void }) {
  const { t, fmt, plural } = useI18n();
  const chip =
    "inline-flex items-center gap-2 rounded-full bg-white/[0.07] px-3 py-1.5 text-sm text-white/90 transition-colors duration-300 hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60";
  const title = "mb-2 text-xs font-semibold uppercase tracking-[0.08em] text-white/45";
  return (
    <div className="flex flex-col gap-5 px-[18px] pb-3 pt-3">
      {menu.bodies.length > 0 && (
        <div>
          <p className={title}>{t.buyMenu.bodies}</p>
          <div className="grid grid-cols-2 gap-2">
            {menu.bodies.map((l) => (
              <Link key={l.href} href={l.href} onClick={onNavigate} className="flex flex-col items-start rounded-xl bg-white/[0.07] p-3 transition-colors hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60">
                {l.image && (
                  <span className="relative mb-1.5 block h-9 w-full">
                    <Image src={l.image} alt="" fill sizes="140px" className="object-contain" />
                  </span>
                )}
                <span className="text-sm font-semibold text-white">{l.label}</span>
                <span className="text-xs tabular-nums text-white/50">{plural(l.count, t.common.cars)}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
      {menu.budgets.length > 0 && (
        <div>
          <p className={title}>{t.buyMenu.budget}</p>
          <div className="flex flex-wrap gap-2">
            {menu.budgets.map((l) => (
              <Link key={l.href} href={l.href} onClick={onNavigate} className={chip}>
                <Wallet className="size-3.5 text-white/60" strokeWidth={1.75} aria-hidden />
                {l.label}
                <span className="text-xs tabular-nums text-white/45">{l.count}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
      {menu.brands.length > 0 && (
        <div>
          <p className={title}>{t.buyMenu.brands}</p>
          <div className="flex flex-wrap gap-2">
            {menu.brands.map((l) => (
              <Link key={l.href} href={l.href} onClick={onNavigate} className={chip}>
                {l.logo && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={l.logo} alt="" className="size-4 object-contain brightness-0 invert" />
                )}
                {l.label}
                <span className="text-xs tabular-nums text-white/45">{l.count}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
      <Link href={href} onClick={onNavigate} className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-white underline decoration-white/30 underline-offset-4">
        {fmt(t.buyMenu.seeAll, { cars: plural(menu.total, t.common.cars) })}
        <ArrowIcon className="size-[9px]" />
      </Link>
    </div>
  );
}
