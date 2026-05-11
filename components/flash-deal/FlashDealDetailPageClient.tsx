"use client";

import Link from "next/link";
import { type ReactNode, useEffect, useState } from "react";
import { useAuthUser } from "@/components/auth/useAuthUser";
import { Card } from "@/components/ui/Card";
import { formatDealDateLabel } from "@/lib/flash-deal-colombo";
import {
  FLASH_DEAL_BOOKING_PACKAGE_SLUG,
  FLASH_DEAL_DETAIL_PATH,
  subscribeFlashDealPublic,
  type FlashDealDetailContent,
  type FlashDealPublicResolved,
} from "@/lib/flash-deal-settings";
import { saveUserFlashDealConfirmation } from "@/lib/flash-deal-user-confirmation";
import { isFirebaseConfigured } from "@/lib/firebase";
import { packagesGreenCard } from "@/lib/packages-section-theme";
import { ensureUserTravelerDefaults, fetchUserProfile } from "@/lib/user-profile";
import { cn } from "@/lib/utils";

/** Shared typography for every detail value on this page */
const detailValueClass =
  "text-sm leading-relaxed text-stone-700 whitespace-pre-line";

/** Renders as `$… pp` when value looks like a simple amount; otherwise shows stored text. */
function formatPricePpDisplay(raw: string): string {
  const s = raw.trim();
  if (!s) return "—";
  const core = s
    .replace(/^\$/, "")
    .trim()
    .replace(/\bpp\b\s*$/i, "")
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
  const { user, ready: authReady } = useAuthUser();
  const [resolved, setResolved] = useState<FlashDealPublicResolved | null>(null);
  const [ready, setReady] = useState(false);
  const [booking, setBooking] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [bookingOk, setBookingOk] = useState(false);

  const detail: FlashDealDetailContent | null = resolved?.detail ?? null;
  const dealDocId = resolved?.dealDocId ?? null;

  useEffect(() => {
    if (!isFirebaseConfigured()) {
      setReady(true);
      setResolved(null);
      return;
    }

    const unsub = subscribeFlashDealPublic((v) => {
      setResolved(v);
      setReady(true);
    });
    return unsub;
  }, []);

  async function handleBookNow() {
    if (!user?.uid || !dealDocId || !detail) return;
    setBookingError(null);
    setBookingOk(false);
    setBooking(true);
    try {
      await ensureUserTravelerDefaults(user.uid, user.email ?? null);
      const profile = await fetchUserProfile(user.uid);
      if (!profile) {
        throw new Error("Could not load your profile.");
      }
      const primaryName = `${profile.firstName} ${profile.lastName}`.trim();
      if (!primaryName) {
        throw new Error(
          "Add your first and last name on your profile before booking.",
        );
      }
      if (!profile.passportId.trim()) {
        throw new Error("Add your passport ID on your profile before booking.");
      }
      if (!profile.phone.trim()) {
        throw new Error(
          "Add your phone number (with country code) on your profile before booking.",
        );
      }
      if (profile.gender !== "male" && profile.gender !== "female") {
        throw new Error("Select your gender on your profile before booking.");
      }

      await saveUserFlashDealConfirmation(user.uid, {
        flashDealDocId: dealDocId,
        packageSlug: FLASH_DEAL_BOOKING_PACKAGE_SLUG,
        packageTitle: detail.title,
        primaryName,
        primaryPassport: profile.passportId.trim(),
        primaryGender: profile.gender,
        partners: [],
        phone: profile.phone.trim(),
        addonTitles: [],
        notes: "",
        estimatedBillLines: [],
        submitterEmail: user.email ?? null,
      });
      setBookingOk(true);
    } catch (err) {
      setBookingError(
        err instanceof Error ? err.message : "Could not complete booking.",
      );
    } finally {
      setBooking(false);
    }
  }

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
  const loginHref = `/login?next=${encodeURIComponent(FLASH_DEAL_DETAIL_PATH)}`;

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

      <div className="space-y-4">
        {!authReady ? (
          <p className="text-sm text-stone-600">Checking sign-in…</p>
        ) : !user ? (
          <div className="space-y-3">
            <p className="text-sm text-stone-600">
              Sign in to book this flash deal using your saved profile details.
            </p>
            <Link
              href={loginHref}
              className="inline-flex min-w-[180px] items-center justify-center rounded-full bg-gold px-8 py-3 text-sm font-semibold text-cream transition hover:bg-[#1d5349]"
            >
              Sign in to book
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-xs text-stone-600">
              Book now saves your profile details to this flash deal under{" "}
              <code className="rounded bg-stone-100 px-1 text-[11px]">
                users/&#123;your uid&#125;/flashDeals/&#123;
                {dealDocId?.slice(0, 12) ?? "…"}
                …&#125;
              </code>
              . Complete{" "}
              <Link
                href="/profile"
                className="font-semibold text-lagoon underline-offset-2 hover:underline"
              >
                your profile
              </Link>{" "}
              (name, passport, phone, gender) first.
            </p>
            <button
              type="button"
              disabled={booking || !dealDocId}
              onClick={() => void handleBookNow()}
              className="inline-flex min-w-[180px] items-center justify-center rounded-full bg-gold px-8 py-3 text-sm font-semibold text-cream transition hover:bg-[#1d5349] disabled:opacity-50"
            >
              {booking ? "Saving…" : "Book now"}
            </button>
            {bookingOk ? (
              <p
                className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-900"
                role="status"
              >
                You&apos;re on the list — your booking details were saved from
                your profile.
              </p>
            ) : null}
            {bookingError ? (
              <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800">
                {bookingError}
              </p>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
