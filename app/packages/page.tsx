import type { Metadata } from "next";
import { TourCard } from "@/components/tours/TourCard";
import { FixedPackagePanel } from "@/components/tours/FixedPackagePanel";
import { fixedPackages, specialtyTours } from "@/data/tours";

export const metadata: Metadata = {
  title: "Packages & tours",
};

export default function PackagesPage() {
  return (
    <div className="bg-cream px-4 py-12 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-6xl">
        <h1 className="font-serif text-4xl font-semibold text-forest">
          Packages &amp; tours
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-stone-600">
          Fixed itineraries anchor your dates; specialty experiences layer on
          the details that matter to you. Enquire via{" "}
          <em>Build your journey</em> or WhatsApp for a tailored quote.
        </p>

        <h2 className="mt-14 font-serif text-2xl font-semibold text-forest">
          Fixed packages
        </h2>
        <div className="mt-8 flex flex-col gap-14">
          {fixedPackages.map((tour, index) => (
            <FixedPackagePanel key={tour.id} tour={tour} index={index} />
          ))}
        </div>

        <h2
          id="specialty"
          className="mt-16 scroll-mt-24 font-serif text-2xl font-semibold text-forest"
        >
          Specialty tours
        </h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {specialtyTours.map((tour) => (
            <TourCard key={tour.id} tour={tour} />
          ))}
        </div>
      </div>
    </div>
  );
}
