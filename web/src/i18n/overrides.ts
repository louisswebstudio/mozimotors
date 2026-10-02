/**
 * Text overrides edited in WordPress › Textes du site. They are a flat map of dictionary paths
 * (`hero.title`, `faq.items.0.q`) to replacement strings and are applied over the built-in
 * dictionary. Only paths that already hold a string are touched, so a stale key (renamed in code)
 * is ignored and can never break the page structure.
 */
export function applyOverrides<T>(dict: T, overrides: Record<string, string>): T {
  const entries = Object.entries(overrides).filter(([, v]) => typeof v === "string" && v.trim() !== "");
  if (!entries.length) return dict;
  const root = structuredClone(dict) as Record<string, unknown>;
  for (const [path, value] of entries) {
    const parts = path.split(".");
    const last = parts.pop()!;
    let node: unknown = root;
    for (const p of parts) {
      if (node == null || typeof node !== "object") { node = null; break; }
      node = (node as Record<string, unknown>)[p];
    }
    if (node != null && typeof node === "object" && typeof (node as Record<string, unknown>)[last] === "string") {
      (node as Record<string, unknown>)[last] = value;
    }
  }
  return root as T;
}
