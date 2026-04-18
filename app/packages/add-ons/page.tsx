import type { Metadata } from "next";
import { PackagesSectionShell } from "@/components/packages/PackagesSectionShell";
import { FixedPackagePanel } from "@/components/tours/FixedPackagePanel";
import { addonTours } from "@/data/tours";
import {
  packagesGreenCard,
  packagesGreenPlaceholder,
  packagesGreenSlideshow,
} from "@/lib/packages-section-theme";

export const metadata: Metadata = {
  title: "Add-ons",
  description:
    "Optional add-ons — village kitchen, nightlife, wellness, and curated shopping.",
};

export default function AddOnsPackagesPage() {
  return (
    <PackagesSectionShell>
      <header>
        <h1 className="font-serif text-4xl font-semibold text-forest">Add-ons</h1>
        <p className="mt-3 max-w-2xl text-sm text-stone-700">
          Optional layers designed to bolt onto your core itinerary — nightlife,
          retail, wellness, and authentic village experiences.
        </p>
      </header>
      <div className="flex flex-col gap-14">
        {addonTours.map((tour, index) => (
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
