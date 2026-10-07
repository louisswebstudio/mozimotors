"use client";

/**
 * Car page actions (siaracash.ma): « Prendre RDV » modal (« Réservez votre RENDEZ-VOUS D'ESSAI », callback form),
 * favourite, share and copy-reference buttons. The form posts to /api/leads like the rest of the site.
 */
import { useEffect, useState } from "react";
import { Check, Copy, Heart, Loader2, MapPin, PhoneCall, Share2, X } from "lucide-react";
import { useFavorites } from "./favorites";
import { useV2 } from "./V2Locale";

export type RdvCar = { id: string; title: string; version: string; price: string; image?: string; city: string };

type Kind = "essai";

const COPY: Record<Kind, { kicker: string; title: string; hint: string; submit: string }> = {
  essai: { kicker: "Réservez votre", title: "RENDEZ-VOUS D'ESSAI", hint: "Un conseiller vous rappelle pour fixer votre essai", submit: "Rappelez-moi" },
};

function RdvModal({ car, kind, extra, onClose }: { car: RdvCar; kind: Kind; extra?: Record<string, string | number>; onClose: () => void }) {
  const { t } = useV2();
  const [state, setState] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const c = COPY[kind];

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("sending");
    const data = Object.fromEntries(new FormData(e.currentTarget));
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: kind, car: `${car.title} ${car.version}`.trim(), carSlug: car.id, city: car.city, ...extra, ...data }),
      });
      setState(res.ok ? "ok" : "error");
    } catch {
      setState("error");
    }
  }

  const input =
    "h-[52px] w-full rounded-xl border border-[var(--cc-line)] bg-white px-4 text-[15px] text-[var(--cc-ink)] outline-none placeholder:text-[var(--cc-muted)] focus:border-[color:var(--color-brand-teal)]";

  return (
    <div className="fixed inset-0 z-[90] grid place-items-center p-4" role="dialog" aria-modal="true" aria-label={`${t(c.kicker)} ${t(c.title)}`}>
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl animate-in fade-in-0 zoom-in-95 duration-200">
        <button
          onClick={onClose}
          aria-label={t("Fermer")}
          className="absolute right-4 top-4 grid size-8 place-items-center rounded-full bg-[var(--cc-soft)] hover:bg-black/5"
        >
          <X className="size-4 text-[var(--cc-ink)]" aria-hidden="true" />
        </button>
        <div className="px-5 pt-12 text-center">
          <p className="text-[20px] font-bold text-[var(--cc-ink)]">{t(c.kicker)}</p>
          <p className="text-[20px] font-extrabold uppercase text-[color:var(--color-brand-teal-text)]">{t(c.title)}</p>
        </div>
        {state === "ok" ? (
          <div className="flex flex-col items-center px-5 pb-8 pt-6 text-center" role="status">
            <span className="grid size-12 place-items-center rounded-full bg-[var(--cc-success)]">
              <Check className="size-6 text-white" aria-hidden="true" />
            </span>
            <p className="mt-3 text-[16px] font-bold text-[var(--cc-ink)]">{t("Demande envoyée")}</p>
            <p className="mt-1 text-[13px] text-[var(--cc-muted)]">{t("Un conseiller MoziMotors vous rappelle très vite.")}</p>
          </div>
        ) : (
          <form onSubmit={submit}>
            <div className="space-y-4 px-5 pb-4 pt-4">
              <div className="flex items-center gap-3 rounded-xl border border-[var(--cc-line)] bg-[var(--cc-soft)] p-3">
                {car.image && <img alt="" src={car.image} className="size-14 shrink-0 rounded-lg object-cover" />}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[15px] font-semibold text-[var(--cc-ink)]">{car.title}</p>
                  <p className="truncate text-[13px] text-[var(--cc-muted)]">{car.version}</p>
                </div>
                <p className="shrink-0 text-right text-[15px] font-bold text-[var(--cc-ink)]">{car.price}</p>
              </div>
              <div>
                <p className="text-[15px] font-semibold text-[var(--cc-ink)]">{t("Lieu du rendez-vous")}</p>
                <p className="mt-1.5 flex items-center gap-2 text-[15px] font-semibold text-[var(--cc-ink)]">
                  <MapPin className="size-4 text-[color:var(--color-brand-teal)]" aria-hidden="true" /> {car.city}
                </p>
              </div>
              <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
              <label className="block">
                <span className="text-[15px] font-semibold text-[var(--cc-ink)]">
                  {t("Nom complet")} <span className="text-red-500">*</span>
                </span>
                <input name="name" required autoComplete="name" placeholder={t("Votre nom")} className={`${input} mt-2`} />
              </label>
              <label className="block">
                <span className="text-[15px] font-semibold text-[var(--cc-ink)]">
                  {t("Téléphone")} <span className="text-red-500">*</span>
                </span>
                <input
                  name="phone"
                  type="tel"
                  required
                  autoComplete="tel"
                  pattern="[+\d\s().-]{8,20}"
                  placeholder="06 12 34 56 78"
                  className={`${input} mt-2`}
                />
              </label>
              {state === "error" && <p className="text-[13px] text-red-600">{t("Envoi impossible. Réessayez ou contactez-nous par WhatsApp.")}</p>}
            </div>
            <div className="border-t border-[var(--cc-line)] px-5 pb-5 pt-3 text-center">
              <p className="mb-3 text-[12px] text-[var(--cc-muted)]">{t(c.hint)}</p>
              <button disabled={state === "sending"} className="cc-btn cc-btn-block h-[52px] w-full bg-[var(--cc-primary)] text-white hover:opacity-90">
                {state === "sending" ? <Loader2 className="size-5 animate-spin" aria-hidden="true" /> : <PhoneCall className="size-5" aria-hidden="true" />}
                {t(c.submit)}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

/** Any button that opens the RDV modal. */
export function RdvButton({
  car,
  kind = "essai",
  extra,
  className,
  children,
}: {
  car: RdvCar;
  kind?: Kind;
  extra?: Record<string, string | number>;
  className: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={className}>
        {children}
      </button>
      {open && <RdvModal car={car} kind={kind} extra={extra} onClose={() => setOpen(false)} />}
    </>
  );
}

export function FavButton({ id, className, iconClass }: { id: string; className: string; iconClass: string }) {
  const { t } = useV2();
  const fav = useFavorites();
  const on = fav.has(id);
  return (
    <button type="button" aria-label={t("Enregistrer")} aria-pressed={on} onClick={() => fav.toggle(id)} className={className}>
      <Heart className={`${iconClass} ${on ? "fill-current !text-[var(--cc-primary)]" : ""}`} aria-hidden="true" />
    </button>
  );
}

export function ShareButton({ title, className, iconClass }: { title: string; className: string; iconClass: string }) {
  const { t } = useV2();
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      aria-label={t("Partager")}
      title={t(copied ? "Lien copié" : "Partager")}
      onClick={async () => {
        const url = window.location.href;
        if (navigator.share) {
          try {
            await navigator.share({ title, url });
          } catch {}
          return;
        }
        await navigator.clipboard?.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      className={className}
    >
      {copied ? <Check className={iconClass} aria-hidden="true" /> : <Share2 className={iconClass} aria-hidden="true" />}
    </button>
  );
}

export function CopyRef({ value }: { value: string }) {
  const { t } = useV2();
  const [copied, setCopied] = useState(false);
  return (
    <p className="flex items-center gap-1.5 pt-1 text-[12.5px] text-[var(--cc-muted)]">
      {t("Réf.")} {value}
      <button
        aria-label={t("Copier la référence")}
        onClick={async () => {
          await navigator.clipboard?.writeText(value);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        }}
        className="text-[var(--cc-muted)] hover:text-[var(--cc-ink)]"
      >
        {copied ? <Check className="size-3.5" aria-hidden="true" /> : <Copy className="size-3.5" aria-hidden="true" />}
      </button>
    </p>
  );
}
