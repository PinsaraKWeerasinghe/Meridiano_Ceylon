"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuthUser } from "@/components/auth/useAuthUser";
import { Card } from "@/components/ui/Card";
import { formatDealDateLabel } from "@/lib/flash-deal-colombo";
import { isFirebaseConfigured } from "@/lib/firebase";
import {
  subscribeUserBookings,
  type UserBookingRow,
} from "@/lib/user-bookings";
import { cn } from "@/lib/utils";

const LOGIN_NEXT = "/login?next=/my-bookings";

function formatBookingDateCell(iso: string): string {
  const s = iso.trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return "—";
  return formatDealDateLabel(s);
}

function formatCreatedAtCell(d: Date | null): string {
  if (!d) return "—";
  return d.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function MyBookingsPageClient() {
  const { user, ready } = useAuthUser();
  const [rows, setRows] = useState<UserBookingRow[]>([]);
  const [subError, setSubError] = useState<string | null>(null);

  useEffect(() => {
    if (!isFirebaseConfigured() || !ready || !user?.uid) return;
    const unsub = subscribeUserBookings(user.uid, setRows, setSubError);
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
                  Deal / travel date
                </th>
                <th className="px-4 py-3 font-serif font-semibold text-forest">
                  Created
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
                  <td className="whitespace-nowrap px-4 py-3 align-top tabular-nums text-stone-800">
                    {formatBookingDateCell(row.bookingDate)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 align-top tabular-nums text-stone-700">
                    {formatCreatedAtCell(row.createdAt)}
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
