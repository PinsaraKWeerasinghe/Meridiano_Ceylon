import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { PackageBookingForm } from "@/components/tours/PackageBookingForm";

export const metadata: Metadata = {
  title: "Book a package",
  description:
    "Submit your booking details — Meridiano Ceylon will follow up on WhatsApp.",
};

function BookFormFallback() {
  return (
    <div className="rounded-xl border border-lagoon/20 bg-white/60 px-6 py-12 text-center text-sm text-stone-600">
      Loading form…
    </div>
  );
}

export default function PackageBookPage() {
  return (
    <div className="min-h-screen bg-lagoon/10 px-4 py-12 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/packages"
          className="text-sm font-semibold text-lagoon underline-offset-4 transition hover:text-lagoon/80 hover:underline"
        >
          ← Packages &amp; tours
        </Link>
        <h1 className="mt-6 font-serif text-3xl font-semibold text-forest sm:text-4xl">
          Book now
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-stone-700">
          Tell us who is travelling, which package you want, and any add-ons.
          We&apos;ll open WhatsApp with your details so our team can confirm
          availability.
        </p>

        <div className="mt-10">
          <Suspense fallback={<BookFormFallback />}>
            <PackageBookingForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
