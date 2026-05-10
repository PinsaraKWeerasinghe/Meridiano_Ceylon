"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { formatDealDateLabel, formatDealDateShort } from "@/lib/flash-deal-colombo";
import {
  FLASH_DEAL_DETAIL_PATH,
  subscribeFlashDealSettingsForBar,
  type FlashDealBarConfig,
} from "@/lib/flash-deal-settings";
import { isFirebaseConfigured } from "@/lib/firebase";

function pad2(n: number) {
  return n.toString().padStart(2, "0");
}

function formatRemaining(ms: number) {
  const totalSec = Math.max(0, Math.floor(ms / 1000));
  const days = Math.floor(totalSec / 86400);
  const restAfterDays = totalSec % 86400;
  const h = Math.floor(restAfterDays / 3600);
  const m = Math.floor((restAfterDays % 3600) / 60);
  const s = restAfterDays % 60;
  return `${days}:${pad2(h)}:${pad2(m)}:${pad2(s)}`;
}

function availabilityPercentRemaining(
  now: number,
  windowStartMs: number,
  dealEndMs: number,
): number {
  if (now <= windowStartMs) return 100;
  if (now >= dealEndMs) return 0;
  const windowMs = dealEndMs - windowStartMs;
  const leftMs = dealEndMs - now;
  return Math.min(100, Math.max(0, (leftMs / windowMs) * 100));
}

type FlashDealBarChromeProps = {
  config: FlashDealBarConfig;
  dismissed: boolean;
  onDismiss: () => void;
};

function FlashDealBarChrome({
  config,
  dismissed,
  onDismiss,
}: FlashDealBarChromeProps) {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    if (dismissed) return;
    setNow(Date.now());
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [dismissed]);

  if (dismissed) {
    return null;
  }

  const dealEndMs = config.dealEndMs;
  const windowStartMs = config.dealWindowStartMs;

  if (now !== null && now > dealEndMs) {
    return null;
  }

  const remainingMs =
    now === null ? 0 : Math.max(0, dealEndMs - now);

  if (now !== null && remainingMs <= 0) {
    return null;
  }

  const timerDisplay =
    now === null ? "—:—:—:—" : formatRemaining(remainingMs);
  const pctLeft =
    now === null ? 100 : availabilityPercentRemaining(now, windowStartMs, dealEndMs);

  const dateLabel = formatDealDateLabel(config.dealDate);
  const shortDateLabel = formatDealDateShort(config.dealDate);

  const topMobileBar =
    "top-[calc(var(--maintenance-strip-h,0px)+var(--navbar-h)+0.75rem)]";
  const topDesktopCard =
    "md:top-[calc(var(--maintenance-strip-h,0px)+var(--navbar-h)+1rem)]";

  return (
    <>
      <section
        role="region"
        aria-label="Limited-time flash deal"
        className={`fixed inset-x-0 z-40 border-b-2 border-amber-400/90 bg-neutral-950 py-1.5 pl-[max(0.5rem,env(safe-area-inset-left))] pr-[max(0.5rem,env(safe-area-inset-right))] text-white shadow-[0_6px_16px_rgba(0,0,0,0.28)] md:hidden ${topMobileBar}`}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-2 gap-y-0.5 text-[10px] leading-tight sm:text-[11px]">
            <span className="shrink-0 font-bold uppercase tracking-wider text-amber-300">
              Flash deal
            </span>
            <span className="text-neutral-500" aria-hidden>
              ·
            </span>
            <time
              dateTime={config.dealDate}
              className="shrink-0 text-neutral-400"
            >
              <span className="text-amber-200/95">{shortDateLabel}</span>
            </time>
            <span className="text-neutral-500" aria-hidden>
              ·
            </span>
            <span className="min-w-0 truncate font-medium text-neutral-300">
              {config.title}
            </span>
            <span className="text-neutral-500" aria-hidden>
              ·
            </span>
            <span className="tabular-nums font-semibold text-amber-300">
              {timerDisplay}
            </span>
            <span className="text-neutral-500" aria-hidden>
              ·
            </span>
            <span className="tabular-nums text-neutral-400">
              {Math.round(pctLeft)}% left
            </span>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <Link
              href={FLASH_DEAL_DETAIL_PATH}
              className="rounded-full bg-amber-400 px-2.5 py-1 text-[10px] font-bold text-neutral-950 transition hover:bg-amber-300"
            >
              Details
            </Link>
            <button
              type="button"
              onClick={onDismiss}
              className="rounded-md p-1 text-neutral-400 transition hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/80"
              aria-label="Close flash deal"
            >
              <X className="h-4 w-4" aria-hidden strokeWidth={2} />
            </button>
          </div>
        </div>
        <div
          className="mt-1.5 h-1 overflow-hidden rounded-full bg-neutral-800"
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
      </section>

      <section
        role="region"
        aria-label="Limited-time flash deal"
        className={`fixed z-40 hidden w-[min(calc(100vw-1.5rem),20rem)] rounded-xl border-2 border-amber-400/90 bg-neutral-950 p-3 text-white shadow-[0_8px_32px_rgba(0,0,0,0.45)] md:right-[max(0.75rem,env(safe-area-inset-right))] ${topDesktopCard} md:block md:p-4`}
      >
        <div className="flex flex-col gap-2">
          <div className="flex items-start justify-between gap-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-amber-300">
              Flash deal
            </span>
            <button
              type="button"
              onClick={onDismiss}
              className="-mr-1 -mt-1 shrink-0 rounded-md p-1 text-neutral-400 transition hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/80"
              aria-label="Close flash deal"
            >
              <X className="h-4 w-4" aria-hidden strokeWidth={2} />
            </button>
          </div>
          <p className="text-xs font-semibold leading-snug text-white">
            {config.title}
          </p>

          <time
            dateTime={config.dealDate}
            className="text-[11px] font-medium text-neutral-400"
          >
            Deal date:{" "}
            <span className="text-amber-200">{dateLabel}</span>
          </time>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-500">
              Ends in
            </span>
            <span className="tabular-nums text-base font-bold tracking-wide text-amber-300 md:text-lg">
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
            href={FLASH_DEAL_DETAIL_PATH}
            className="mt-1 block w-full rounded-full bg-amber-400 py-2 text-center text-xs font-bold text-neutral-950 transition hover:bg-amber-300"
          >
            Details
          </Link>
        </div>
      </section>
    </>
  );
}

export function FlashDealBar() {
  const [config, setConfig] = useState<FlashDealBarConfig | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (!isFirebaseConfigured()) {
      setHydrated(true);
      setConfig(null);
      return;
    }

    const unsub = subscribeFlashDealSettingsForBar((c) => {
      setConfig(c);
      setHydrated(true);
    });
    return unsub;
  }, []);

  if (!hydrated || !config) {
    return null;
  }

  return (
    <FlashDealBarChrome
      config={config}
      dismissed={dismissed}
      onDismiss={() => setDismissed(true)}
    />
  );
}
