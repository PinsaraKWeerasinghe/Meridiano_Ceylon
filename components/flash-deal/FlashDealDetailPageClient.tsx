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

/** Plain USD (no `pp` suffix) — e.g. registration fee. */
function formatUsdAmountDisplay(raw: string): string {
  const s = raw.trim();
  if (!s) return "—";
  const core = s
    .replace(/^\$/, "")
    .trim()
    .replace(/\bpp\b\s*$/i, "")
    .trim();
  if (!core) return "—";
  const simplePrice = /^[\d,]+(?:\.\d{1,2})?$/.test(core);
  if (simplePrice) return `$${core}`;
  return s;
}

/** Empty CMS value on the public page */
function emptyCell(): string {
  return "—";
}

function displayDetailText(raw: string): string {
  const s = raw.trim();
  return s.length > 0 ? s : emptyCell();
}

/** `groupSize` in the data source: digit string = minimum bookings to proceed; else legacy copy. */
function displayMinSlotsToProceed(raw: string): string {
  const t = raw.trim();
  if (!t) return emptyCell();
  if (/^\d+$/.test(t)) return t;
  return displayDetailText(raw);
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
    if (
      !user?.uid ||
      !dealDocId ||
      !detail ||
      !detail.title.trim() ||
      !/^\d{4}-\d{2}-\d{2}$/.test(detail.dealDate)
    ) {
      return;
    }
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
        dealDate: detail.dealDate,
      });
      setBookingOk(true);
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Could not complete booking.";
      const code =
        err &&
        typeof err === "object" &&
        "code" in err &&
        typeof (err as { code?: unknown }).code === "string"
          ? (err as { code: string }).code
          : undefined;
      setBookingError(code ? `${msg} (${code})` : msg);
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
      <p className="sr-only" aria-live="polite">
        No flash deal is featured.
      </p>
    );
  }

  const bookingReady =
    Boolean(detail.title.trim()) &&
    /^\d{4}-\d{2}-\d{2}$/.test(detail.dealDate);

  const slotsLimited = detail.maxSlots >= 1;
  const spotsLeft = slotsLimited
    ? Math.max(0, detail.maxSlots - detail.slotsTaken)
    : null;
  const soldOut = slotsLimited && spotsLeft === 0;
  const bookingAllowed =
    bookingReady && slotsLimited && !soldOut;

  const dateLabel = detail.dealDate
    ? formatDealDateLabel(detail.dealDate)
    : emptyCell();
  const loginHref = `/login?next=${encodeURIComponent(FLASH_DEAL_DETAIL_PATH)}`;

  return (
    <div className="space-y-10">
      <header className="space-y-3">
        <h1 className="font-serif text-3xl font-semibold text-forest sm:text-4xl">
          {detail.title.trim() ? detail.title : emptyCell()}
        </h1>
        <p className="text-sm text-stone-600">
          <span className="font-semibold text-forest">Deal date:</span>{" "}
          {detail.dealDate ? (
            <time dateTime={detail.dealDate}>{dateLabel}</time>
          ) : (
            <span className="text-stone-500">{emptyCell()}</span>
          )}
        </p>
      </header>

      <Card className={cn("space-y-8 p-6 sm:p-8", packagesGreenCard)}>
        {detail.description.trim() ? (
          <div className={detailValueClass}>{detail.description}</div>
        ) : (
          <div className={cn(detailValueClass, "text-stone-400")}>
            {emptyCell()}
          </div>
        )}

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
            <p className="text-stone-400">{emptyCell()}</p>
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
              Minimum slots to proceed
            </dt>
            <dd className={cn("mt-2 tabular-nums", detailValueClass)}>
              {displayMinSlotsToProceed(detail.groupSize)}
            </dd>
          </div>
          <div>
            <dt className="font-serif text-base font-semibold text-forest">
              Hotel level
            </dt>
            <dd className={cn("mt-2", detailValueClass)}>
              {displayDetailText(detail.hotelLevel)}
            </dd>
          </div>
          <div>
            <dt className="font-serif text-base font-semibold text-forest">
              Transport
            </dt>
            <dd className={cn("mt-2", detailValueClass)}>
              {displayDetailText(detail.transport)}
            </dd>
          </div>
        </dl>

        <section className="space-y-4 border-t border-lagoon/20 pt-8">
          <h2 className="font-serif text-lg font-semibold text-forest">
            Itinerary snaps
          </h2>
          <ul className="grid gap-4 sm:grid-cols-2">
            {detail.itinerarySnaps.length === 0 ? (
              <li className={cn("text-stone-500 sm:col-span-2", detailValueClass)}>
                {emptyCell()}
              </li>
            ) : (
              detail.itinerarySnaps.map((snap, index) => (
                <li
                  key={`snap-${index}-${snap.title.slice(0, 24)}`}
                  className="rounded-xl border border-lagoon/25 bg-white/60 p-4 shadow-sm"
                >
                  <p className={cn("font-semibold text-forest", detailValueClass)}>
                    {displayDetailText(snap.title)}
                  </p>
                  <p className={cn("mt-2", detailValueClass)}>
                    {displayDetailText(snap.description)}
                  </p>
                </li>
              ))
            )}
          </ul>
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
            {bookingReady ? (
              <fieldset>
                <legend className="text-sm font-semibold text-forest">
                  Booking summary
                </legend>
                <p className="mt-1 text-xs text-stone-500">
                  Figures below come from this flash-deal campaign. Meridiano
                  confirms the final amount before payment.
                </p>
                <div className="mt-4 rounded-xl border border-stone-200 bg-stone-50/80 px-4 py-4 text-sm text-stone-800">
                  <div className="space-y-3">
                    <p className="text-xs font-medium text-stone-600">
                      Travellers in this booking:{" "}
                      <span className="tabular-nums text-forest">1</span>
                      <span className="text-stone-500">
                        {" "}
                        (lead traveller from your profile)
                      </span>
                    </p>

                    <div className="flex justify-between gap-4 border-b border-stone-200 pb-3">
                      <div className="min-w-0">
                        <p className="font-medium text-forest">{detail.title}</p>
                        <p className="mt-0.5 text-xs text-stone-500">
                          Flash deal
                        </p>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="text-xs text-stone-500">Deal date</p>
                        <p className="font-semibold tabular-nums text-forest">
                          <time dateTime={detail.dealDate}>{dateLabel}</time>
                        </p>
                      </div>
                    </div>

                    {spotsLeft !== null ? (
                      <div className="flex justify-between gap-4 border-b border-stone-200 pb-3">
                        <span className="text-stone-700">Spots remaining</span>
                        <span className="shrink-0 tabular-nums text-right font-semibold text-forest">
                          {soldOut ? (
                            <span className="text-amber-900">Sold out</span>
                          ) : (
                            <>
                              {spotsLeft} of {detail.maxSlots}
                            </>
                          )}
                        </span>
                      </div>
                    ) : null}

                    <div className="flex justify-between gap-4 border-b border-stone-200 pb-3">
                      <span className="text-stone-700">Tour window</span>
                      <span className="shrink-0 text-right text-stone-800">
                        {detail.fixedTourStartDate &&
                        detail.fixedTourEndDate ? (
                          <>
                            <time dateTime={detail.fixedTourStartDate}>
                              {formatDealDateLabel(detail.fixedTourStartDate)}
                            </time>
                            <span aria-hidden className="mx-1 text-stone-400">
                              —
                            </span>
                            <time dateTime={detail.fixedTourEndDate}>
                              {formatDealDateLabel(detail.fixedTourEndDate)}
                            </time>
                          </>
                        ) : (
                          emptyCell()
                        )}
                      </span>
                    </div>

                    <div className="flex justify-between gap-4 border-b border-stone-200 pb-3">
                      <span className="text-stone-700">Per person charge</span>
                      <span className="shrink-0 text-right font-medium text-forest">
                        {formatPricePpDisplay(detail.perPersonCharge)}
                      </span>
                    </div>

                    <div className="flex justify-between gap-4">
                      <span className="text-stone-700">Registration price</span>
                      <span className="shrink-0 text-right font-medium text-forest">
                        {formatUsdAmountDisplay(detail.registrationPrice)}
                      </span>
                    </div>
                  </div>
                </div>
              </fieldset>
            ) : null}
            {!bookingReady ? (
              <p className="text-xs text-amber-800">
                Booking opens once this campaign has a title and deal date in
                admin.
              </p>
            ) : null}
            {bookingReady && !slotsLimited ? (
              <p className="text-xs text-amber-800">
                Booking isn&apos;t open yet — an administrator still needs to set
                maximum bookings (sold-out cap) for this campaign.
              </p>
            ) : null}
            {soldOut ? (
              <p className="text-xs font-medium text-amber-900">
                All spots for this flash deal are filled.
              </p>
            ) : null}
            <button
              type="button"
              disabled={booking || !dealDocId || !bookingAllowed}
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
