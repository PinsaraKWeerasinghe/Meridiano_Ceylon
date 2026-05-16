import { SiteReviewsPanel } from "@/components/home/SiteReviewsPanel";
import { TrustPilotTrustBox } from "@/components/home/TrustPilotTrustBox";
import { TripAdvisorReviewsPanel } from "@/components/home/TripAdvisorReviewsPanel";

export function TrustPilotReviewsSection() {
  return (
    <section className="border-t border-lagoon/15 bg-lagoon/10 px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <h2 className="font-serif text-3xl font-semibold text-forest">
            Reviews &amp; ratings
          </h2>
          <p className="mt-2 text-sm text-stone-700">
            Trusted by travellers worldwide — on Trustpilot and TripAdvisor — and
            from guests who travelled with Meridiano Ceylon.
          </p>
        </div>
        <div className="mt-10">
          <h3 className="font-serif text-xl font-semibold text-forest">
            Guest reviews
          </h3>
          <p className="mt-1 text-xs text-stone-600">
            Names and photos are from traveller accounts when the review was
            submitted.
          </p>
          <div className="mt-4">
            <SiteReviewsPanel />
          </div>
        </div>
        <div className="mt-12 grid gap-8 lg:grid-cols-2 lg:items-stretch lg:gap-10 [&>*]:min-w-0">
          <TrustPilotTrustBox />
          <TripAdvisorReviewsPanel />
        </div>
      </div>
    </section>
  );
}
