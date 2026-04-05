import type { Metadata } from "next";
import { FixedPackagePanel } from "@/components/tours/FixedPackagePanel";
import { addonTours, fixedPackages, specialtyTours } from "@/data/tours";
import {
  packagesGreenCard,
  packagesGreenPlaceholder,
  packagesGreenSlideshow,
} from "@/lib/packages-section-theme";

export const metadata: Metadata = {
  title: "Packages & tours",
};

export default function PackagesPage() {
  return (
    <div className="min-h-screen bg-lagoon/10 px-4 py-12 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-6xl">
        <h1 className="font-serif text-4xl font-semibold text-forest">
          Packages &amp; tours
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-stone-700">
          Fixed itineraries anchor your dates; add-ons and specialty experiences
          layer on the details that matter to you. Enquire via{" "}
          <em>Build your journey</em> or WhatsApp for a tailored quote.
        </p>

        <h2 className="mt-14 font-serif text-2xl font-semibold text-forest">
          Fixed packages
        </h2>
        <div className="mt-8 flex flex-col gap-14">
          {fixedPackages.map((tour, index) => (
            <FixedPackagePanel
              key={tour.id}
              tour={tour}
              index={index}
              cardClassName={packagesGreenCard}
              placeholderClassName={packagesGreenPlaceholder}
              slideshowClassName={packagesGreenSlideshow}
              verticallyCenterCardContent
              alignTextTowardImages
            />
          ))}
        </div>

        <h2
          id="addons"
          className="mt-16 scroll-mt-24 font-serif text-2xl font-semibold text-forest"
        >
          Add-ons
        </h2>
        <p className="mt-3 max-w-2xl text-sm text-stone-700">
          Optional layers — nightlife, retail, beach sports, volunteering, and
          photography — designed to bolt onto your core itinerary.
        </p>
        <div className="mt-8 flex flex-col gap-14">
          {addonTours.map((tour, index) => (
            <FixedPackagePanel
              key={tour.id}
              tour={tour}
              index={index}
              cardClassName={packagesGreenCard}
              placeholderClassName={packagesGreenPlaceholder}
              slideshowClassName={packagesGreenSlideshow}
              verticallyCenterCardContent
            />
          ))}
        </div>

        <h2
          id="specialty"
          className="mt-16 scroll-mt-24 font-serif text-2xl font-semibold text-forest"
        >
          Specialty tours
        </h2>
        <div className="mt-8 flex flex-col gap-14">
          {specialtyTours.map((tour, index) => (
            <FixedPackagePanel
              key={tour.id}
              tour={tour}
              index={index}
              cardClassName={packagesGreenCard}
              placeholderClassName={packagesGreenPlaceholder}
              slideshowClassName={packagesGreenSlideshow}
              verticallyCenterCardContent
            />
          ))}
        </div>
      </div>
    </div>
  );
}
