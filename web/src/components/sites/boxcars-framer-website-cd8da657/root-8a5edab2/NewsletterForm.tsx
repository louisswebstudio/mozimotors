"use client";

import { useState } from "react";
import { Check, Send } from "lucide-react";
import { useI18n } from "@/i18n/client";

/**
 * Footer "new arrivals" signup: WhatsApp number pill posting a "contact" lead.
 * Pill: rgba(255,255,255,.07), 120px radius, 65px tall, 10/10/10/24 padding.
 */
export function NewsletterForm() {
  const { t } = useI18n();
  const [status, setStatus] = useState<"idle" | "pending" | "done" | "error">("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const phone = String(data.get("phone") ?? "").trim();
    const website = String(data.get("website") ?? "");
    setStatus("pending");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "contact",
          name: "Alerte nouveaux arrivages",
          phone,
          message: "Inscription alerte nouveaux arrivages (WhatsApp)",
          website,
        }),
      });
      setStatus(res.ok ? "done" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <p className="flex w-full max-w-[502px] items-center gap-2.5 text-sm leading-5 text-bx-muted" role="status">
        <Check className="size-4 shrink-0 text-white" strokeWidth={1.5} aria-hidden />
        {t.footer.newsletterDone}
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex w-full max-w-[502px] flex-col gap-2">
      <div className="flex h-[65px] w-full items-center rounded-[120px] bg-white/[0.07] py-2.5 ps-6 pe-2.5">
        <input
          type="tel"
          name="phone"
          required
          autoComplete="tel"
          placeholder={t.footer.newsletterPlaceholder}
          aria-label={t.footer.newsletterPlaceholder}
          onChange={() => status === "error" && setStatus("idle")}
          className="min-w-0 flex-1 bg-transparent text-sm leading-[19.6px] text-white outline-none placeholder:text-bx-muted"
        />
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden
          className="absolute -left-[9999px] size-px opacity-0"
        />
        <button
          type="submit"
          aria-label={t.footer.newsletterSubmit}
          disabled={status === "pending"}
          className="group/send grid size-[45px] shrink-0 place-items-center rounded-full bg-bx-blue text-white transition-colors duration-300 hover:bg-bx-blue-hover disabled:opacity-60"
        >
          <Send
            className="size-4 transition-transform duration-300 group-hover/send:rotate-45"
            strokeWidth={1.5}
            aria-hidden
          />
        </button>
      </div>
      {status === "error" && (
        <p className="ps-6 text-xs text-[#ff8a8a]" role="alert">
          {t.footer.newsletterError}
        </p>
      )}
    </form>
  );
}
