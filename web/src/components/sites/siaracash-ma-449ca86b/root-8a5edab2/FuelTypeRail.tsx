/** Mobile « Voitures d'occasion par type de carburant » rail. */
import { getV2 } from "./server-locale";

export async function FuelTypeRail() {
  const { t, href } = await getV2();
  return (
    <section className="bg-white px-4 py-6">
      <div className="flex flex-col gap-4">
        <h2 className="text-[18px] font-bold leading-[1.2] tracking-[-0.01em] text-[color:var(--color-ink-strong)]">
          {t("Voitures d'occasion par type de carburant")}
        </h2>
        <div className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 scroll-ps-4 scrollbar-hide">
          <a className="group flex w-[42%] flex-shrink-0 snap-start flex-col gap-2" href={href("/acheter?fuel=essence")}>
            <span className="block aspect-[320/202] w-full overflow-hidden rounded-2xl">
              <img
                src="/sites/siaracash-ma-449ca86b/root-8a5edab2/assets/home/fuel-gasoline.webp"
                alt=""
                aria-hidden="true"
                loading="lazy"
                className="h-full w-full object-cover transition-transform group-hover:scale-105"
              />
            </span>
            <span className="text-[14px] font-semibold text-[color:var(--color-brand-dark)]">{t("Essence")}</span>
          </a>
          <a className="group flex w-[42%] flex-shrink-0 snap-start flex-col gap-2" href={href("/acheter?fuel=diesel")}>
            <span className="block aspect-[320/202] w-full overflow-hidden rounded-2xl">
              <img
                src="/sites/siaracash-ma-449ca86b/root-8a5edab2/assets/home/fuel-diesel.webp"
                alt=""
                aria-hidden="true"
                loading="lazy"
                className="h-full w-full object-cover transition-transform group-hover:scale-105"
              />
            </span>
            <span className="text-[14px] font-semibold text-[color:var(--color-brand-dark)]">{t("Diesel")}</span>
          </a>
          <a className="group flex w-[42%] flex-shrink-0 snap-start flex-col gap-2" href={href("/acheter?fuel=hybride")}>
            <span className="block aspect-[320/202] w-full overflow-hidden rounded-2xl">
              <img
                src="/sites/siaracash-ma-449ca86b/root-8a5edab2/assets/home/fuel-hybrid.webp"
                alt=""
                aria-hidden="true"
                loading="lazy"
                className="h-full w-full object-cover transition-transform group-hover:scale-105"
              />
            </span>
            <span className="text-[14px] font-semibold text-[color:var(--color-brand-dark)]">{t("Hybride")}</span>
          </a>
          <a className="group flex w-[42%] flex-shrink-0 snap-start flex-col gap-2" href={href("/acheter?fuel=electrique")}>
            <span className="block aspect-[320/202] w-full overflow-hidden rounded-2xl">
              <img
                src="/sites/siaracash-ma-449ca86b/root-8a5edab2/assets/home/fuel-electric.webp"
                alt=""
                aria-hidden="true"
                loading="lazy"
                className="h-full w-full object-cover transition-transform group-hover:scale-105"
              />
            </span>
            <span className="text-[14px] font-semibold text-[color:var(--color-brand-dark)]">{t("Électrique")}</span>
          </a>
        </div>
      </div>
    </section>
  );
}
