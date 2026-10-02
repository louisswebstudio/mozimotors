"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { ArrowIcon } from "@/components/sites/boxcars-framer-website-cd8da657/root-8a5edab2/ui";
import { CheckBadge } from "@/components/sites/boxcars-framer-website-cd8da657/shared/page";
import { useI18n } from "@/i18n/client";

export type LeadType = "reservation" | "estimation" | "financement" | "contact" | "essai";

export type FieldDef = {
  name: string;
  label: string;
  type?: "text" | "tel" | "email" | "number" | "select" | "textarea";
  options?: string[];
  required?: boolean;
  placeholder?: string;
  half?: boolean;
};

/** Boxcars form field: 48px, 12px radius, 1px #E1E1E1 border, 14px navy text. */
const inputCls =
  "w-full rounded-xl border border-bx-line bg-white px-4 py-3 text-sm leading-6 text-bx-navy outline-none transition-[border-color,box-shadow] duration-300 placeholder:text-[#818181] focus:border-bx-blue focus:shadow-[0_0_0_3px_rgba(64,95,242,0.12)]";

/**
 * Generic lead form. Posts to /api/leads, which forwards to the WordPress
 * `mozi/v1/leads` endpoint so every submission lands in WP admin › Demandes.
 */
export function LeadForm({
  type,
  fields,
  submitLabel,
  extra,
  successText,
}: {
  type: LeadType;
  fields: FieldDef[];
  submitLabel?: string;
  extra?: Record<string, string | number>;
  successText?: string;
}) {
  const { t } = useI18n();
  const [state, setState] = useState<"idle" | "sending" | "ok" | "error">("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("sending");
    const data = Object.fromEntries(new FormData(e.currentTarget));
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, ...extra, ...data }),
      });
      setState(res.ok ? "ok" : "error");
    } catch {
      setState("error");
    }
  }

  if (state === "ok")
    return (
      <div className="flex flex-col items-center rounded-2xl bg-bx-lavender px-6 py-10 text-center" role="status">
        <CheckBadge className="size-10" />
        <p className="mt-3 text-lg font-medium text-bx-navy">{t.leadForm.sentTitle}</p>
        <p className="mt-1 text-sm leading-5 text-bx-ink">{successText ?? t.leadForm.success}</p>
      </div>
    );

  return (
    <form onSubmit={onSubmit} className="grid grid-cols-2 gap-x-5 gap-y-5">
      {/* honeypot */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      {fields.map((f) => (
        <label key={f.name} className={`flex flex-col gap-2.5 ${f.half ? "col-span-2 bxt:col-span-1" : "col-span-2"}`}>
          <span className="text-sm leading-5 text-[#818181]">
            {f.label} {f.required && <span className="text-bx-blue">*</span>}
          </span>
          {f.type === "select" ? (
            <select name={f.name} required={f.required} className={`${inputCls} appearance-none bg-[url('data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20viewBox=%220%200%2024%2024%22%20fill=%22none%22%20stroke=%22%23050B20%22%20stroke-width=%221.5%22%20stroke-linecap=%22round%22%20stroke-linejoin=%22round%22%3E%3Cpath%20d=%22m6%209%206%206%206-6%22/%3E%3C/svg%3E')] bg-[length:16px] bg-[right_16px_center] bg-no-repeat rtl:bg-[left_16px_center] pe-10`} defaultValue="">
              <option value="" disabled>{t.leadForm.choose}</option>
              {f.options?.map((o) => <option key={o}>{o}</option>)}
            </select>
          ) : f.type === "textarea" ? (
            <textarea name={f.name} required={f.required} placeholder={f.placeholder} rows={4} className={`${inputCls} min-h-[100px] resize-y`} />
          ) : (
            <input name={f.name} type={f.type ?? "text"} required={f.required} placeholder={f.placeholder} className={inputCls} />
          )}
        </label>
      ))}
      <button
        disabled={state === "sending"}
        className="col-span-2 flex h-11 items-center justify-center gap-2.5 rounded-[10px] bg-bx-blue px-6 text-[15px] font-medium leading-6 text-white transition-colors duration-300 bx-ease hover:bg-bx-blue-hover disabled:opacity-70"
      >
        {state === "sending" ? <Loader2 className="size-4 animate-spin" /> : null}
        {submitLabel ?? t.leadForm.send}
        {state !== "sending" && <ArrowIcon />}
      </button>
      {state === "error" && (
        <p className="col-span-2 text-center text-sm text-red-600" role="alert">
          {t.leadForm.error}
        </p>
      )}
      <p className="col-span-2 text-center text-xs leading-5 text-[#818181]">
        {t.leadForm.privacy}
      </p>
    </form>
  );
}
