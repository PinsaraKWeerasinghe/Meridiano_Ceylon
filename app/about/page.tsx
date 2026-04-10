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
          Your Gateway to Sri Lanka
        </h1>

        <Card
          className={cn(
            "mt-8 space-y-8 text-sm leading-relaxed text-stone-700",
            packagesGreenCard,
          )}
        >
          <section className="space-y-4">
            <p>
              At Meridiano Ceylon, we believe that traveling is about more
              than just seeing new places—it is about creating memories that
              last a lifetime. Based in the heart of the island, we are a
              premier travel guide dedicated to showing you the true spirit of
              Sri Lanka.
            </p>
            <p>
              From the hidden waterfalls of the misty mountains to the
              sun-drenched shores of our coastal towns, we reveal the
              island&apos;s best-kept secrets with local expertise and premium
              care.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-forest">
              What Makes Us Different?
            </h2>
            <ul className="mt-3 list-inside list-disc space-y-3 marker:text-lagoon">
              <li>
                <strong className="text-forest">Safety Without Compromise</strong>
                {" — "}
                Your peace of mind is our priority. We are proud to be one of the
                few operators offering a 24/7 Medical &amp; Safety Promise. No
                matter where you are on the island, we are always here to help.
              </li>
              <li>
                <strong className="text-forest">Tours Designed for You</strong>
                {" — "}
                We don&apos;t believe in &quot;one-size-fits-all&quot; travel.
                Whether you want a high-energy adventure or a peaceful escape,
                we listen to your &quot;vibe&quot; and build a custom journey
                specifically for you.
              </li>
              <li>
                <strong className="text-forest">Pet-Friendly Adventures</strong>
                {" — "}
                We know that pets are part of the family. We specialize in
                pet-friendly travel, providing comfortable vehicles and booking
                hotels that welcome your furry friends with open arms.
              </li>
              <li>
                <strong className="text-forest">Quality You Can Trust</strong>
                {" — "}
                We partner with the most professional drivers and the most
                comfortable hotels to ensure every part of your trip is smooth,
                safe, and relaxing.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-forest">
              Our Mission
            </h2>
            <p className="mt-3">
              Our mission is simple: to provide high-quality, personalized, and
              safe travel experiences that showcase the natural beauty and
              hospitality of Sri Lanka. Whether you are a solo traveler, a
              couple, or a family with pets, we invite you to explore the island
              with us.
            </p>
          </section>
        </Card>
      </div>
    </div>
  );
}
