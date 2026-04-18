import type { Metadata } from "next";
import { PackagesSectionShell } from "@/components/packages/PackagesSectionShell";
import { FixedPackagePanel } from "@/components/tours/FixedPackagePanel";
import { fixedPackages7Day } from "@/data/tours";
import {
  packagesGreenCard,
  packagesGreenPlaceholder,
  packagesGreenSlideshow,
} from "@/lib/packages-section-theme";

export const metadata: Metadata = {
  title: "7-day packages",
  description:
    "Seven-day fixed tours — highlands, safari, coast, and cultural depth.",
};

export default function Fixed7DayPackagesPage() {
  return (
    <PackagesSectionShell>
      <header>
        <h1 className="font-serif text-4xl font-semibold text-forest">
          7-day packages
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-stone-700">
          A full week to settle into the route — from hill country and heritage
          to wildlife and the sea.
        </p>
      </header>
      <div className="flex flex-col gap-14">
        {fixedPackages7Day.map((tour, index) => (
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
