"use client";

/**
 * Car page head blocks (siaracash.ma): sticky price/contact card (desktop aside), the same info inline on
 * mobile, the mobile top bar (back, logo, save, share) and the bottom CTA bar (RDV / WhatsApp / call).
 */
import { BadgeCheck, ChevronLeft, Fuel, Gauge, MapPin, MessageCircle, Phone, Settings2, ShieldCheck, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { HOME, Logo, telLink, waLink } from "./assets";
import { CopyRef, FavButton, RdvButton, ShareButton, type RdvCar } from "./CarActions";
import type { ListedCar } from "./listing";
import { useV2 } from "./V2Locale";

type Props = { car: ListedCar; owners?: string; rdv: RdvCar; reportHref: string };

function Badges({ car }: { car: ListedCar }) {
  const { t } = useV2();
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {car.certified && (
        <span className="flex items-center gap-1 rounded-md bg-[var(--cc-success-bg)] px-2.5 py-1 text-[12.5px] font-bold text-[var(--cc-success-text)]">
          <ShieldCheck className="size-3.5 shrink-0" aria-hidden="true" /> {t("Certifié")}
        </span>
      )}
      {car.privateSeller && (
        <span className="flex items-center gap-1 rounded-md bg-[var(--cc-navy)] px-2.5 py-1 text-[12.5px] font-bold text-white">
          <BadgeCheck className="size-3.5 shrink-0" aria-hidden="true" /> {t("Particuliers")}
        </span>
      )}
    </div>
  );
}

function Specs({ car, owners, big }: { car: ListedCar; owners?: string; big?: boolean }) {
  const { t } = useV2();
  const items = [
    { icon: Gauge, v: car.km },
    { icon: UserRound, v: owners },
    { icon: Fuel, v: car.fuel },
    { icon: Settings2, v: car.gearbox },
  ].filter((x) => x.v);
  return (
    <div className={`mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 font-semibold text-[var(--cc-ink)] ${big ? "text-[14px]" : "text-[13.5px]"}`}>
      {items.map(({ icon: Icon, v }) => (
        <span key={v} className="flex items-center gap-1.5">
          <Icon className="size-4 text-[var(--cc-muted)]" aria-hidden="true" /> {t(v!)}
        </span>
      ))}
    </div>
  );
}

const waText = (car: ListedCar) => `Bonjour, je suis intéressé par cette voiture : ${car.title} (réf. ${car.id})`;

export function PriceCard({ car, owners, rdv, reportHref, phone, whatsapp }: Props & { phone: string; whatsapp: string }) {
  const { t } = useV2();
  return (
    <aside className="space-y-4">
      <div className="sticky top-[124px] space-y-4">
        <div className="cc-card overflow-hidden">
          <div className="px-4 pt-4">
            <div className="flex items-end gap-2">
              <span className="text-[34px] font-extrabold leading-none tracking-tight text-[var(--cc-ink)]">{car.price}</span>
            </div>
          </div>
          <div className="mx-4 mt-4 border-t border-[var(--cc-line)]" />
          <div className="px-4 pt-4">
            <div className="flex items-center justify-between gap-2">
              <Badges car={car} />
              <div className="flex shrink-0 items-center gap-1.5">
                <FavButton
                  id={car.id}
                  className="grid size-9 place-items-center rounded-full border border-[var(--cc-line)]"
                  iconClass="size-4 text-[var(--cc-body)]"
                />
                <ShareButton
                  title={car.title}
                  className="grid size-9 place-items-center rounded-full border border-[var(--cc-line)] text-[var(--cc-body)] hover:bg-[var(--cc-primary-tint)]"
                  iconClass="size-4"
                />
              </div>
            </div>
            <h1 className="mt-2.5 text-[24px] font-extrabold leading-8 text-[var(--cc-ink)]">{car.title}</h1>
            {car.version && <p className="mt-0.5 text-[14px] text-[var(--cc-muted)]">{car.version}</p>}
            <Specs car={car} owners={owners} />
            <a href={reportHref} className="mt-3 inline-block text-[14px] font-bold text-[var(--cc-primary)] underline underline-offset-4 hover:opacity-80">
              {t("Voir le rapport d'expertise complet")}
            </a>
          </div>
          <div className="space-y-3 px-4 pb-4 pt-4">
            <RdvButton car={rdv} className="cc-btn cc-btn-primary h-12 w-full">
              {t("Prendre RDV")}
            </RdvButton>
            <a
              href={waLink(whatsapp, waText(car))}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border-2 border-[color:var(--color-brand-teal)] bg-white text-[color:var(--color-brand-teal)] hover:bg-[color:var(--color-brand-teal-soft)] text-[15px] font-semibold transition-opacity hover:opacity-90"
            >
              <MessageCircle className="size-4" aria-hidden="true" /> WhatsApp
            </a>
            <a
              href={telLink(phone)}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-[var(--cc-line)] text-[15px] font-semibold text-[var(--cc-ink)] transition-colors hover:bg-[var(--cc-primary-tint)]"
            >
              <Phone className="size-4" aria-hidden="true" /> {phone}
            </a>
            <CopyRef value={car.id} />
          </div>
        </div>
        <div className="rounded-xl border border-[var(--cc-line)] bg-white p-4">
          <p className="flex items-center gap-2 text-[14px] font-bold text-[var(--cc-ink)]">
            <MapPin className="size-5 text-[var(--cc-primary)]" aria-hidden="true" /> {car.city}
          </p>
        </div>
      </div>
    </aside>
  );
}

export function MobileInfo({ car, owners, reportHref }: Omit<Props, "rdv">) {
  const { t } = useV2();
  return (
    <div className="mt-3">
      <div className="flex items-end gap-2">
        <span className="text-[32px] font-extrabold leading-none tracking-tight text-[var(--cc-ink)]">{car.price}</span>
      </div>
      <div className="my-4 border-t border-[var(--cc-line)]" />
      <Badges car={car} />
      <h1 className="mt-2.5 text-[24px] font-extrabold leading-8 text-[var(--cc-ink)]">{car.title}</h1>
      {car.version && <p className="mt-0.5 text-[14px] text-[var(--cc-muted)]">{car.version}</p>}
      <Specs car={car} owners={owners} big />
      <a href={reportHref} className="mt-3.5 inline-block text-[15px] font-bold text-[var(--cc-primary)] underline underline-offset-4">
        {t("Voir le rapport d'expertise complet")}
      </a>
    </div>
  );
}

export function MobileTopBar({ car }: { car: ListedCar }) {
  const { t, href } = useV2();
  const router = useRouter();
  return (
    <header className="sticky top-0 z-[60] border-b border-[var(--cc-line)] bg-white lg:hidden">
      <div className="flex min-h-[64px] items-center gap-3 px-4 py-2">
        <button
          type="button"
          aria-label={t("Retour")}
          onClick={() => (history.length > 1 ? router.back() : router.push(href("/acheter")))}
          className="-ms-1 grid size-9 shrink-0 place-items-center rounded-full hover:bg-[var(--cc-soft)]"
        >
          <ChevronLeft className="size-6 text-[var(--cc-ink)]" aria-hidden="true" />
        </button>
        <a href={href(HOME)} aria-label={t("Accueil MoziMotors")} className="shrink-0">
          <Logo height={36} />
        </a>
        <div className="ms-auto flex shrink-0 items-center">
          <FavButton id={car.id} className="grid size-10 place-items-center rounded-full" iconClass="size-[24px] text-[var(--cc-primary)]" />
          <ShareButton title={car.title} className="grid size-10 place-items-center rounded-full" iconClass="size-[24px] text-[var(--cc-ink)]" />
        </div>
      </div>
    </header>
  );
}

export function MobileCtaBar({ car, rdv, phone, whatsapp }: { car: ListedCar; rdv: RdvCar; phone: string; whatsapp: string }) {
  const { t } = useV2();
  return (
    <div
      className="cc-bottombar fixed inset-x-0 z-40 border-t border-[var(--cc-line)] bg-white px-4 py-3 transition-[bottom] duration-300 ease-out lg:hidden"
      style={{ bottom: "var(--bottom-nav-h, 0px)" }}
    >
      <div className="flex items-center gap-2">
        <RdvButton car={rdv} className="cc-btn cc-btn-primary flex-1">
          {t("Prendre RDV")}
        </RdvButton>
        <a
          href={waLink(whatsapp, waText(car))}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="WhatsApp"
          className="grid size-12 shrink-0 place-items-center rounded-xl border-2 border-[color:var(--color-brand-teal)] bg-white text-[color:var(--color-brand-teal)] hover:bg-[color:var(--color-brand-teal-soft)]"
        >
          <MessageCircle className="size-5" aria-hidden="true" />
        </a>
        <a
          href={telLink(phone)}
          aria-label={t("Appeler")}
          className="grid size-12 shrink-0 place-items-center rounded-xl border border-[var(--cc-line)] text-[var(--cc-ink)]"
        >
          <Phone className="size-5" aria-hidden="true" />
        </a>
      </div>
    </div>
  );
}
