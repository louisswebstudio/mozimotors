/** « Parcourir par marque »: horizontally scrolling brand tiles (64px mobile, 120px desktop). */
import { A } from "./assets";
import { BRANDS } from "./brands";
import { getV2 } from "./server-locale";

export async function BrandStrip() {
  const { t, href } = await getV2();
  return (
    <section className="bg-white px-4 py-6 lg:px-12 lg:py-14">
      <div className="mx-auto flex w-full max-w-[362px] flex-col gap-4 lg:max-w-[1280px] lg:gap-8">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-[16px] font-medium leading-[1.2] text-[color:var(--color-ink-strong)] lg:text-[32px] lg:font-semibold lg:tracking-[-0.02em]">
            {t("Parcourir par marque")}
          </h2>
          <a
            className="flex-shrink-0 text-[14px] font-medium text-[color:var(--color-brand-teal)] hover:underline lg:text-[22px] lg:font-semibold"
            href={href("/v2/acheter")}
          >
            {t("Afficher tout")}
          </a>
        </div>
        <div className="flex gap-3 overflow-x-auto scroll-smooth scrollbar-hide pb-1 lg:gap-4">
          {BRANDS.map((b) => (
            <a
              key={b.slug}
              className="flex size-[64px] shrink-0 items-center justify-center rounded-2xl border border-[color:var(--color-line-medium)] bg-white p-3 shadow-sm transition-shadow hover:shadow-md lg:size-[120px] lg:rounded-[32px] lg:p-4"
              aria-label={b.name}
              href={href(`/v2/acheter?brand=${b.slug}`)}
            >
              <img alt={b.name} className="size-full object-contain" loading="lazy" src={`${A}/storage/brands/${b.slug}.png`} />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
