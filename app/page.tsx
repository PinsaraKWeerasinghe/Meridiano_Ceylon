import Link from "next/link";
import { FlashDealBar } from "@/components/home/FlashDealBar";
import { Hero } from "@/components/home/Hero";
import { BuildJourneyForm } from "@/components/home/BuildJourneyForm";
import { HomeAddonsSection } from "@/components/home/HomeAddonsSection";
import { TrustPilotReviewsSection } from "@/components/home/TrustPilotReviewsSection";
import { FixedPackagePanel } from "@/components/tours/FixedPackagePanel";
import {
  fixedPackagesFirstPerDuration,
  homeSpecialtyTours,
} from "@/data/tours";
import { packagesSectionHref } from "@/lib/packages-nav";
import {
  packagesGreenCard,
  packagesGreenPlaceholder,
  packagesGreenSlideshow,
} from "@/lib/packages-section-theme";

export default function HomePage() {
  return (
    <>
      <FlashDealBar />
      <Hero />
      <BuildJourneyForm />

      <section className="border-t border-lagoon/15 bg-lagoon/10 px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h2 className="font-serif text-3xl font-semibold text-forest">
                Fixed packages
              </h2>
              <p className="mt-2 max-w-xl text-sm text-stone-700">
                Curated durations from five days to two weeks — hills, safari,
                coast, and culture in balance.
              </p>
            </div>
            <Link
              href="/packages"
              className="text-sm font-semibold text-lagoon underline-offset-4 transition hover:text-lagoon/80 hover:underline"
            >
              View all packages
            </Link>
          </div>
          <div className="mt-10 flex flex-col gap-14">
            {fixedPackagesFirstPerDuration.map((tour, index) => (
              <FixedPackagePanel
                key={tour.id}
                tour={tour}
                index={index}
                cardClassName={packagesGreenCard}
                placeholderClassName={packagesGreenPlaceholder}
                slideshowClassName={packagesGreenSlideshow}
                scrollRevealImages
                verticallyCenterCardContent
                alignTextTowardImages
              />
            ))}
          </div>
        </div>
      </section>

      <HomeAddonsSection />

      <section className="border-t border-lagoon/15 bg-lagoon/10 px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h2 className="font-serif text-3xl font-semibold text-forest">
                Specialty tours
              </h2>
              <p className="mt-2 max-w-xl text-sm text-stone-700">
                Tailored for those who seek more than just a holiday — journeys
                built around your passions, with every detail handled by
                experts.
              </p>
            </div>
            <Link
              href={packagesSectionHref("specialty-tours")}
              className="text-sm font-semibold text-lagoon underline-offset-4 transition hover:text-lagoon/80 hover:underline"
            >
              Explore specialties
            </Link>
          </div>
          <div className="mt-10 flex flex-col gap-14">
            {homeSpecialtyTours.map((tour, index) => (
              <FixedPackagePanel
                key={tour.id}
                tour={tour}
                index={index}
                cardClassName={packagesGreenCard}
                placeholderClassName={packagesGreenPlaceholder}
                slideshowClassName={packagesGreenSlideshow}
                scrollRevealImages
                verticallyCenterCardContent
                alignTextTowardImages
              />
            ))}
          </div>
        </div>
      </section>

      <TrustPilotReviewsSection />
    </>
  );
}
