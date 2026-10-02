import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

/**
 * Called by WordPress (mozimotors-core) whenever a car, testimonial or setting is saved,
 * so the site updates instantly instead of waiting for the periodic revalidation.
 * Body: { tags: string[] }  Header: X-Mozi-Secret
 */
export async function POST(req: Request) {
  const secret = process.env.WP_SHARED_SECRET;
  if (!secret || req.headers.get("x-mozi-secret") !== secret) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const { tags = [] } = (await req.json().catch(() => ({}))) as { tags?: string[] };
  const valid = tags.filter((t) => typeof t === "string" && /^[a-z0-9-]{1,120}$/.test(t));
  for (const t of valid) revalidateTag(t, { expire: 0 });
  revalidatePath("/", "layout");
  return NextResponse.json({ revalidated: valid });
}
