"use client";

import { useEffect } from "react";
import { initFirebaseAnalytics, isFirebaseConfigured } from "@/lib/firebase";
import {
  COOKIE_CONSENT_EVENT,
  readCookieConsentAccepted,
} from "@/lib/cookie-consent";

/**
 * Loads Firebase Analytics in the browser only after the user accepts cookies.
 * Safe no-op when Firebase is not configured (e.g. local dev without .env).
 */
export function FirebaseAnalytics() {
  useEffect(() => {
    if (!isFirebaseConfigured()) return;

    if (readCookieConsentAccepted()) {
      void initFirebaseAnalytics();
      return;
    }

    const onConsent = () => {
      if (readCookieConsentAccepted()) {
        void initFirebaseAnalytics();
        document.removeEventListener(COOKIE_CONSENT_EVENT, onConsent);
      }
    };

    document.addEventListener(COOKIE_CONSENT_EVENT, onConsent);
    return () => document.removeEventListener(COOKIE_CONSENT_EVENT, onConsent);
  }, []);

  return null;
}
