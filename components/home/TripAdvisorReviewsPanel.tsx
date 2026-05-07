import { ReviewPanelLogo } from "@/components/home/ReviewPanelLogo";
import { homeReviewPanelClass } from "@/lib/home-review-panels";

const TRIPADVISOR_LOGO_SRC = "/SiteInfo/Tripadvisor_Logo.png";

/** TripAdvisor branding + placeholder metrics (wire listing / widget later if needed). */
export function TripAdvisorReviewsPanel() {
  return (
    <div className={homeReviewPanelClass}>
      <ReviewPanelLogo src={TRIPADVISOR_LOGO_SRC} unoptimized />

      <div className="mx-auto grid max-w-lg justify-items-center gap-8 text-center sm:grid-cols-2 sm:gap-10">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-stone-500">
            TripAdvisor rating
          </p>
          <p className="mt-2 font-serif text-3xl font-semibold tracking-tight text-forest tabular-nums">
            N/A
          </p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-stone-500">
            Reviews
          </p>
          <p className="mt-2 font-serif text-3xl font-semibold tracking-tight text-forest tabular-nums">
            N/A
          </p>
        </div>
      </div>
      <p className="mt-8 text-center text-xs text-stone-500">
        Traveler ratings on TripAdvisor will appear here when linked.
      </p>
    </div>
  );
}
