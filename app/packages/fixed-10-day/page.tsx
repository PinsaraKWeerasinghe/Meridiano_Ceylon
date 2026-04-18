import type { Metadata } from "next";
import { PackagesSectionShell } from "@/components/packages/PackagesSectionShell";
import { FixedPackagePanel } from "@/components/tours/FixedPackagePanel";
import { fixedPackages10Day } from "@/data/tours";
import {
  packagesGreenCard,
  packagesGreenPlaceholder,
  packagesGreenSlideshow,
} from "@/lib/packages-section-theme";

export const metadata: Metadata = {
  title: "10-day packages",
  description:
    "Ten-day fixed itineraries — ancient cities, coast, safari, and specialty routes.",
};

export default function Fixed10DayPackagesPage() {
  return (
    <PackagesSectionShell>
      <header>
        <h1 className="font-serif text-4xl font-semibold text-forest">
          10-day packages
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-stone-700">
          More room to explore UNESCO sites, national parks, and slower coastal
          days without rushing the highlights.
        </p>
      </header>
      <div className="flex flex-col gap-14">
        {fixedPackages10Day.map((tour, index) => (
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
