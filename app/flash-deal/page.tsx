import type { Metadata } from "next";
import Link from "next/link";
import { FlashDealDetailPageClient } from "@/components/flash-deal/FlashDealDetailPageClient";

export const metadata: Metadata = {
  title: "Flash deal",
  description:
    "Limited-time Meridiano Ceylon flash deal — dates, inclusions, and itinerary highlights.",
};

export default function FlashDealPage() {
  return (
    <div className="min-h-screen bg-lagoon/10 px-4 py-12 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/"
          className="text-sm font-semibold text-lagoon underline-offset-4 transition hover:text-lagoon/80 hover:underline"
        >
          ← Home
        </Link>
        <div className="mt-8">
          <FlashDealDetailPageClient />
        </div>
      </div>
    </div>
  );
}
