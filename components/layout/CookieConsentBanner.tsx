"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  readCookieConsentAccepted,
  writeCookieConsentAccepted,
} from "@/lib/cookie-consent";

/**
 * Brand-styled cookie/consent banner. Renders only until the user accepts.
 * On accept it persists consent and notifies listeners (analytics, flash-deal
 * dismissal) via the shared consent event — no reload needed.
 */
export function CookieConsentBanner() {
  const [hydrated, setHydrated] = useState(false);
  const [needsConsent, setNeedsConsent] = useState(false);

  useEffect(() => {
    setHydrated(true);
    setNeedsConsent(!readCookieConsentAccepted());
  }, []);

  if (!hydrated || !needsConsent) {
    return null;
  }

  const accept = () => {
    writeCookieConsentAccepted();
    setNeedsConsent(false);
  };

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent"
      className="fixed bottom-4 left-4 right-4 z-[60] mx-auto max-w-[calc(100vw-2rem)] rounded-2xl border border-goldMint/20 bg-[#123630]/95 p-5 text-cream shadow-[0_8px_32px_rgba(0,0,0,0.35)] backdrop-blur-md pb-[calc(1.25rem+env(safe-area-inset-bottom))] sm:bottom-6 sm:max-w-2xl"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        <p className="text-xs leading-relaxed text-cream/90 sm:text-sm">
          We use cookies and local storage to remember your choices and improve
          your experience.{" "}
          <Link
            href="/legal/privacy"
            className="font-semibold text-goldMint underline underline-offset-2 hover:text-cream transition-colors"
          >
            Privacy Policy
          </Link>
          .
        </p>
        <div className="flex shrink-0 justify-end">
          <button
            type="button"
            onClick={accept}
            className="rounded-full bg-gold px-6 py-2 text-xs font-bold text-cream shadow-md transition-all duration-200 hover:bg-[#1d5349] hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold/40 sm:text-sm"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
