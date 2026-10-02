"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy, Phone, Share2, X } from "lucide-react";
import { LeadForm } from "@/components/lead-form";
import { useI18n } from "@/i18n/client";

/* Car page sidebar actions (SiaraCash layout): share icon, then
   "Prendre RDV" (dialog with the reservation lead form) / WhatsApp / call, and the reference. */

const iconBtn =
  "grid shrink-0 place-items-center rounded-full border border-bx-line bg-white text-bx-navy transition-colors duration-300 bx-ease hover:border-bx-blue hover:text-bx-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bx-blue/40";

function useFlash(ms = 1800) {
  const [on, setOn] = useState(false);
  const t = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(t.current), []);
  return [on, () => { setOn(true); clearTimeout(t.current); t.current = setTimeout(() => setOn(false), ms); }] as const;
}

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

/** Share button (native sheet, or copies the link). */
export function FavShare({ title }: { title: string }) {
  const { t } = useI18n();
  const [copied, flash] = useFlash();

  const share = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        /* dismissed — fall through to nothing */
        return;
      }
    }
    if (await copyText(url)) flash();
  };

  return (
    <div className="relative flex shrink-0 items-center gap-1.5">
      <button type="button" onClick={share} aria-label={t.carActions.share} className={`${iconBtn} size-9`}>
        {copied ? <Check className="size-[18px] text-ok" strokeWidth={2} /> : <Share2 className="size-[18px]" strokeWidth={1.5} />}
      </button>
      <span role="status" className={`pointer-events-none absolute end-0 top-full mt-2 whitespace-nowrap rounded-lg bg-bx-navy px-2.5 py-1 text-xs text-white transition-opacity duration-200 ${copied ? "opacity-100" : "opacity-0"}`}>
        {copied ? t.carActions.linkCopied : ""}
      </span>
    </div>
  );
}

/** "Prendre RDV" (reservation form in a modal dialog), WhatsApp, call, and the copyable reference. */
export function CarCtas({
  carId,
  carLabel,
  reference,
  phone,
  whatsapp,
}: {
  carId: number;
  /** e.g. "Peugeot 3008 1.5 BlueHDi 130 2022 — 259 000 DH" */
  carLabel: string;
  reference: string;
  phone: string;
  whatsapp: string;
}) {
  const { t, fmt } = useI18n();
  const dialog = useRef<HTMLDialogElement>(null);
  const [copied, flash] = useFlash();
  const waMessage = fmt(t.carActions.waMessage, { car: carLabel, ref: reference });
  const waLink = (text: string) => `https://wa.me/${whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(text)}`;

  const btn =
    "flex h-12 w-full items-center justify-center gap-2 rounded-xl text-[15px] font-semibold leading-6 transition-colors duration-300 bx-ease focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2";

  return (
    <div className="flex flex-col gap-3">
      <button type="button" onClick={() => dialog.current?.showModal()} className={`${btn} bg-bx-blue text-white hover:bg-bx-blue-hover focus-visible:ring-bx-blue/50`}>
        {t.carActions.book}
      </button>
      <a
        href={waLink(waMessage)}
        // The page URL is only known in the browser: append it at click time.
        onClick={(e) => (e.currentTarget.href = waLink(`${waMessage} ${window.location.href.split("?")[0]}`))}
        target="_blank" rel="noopener noreferrer" className={`${btn} bg-[#128C7E] text-white hover:bg-[#0E7266] focus-visible:ring-[#128C7E]/50`}>
        <WhatsAppIcon /> {t.carActions.whatsapp}
      </a>
      <a href={`tel:${phone.replace(/\s/g, "")}`} className={`${btn} border border-bx-line bg-white font-medium text-bx-navy hover:border-bx-navy focus-visible:ring-bx-blue/40`}>
        <Phone className="size-4" strokeWidth={1.75} aria-hidden /> {phone}
      </a>

      <button
        type="button"
        onClick={async () => (await copyText(reference)) && flash()}
        className="mt-1 inline-flex w-fit items-center gap-1.5 rounded text-[13px] text-bx-ink/60 transition-colors duration-300 hover:text-bx-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bx-blue/40"
        aria-label={fmt(t.carActions.copyReference, { ref: reference })}
      >
        {fmt(t.carActions.reference, { ref: reference })}
        {copied ? <Check className="size-3.5 text-ok" strokeWidth={2} aria-hidden /> : <Copy className="size-3.5" strokeWidth={1.5} aria-hidden />}
        <span role="status" className="sr-only">{copied ? t.carActions.referenceCopied : ""}</span>
      </button>

      <dialog
        ref={dialog}
        aria-labelledby="rdv-title"
        data-lenis-prevent
        onClick={(e) => e.target === dialog.current && dialog.current?.close()}
        className="m-auto w-[min(440px,calc(100vw-32px))] rounded-2xl p-0 text-bx-navy shadow-[0_24px_64px_rgba(5,11,32,0.35)] backdrop:bg-bx-navy/60 backdrop:backdrop-blur-sm"
      >
        <div className="flex flex-col gap-5 p-6 bxt:p-8">
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-1">
              <h2 id="rdv-title" className="text-xl font-bold leading-7">{t.carActions.rdvTitle}</h2>
              <p className="text-sm leading-5 text-bx-ink/70">{carLabel}</p>
            </div>
            <button type="button" onClick={() => dialog.current?.close()} aria-label={t.common.close} className={`${iconBtn} size-10`}>
              <X className="size-[18px]" strokeWidth={1.75} />
            </button>
          </div>
          <LeadForm
            type="reservation"
            extra={{ car_id: carId, car: carLabel, reference }}
            submitLabel={t.carActions.rdvSubmit}
            successText={t.carActions.rdvSuccess}
            fields={[
              { name: "name", label: t.leadForm.name, required: true },
              { name: "phone", label: t.leadForm.phone, type: "tel", required: true, placeholder: t.leadForm.phonePlaceholder },
              { name: "slot", label: t.carActions.slotLabel, type: "select", options: t.carActions.slots },
            ]}
          />
        </div>
      </dialog>
    </div>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-[18px]" fill="currentColor" aria-hidden>
      <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.4-1.47-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.49s1.07 2.89 1.22 3.09c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.08 1.76-.72 2.01-1.42.25-.7.25-1.29.17-1.42-.07-.12-.27-.2-.57-.35ZM12.05 21.5h-.01a9.45 9.45 0 0 1-4.82-1.32l-.35-.2-3.58.94.96-3.49-.23-.36a9.43 9.43 0 0 1-1.45-5.03c0-5.22 4.25-9.47 9.48-9.47a9.4 9.4 0 0 1 6.7 2.78 9.4 9.4 0 0 1 2.77 6.7c0 5.22-4.25 9.46-9.47 9.46Zm8.06-17.52A11.3 11.3 0 0 0 12.05.64C5.77.64.66 5.75.66 12.03c0 2 .52 3.96 1.52 5.69L.57 23.36l5.78-1.52a11.37 11.37 0 0 0 5.69 1.45h.01c6.28 0 11.39-5.11 11.39-11.39 0-3.04-1.18-5.9-3.33-8.05v.13Z" />
    </svg>
  );
}

/**
 * Phone/tablet only: once the inline summary has scrolled away, a bottom bar keeps the price and
 * the two main actions one tap away. Sets `data-cta-bar` on <html> so the floating WhatsApp button hides.
 */
export function MobileCtaBar({
  price,
  carLabel,
  reference,
  whatsapp,
}: {
  price: string;
  carLabel: string;
  reference: string;
  whatsapp: string;
}) {
  const { t, fmt } = useI18n();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const summary = document.getElementById("summary");
    if (!summary) return;
    const io = new IntersectionObserver(([e]) => setShow(!e.isIntersecting && e.boundingClientRect.top < 0), { threshold: 0 });
    io.observe(summary);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    // The inline summary already has its own WhatsApp action, so the floating button stays hidden on the whole car page.
    document.documentElement.setAttribute("data-cta-bar", "");
    return () => document.documentElement.removeAttribute("data-cta-bar");
  }, []);

  const wa = `https://wa.me/${whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(fmt(t.carActions.waMessage, { car: carLabel, ref: reference }))}`;

  return (
    <div
      aria-hidden={!show}
      className={`fixed inset-x-0 bottom-0 z-40 flex items-center gap-3 border-t border-bx-line bg-white/95 px-4 py-3 pb-[max(12px,env(safe-area-inset-bottom))] shadow-[0_-8px_24px_-12px_rgba(5,11,32,0.25)] backdrop-blur transition-transform duration-300 bx-ease bxd:hidden ${show ? "translate-y-0" : "translate-y-full"}`}
    >
      <p className="min-w-0 flex-1 truncate text-lg font-bold tracking-[-0.02em] text-bx-navy">{price}</p>
      <a
        href={wa}
        target="_blank"
        rel="noopener noreferrer"
        tabIndex={show ? 0 : -1}
        aria-label={t.carActions.whatsapp}
        className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#128C7E] text-white"
      >
        <WhatsAppIcon />
      </a>
      <a
        href="#summary"
        tabIndex={show ? 0 : -1}
        className="flex h-11 shrink-0 items-center rounded-xl bg-bx-blue px-5 text-[15px] font-semibold text-white"
      >
        {t.carActions.book}
      </a>
    </div>
  );
}
