import { GoogleMapsReviewsPromo } from "@/components/home/GoogleMapsReviewsPromo";

export function TrustPilotReviewsSection() {
  return (
    <section className="border-t border-lagoon/15 bg-lagoon/10 px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <h2 className="font-serif text-3xl font-semibold text-forest">
            Reviews &amp; ratings
          </h2>
          <p className="mt-2 text-sm text-stone-700">
            Recent ratings and feedback from travellers who explored Sri Lanka with
            Meridiano Ceylon.
          </p>
        </div>
        <GoogleMapsReviewsPromo />
      </div>
    </section>
  );
}
