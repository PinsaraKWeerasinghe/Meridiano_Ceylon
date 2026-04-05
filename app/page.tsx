import Link from "next/link";
import { Hero } from "@/components/home/Hero";
import { BuildJourneyForm } from "@/components/home/BuildJourneyForm";
import { TourCard } from "@/components/tours/TourCard";
import { FixedPackagePanel } from "@/components/tours/FixedPackagePanel";
import { fixedPackages, specialtyTours } from "@/data/tours";
import {
  packagesGreenCard,
  packagesGreenPlaceholder,
  packagesGreenSlideshow,
} from "@/lib/packages-section-theme";

export default function HomePage() {
  return (
    <>
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
            {fixedPackages.map((tour, index) => (
              <FixedPackagePanel
                key={tour.id}
                tour={tour}
                index={index}
                cardClassName={packagesGreenCard}
                placeholderClassName={packagesGreenPlaceholder}
                slideshowClassName={packagesGreenSlideshow}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-lagoon/15 bg-lagoon/10 px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h2 className="font-serif text-3xl font-semibold text-forest">
                Specialty tours
              </h2>
              <p className="mt-2 max-w-xl text-sm text-stone-700">
                Nightlife, long stays, shopping, volunteering, photography,
                beach sports, luxury, and groups — layered onto your rhythm.
              </p>
            </div>
            <Link
              href="/packages#specialty"
              className="text-sm font-semibold text-lagoon underline-offset-4 transition hover:text-lagoon/80 hover:underline"
            >
              Explore specialties
            </Link>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {specialtyTours.slice(0, 6).map((tour) => (
              <TourCard key={tour.id} tour={tour} className={packagesGreenCard} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
