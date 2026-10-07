/** Mobile « Voitures d'occasion par type de carrosserie » rail. */
import { getV2 } from "./server-locale";

export async function BodyTypeRail() {
  const { t, href } = await getV2();
  return (
    <section className="bg-white px-4 py-6">
      <div className="flex flex-col gap-4">
        <h2 className="text-[18px] font-bold leading-[1.2] tracking-[-0.01em] text-[color:var(--color-ink-strong)]">
          {t("Voitures d'occasion par type de carrosserie")}
        </h2>
        <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth pb-2 scrollbar-hide lg:grid lg:grid-cols-3 lg:overflow-visible lg:pb-0 lg:snap-none">
          <a className="group flex w-[112px] flex-shrink-0 snap-start flex-col items-center gap-2 lg:w-auto" href={href("/acheter?body=berline")}>
            <img
              src="/sites/siaracash-ma-449ca86b/root-8a5edab2/assets/body-types-v2/sedan_2x_car.webp"
              alt=""
              aria-hidden="true"
              loading="lazy"
              className="aspect-[3/2] w-full object-contain p-2 drop-shadow-[0_18px_14px_rgba(15,23,42,0.22)] transition-transform group-hover:scale-105"
            />
            <span className="text-center text-[13px] font-semibold leading-tight text-[color:var(--color-brand-dark)]">{t("Berline")}</span>
          </a>
          <a className="group flex w-[112px] flex-shrink-0 snap-start flex-col items-center gap-2 lg:w-auto" href={href("/acheter?body=cabriolet")}>
            <img
              src="/sites/siaracash-ma-449ca86b/root-8a5edab2/assets/body-types-v2/convertible_2x_car.webp"
              alt=""
              aria-hidden="true"
              loading="lazy"
              className="aspect-[3/2] w-full object-contain p-2 drop-shadow-[0_18px_14px_rgba(15,23,42,0.22)] transition-transform group-hover:scale-105"
            />
            <span className="text-center text-[13px] font-semibold leading-tight text-[color:var(--color-brand-dark)]">{t("Cabriolet")}</span>
          </a>
          <a className="group flex w-[112px] flex-shrink-0 snap-start flex-col items-center gap-2 lg:w-auto" href={href("/acheter?body=citadine")}>
            <img
              src="/sites/siaracash-ma-449ca86b/root-8a5edab2/assets/body-types-v2/compact_2x_car.webp"
              alt=""
              aria-hidden="true"
              loading="lazy"
              className="aspect-[3/2] w-full object-contain p-2 drop-shadow-[0_18px_14px_rgba(15,23,42,0.22)] transition-transform group-hover:scale-105"
            />
            <span className="text-center text-[13px] font-semibold leading-tight text-[color:var(--color-brand-dark)]">{t("Compacte")}</span>
          </a>
          <a className="group flex w-[112px] flex-shrink-0 snap-start flex-col items-center gap-2 lg:w-auto" href={href("/acheter?body=pickup")}>
            <img
              src="/sites/siaracash-ma-449ca86b/root-8a5edab2/assets/home/body-pickup.webp"
              alt=""
              aria-hidden="true"
              loading="lazy"
              className="aspect-[3/2] w-full object-contain p-2 drop-shadow-[0_18px_14px_rgba(15,23,42,0.22)] transition-transform group-hover:scale-105"
            />
            <span className="text-center text-[13px] font-semibold leading-tight text-[color:var(--color-brand-dark)]">{t("Pick-up")}</span>
          </a>
          <a className="group flex w-[112px] flex-shrink-0 snap-start flex-col items-center gap-2 lg:w-auto" href={href("/acheter?body=suv")}>
            <img
              src="/sites/siaracash-ma-449ca86b/root-8a5edab2/assets/body-types-v2/suv_2x_car.webp"
              alt=""
              aria-hidden="true"
              loading="lazy"
              className="aspect-[3/2] w-full object-contain p-2 drop-shadow-[0_18px_14px_rgba(15,23,42,0.22)] transition-transform group-hover:scale-105"
            />
            <span className="text-center text-[13px] font-semibold leading-tight text-[color:var(--color-brand-dark)]">SUV</span>
          </a>
          <a className="group flex w-[112px] flex-shrink-0 snap-start flex-col items-center gap-2 lg:w-auto" href={href("/acheter?body=monospace")}>
            <img
              src="/sites/siaracash-ma-449ca86b/root-8a5edab2/assets/body-types-v2/van_2x_car.webp"
              alt=""
              aria-hidden="true"
              loading="lazy"
              className="aspect-[3/2] w-full object-contain p-2 drop-shadow-[0_18px_14px_rgba(15,23,42,0.22)] transition-transform group-hover:scale-105"
            />
            <span className="text-center text-[13px] font-semibold leading-tight text-[color:var(--color-brand-dark)]">{t("Utilitaire")}</span>
          </a>
        </div>
      </div>
    </section>
  );
}
