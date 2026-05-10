/**
 * Safe in-app return paths only (blocks open redirects).
 */
export function safeReturnPath(raw: string | null): string | null {
  if (!raw) return null;
  const v = raw.trim();
  if (!v.startsWith("/") || v.startsWith("//")) return null;
  if (v.includes("\\")) return null;
  return v;
}

/**
 * Where to send the user after login: explicit `next` query, else same-origin
 * referrer (when available), else home.
 */
export function postLoginDestination(
  searchParams: { get(name: string): string | null },
): string {
  const next = safeReturnPath(searchParams.get("next"));
  if (next) return next;

  if (typeof window !== "undefined" && document.referrer) {
    try {
      const u = new URL(document.referrer);
      if (u.origin === window.location.origin) {
        const path = `${u.pathname}${u.search}${u.hash}`;
        if (path !== "/login" && !path.startsWith("/login?")) {
          return path;
        }
      }
    } catch {
      /* ignore */
    }
  }

  return "/";
}
