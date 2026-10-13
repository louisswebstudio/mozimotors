/** Mobile closing block « Prenez la route l'esprit tranquille ». */
import { getV2 } from "./server-locale";

export async function PeaceOfMind() {
  const { t } = await getV2();
  return (
    <section className="bg-white px-4 py-8">
      <div className="mx-auto flex w-full max-w-[362px] sm:max-w-[560px] flex-col items-center gap-3 text-center">
        <img
          src="/sites/siaracash-ma-449ca86b/root-8a5edab2/assets/certified/mozimotors-certified.svg"
          alt="MoziMotors Certified"
          loading="lazy"
          className="h-auto w-[180px]"
        />
        <h2 className="text-[22px] font-bold leading-[1.2] tracking-[-0.01em] text-[color:var(--color-brand-teal)]">
          {t("Prenez la route l'esprit tranquille")}
        </h2>
        <p className="text-[14px] font-medium leading-[20px] text-[color:var(--color-brand-dark)]">
          {t("Formalités, prix, enlèvement : MoziMotors s'occupe de tout. Vendez ou achetez votre voiture simplement — un service 100 % en ligne, gratuit et sans surprise.")}
        </p>
      </div>
    </section>
  );
}
