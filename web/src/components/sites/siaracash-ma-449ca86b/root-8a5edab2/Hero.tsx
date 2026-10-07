/**
 * Hero blocks from siaracash.ma.
 * - DesktopHero (lg+): headline + CTAs beside the handover photo, search card underneath.
 * - QuickNav: floating icon tab row overlapping the hero (desktop) / 2-up card (mobile).
 *   Financement and Le Neuf are left out on request.
 */
import type { Catalog } from "@/lib/cms";
import { A, HOME } from "./assets";
import { SearchCard } from "./SearchCard";
import { getV2 } from "./server-locale";

export async function DesktopHero({ catalog }: { catalog: Catalog }) {
  const { t, href } = await getV2();
  return (
    <section className="relative">
      {/* Full-bleed showroom photo (people on the right), white fade behind the headline — as on the client's mockup. */}
      <div className="mz-hero-stage relative overflow-hidden">
        <div className="mz-hero-media absolute">
          <img
            src={`${A}/assets/home/hero-wide.webp`}
            alt=""
            width="2000"
            height="750"
            loading="eager"
            fetchPriority="high"
            className="mz-hero-photo block h-full"
          />
          <div aria-hidden="true" className="mz-hero-fade absolute inset-0" />
        </div>
        <div className="relative mx-auto flex h-full w-full max-w-[1280px] items-center px-12" style={{ paddingBottom: 60 }}>
          <div className="flex flex-col items-start" style={{ gap: 32 }}>
            <h1 className="font-extrabold tracking-[-0.03em] text-[color:var(--color-brand-dark)]" style={{ maxWidth: 660, fontSize: 60, lineHeight: 1.08 }}>
              {t("Achetez ou vendez votre voiture d'occasion,")}{" "}
              <span className="block text-[color:var(--color-brand-teal)]">{t("en toute confiance")}</span>
            </h1>
            <div className="flex flex-wrap items-center" style={{ gap: 16 }}>
              <a
                className="inline-flex h-[56px] items-center justify-center gap-2 rounded-full bg-[color:var(--color-brand-teal)] px-8 text-[16px] font-semibold text-white shadow-sm transition-colors hover:bg-[color:var(--color-brand-teal-hover)]"
                href={href("/acheter")}
              >
                {t("Voir les voitures")}
                <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="size-4 rtl:rotate-180"><path d="m9 18 6-6-6-6" /></svg>
              </a>
              <a
                className="inline-flex h-[56px] items-center justify-center gap-2 rounded-full border-2 border-[color:var(--color-brand-teal)] bg-white px-8 text-[16px] font-semibold text-[color:var(--color-brand-teal)] transition-colors hover:bg-[color:var(--color-brand-teal-soft)]"
                href={href("/vendre")}
              >
                {t("Vendre ma voiture")}
                <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="size-4 rtl:rotate-180"><path d="m9 18 6-6-6-6" /></svg>
              </a>
            </div>
          </div>
        </div>
      </div>
      {/* Search card overlapping the bottom of the photo */}
      <div className="relative z-10 mx-auto w-full max-w-[1280px] px-12" style={{ marginTop: -64 }}>
        <div className="overflow-hidden rounded-2xl bg-white" style={{ boxShadow: "0 18px 50px -12px rgba(16, 24, 40, 0.18)" }}>
          <SearchCard catalog={catalog} />
        </div>
      </div>
      <div style={{ height: 56 }} />
    </section>
  );
}

export function MobileSearch({ catalog }: { catalog: Catalog }) {
  return (
    <section className="pt-6">
      <div className="bg-white p-4">
        <SearchCard catalog={catalog} />
      </div>
    </section>
  );
}

const DESKTOP_TABS = [
  { label: "Accueil", href: HOME, img: "nav-home", active: true },
  { label: "Acheter", href: "/acheter", img: "nav-buy" },
  { label: "Vendre", href: "/vendre", img: "nav-sell" },
];

export async function QuickNavDesktop() {
  const { t, href } = await getV2();
  return (
    <section className="relative z-10 -mt-10 px-4 lg:px-12">
      <div className="mx-auto max-w-[880px] rounded-2xl border border-[color:var(--color-line-strong)] bg-white px-5 pt-3 shadow-[0_12px_34px_rgba(16,24,40,0.10)] lg:px-8">
        <div className="grid grid-cols-3 gap-3">
          {DESKTOP_TABS.map((tab) => (
            <a key={tab.href} className="group relative flex flex-col items-center gap-2 pb-2.5" href={href(tab.href)}>
              <img
                src={`${A}/assets/home/${tab.img}-mozi.webp`}
                alt=""
                aria-hidden="true"
                loading="lazy"
                className="h-[48px] w-auto object-contain transition-transform group-hover:scale-105"
              />
              <span className="text-[14px] font-semibold leading-[20px] text-[color:var(--color-ink-strong)]">{t(tab.label)}</span>
              <span
                aria-hidden="true"
                className={`absolute inset-x-0 bottom-0 mx-auto h-1 w-[92px] rounded-t-[10px] ${tab.active ? "bg-[color:var(--color-brand-teal)]" : "bg-transparent"}`}
              />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

export async function QuickNavMobile() {
  const { t, href } = await getV2();
  return (
    <section className="px-4 pt-5">
      <div className="mx-auto max-w-[362px] rounded-2xl border border-[color:var(--color-line-strong)] bg-white px-3 py-3 shadow-[0_10px_28px_rgba(16,24,40,0.08)]">
        <div className="grid grid-cols-2 gap-2">
          {DESKTOP_TABS.slice(1).map((tab) => (
            <a key={tab.href} className="group flex flex-col items-center gap-1.5 text-center transition-transform active:scale-[0.97]" href={href(tab.href)}>
              <img src={`${A}/assets/home/${tab.img}-mozi.webp`} alt="" aria-hidden="true" loading="lazy" className="h-[46px] w-auto object-contain" />
              <span className="text-[12px] font-semibold leading-[15px] text-[color:var(--color-ink-strong)]">{t(tab.label)}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
