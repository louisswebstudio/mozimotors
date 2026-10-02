import { NextResponse } from "next/server";

/**
 * Receives form submissions from the site and forwards them to WordPress
 * (mozimotors-core plugin → POST /wp-json/mozi/v1/leads), which stores them as
 * "Demandes" in the admin and emails the team.
 */
const ALLOWED = new Set(["reservation", "estimation", "financement", "contact", "essai"]);

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

  // Keep only short string/number values.
  const clean = Object.fromEntries(
    Object.entries(body)
      .filter(([k, v]) => k !== "website" && (typeof v === "string" || typeof v === "number"))
      .map(([k, v]) => [k.slice(0, 40), String(v).slice(0, 2000)]),
  );

  const wp = process.env.WP_API_URL?.replace(/\/$/, "");
  if (!wp) {
    console.info("[leads] WP_API_URL not set — lead received (dev only):", clean);
    return NextResponse.json({ ok: true, dev: true });
  }

  try {
    const res = await fetch(`${wp}/wp-json/mozi/v1/leads`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Mozi-Secret": process.env.WP_SHARED_SECRET ?? "",
      },
      body: JSON.stringify(clean),
      cache: "no-store",
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[leads] forward to WP failed:", err);
    return NextResponse.json({ error: "upstream" }, { status: 502 });
  }
}
