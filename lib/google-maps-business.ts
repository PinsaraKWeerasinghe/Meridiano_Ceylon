/** Raw embed `src` from env; callers must validate with `isSafeGoogleMapsEmbedSrc` before injecting into iframe. */
export function googleMapsEmbedUrl(): string | null {
  const fromEnv = process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL?.trim();
  return fromEnv && fromEnv.length > 0 ? fromEnv : null;
}

export function isSafeGoogleMapsEmbedSrc(urlString: string): boolean {
  try {
    const u = new URL(urlString);
    if (u.protocol !== "https:") return false;
    if (u.hostname !== "www.google.com") return false;
    return u.pathname.startsWith("/maps/embed");
  } catch {
    return false;
  }
}

/** SociableKIT embed IDs are numeric (e.g. `25682277`). Strict regex blocks arbitrary iframe URLs from env. */
const SOCIABLEKIT_EMBED_ID_PATTERN = /^[0-9]{4,16}$/;

export function sociableKitGoogleReviewsEmbedId(): string | null {
  const raw =
    process.env.NEXT_PUBLIC_SOCIABLEKIT_GOOGLE_REVIEWS_EMBED_ID?.trim();
  return raw && SOCIABLEKIT_EMBED_ID_PATTERN.test(raw) ? raw : null;
}

export function sociableKitGoogleReviewsIframeSrc(embedId: string): string {
  return `https://widgets.sociablekit.com/google-reviews/iframe/${embedId}`;
}
