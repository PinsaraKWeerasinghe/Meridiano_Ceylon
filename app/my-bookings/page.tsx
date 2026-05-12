import type { Metadata } from "next";
import Link from "next/link";
import { MyBookingsPageClient } from "@/components/my-bookings/MyBookingsPageClient";

export const metadata: Metadata = {
  title: "My Bookings",
  description:
    "Bookings you saved while signed in — flash deals and package enquiries.",
};

export default function MyBookingsPage() {
  return (
    <div className="min-h-screen bg-lagoon/10 px-4 py-12 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/"
          className="text-sm font-semibold text-lagoon underline-offset-4 transition hover:text-lagoon/80 hover:underline"
        >
          ← Home
        </Link>
        <h1 className="mt-6 font-serif text-3xl font-semibold text-forest sm:text-4xl">
          My Bookings
        </h1>
        <p className="mt-2 text-sm text-stone-600">
          Flash-deal reservations and package submissions you made while signed
          in (deal or travel date, plus when each was saved).
        </p>
        <div className="mt-8">
          <MyBookingsPageClient />
        </div>
      </div>
    </div>
  );
}
