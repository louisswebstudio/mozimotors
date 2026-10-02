/** « Combien vaut votre voiture aujourd'hui ? » sell banner. */
import { getV2 } from "./server-locale";

export async function SellCta() {
  const { t, href } = await getV2();
  return (
    <section className="bg-white px-4 py-6 lg:px-12 lg:py-14">
      <div className="mx-auto flex w-full max-w-[362px] items-center gap-4 overflow-hidden rounded-[20px] border border-[color:var(--color-line-strong)] bg-[color:var(--color-brand-purple-soft)] shadow-[0_6px_24px_rgba(16,24,40,0.06)] py-6 ps-6 pe-0 lg:max-w-[1280px] lg:gap-10 lg:py-12 lg:ps-0 lg:pe-12">
        <div className="order-2 flex h-[139px] w-[150px] shrink-0 items-center justify-center lg:order-1 lg:h-[200px] lg:w-[320px]">
          <img
            src="/sites/siaracash-ma-449ca86b/root-8a5edab2/assets/home/cta-sell-suv-mozi.webp"
            alt=""
            aria-hidden="true"
            loading="lazy"
            className="h-[139px] w-[150px] object-contain drop-shadow-[0_16px_20px_rgba(16,24,40,0.18)] lg:h-[170px] lg:w-[300px]"
          />
        </div>
        <div className="order-1 flex flex-1 flex-col items-start gap-3 lg:order-2 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
          <div className="flex flex-col items-start gap-2 lg:max-w-[480px] lg:gap-3">
            <h2 className="text-[18px] font-bold leading-[1.25] tracking-[-0.01em] text-[color:var(--color-brand-purple)] lg:text-[32px] lg:tracking-[-0.02em]">
              {t("Combien vaut votre voiture aujourd'hui ?")}
            </h2>
            <p className="text-[13px] font-medium leading-[18px] text-[color:var(--color-ink-muted)] lg:text-[20px] lg:leading-[1.2]">
              {t("Découvrez sa valeur en 2 minutes, gratuitement et sans engagement. Expertise, offre ferme sous 24h, paiement sécurisé : nous nous occupons de tout.")}
            </p>
          </div>
          <a
            className="inline-flex h-10 items-center justify-center rounded-[30px] bg-[color:var(--color-brand-teal)] px-5 text-[12px] font-medium uppercase tracking-wide text-white transition-colors hover:bg-[color:var(--color-brand-teal-hover)] lg:hidden"
            href={href("/v2/vendre")}
          >
            {t("Estimer ma voiture")}
          </a>
        </div>
        <a
          className="order-3 hidden h-[58px] w-[240px] shrink-0 items-center justify-center rounded-[30px] bg-[color:var(--color-brand-teal)] text-[16px] font-semibold uppercase tracking-wide text-white transition-colors hover:bg-[color:var(--color-brand-teal-hover)] lg:inline-flex"
          href={href("/v2/vendre")}
        >
          {t("Estimer ma voiture")}
        </a>
      </div>
    </section>
  );
}
