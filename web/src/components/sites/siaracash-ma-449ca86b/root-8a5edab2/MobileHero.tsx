/** Mobile hero (title + handover image), shown < lg. */
import { getV2 } from "./server-locale";

export async function MobileHero() {
  const { t } = await getV2();
  return (
    <section className="relative overflow-hidden mz-hero-grad-m">
      <div className="relative flex flex-col items-start px-4 pt-6 pb-5">
        <h1 className="max-w-[300px] text-[26px] font-extrabold leading-[1.1] tracking-[-0.02em] text-[color:var(--color-brand-dark)]">
          {t("Achetez ou vendez votre voiture d'occasion,")}{" "}
          <span className="block text-[color:var(--color-brand-teal)]">{t("en toute confiance")}</span>
        </h1>
        <img
          src="/sites/siaracash-ma-449ca86b/root-8a5edab2/assets/home/hero-wide.webp"
          alt=""
          width="2000"
          height="750"
          loading="eager"
          fetchPriority="high"
          className="mz-hero-photo-m mt-4 w-full rounded-2xl object-cover"
          style={{ height: 200 }}
        />
      </div>
    </section>
  );
}
