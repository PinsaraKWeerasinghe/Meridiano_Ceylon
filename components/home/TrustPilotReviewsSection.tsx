import { TrustPilotTrustBox } from "@/components/home/TrustPilotTrustBox";

export function TrustPilotReviewsSection() {
  return (
    <section className="border-t border-lagoon/15 bg-lagoon/10 px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-xl">
          <h2 className="font-serif text-3xl font-semibold text-forest">
            Reviews &amp; ratings
          </h2>
          <p className="mt-2 text-sm text-stone-700">
            Trusted by travellers worldwide — verified on Trustpilot.
          </p>
        </div>
        <div className="mt-8">
          <TrustPilotTrustBox />
        </div>
      </div>
    </section>
  );
}
