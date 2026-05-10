"use client";

import Link from "next/link";
import { type ReactNode, useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { formatDealDateLabel } from "@/lib/flash-deal-colombo";
import {
  subscribeFlashDealDetailPage,
  type FlashDealDetailContent,
} from "@/lib/flash-deal-settings";
import { isFirebaseConfigured } from "@/lib/firebase";
import { packagesGreenCard } from "@/lib/packages-section-theme";
import { cn } from "@/lib/utils";

/** Shared typography for every detail value on this page */
const detailValueClass =
  "text-sm leading-relaxed text-stone-700 whitespace-pre-line";

/** Renders as `$… pp` when value looks like a simple amount; otherwise shows stored text. */
function formatPricePpDisplay(raw: string): string {
  const s = raw.trim();
  if (!s) return "—";
  const core = s
    .replace(/^\$/u, "")
    .trim()
    .replace(/\bpp\b\s*$/iu, "")
    .trim();
  if (!core) return "—";
  const simplePrice = /^[\d,]+(?:\.\d{1,2})?$/.test(core);
  if (simplePrice) return `$${core} pp`;
  return s;
}

function DetailSection({
  heading,
  children,
}: {
  heading: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-2">
      <h2 className="font-serif text-lg font-semibold text-forest">
        {heading}
      </h2>
      <div className={detailValueClass}>{children}</div>
    </section>
  );
}

export function FlashDealDetailPageClient() {
  const [detail, setDetail] = useState<FlashDealDetailContent | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!isFirebaseConfigured()) {
      setReady(true);
      setDetail(null);
      return;
    }

    const unsub = subscribeFlashDealDetailPage((d) => {
      setDetail(d);
      setReady(true);
    });
    return unsub;
  }, []);

  if (!isFirebaseConfigured()) {
    return (
      <Card className={cn("p-8", packagesGreenCard)}>
        <p className="text-sm text-stone-700">
          Flash deals are not available — Firebase is not configured for this
          environment.
        </p>
        <Link
          href="/"
          className="mt-4 inline-block text-sm font-semibold text-lagoon underline-offset-4 hover:underline"
        >
          Back to home
        </Link>
      </Card>
    );
  }

  if (!ready) {
    return (
      <p className="text-sm text-stone-600" aria-live="polite">
        Loading…
      </p>
    );
  }

  if (!detail) {
    return (
      <Card className={cn("p-8", packagesGreenCard)}>
        <p className="text-sm font-semibold text-forest">Offer unavailable</p>
        <p className="mt-2 text-sm text-stone-600">
          This flash deal is disabled or has not been published yet.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block text-sm font-semibold text-lagoon underline-offset-4 hover:underline"
        >
          Back to home
        </Link>
      </Card>
    );
  }

  const dateLabel = formatDealDateLabel(detail.dealDate);

  return (
    <div className="space-y-10">
      <header className="space-y-3">
        <h1 className="font-serif text-3xl font-semibold text-forest sm:text-4xl">
          {detail.title}
        </h1>
        <p className="text-sm text-stone-600">
          <span className="font-semibold text-forest">Deal date:</span>{" "}
          <time dateTime={detail.dealDate}>{dateLabel}</time>
        </p>
      </header>

      <Card className={cn("space-y-8 p-6 sm:p-8", packagesGreenCard)}>
        {detail.description.trim() ? (
          <div className={detailValueClass}>{detail.description}</div>
        ) : null}

        <DetailSection heading="Fixed tour dates">
          {detail.fixedTourStartDate && detail.fixedTourEndDate ? (
            <p>
              <time dateTime={detail.fixedTourStartDate}>
                {formatDealDateLabel(detail.fixedTourStartDate)}
              </time>
              <span aria-hidden className="mx-1.5 text-stone-400">
                —
              </span>
              <time dateTime={detail.fixedTourEndDate}>
                {formatDealDateLabel(detail.fixedTourEndDate)}
              </time>
            </p>
          ) : (
            <p>Tour dates will be published soon.</p>
          )}
        </DetailSection>

        <dl className="grid gap-6 sm:grid-cols-2">
          <div>
            <dt className="font-serif text-base font-semibold text-forest">
              Per person charge
            </dt>
            <dd className={cn("mt-2", detailValueClass)}>
              {formatPricePpDisplay(detail.perPersonCharge)}
            </dd>
          </div>
          <div>
            <dt className="font-serif text-base font-semibold text-forest">
              Group size
            </dt>
            <dd className={cn("mt-2", detailValueClass)}>
              {detail.groupSize}
            </dd>
          </div>
          <div>
            <dt className="font-serif text-base font-semibold text-forest">
              Hotel level
            </dt>
            <dd className={cn("mt-2", detailValueClass)}>
              {detail.hotelLevel}
            </dd>
          </div>
          <div>
            <dt className="font-serif text-base font-semibold text-forest">
              Transport
            </dt>
            <dd className={cn("mt-2", detailValueClass)}>
              {detail.transport}
            </dd>
          </div>
        </dl>

        <section className="space-y-4 border-t border-lagoon/20 pt-8">
          <h2 className="font-serif text-lg font-semibold text-forest">
            Itinerary snaps
          </h2>
          <ul className="grid gap-4 sm:grid-cols-2">
            {detail.itinerarySnaps.map((snap, index) => (
              <li
                key={`${snap.title}-${index}`}
                className="rounded-xl border border-lagoon/25 bg-white/60 p-4 shadow-sm"
              >
                <p className={cn("font-semibold text-forest", detailValueClass)}>
                  {snap.title}
                </p>
                <p className={cn("mt-2", detailValueClass)}>{snap.description}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="space-y-2 border-t border-lagoon/20 pt-8">
          <h2 className="font-serif text-lg font-semibold text-forest">
            Registration price
          </h2>
          <p className={detailValueClass}>
            {formatPricePpDisplay(detail.registrationPrice)}
          </p>
        </section>
      </Card>

      <Link
        href="/packages/book"
        className="inline-flex min-w-[180px] items-center justify-center rounded-full bg-gold px-8 py-3 text-sm font-semibold text-cream transition hover:bg-[#1d5349]"
      >
        Book now
      </Link>
    </div>
  );
}
