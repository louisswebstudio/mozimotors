/**
 * /contact — Boxcars /contact layout, MoziMotors content (settings from WordPress).
 * Spec: docs/research/boxcars-framer-website-cd8da657/inner-pages/pourquoi-contact.spec.md
 */
import type { Metadata } from "next";
import { Headphones, Hourglass, MapPin } from "lucide-react";
import { LeadForm } from "@/components/lead-form";
import { getSettings } from "@/lib/wp";
import { getI18n } from "@/i18n/server";
import { localeAlternates } from "@/i18n/seo";
import { Card, H5, PageIntro, PageSheet } from "@/components/sites/boxcars-framer-website-cd8da657/shared/page";
import { Container, Eyebrow, H3 } from "@/components/sites/boxcars-framer-website-cd8da657/root-8a5edab2/ui";
import { Reveal } from "@/components/sites/boxcars-framer-website-cd8da657/root-8a5edab2/reveal";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t.contact.metaTitle, description: t.contact.metaDescription, alternates: await localeAlternates("/contact") };
}

const LINK = "transition-colors duration-300 bx-ease hover:text-bx-blue hover:underline";

export default async function ContactPage() {
  const [s, { t }] = await Promise.all([getSettings(), getI18n()]);
  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(s.address)}&output=embed`;

  const items = [
    {
      icon: MapPin,
      label: t.contact.address,
      body: s.mapsUrl ? (
        <a href={s.mapsUrl} target="_blank" rel="noopener noreferrer" className={LINK}>{s.address}</a>
      ) : (
        <span>{s.address}</span>
      ),
    },
    {
      icon: Headphones,
      label: t.contact.contact,
      body: (
        <>
          <a href={`mailto:${s.email}`} className={LINK}>{s.email}</a>
          <a href={`tel:${s.phone.replace(/\s/g, "")}`} className={LINK}>{s.phone}</a>
          {s.whatsapp && (
            <a href={`https://wa.me/${s.whatsapp}`} target="_blank" rel="noopener noreferrer" className={LINK}>
              WhatsApp
            </a>
          )}
        </>
      ),
    },
    { icon: Hourglass, label: t.contact.hours, body: <span>{s.hours}</span> },
  ];

  return (
    <PageSheet>
      <PageIntro eyebrow={t.contact.eyebrow} title={t.contact.title} aside={t.contact.aside} />

      <section className="bg-white pb-[30px] bxt:pb-[60px] bxd:pb-[90px]">
        <Container className="flex flex-col gap-[60px] bxd:flex-row bxd:items-start bxd:justify-between">
          <Reveal y={24} className="flex max-w-[704px] flex-1 flex-col gap-[30px]">
            <div className="flex flex-col items-start gap-2.5">
              <Eyebrow>{t.contact.formEyebrow}</Eyebrow>
              <h2 className={`${H3} text-bx-navy`}>{t.contact.formTitle}</h2>
              <p className="text-[15px] leading-6 text-bx-ink">{t.contact.formText}</p>
            </div>
            <LeadForm
              type="contact"
              fields={[
                { name: "name", label: t.leadForm.name, required: true },
                { name: "phone", label: t.leadForm.phone, type: "tel", required: true, half: true },
                { name: "email", label: t.leadForm.email, type: "email", half: true },
                { name: "subject", label: t.contact.subject, type: "select", options: t.contact.subjects, required: true },
                { name: "message", label: t.leadForm.message, type: "textarea", required: true },
              ]}
            />
          </Reveal>

          <Reveal y={20} className="w-full bxd:w-[439px] bxd:shrink-0">
            <Card className="bx-lift flex flex-col gap-5 p-[30px] hover:shadow-[0_16px_32px_-20px_rgba(5,11,32,0.35)]">
              <div className="flex flex-col items-start gap-2.5">
                <Eyebrow>{t.contact.visitEyebrow}</Eyebrow>
                <h3 className={H5}>{t.contact.visitTitle}</h3>
                <p className="text-[15px] leading-6 text-bx-ink">{t.contact.visitText}</p>
              </div>
              <ul className="flex flex-col gap-[30px]">
                {items.map(({ icon: Icon, label, body }) => (
                  <li key={label} className="flex items-start gap-[15px]">
                    <Icon className="size-6 shrink-0 text-bx-navy" strokeWidth={1.5} aria-hidden />
                    <div className="flex flex-col gap-[5px]">
                      <h4 className="text-lg font-medium leading-[23.4px] text-bx-navy">{label}</h4>
                      <div className="flex flex-col text-[15px] leading-6 text-bx-ink">{body}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </Card>
          </Reveal>
        </Container>
      </section>

      <section className="bg-white pb-[30px] bxt:pb-[60px] bxd:pb-[90px]">
        <Container>
          <Reveal y={24}>
            <iframe
              src={mapSrc}
              title={t.visit.mapTitle}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="block h-[320px] w-full rounded-2xl border-0 bxt:h-[510px]"
            />
          </Reveal>
        </Container>
      </section>
    </PageSheet>
  );
}
