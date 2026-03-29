import Link from "next/link";
import { Hero } from "@/components/home/Hero";
import { BuildJourneyForm } from "@/components/home/BuildJourneyForm";
import { TourCard } from "@/components/tours/TourCard";
import { fixedPackages, specialtyTours } from "@/data/tours";

export default function HomePage() {
  return (
    <>
      <Hero />
      <BuildJourneyForm />

      <section className="border-t border-stone-200 bg-white px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h2 className="font-serif text-3xl font-semibold text-forest">
                Fixed packages
              </h2>
              <p className="mt-2 max-w-xl text-sm text-stone-600">
                Curated durations from five days to two weeks — hills, safari,
                coast, and culture in balance.
              </p>
            </div>
            <Link
              href="/packages"
              className="text-sm font-semibold text-gold underline-offset-4 hover:underline"
            >
              View all packages
            </Link>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {fixedPackages.map((tour) => (
              <TourCard key={tour.id} tour={tour} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-stone-100/80 px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h2 className="font-serif text-3xl font-semibold text-forest">
                Specialty tours
              </h2>
              <p className="mt-2 max-w-xl text-sm text-stone-600">
                Nightlife, long stays, shopping, volunteering, photography,
                beach sports, luxury, and groups — layered onto your rhythm.
              </p>
            </div>
            <Link
              href="/packages#specialty"
              className="text-sm font-semibold text-gold underline-offset-4 hover:underline"
            >
              Explore specialties
            </Link>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {specialtyTours.slice(0, 6).map((tour) => (
              <TourCard key={tour.id} tour={tour} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
