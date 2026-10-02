/** « Comment ça marche » three cards. */
import { getV2 } from "./server-locale";

export async function HowItWorks() {
  const { t } = await getV2();
  return (
    <section className="bg-white px-4 py-6 lg:px-12 lg:py-14">
      <div className="mx-auto flex w-full max-w-[362px] flex-col gap-4 lg:max-w-[1280px] lg:gap-6">
        <h2 className="text-[18px] font-bold leading-[1.2] tracking-[-0.01em] text-[color:var(--color-ink-strong)] lg:text-[28px] lg:tracking-[-0.02em]">
          {t("Comment ça marche")}
        </h2>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-6">
          <div className="flex flex-col overflow-hidden rounded-2xl border border-[color:var(--color-line-strong)] bg-white shadow-[0_6px_24px_rgba(16,24,40,0.06)]">
            <img
              src="/sites/siaracash-ma-449ca86b/root-8a5edab2/assets/home/how-mozi-1.webp"
              alt=""
              aria-hidden="true"
              loading="lazy"
              className="aspect-[716/382] w-full object-cover"
            />
            <div className="flex flex-col gap-1.5 p-4 lg:gap-2 lg:p-5">
              <h3 className="text-[16px] font-bold leading-snug text-[color:var(--color-brand-purple)] lg:text-[18px] lg:tracking-[-0.01em]">
                {t("Trouvez la voiture qu'il vous faut")}
              </h3>
              <p className="text-[13px] leading-[18px] text-[color:var(--color-ink-base)] lg:text-[14px] lg:leading-[20px]">
                {t("Chaque voiture est inspectée sur plus de 140 points et affichée à prix juste. Aucune mauvaise surprise.")}
              </p>
            </div>
          </div>
          <div className="flex flex-col overflow-hidden rounded-2xl border border-[color:var(--color-line-strong)] bg-white shadow-[0_6px_24px_rgba(16,24,40,0.06)]">
            <img
              src="/sites/siaracash-ma-449ca86b/root-8a5edab2/assets/home/how-mozi-2.webp"
              alt=""
              aria-hidden="true"
              loading="lazy"
              className="aspect-[716/382] w-full object-cover"
            />
            <div className="flex flex-col gap-1.5 p-4 lg:gap-2 lg:p-5">
              <h3 className="text-[16px] font-bold leading-snug text-[color:var(--color-brand-purple)] lg:text-[18px] lg:tracking-[-0.01em]">
                {t("Réservez en ligne en quelques minutes")}
              </h3>
              <p className="text-[13px] leading-[18px] text-[color:var(--color-ink-base)] lg:text-[14px] lg:leading-[20px]">
                {t("Réservez votre voiture et suivez votre dossier en ligne. Un conseiller vous accompagne à chaque étape.")}
              </p>
            </div>
          </div>
          <div className="flex flex-col overflow-hidden rounded-2xl border border-[color:var(--color-line-strong)] bg-white shadow-[0_6px_24px_rgba(16,24,40,0.06)]">
            <img
              src="/sites/siaracash-ma-449ca86b/root-8a5edab2/assets/home/how-mozi-3.webp"
              alt=""
              aria-hidden="true"
              loading="lazy"
              className="aspect-[716/382] w-full object-cover"
            />
            <div className="flex flex-col gap-1.5 p-4 lg:gap-2 lg:p-5">
              <h3 className="text-[16px] font-bold leading-snug text-[color:var(--color-brand-purple)] lg:text-[18px] lg:tracking-[-0.01em]">
                {t("Récupérez-la ou faites-vous livrer")}
              </h3>
              <p className="text-[13px] leading-[18px] text-[color:var(--color-ink-base)] lg:text-[14px] lg:leading-[20px]">
                {t("Remise des clés à notre showroom de Casablanca, ou livraison disponible partout au Maroc en option.")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
