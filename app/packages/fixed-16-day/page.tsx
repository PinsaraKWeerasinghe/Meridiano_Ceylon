import type { Metadata } from "next";
import { PackagesSectionShell } from "@/components/packages/PackagesSectionShell";
import { FixedPackagePanel } from "@/components/tours/FixedPackagePanel";
import { fixedPackages16Day } from "@/data/tours";
import {
  packagesGreenCard,
  packagesGreenPlaceholder,
  packagesGreenSlideshow,
} from "@/lib/packages-section-theme";

export const metadata: Metadata = {
  title: "16-day packages",
  description:
    "Sixteen-day cross-country expedition — north to south across Sri Lanka.",
};

export default function Fixed16DayPackagesPage() {
  return (
    <PackagesSectionShell>
      <header>
        <h1 className="font-serif text-4xl font-semibold text-forest">
          16-day packages
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-stone-700">
          The full breadth of the island in one thoughtfully paced route — from
          the northern tip to the southern coast.
        </p>
      </header>
      <div className="flex flex-col gap-14">
        {fixedPackages16Day.map((tour, index) => (
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
