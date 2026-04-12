"use client";

import { useEffect } from "react";
import { initFirebaseAnalytics, isFirebaseConfigured } from "@/lib/firebase";

/**
 * Loads Firebase Analytics in the browser when env is set.
 * Safe no-op when Firebase is not configured (e.g. local dev without .env).
 */
export function FirebaseAnalytics() {
  useEffect(() => {
    if (!isFirebaseConfigured()) return;
    void initFirebaseAnalytics();
  }, []);

  return null;
}
