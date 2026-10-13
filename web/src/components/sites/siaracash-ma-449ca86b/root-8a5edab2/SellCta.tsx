/**
 * « Combien vaut votre voiture aujourd'hui ? » sell band: burgundy panel with the pitch and the button,
 * next to a white car (Pixabay Content License, pixabay.com/illustrations/mercedes-benz-car-vehicle-auto-1335674).
 * Styles: .mz-sell* in mozi-theme.css.
 */
import { ArrowRight, Gauge } from "lucide-react";
import { getV2 } from "./server-locale";

export async function SellCta() {
  const { t, href } = await getV2();
  return (
    <section className="bg-white px-4 py-6 lg:px-12 lg:py-14">
      <div className="mz-sell">
        <span className="mz-sell-glow" aria-hidden="true" />
        <div className="mz-sell-copy">
          <span className="mz-sell-kicker">
            <Gauge className="size-4" aria-hidden="true" />
            {t("Gratuit · 2 minutes · Sans engagement")}
          </span>
          <h2 className="mz-sell-title">{t("Combien vaut votre voiture aujourd'hui ?")}</h2>
          <p className="mz-sell-text">
            {t("Découvrez sa valeur en 2 minutes, gratuitement et sans engagement. Expertise, offre ferme sous 24h, paiement sécurisé : nous nous occupons de tout.")}
          </p>
          <a className="mz-sell-btn" href={href("/vendre")}>
            {t("Estimer ma voiture")}
            <ArrowRight className="size-4 rtl:-scale-x-100" aria-hidden="true" />
          </a>
        </div>

        <div className="mz-sell-visual" aria-hidden="true">
          <span className="mz-sell-ground" />
          <img src="/sites/siaracash-ma-449ca86b/root-8a5edab2/assets/home/sell-car-mozi.webp" alt="" width={760} height={349} loading="lazy" className="mz-sell-car" />
        </div>
      </div>
    </section>
  );
}
