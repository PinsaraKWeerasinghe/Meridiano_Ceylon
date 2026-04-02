"use client";

import { useLayoutEffect, useRef } from "react";
import {
  getMaintenanceBookingsEmail,
  getMaintenanceInfoEmail,
} from "@/lib/maintenance";

const STRIP_VAR = "--maintenance-strip-h";

const INFO_EMAIL = getMaintenanceInfoEmail();
const BOOKINGS_EMAIL = getMaintenanceBookingsEmail();

export function MaintenanceBanner() {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const sync = () => {
      const h = el.getBoundingClientRect().height;
      document.documentElement.style.setProperty(STRIP_VAR, `${h}px`);
    };

    sync();
    requestAnimationFrame(sync);
    const fontsReady =
      typeof document.fonts?.ready !== "undefined"
        ? document.fonts.ready.then(() => requestAnimationFrame(sync))
        : Promise.resolve();

    void fontsReady;

    const ro = new ResizeObserver(() => requestAnimationFrame(sync));
    ro.observe(el, { box: "border-box" });
    window.addEventListener("resize", sync);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", sync);
      document.documentElement.style.removeProperty(STRIP_VAR);
    };
  }, []);

  return (
    <div
      ref={ref}
      role="status"
      className="fixed left-0 right-0 top-0 z-40 border-b border-red-900/40 bg-red-700 px-3 pb-2 pt-[max(0.5rem,env(safe-area-inset-top))] text-center text-[11px] leading-snug text-black sm:px-5 sm:text-xs"
    >
      <p className="mx-auto max-w-4xl font-normal sm:font-medium">
        This digital platform is under maintenance. If you face any issue, please
        contact through{" "}
        <a
          href={`mailto:${INFO_EMAIL}`}
          className="font-medium underline decoration-black/55 underline-offset-2 hover:decoration-black sm:font-semibold"
        >
          {INFO_EMAIL}
        </a>{" "}
        for information and{" "}
        <a
          href={`mailto:${BOOKINGS_EMAIL}`}
          className="font-medium underline decoration-black/55 underline-offset-2 hover:decoration-black sm:font-semibold"
        >
          {BOOKINGS_EMAIL}
        </a>{" "}
        for bookings. Our agents will reply back soon. Apologies for the
        inconvenience.
      </p>
    </div>
  );
}

/** Reserves space under the fixed banner; height follows measured `--maintenance-strip-h`. */
export function MaintenanceBannerSpacer() {
  return (
    <div
      className="shrink-0 w-full"
      style={{ height: "var(--maintenance-strip-h, 4.75rem)" }}
      aria-hidden
    />
  );
}
