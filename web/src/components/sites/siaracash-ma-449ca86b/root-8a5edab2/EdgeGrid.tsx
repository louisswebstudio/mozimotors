/** « MoziMotors Edge » six-tile grid (siaracash.ma « SiaraCash Edge »). */
import { getV2 } from "./server-locale";

export async function EdgeGrid() {
  const { t } = await getV2();
  return (
    <section className="bg-white px-4 py-6 lg:px-12 lg:py-14">
      <div className="mx-auto flex w-full max-w-[362px] flex-col gap-4 sm:max-w-none lg:max-w-[1280px] lg:gap-8">
        <h2 className="text-[16px] font-medium leading-[1.2] tracking-[-0.01em] text-[color:var(--color-ink-strong)] lg:text-[32px] lg:font-semibold lg:tracking-[-0.02em]">
          MoziMotors Edge
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4">
          <div className="flex items-center gap-3.5 rounded-[14px] px-4 py-3.5 transition-colors border border-[color:var(--color-line-soft)] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.04)] hover:border-[color:var(--color-brand-purple-border)] hover:bg-[color:var(--color-surface-soft)]">
            <span className="flex size-14 shrink-0 items-center justify-center rounded-[14px] bg-[color:var(--color-brand-purple-soft)]">
              <img
                src="/sites/siaracash-ma-449ca86b/root-8a5edab2/assets/home/edge-inspection-mozi.webp"
                alt=""
                aria-hidden="true"
                loading="lazy"
                width="40"
                height="40"
                className="size-10 object-contain"
              />
            </span>
            <p className="text-start text-[14.5px] font-semibold leading-[1.3] text-[color:var(--color-ink-strong)]">{t("Inspection 140+ points")}</p>
          </div>
          <div className="flex items-center gap-3.5 rounded-[14px] px-4 py-3.5 transition-colors border border-[color:var(--color-line-soft)] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.04)] hover:border-[color:var(--color-brand-purple-border)] hover:bg-[color:var(--color-surface-soft)]">
            <span className="flex size-14 shrink-0 items-center justify-center rounded-[14px] bg-[color:var(--color-brand-purple-soft)]">
              <img
                src="/sites/siaracash-ma-449ca86b/root-8a5edab2/assets/home/edge-rapport-mozi.webp"
                alt=""
                aria-hidden="true"
                loading="lazy"
                width="40"
                height="40"
                className="size-10 object-contain"
              />
            </span>
            <p className="text-start text-[14.5px] font-semibold leading-[1.3] text-[color:var(--color-ink-strong)]">{t("Rapport sur l'état du véhicule")}</p>
          </div>
          <div className="flex items-center gap-3.5 rounded-[14px] px-4 py-3.5 transition-colors border border-[color:var(--color-line-soft)] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.04)] hover:border-[color:var(--color-brand-purple-border)] hover:bg-[color:var(--color-surface-soft)]">
            <span className="flex size-14 shrink-0 items-center justify-center rounded-[14px] bg-[color:var(--color-brand-purple-soft)]">
              <img
                src="/sites/siaracash-ma-449ca86b/root-8a5edab2/assets/home/edge-immatriculation-mozi.webp"
                alt=""
                aria-hidden="true"
                loading="lazy"
                width="40"
                height="40"
                className="size-10 object-contain"
              />
            </span>
            <p className="text-start text-[14.5px] font-semibold leading-[1.3] text-[color:var(--color-ink-strong)]">{t("Contrôle d'opposition (NARSA)")}</p>
          </div>
          <div className="flex items-center gap-3.5 rounded-[14px] px-4 py-3.5 transition-colors border border-[color:var(--color-line-soft)] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.04)] hover:border-[color:var(--color-brand-purple-border)] hover:bg-[color:var(--color-surface-soft)]">
            <span className="flex size-14 shrink-0 items-center justify-center rounded-[14px] bg-[color:var(--color-brand-purple-soft)]">
              <img
                src="/sites/siaracash-ma-449ca86b/root-8a5edab2/assets/home/../sell2/exp-essai-mozi.webp"
                alt=""
                aria-hidden="true"
                loading="lazy"
                width="40"
                height="40"
                className="size-10 object-contain"
              />
            </span>
            <p className="text-start text-[14.5px] font-semibold leading-[1.3] text-[color:var(--color-ink-strong)]">{t("Essai avant achat")}</p>
          </div>
          <div className="flex items-center gap-3.5 rounded-[14px] px-4 py-3.5 transition-colors border border-[color:var(--color-line-soft)] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.04)] hover:border-[color:var(--color-brand-purple-border)] hover:bg-[color:var(--color-surface-soft)]">
            <span className="flex size-14 shrink-0 items-center justify-center rounded-[14px] bg-[color:var(--color-brand-purple-soft)]">
              <img
                src="/sites/siaracash-ma-449ca86b/root-8a5edab2/assets/home/edge-demarches-mozi.webp"
                alt=""
                aria-hidden="true"
                loading="lazy"
                width="40"
                height="40"
                className="size-10 object-contain"
              />
            </span>
            <p className="text-start text-[14.5px] font-semibold leading-[1.3] text-[color:var(--color-ink-strong)]">
              {t("Accompagnement dans les démarches administratives")}
            </p>
          </div>
          <div className="flex items-center gap-3.5 rounded-[14px] px-4 py-3.5 transition-colors border border-[color:var(--color-line-soft)] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.04)] hover:border-[color:var(--color-brand-purple-border)] hover:bg-[color:var(--color-surface-soft)]">
            <span className="flex size-14 shrink-0 items-center justify-center rounded-[14px] bg-[color:var(--color-brand-purple-soft)]">
              <img
                src="/sites/siaracash-ma-449ca86b/root-8a5edab2/assets/home/edge-garantie-mozi.webp"
                alt=""
                aria-hidden="true"
                loading="lazy"
                width="40"
                height="40"
                className="size-10 object-contain"
              />
            </span>
            <p className="text-start text-[14.5px] font-semibold leading-[1.3] text-[color:var(--color-ink-strong)]">{t("Paiement 100% sécurisé")}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
