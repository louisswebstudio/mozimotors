/** /a-propos — « MoziMotors, l'occasion en confiance »: who we are, in the /pourquoi-mozimotors card style. */
import { ChevronRight, Quote } from "lucide-react";
import { A } from "./assets";
import { getV2 } from "./server-locale";

const BODY = "text-[14px] leading-[1.85] text-[color:var(--color-ink-base)] lg:text-[15.5px]";
const CHEV = <ChevronRight className="size-4 rtl:rotate-180" aria-hidden="true" />;

export async function About() {
  const { t, href } = await getV2();
  return (
    <section className="bg-[color:var(--color-surface-soft)] px-4 py-10 lg:px-12 lg:py-16">
      <div className="mx-auto w-full max-w-[1280px] rounded-[20px] bg-white p-6 shadow-[0_6px_24px_rgba(16,24,40,0.06)] sm:p-10 lg:p-14">
        <div className="grid gap-8 lg:grid-cols-[1.08fr_1fr] lg:items-center lg:gap-14">
          <div>
            <span className="block text-[13px] font-semibold uppercase tracking-[0.08em] text-[color:var(--color-ink-muted)]">{t("À propos")}</span>
            <h1 className="mt-3 text-[28px] font-bold leading-[1.2] tracking-[-0.02em] text-[color:var(--color-brand-teal)] lg:text-[40px]">
              {t("MoziMotors, l'occasion en confiance")}
            </h1>
            <p className="mt-5 text-[16px] font-semibold leading-[1.5] text-[color:var(--color-brand-purple)] lg:text-[19px]">
              {t("Acheter ou vendre une voiture est une décision importante. Chez MoziMotors, nous vous aidons à la prendre avec des informations claires et un accompagnement concret.")}
            </p>
            <p className={`mt-5 ${BODY}`}>
              {t("Basés à Casablanca, nous réunissons expertise automobile et service de proximité pour simplifier l'achat et la vente de véhicules d'occasion. Inspection approfondie, mise en valeur des voitures, échanges avec les acheteurs et suivi administratif : notre équipe vous accompagne à chaque étape.")}
            </p>
          </div>
          <img
            src={`${A}/assets/why/hero-mozi.webp`}
            alt={t("Le showroom MoziMotors")}
            width={1672}
            height={941}
            className="aspect-[4/3] w-full rounded-[16px] object-cover object-[center_26%]"
          />
        </div>

        <div className="mt-10 rounded-[16px] bg-[color:var(--color-brand-teal-soft)] p-6 lg:mt-12 lg:p-10">
          <p className="flex items-start gap-3 text-[20px] font-bold leading-[1.3] text-[color:var(--color-brand-teal)] lg:text-[26px]">
            <Quote className="mt-1 size-6 shrink-0 rtl:-scale-x-100" aria-hidden="true" />
            {t("Notre conviction : la confiance se construit sur des faits.")}
          </p>
          <p className={`mt-4 max-w-[900px] ${BODY}`}>
            {t("Nous privilégions la transparence sur l'état des véhicules, la clarté des démarches et l'écoute de vos besoins. Que vous cherchiez votre prochaine voiture ou souhaitiez vendre la vôtre, nous vous aidons à avancer sereinement, avec une formule adaptée à votre projet.")}
          </p>
        </div>

        <div className="mt-10 flex flex-col gap-5 lg:mt-12 lg:flex-row lg:items-center lg:justify-between">
          <p className="text-[18px] font-semibold text-[color:var(--color-brand-purple)] lg:text-[22px]">{t("Votre projet automobile mérite toute notre attention.")}</p>
          <div className="flex flex-wrap gap-3">
            <a
              href={href("/acheter")}
              className="inline-flex h-[52px] items-center justify-center gap-2 rounded-full bg-[color:var(--color-brand-teal)] px-7 text-[15px] font-semibold text-white transition-colors hover:bg-[color:var(--color-brand-teal-hover)]"
            >
              {t("Acheter")}
              {CHEV}
            </a>
            <a
              href={href("/vendre")}
              className="inline-flex h-[52px] items-center justify-center gap-2 rounded-full border-2 border-[color:var(--color-brand-teal)] bg-white px-7 text-[15px] font-semibold text-[color:var(--color-brand-teal)] transition-colors hover:bg-[color:var(--color-brand-teal-soft)]"
            >
              {t("Vendre")}
              {CHEV}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
