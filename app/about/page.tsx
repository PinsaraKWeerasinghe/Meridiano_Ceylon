import type { Metadata } from "next";
import { Card } from "@/components/ui/Card";
import { packagesGreenCard } from "@/lib/packages-section-theme";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "About us",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-lagoon/10 px-4 py-12 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-serif text-4xl font-semibold text-forest">
          About us
        </h1>
        <Card
          className={cn(
            "mt-8 space-y-6 text-sm leading-relaxed text-stone-700",
            packagesGreenCard,
          )}
        >
          <section>
            <h2 className="font-serif text-xl font-semibold text-forest">
              Who we are
            </h2>
            <p className="mt-2">
              Meridiano Ceylon is your premier guide to the wonders of Sri
              Lanka. We specialize in creating unforgettable journeys tailored
              just for you. From hidden gems in the misty mountains to stunning
              coastal views, we reveal the island&apos;s best-kept secrets. We
              combine local expertise with premium care to ensure your holiday
              is perfect.
            </p>
          </section>
          <section>
            <h2 className="font-serif text-xl font-semibold text-forest">
              Why choose us?
            </h2>
            <ul className="mt-3 list-inside list-disc space-y-2">
              <li>
                <strong className="text-forest">Safety first</strong> — We are
                one of the few operators that offer a 24/7 Medical &amp; Safety
                Promise. Your health is our priority.
              </li>
              <li>
                <strong className="text-forest">True customization</strong> —
                We don&apos;t give you a one-size-fits-all plan. You tell us
                your vibe, and we build the journey around you.
              </li>
              <li>
                <strong className="text-forest">Pet-friendly travel</strong> —
                We believe your furry friends are part of the family. We offer
                special vehicles and hotels that welcome pets.
              </li>
              <li>
                <strong className="text-forest">Local partners</strong> — We
                work with trusted hotels and professional drivers to make sure
                your trip is smooth and comfortable.
              </li>
            </ul>
          </section>
        </Card>
      </div>
    </div>
  );
}
