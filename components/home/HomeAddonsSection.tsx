import Link from "next/link";
import { AddonMarqueeStrip } from "@/components/home/AddonMarqueeStrip";
import { addonTours } from "@/data/tours";

export function HomeAddonsSection() {
  return (
    <section className="border-t border-lagoon/15 bg-lagoon/10 py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h2 className="font-serif text-3xl font-semibold text-forest">
              Add-ons
            </h2>
            <p className="mt-2 max-w-xl text-sm text-stone-700">
              Nightlife, shopping, beach sports, volunteering, and photography
              — optional layers on top of your core route.
            </p>
          </div>
          <Link
            href="/packages#addons"
            className="text-sm font-semibold text-lagoon underline-offset-4 transition hover:text-lagoon/80 hover:underline"
          >
            View all add-ons
          </Link>
        </div>
      </div>
      <div className="mt-10 w-full min-w-0">
        <AddonMarqueeStrip tours={addonTours} cardVariant="onDark" fullWidth />
      </div>
    </section>
  );
}
