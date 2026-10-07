import "server-only";

/**
 * Minimal Sanity HTTP client (no SDK: plain fetch keeps Next's cache tags and a small Worker bundle).
 * The dataset is private — it holds the leads — so every request is authenticated with a server-side token.
 */
const PROJECT_ID = process.env.SANITY_PROJECT_ID;
const DATASET = process.env.SANITY_DATASET || "production";
const API_VERSION = "v2025-02-19";
const READ_TOKEN = process.env.SANITY_READ_TOKEN || process.env.SANITY_WRITE_TOKEN;
const REVALIDATE = Number(process.env.CMS_REVALIDATE ?? 300);
const TIMEOUT_MS = 8000;

export const sanityConfigured = Boolean(PROJECT_ID);

/** Runs a GROQ query on published documents only, cached by Next under `tags`. */
export async function sanityQuery<T>(query: string, params: Record<string, unknown>, tags: string[]): Promise<T> {
  const url = new URL(`https://${PROJECT_ID}.apicdn.sanity.io/${API_VERSION}/data/query/${DATASET}`);
  url.searchParams.set("query", query);
  url.searchParams.set("perspective", "published");
  for (const [k, v] of Object.entries(params)) url.searchParams.set(`$${k}`, JSON.stringify(v));
  const res = await fetch(url, {
    headers: { Accept: "application/json", ...(READ_TOKEN ? { Authorization: `Bearer ${READ_TOKEN}` } : {}) },
    next: { revalidate: REVALIDATE, tags },
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!res.ok) throw new Error(`Sanity ${res.status} ${res.statusText}: ${(await res.text()).slice(0, 300)}`);
  return ((await res.json()) as { result: T }).result;
}

/** Creates a document (used for leads). Needs SANITY_WRITE_TOKEN (Editor). */
export async function sanityCreate(doc: Record<string, unknown> & { _type: string }): Promise<string> {
  const token = process.env.SANITY_WRITE_TOKEN;
  if (!token) throw new Error("SANITY_WRITE_TOKEN is not set");
  const res = await fetch(`https://${PROJECT_ID}.api.sanity.io/${API_VERSION}/data/mutate/${DATASET}?returnIds=true&visibility=async`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ mutations: [{ create: doc }] }),
    cache: "no-store",
    signal: AbortSignal.timeout(10_000),
  });
  if (!res.ok) throw new Error(`Sanity ${res.status}: ${(await res.text()).slice(0, 300)}`);
  const out = (await res.json()) as { results?: { id: string }[] };
  return out.results?.[0]?.id ?? "";
}

/** Sanity image CDN URL, resized and served as WebP/AVIF where supported. */
export const sanityImage = (url: string | undefined, params: string) => (url ? `${url}?${params}&auto=format` : undefined);
