import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { PackageBookingCheckout } from "@/components/tours/PackageBookingCheckout";

export const metadata: Metadata = {
  title: "Billing & payment",
  description:
    "Review your package booking, confirm billing details, and pay securely.",
};

function CheckoutFallback() {
  return (
    <div className="rounded-xl border border-lagoon/20 bg-white/60 px-6 py-12 text-center text-sm text-stone-600">
      Loading checkout…
    </div>
  );
}

export default function PackageBookCheckoutPage() {
  return (
    <div className="min-h-screen bg-lagoon/10 px-4 py-12 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/packages/book"
          className="text-sm font-semibold text-lagoon underline-offset-4 transition hover:text-lagoon/80 hover:underline"
        >
          ← Booking form
        </Link>
        <h1 className="mt-6 font-serif text-3xl font-semibold text-forest sm:text-4xl">
          Billing &amp; payment
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-stone-700">
          Confirm your traveller details below, fill in billing information,
          agree to our policies, then continue to PayHere when your merchant
          account is configured.
        </p>

        <div className="mt-10">
          <Suspense fallback={<CheckoutFallback />}>
            <PackageBookingCheckout />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
