import { ReviewPanelLogo } from "@/components/home/ReviewPanelLogo";
import { homeReviewPanelClass } from "@/lib/home-review-panels";

const TRIPADVISOR_LOGO_SRC = "/SiteInfo/Tripadvisor_Logo.png";

/** TripAdvisor logo only until a listing/widget env is wired (mirror disconnected Trustpilot). */
export function TripAdvisorReviewsPanel() {
  return (
    <div className={homeReviewPanelClass}>
      <ReviewPanelLogo
        src={TRIPADVISOR_LOGO_SRC}
        unoptimized
        variant="tripadvisor"
        className="mb-0"
      />
    </div>
  );
}
