/** « Achetez en toute confiance » banner (siaracash.ma home, desktop + mobile). */
import { getV2 } from "./server-locale";

export async function CertifiedBanner() {
  const { t } = await getV2();
  return (
    <section className="bg-white px-4 pt-2 pb-8 lg:px-12 lg:py-16">
      <div className="relative mx-auto flex w-full max-w-[362px] flex-col items-center gap-5 overflow-hidden rounded-[20px] border border-[color:var(--color-line-strong)] bg-white p-6 text-center lg:max-w-[1280px] lg:flex-row lg:items-center lg:gap-10 lg:p-11 lg:text-start">
        <span aria-hidden="true" className="absolute inset-y-0 start-0 w-1.5 mz-stripe" />
        <img
          src="/sites/siaracash-ma-449ca86b/root-8a5edab2/assets/certified/mozimotors-certified.svg"
          alt="MoziMotors Certified"
          loading="lazy"
          className="h-[133px] w-[180px] shrink-0"
        />
        <div className="flex flex-col items-center gap-2 lg:flex-1 lg:items-start lg:gap-3">
          <h2 className="text-[26px] font-bold leading-[1.2] tracking-[-0.01em] text-[color:var(--color-brand-teal)] lg:text-[40px] lg:leading-[1.4] lg:tracking-[-0.02em]">
            {t("Achetez en toute confiance")}
          </h2>
          <p className="max-w-[320px] text-[14px] font-medium leading-[20px] text-[color:var(--color-brand-navy)] lg:max-w-[560px] lg:text-[24px] lg:leading-[1.2]">
            {t("Chaque véhicule est contrôlé par nos experts techniques pour une transaction claire, sécurisée et sans frais cachés.")}
          </p>
        </div>
        <img
          src="/sites/siaracash-ma-449ca86b/root-8a5edab2/assets/home/certified-car.webp"
          alt=""
          aria-hidden="true"
          loading="lazy"
          className="w-[260px] shrink-0 object-contain drop-shadow-[0_20px_26px_rgba(16,24,40,0.18)] lg:w-[360px]"
        />
      </div>
    </section>
  );
}
