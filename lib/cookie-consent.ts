/**
 * Cookie / client-storage consent.
 *
 * Consent-first model: nothing non-essential is stored or loaded until the user
 * accepts. Backed by `localStorage` (SSR-safe; no server parsing needed). When
 * consent is granted we dispatch a DOM event so already-mounted listeners
 * (e.g. analytics) can react without a reload.
 */

export const COOKIE_CONSENT_STORAGE_KEY = "mc_cookie_consent_v1";
export const COOKIE_CONSENT_ACCEPTED_VALUE = "accepted";
export const COOKIE_CONSENT_EVENT = "mc-cookie-consent";

/** True only when the user has explicitly accepted. Safe on the server. */
export function readCookieConsentAccepted(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return (
      window.localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY) ===
      COOKIE_CONSENT_ACCEPTED_VALUE
    );
  } catch {
    return false;
  }
}

/** Persist acceptance and notify listeners in the current tab. */
export function writeCookieConsentAccepted(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      COOKIE_CONSENT_STORAGE_KEY,
      COOKIE_CONSENT_ACCEPTED_VALUE,
    );
  } catch {
    // Storage unavailable (private mode / blocked) — still notify listeners.
  }
  try {
    document.dispatchEvent(new Event(COOKIE_CONSENT_EVENT));
  } catch {
    // No-op if events are unavailable.
  }
}
