"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuthUser } from "@/components/auth/useAuthUser";
import { Card } from "@/components/ui/Card";
import { isFirebaseConfigured } from "@/lib/firebase";
import {
  bookingPaymentHref,
  cancelUserBooking,
  cancelUserFlashDealBooking,
  subscribeUserBookingsHydrated,
  USER_BOOKING_PAYMENT_STATUS_LABEL,
  USER_BOOKING_TRIP_STATUS_LABEL,
  type UserBookingRow,
  type UserBookingTripStatus,
} from "@/lib/user-bookings";
import { cn } from "@/lib/utils";

const LOGIN_NEXT = "/login?next=/my-bookings";

function tripStatusTone(s: UserBookingTripStatus): string {
  switch (s) {
    case "pending-payment":
      return "bg-amber-50 text-amber-950 ring-amber-800/15";
    case "booking-confirmed":
      return "bg-sky-50 text-sky-950 ring-sky-800/15";
    case "trip-started":
      return "bg-emerald-50 text-emerald-950 ring-emerald-800/15";
    case "trip-completed":
      return "bg-stone-100 text-stone-800 ring-stone-400/25";
    case "canceled":
      return "bg-red-50 text-red-900 ring-red-800/15";
  }
}

function PaymentStatusCell({ row }: { row: UserBookingRow }) {
  const label = USER_BOOKING_PAYMENT_STATUS_LABEL[row.paymentStatus];
  const href = bookingPaymentHref(row);
  if (!row.frozenByAdmin && row.paymentStatus === "pending-payment" && href) {
    return (
      <Link
        href={href}
        className="font-semibold text-lagoon underline underline-offset-2 hover:text-lagoon/80"
      >
        {label}
      </Link>
    );
  }
  return <span className="text-stone-800">{label}</span>;
}

function TripStatusCell({ row }: { row: UserBookingRow }) {
  if (row.frozenByAdmin) {
    return (
      <span
        className="inline-block rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-900 ring-1 ring-inset ring-slate-400/30"
        title="The flash deal campaign was removed by an admin; this booking is frozen."
      >
        Frozen by Admin
      </span>
    );
  }
  return (
    <span
      className={cn(
        "inline-block rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset",
        tripStatusTone(row.tripStatus),
      )}
    >
      {USER_BOOKING_TRIP_STATUS_LABEL[row.tripStatus]}
    </span>
  );
}

export function MyBookingsPageClient() {
  const { user, ready } = useAuthUser();
  const [rows, setRows] = useState<UserBookingRow[]>([]);
  const [subError, setSubError] = useState<string | null>(null);
  const [cancelingId, setCancelingId] = useState<string | null>(null);
  const [cancelError, setCancelError] = useState<string | null>(null);

  useEffect(() => {
    if (!isFirebaseConfigured() || !ready || !user?.uid) return;
    const unsub = subscribeUserBookingsHydrated(user.uid, setRows, setSubError);
    return unsub;
  }, [ready, user?.uid]);

  if (!isFirebaseConfigured()) {
    return (
      <Card className="border-lagoon/25 p-6 shadow-sm">
        <p className="text-sm text-stone-700">
          Firebase is not configured. Add{" "}
          <code className="rounded bg-stone-100 px-1 text-xs">
            NEXT_PUBLIC_FIREBASE_*
          </code>{" "}
          to your environment.
        </p>
      </Card>
    );
  }

  if (!ready) {
    return (
      <Card className="border-lagoon/25 p-8 shadow-sm">
        <p className="text-sm text-stone-600">Checking sign-in…</p>
      </Card>
    );
  }

  if (!user) {
    return (
      <Card className="border-lagoon/25 p-8 shadow-sm">
        <p className="text-sm text-stone-700">
          Sign in to see bookings you’ve saved from flash deals and the package
          form.
        </p>
        <Link
          href={LOGIN_NEXT}
          className="mt-4 inline-block text-sm font-semibold text-lagoon underline-offset-4 hover:underline"
        >
          Go to login
        </Link>
      </Card>
    );
  }

  return (
    <Card className="border-lagoon/25 p-6 shadow-sm sm:p-8">
      {subError ? (
        <p className="mb-4 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-950">
          Could not load bookings: {subError}
        </p>
      ) : null}

      {cancelError ? (
        <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-950">
          {cancelError}
        </p>
      ) : null}

      {rows.length === 0 ? (
        <p className="text-sm text-stone-600">
          No saved bookings yet. Book a featured flash deal while signed in, or
          submit the package booking form — each appears here automatically.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-stone-200/80">
          <table className="w-full min-w-[640px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-stone-200 bg-stone-50/90">
                <th className="px-4 py-3 font-serif font-semibold text-forest">
                  Type
                </th>
                <th className="px-4 py-3 font-serif font-semibold text-forest">
                  Trip ID
                </th>
                <th className="px-4 py-3 font-serif font-semibold text-forest">
                  Payment status
                </th>
                <th className="px-4 py-3 font-serif font-semibold text-forest">
                  Trip status
                </th>
                <th className="px-4 py-3 text-right font-serif font-semibold text-forest">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-stone-100 last:border-b-0 odd:bg-white even:bg-stone-50/40"
                >
                  <td className="max-w-[min(28rem,55vw)] px-4 py-3 align-top text-stone-800">
                    <span
                      className={cn(
                        "inline-block rounded-full px-2 py-0.5 text-xs font-semibold uppercase tracking-wide",
                        row.kind === "flash-deal"
                          ? "bg-emerald-100 text-emerald-900"
                          : "bg-sky-100 text-sky-950",
                      )}
                    >
                      {row.kind === "flash-deal" ? "Flash deal" : "Package"}
                    </span>
                    <p className="mt-2 whitespace-normal leading-snug">
                      {row.typeLabel}
                    </p>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 align-top font-mono text-xs tracking-wide text-stone-900">
                    {row.tripRef ?? "—"}
                  </td>
                  <td className="px-4 py-3 align-top text-stone-800">
                    <PaymentStatusCell row={row} />
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 align-top text-stone-800">
                    <TripStatusCell row={row} />
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 align-top text-right">
                    <button
                      type="button"
                      className={cn(
                        "inline bg-transparent p-0 text-sm font-semibold text-red-600 underline underline-offset-2",
                        "hover:text-red-800 disabled:pointer-events-none disabled:no-underline disabled:opacity-40",
                      )}
                      disabled={
                        row.tripStatus === "canceled" ||
                        row.frozenByAdmin === true ||
                        cancelingId === row.id ||
                        !user?.uid
                      }
                      onClick={async () => {
                        const ok =
                          typeof window !== "undefined" &&
                          window.confirm(
                            "Are you sure Cancel this booking? Your record stays in My Bookings page. If you’ve already paid, we’ll initiate refund follow-up.",
                          );
                        if (!ok || !user?.uid) return;
                        setCancelError(null);
                        setCancelingId(row.id);
                        try {
                          if (row.kind === "flash-deal") {
                            await cancelUserFlashDealBooking(user.uid, row.id);
                          } else {
                            await cancelUserBooking(user.uid, row.id);
                          }
                        } catch (e) {
                          const msg =
                            e instanceof Error
                              ? e.message
                              : "Could not cancel this booking.";
                          setCancelError(msg);
                        } finally {
                          setCancelingId(null);
                        }
                      }}
                    >
                      {cancelingId === row.id ? "Canceling…" : "Cancel"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}
