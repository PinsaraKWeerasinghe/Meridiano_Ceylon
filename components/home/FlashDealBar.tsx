"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

/** Sri Lanka — flash ends end of day 11 May 2026 */
const DEAL_END_MS = Date.parse("2026-05-11T23:59:59+05:30");
/** Window start for availability bar (portion of sale elapsed) */
const DEAL_WINDOW_START_MS = Date.parse("2026-05-10T00:00:00+05:30");

function pad2(n: number) {
  return n.toString().padStart(2, "0");
}

function formatRemaining(ms: number) {
  const totalSec = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  return `${pad2(h)}:${pad2(m)}:${pad2(s)}`;
}

function availabilityPercentRemaining(now: number): number {
  if (now <= DEAL_WINDOW_START_MS) return 100;
  if (now >= DEAL_END_MS) return 0;
  const windowMs = DEAL_END_MS - DEAL_WINDOW_START_MS;
  const leftMs = DEAL_END_MS - now;
  return Math.min(100, Math.max(0, (leftMs / windowMs) * 100));
}

export function FlashDealBar() {
  const [now, setNow] = useState<number | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (dismissed) return;
    setNow(Date.now());
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [dismissed]);

  if (dismissed) {
    return null;
  }

  if (now !== null && now > DEAL_END_MS) {
    return null;
  }

  const remainingMs =
    now === null ? 0 : Math.max(0, DEAL_END_MS - now);

  if (now !== null && remainingMs <= 0) {
    return null;
  }

  const timerDisplay =
    now === null ? "—:—:—" : formatRemaining(remainingMs);
  const pctLeft =
    now === null ? 100 : availabilityPercentRemaining(now);

  return (
    <section
      role="region"
      aria-label="Limited-time flash deal"
      className="fixed right-[max(0.75rem,env(safe-area-inset-right))] top-[calc(var(--maintenance-strip-h,0px)+var(--navbar-h)+0.75rem)] z-40 w-[min(calc(100vw-1.5rem),20rem)] rounded-xl border-2 border-amber-400/90 bg-neutral-950 p-3 text-white shadow-[0_8px_32px_rgba(0,0,0,0.45)] sm:p-4"
    >
      <div className="flex flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-amber-300">
            Flash deal
          </span>
          <button
            type="button"
            onClick={() => setDismissed(true)}
            className="-mr-1 -mt-1 shrink-0 rounded-md p-1 text-neutral-400 transition hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/80"
            aria-label="Close flash deal"
          >
            <X className="h-4 w-4" aria-hidden strokeWidth={2} />
          </button>
        </div>
        <p className="text-xs font-semibold leading-snug text-white">
          Exclusive Sri Lanka packages — limited slots
        </p>

        <time
          dateTime="2026-05-11"
          className="text-[11px] font-medium text-neutral-400"
        >
          Deal date:{" "}
          <span className="text-amber-200">11th May 2026</span>
        </time>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-500">
            Ends in
          </span>
          <span className="tabular-nums text-base font-bold tracking-wide text-amber-300 sm:text-lg">
            {timerDisplay}
          </span>
        </div>

        <div>
          <div className="flex items-center justify-between gap-2 text-[10px] font-medium uppercase tracking-wide text-neutral-500">
            <span>Availability</span>
            <span className="tabular-nums text-neutral-200">
              {Math.round(pctLeft)}% remaining
            </span>
          </div>
          <div
            className="mt-1.5 h-2 overflow-hidden rounded-full bg-neutral-800"
            role="progressbar"
            aria-valuenow={Math.round(pctLeft)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Deal availability remaining"
          >
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-300 transition-[width] duration-500 ease-out"
              style={{ width: `${pctLeft}%` }}
            />
          </div>
        </div>

        <Link
          href="/packages/book"
          className="mt-1 block w-full rounded-full bg-amber-400 py-2 text-center text-xs font-bold text-neutral-950 transition hover:bg-amber-300"
        >
          Book now
        </Link>
      </div>
    </section>
  );
}
