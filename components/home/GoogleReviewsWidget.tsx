import {
  sociableKitGoogleReviewsEmbedId,
  sociableKitGoogleReviewsIframeSrc,
} from "@/lib/google-maps-business";

export function GoogleReviewsWidget() {
  const embedId = sociableKitGoogleReviewsEmbedId();
  if (!embedId) return null;

  return (
    <div className="w-full max-w-full min-w-0">
      <iframe
        src={sociableKitGoogleReviewsIframeSrc(embedId)}
        title="Travel reviews for Meridiano Ceylon"
        className="block h-[1000px] w-full max-w-full border-0"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}
