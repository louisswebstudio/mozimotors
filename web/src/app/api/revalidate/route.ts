import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

/**
 * Called by a Sanity webhook whenever a car, brand, model, testimonial, setting or site text is published,
 * so the site updates instantly instead of waiting for the periodic revalidation (CMS_REVALIDATE).
 * Body: { tags: string[] } (webhook projection, see README)  Header: X-Mozi-Secret = REVALIDATE_SECRET
 */
export async function POST(req: Request) {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret || req.headers.get("x-mozi-secret") !== secret) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const { tags = [] } = (await req.json().catch(() => ({}))) as { tags?: string[] };
  const valid = (Array.isArray(tags) ? tags : []).filter((t) => typeof t === "string" && /^[a-z0-9-]{1,120}$/.test(t));
  for (const t of valid) revalidateTag(t, { expire: 0 });
  revalidatePath("/", "layout");
  return NextResponse.json({ revalidated: valid });
}
