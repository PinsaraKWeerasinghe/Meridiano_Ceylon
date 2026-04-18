import type { Metadata } from "next";
import { PackagesSectionShell } from "@/components/packages/PackagesSectionShell";
import { FixedPackagePanel } from "@/components/tours/FixedPackagePanel";
import { specialtyTours } from "@/data/tours";
import {
  packagesGreenCard,
  packagesGreenPlaceholder,
  packagesGreenSlideshow,
} from "@/lib/packages-section-theme";

export const metadata: Metadata = {
  title: "Specialty tours",
  description:
    "Specialty journeys — photography, long-stay, volunteering, transport, and adventure.",
};

export default function SpecialtyToursPackagesPage() {
  return (
    <PackagesSectionShell>
      <header>
        <h1 className="font-serif text-4xl font-semibold text-forest">
          Specialty tours
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-stone-700">
          Tailored for passions beyond a classic holiday — logistics, permits,
          long stays, and experiences built around how you travel.
        </p>
      </header>
      <div className="flex flex-col gap-14">
        {specialtyTours.map((tour, index) => (
          <FixedPackagePanel
            key={tour.id}
            tour={tour}
            index={index}
            cardClassName={packagesGreenCard}
            placeholderClassName={packagesGreenPlaceholder}
            slideshowClassName={packagesGreenSlideshow}
            verticallyCenterCardContent
            alignTextTowardImages
            previewMaxImages={2}
          />
        ))}
      </div>
    </PackagesSectionShell>
  );
}
