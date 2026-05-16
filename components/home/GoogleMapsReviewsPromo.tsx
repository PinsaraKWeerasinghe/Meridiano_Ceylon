import { GoogleReviewsWidget } from "@/components/home/GoogleReviewsWidget";
import {
  googleMapsEmbedUrl,
  isSafeGoogleMapsEmbedSrc,
  sociableKitGoogleReviewsEmbedId,
} from "@/lib/google-maps-business";

export function GoogleMapsReviewsPromo() {
  const reviewsEmbedId = sociableKitGoogleReviewsEmbedId();
  const embedCandidate = googleMapsEmbedUrl();
  const embedSrc =
    !reviewsEmbedId &&
    embedCandidate &&
    isSafeGoogleMapsEmbedSrc(embedCandidate)
      ? embedCandidate
      : null;

  const widgetActive = Boolean(reviewsEmbedId);

  return (
    <div
      className={
        widgetActive
          ? "mt-8 w-full max-w-none min-w-0"
          : "mt-8 max-w-2xl rounded-2xl border border-lagoon/20 bg-white/80 p-5 shadow-sm shadow-lagoon/10 sm:p-6"
      }
    >
      {!reviewsEmbedId ? (
        <p className="text-sm text-stone-700">
          Ratings and reviews appear below.
        </p>
      ) : null}
      {reviewsEmbedId ? (
        <GoogleReviewsWidget />
      ) : embedSrc ? (
        <div className="mt-6 overflow-hidden rounded-2xl border border-lagoon/15 bg-stone-100 ring-1 ring-lagoon/10">
          <div className="relative aspect-video w-full max-w-xl">
            <iframe
              src={embedSrc}
              title="Meridiano Ceylon on Google Maps"
              className="absolute inset-0 h-full w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
