import type { Metadata } from "next";
import Link from "next/link";
import { AdminFlashDealPageClient } from "@/components/admin/AdminFlashDealPageClient";

export const metadata: Metadata = {
  title: "Flash deal",
  description: "Configure the limited-time flash deal banner (admins only).",
};

export default function AdminFlashDealPage() {
  return (
    <div className="min-h-screen bg-lagoon/10 px-4 py-12 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-xl">
        <Link
          href="/"
          className="text-sm font-semibold text-lagoon underline-offset-4 transition hover:text-lagoon/80 hover:underline"
        >
          ← Home
        </Link>
        <h1 className="mt-6 font-serif text-3xl font-semibold text-forest sm:text-4xl">
          Flash deal
        </h1>
        <p className="mt-2 text-sm text-stone-600">
          Title, deal date, and visibility. Updates sync to the banner on the
          homepage.
        </p>
        <div className="mt-10">
          <AdminFlashDealPageClient />
        </div>
      </div>
    </div>
  );
}
