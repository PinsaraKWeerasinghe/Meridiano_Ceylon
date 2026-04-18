import type { Metadata } from "next";
import { PackagesSectionShell } from "@/components/packages/PackagesSectionShell";
import { FixedPackagePanel } from "@/components/tours/FixedPackagePanel";
import { fixedPackages5Day } from "@/data/tours";
import {
  packagesGreenCard,
  packagesGreenPlaceholder,
  packagesGreenSlideshow,
} from "@/lib/packages-section-theme";

export const metadata: Metadata = {
  title: "5-day packages",
  description:
    "Five-day fixed itineraries — beach, safari, hills, and coast in balance.",
};

export default function Fixed5DayPackagesPage() {
  return (
    <PackagesSectionShell>
      <header>
        <h1 className="font-serif text-4xl font-semibold text-forest">
          5-day packages
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-stone-700">
          Shorter itineraries with a clear rhythm — ideal when time is tight but
          you still want signature Sri Lankan landscapes and culture.
        </p>
      </header>
      <div className="flex flex-col gap-14">
        {fixedPackages5Day.map((tour, index) => (
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
