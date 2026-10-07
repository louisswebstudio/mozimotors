import { NextResponse } from "next/server";
import { getLeadEmail } from "@/lib/cms";
import { sanityConfigured, sanityCreate } from "@/lib/sanity";

/**
 * Receives form submissions from the site. Each one is saved as a « Demande » in Sanity (Studio › Demandes)
 * and emailed to the team through Resend. The request succeeds if either channel worked, so a lead is only
 * lost when both are down.
 */
const ALLOWED = new Set(["reservation", "estimation", "financement", "contact", "essai"]);

const TYPE_LABELS: Record<string, string> = {
  reservation: "Réservation",
  estimation: "Estimation",
  financement: "Financement",
  contact: "Contact",
  essai: "Essai",
};

/** Readable labels for the extra form fields (unknown keys are shown as is). */
const FIELD_LABELS: Record<string, string> = {
  name: "Nom",
  phone: "Téléphone",
  email: "Email",
  car: "Voiture",
  message: "Message",
  city: "Ville",
  brand: "Marque",
  model: "Modèle",
  year: "Année",
  version: "Version",
  fuel: "Carburant",
  gearbox: "Boîte",
  mileage: "Kilométrage",
  condition: "État",
  plate: "Immatriculation",
  owner_carte_grise: "Carte grise à son nom",
  documents: "Documents",
  inspection: "Inspection",
  carSlug: "Réf. voiture",
  lang: "Langue",
  date: "Date",
  slot: "Créneau",
};

/** Fields stored in their own Studio field rather than in « Autres informations ». */
const MAIN_FIELDS = new Set(["type", "name", "phone", "email", "car", "message"]);

/** Best-effort per-IP throttle (in-memory: per server instance, enough to blunt form spam). */
const hits = new Map<string, number[]>();
function throttled(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 60_000);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) for (const [k, v] of hits) if (now - v[v.length - 1] > 60_000) hits.delete(k);
  return recent.length > 6;
}

type Lead = Record<string, string>;

async function saveToSanity(lead: Lead): Promise<string> {
  const details = Object.entries(lead)
    .filter(([k]) => !MAIN_FIELDS.has(k))
    .map(([k, v]) => ({ _key: crypto.randomUUID().slice(0, 12), _type: "detail", label: FIELD_LABELS[k] ?? k, value: v }));
  return sanityCreate({
    _type: "lead",
    status: "nouveau",
    type: lead.type,
    name: lead.name,
    phone: lead.phone,
    email: lead.email || undefined,
    car: lead.car || undefined,
    message: lead.message || undefined,
    details,
    receivedAt: new Date().toISOString(),
  });
}

async function sendEmail(lead: Lead, leadId: string | undefined) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.LEAD_EMAIL_FROM;
  const to = (await getLeadEmail().catch(() => undefined)) || process.env.LEAD_EMAIL_TO;
  if (!apiKey || !from || !to) throw new Error("email not configured (RESEND_API_KEY, LEAD_EMAIL_FROM, lead email)");

  const title = `${TYPE_LABELS[lead.type] ?? "Demande"} — ${lead.name} (${lead.phone})`;
  const lines = Object.entries(lead)
    .filter(([k]) => k !== "type")
    .map(([k, v]) => `${FIELD_LABELS[k] ?? k} : ${v}`);
  const studio = process.env.SANITY_STUDIO_URL?.replace(/\/$/, "");
  if (studio && leadId) lines.push("", `Ouvrir dans le Studio : ${studio}/intent/edit/id=${leadId};type=lead`);

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      from,
      to: to.split(",").map((s) => s.trim()),
      subject: `[MoziMotors] ${title}`,
      text: lines.join("\n"),
      ...(lead.email ? { reply_to: lead.email } : {}),
    }),
    cache: "no-store",
    signal: AbortSignal.timeout(10_000),
  });
  if (!res.ok) throw new Error(`Resend ${res.status}: ${(await res.text()).slice(0, 300)}`);
}

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
  if (throttled(ip)) return NextResponse.json({ error: "rate_limited" }, { status: 429 });

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  // Honeypot: bots fill hidden fields. Pretend success.
  if (body.website) return NextResponse.json({ ok: true });

  const type = String(body.type ?? "");
  const name = String(body.name ?? "").trim();
  const phone = String(body.phone ?? "").trim();
  if (!ALLOWED.has(type) || !name || !/^[+\d\s().-]{8,20}$/.test(phone)) {
    return NextResponse.json({ error: "validation" }, { status: 422 });
  }

  // Keep only short string/number values, at most 30 fields.
  const lead: Lead = Object.fromEntries(
    Object.entries(body)
      .filter(([k, v]) => k !== "website" && (typeof v === "string" || typeof v === "number") && String(v).trim() !== "")
      .slice(0, 30)
      .map(([k, v]) => [k.slice(0, 40), String(v).trim().slice(0, 2000)]),
  );
  lead.name = name;
  lead.phone = phone;

  const emailConfigured = Boolean(process.env.RESEND_API_KEY);
  if (!sanityConfigured && !emailConfigured) {
    console.info("[leads] Sanity and email not configured — lead received (dev only):", lead);
    return NextResponse.json({ ok: true, dev: true });
  }

  let leadId: string | undefined;
  let saved = false;
  if (sanityConfigured) {
    try {
      leadId = await saveToSanity(lead);
      saved = true;
    } catch (err) {
      console.error("[leads] saving to Sanity failed:", err);
    }
  }

  let emailed = false;
  if (emailConfigured) {
    try {
      await sendEmail(lead, leadId);
      emailed = true;
    } catch (err) {
      console.error("[leads] email failed:", err);
    }
  }

  if (!saved && !emailed) return NextResponse.json({ error: "upstream" }, { status: 502 });
  return NextResponse.json({ ok: true });
}
