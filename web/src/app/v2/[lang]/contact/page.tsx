/** /v2/contact — siaracash.ma/contact: the three contact cards above a map of the showroom. */
import type { Metadata } from "next";
import { getSettings } from "@/components/sites/siaracash-ma-449ca86b/root-8a5edab2/settings";
import { ContactCards } from "@/components/sites/siaracash-ma-449ca86b/root-8a5edab2/ContactCards";
import { getV2 } from "@/components/sites/siaracash-ma-449ca86b/root-8a5edab2/server-locale";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getV2();
  return { title: t("Contactez-nous | MoziMotors") };
}

export default async function V2Contact() {
  const [settings, { t }] = await Promise.all([getSettings(), getV2()]);
  const map = `https://www.google.com/maps?q=${encodeURIComponent(settings.address)}&output=embed`;
  return (
    <div className="min-h-[60vh]">
      <ContactCards settings={settings} />
      <section className="bg-[color:var(--color-surface-soft)]">
        <iframe
          title={`${t("Plan")} — ${settings.address}`}
          src={map}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="block w-full border-0"
          style={{ height: 412 }}
        />
      </section>
    </div>
  );
}
