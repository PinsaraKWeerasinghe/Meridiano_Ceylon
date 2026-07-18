/**
 * Persists the homepage flash-deal banner dismissal, keyed per campaign so a
 * new/different featured deal re-shows automatically. Backed by `localStorage`.
 *
 * Persistence is consent-gated: callers must only write after the user has
 * accepted cookies (see `lib/cookie-consent.ts`).
 */

const FLASH_DEAL_DISMISS_KEY_PREFIX = "mc_flash_dismissed:";

export function flashDealDismissKey(dealDocId: string): string {
  return `${FLASH_DEAL_DISMISS_KEY_PREFIX}${dealDocId}`;
}

/** True when this specific deal was previously dismissed. Safe on the server. */
export function readFlashDealDismissed(dealDocId: string): boolean {
  if (typeof window === "undefined" || !dealDocId) return false;
  try {
    return window.localStorage.getItem(flashDealDismissKey(dealDocId)) === "1";
  } catch {
    return false;
  }
}

/** Remember that this deal was dismissed. Caller must check consent first. */
export function writeFlashDealDismissed(dealDocId: string): void {
  if (typeof window === "undefined" || !dealDocId) return;
  try {
    window.localStorage.setItem(flashDealDismissKey(dealDocId), "1");
  } catch {
    // Storage unavailable — dismissal stays in-memory for this view only.
  }
}
