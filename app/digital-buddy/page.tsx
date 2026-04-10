import type { Metadata } from "next";
import { Card } from "@/components/ui/Card";
import { packagesGreenCard } from "@/lib/packages-section-theme";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Meridiano Digital Buddy",
  description:
    "Backpacker support and remote guiding in Sri Lanka — WhatsApp concierge, transport help, vetted stays, and local insight.",
};

export default function DigitalBuddyPage() {
  return (
    <div className="min-h-screen bg-lagoon/10 px-4 py-12 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-serif text-4xl font-semibold text-forest">
          Backpacker Support &amp; Remote Guiding
        </h1>
        <p className="mt-4 text-lg font-semibold text-forest/90">
          Independent Travel, Locally Supported
        </p>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-stone-700">
          Love the freedom of backpacking but want to skip the stress? Our
          Backpacker Support service is designed for explorers who want to travel
          on their own terms but value the safety and insider knowledge of a
          local expert.
        </p>

        <Card className={cn("mt-10 space-y-6", packagesGreenCard)}>
          <section>
            <h2 className="font-serif text-xl font-semibold text-forest">
              What you get
            </h2>
            <ul className="mt-4 list-inside list-disc space-y-3 text-sm leading-relaxed text-stone-700">
              <li>
                <strong className="text-forest">24/7 Remote Concierge:</strong>{" "}
                We are just a WhatsApp message away. Whether you need help
                navigating a local bus station, translating a menu, or finding
                a pharmacy at night, our team is online to guide you.
              </li>
              <li>
                <strong className="text-forest">Smart Transport Bookings:</strong>{" "}
                Don&apos;t get stuck! We help you book trains, long-distance
                buses, and ferries in advance so you never miss a connection.
              </li>
              <li>
                <strong className="text-forest">
                  Safety &amp; Location Tracking:
                </strong>{" "}
                Travel with peace of mind. Share your live location with us
                during solo treks or night journeys, and our security-conscious
                team will monitor your progress until you arrive safely.
              </li>
              <li>
                <strong className="text-forest">
                  Trusted Stays (Hand-Picked):
                </strong>{" "}
                Skip the tourist traps. We recommend and book vetted homestays,
                hostels, and host families known for their safety, cleanliness,
                and authentic Sri Lankan hospitality.
              </li>
              <li>
                <strong className="text-forest">Real-Time Problem Solving:</strong>{" "}
                If a plan falls through or you get lost, we provide instant
                rerouting and advice to get your trip back on track.
              </li>
            </ul>
          </section>

          <section className="border-t border-lagoon/20 pt-8">
            <h2 className="font-serif text-xl font-semibold text-forest">
              Why choose Meridiano Backpacker Support?
            </h2>
            <ul className="mt-4 list-inside list-disc space-y-2 text-sm text-stone-700">
              <li>
                <strong className="text-forest">Cost-effective:</strong>{" "}
                Professional guidance without the price tag of a full private
                tour.
              </li>
              <li>
                <strong className="text-forest">Total freedom:</strong> You
                choose where to go; we just make sure you get there safely.
              </li>
              <li>
                <strong className="text-forest">Local insight:</strong> Access
                hidden spots and local prices that aren&apos;t in the
                guidebooks.
              </li>
            </ul>
          </section>
        </Card>

        <Card className={cn("mt-8 space-y-8", packagesGreenCard)}>
          <section>
            <h2 className="font-serif text-xl font-semibold text-forest">
              Expert planning, seamless travel
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-stone-700">
              Love the freedom of backpacking but want to skip the stress of the
              unknown? We offer professional local insight to help you build your
              perfect Sri Lankan journey before you even leave home.
            </p>
          </section>

          <section>
            <h3 className="font-serif text-lg font-semibold text-forest">
              1. Free pre-arrival planning
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-stone-700">
              <strong className="text-forest">Pre-arrival planning</strong> is{" "}
              <em>free of charge</em>. Get your trip started on the right foot
              with our expert advice — we help you map out your route and
              suggest the best local secrets.
            </p>
            <p className="mt-4 text-sm font-semibold text-forest">
              Charges may apply
            </p>
            <ul className="mt-2 list-inside list-disc space-y-2 text-sm text-stone-700">
              <li>
                <strong className="text-forest">Route consultation:</strong>{" "}
                Advice on the best sequence of cities and stops.
              </li>
              <li>
                <strong className="text-forest">Trusted recommendations:</strong>{" "}
                Hand-picked homestays, hostels, and guest houses known for safety
                and authenticity.
              </li>
              <li>
                <strong className="text-forest">Local transport insight:</strong>{" "}
                Tips on how to use the Sri Lankan bus and train networks like a
                local.
              </li>
            </ul>
          </section>

          <section className="border-t border-lagoon/20 pt-8">
            <h3 className="font-serif text-lg font-semibold text-forest">
              2. On-ground remote support
            </h3>
            <p className="mt-2 text-sm font-semibold text-stone-800">
              Stay connected, stay safe{" "}
              <span className="font-normal text-stone-600">(charges apply)</span>
            </p>
            <p className="mt-3 text-sm leading-relaxed text-stone-700">
              Once you arrive, our team becomes your &quot;local friend in your
              pocket.&quot; For a small fee, you can activate our full suite of
              remote services to ensure your trip runs smoothly 24/7.
            </p>
            <ul className="mt-4 list-inside list-disc space-y-3 text-sm text-stone-700">
              <li>
                <strong className="text-forest">24/7 WhatsApp concierge:</strong>{" "}
                Real-time help with translations, finding locations, and
                navigating local schedules.
              </li>
              <li>
                <strong className="text-forest">Booking assistance:</strong> We
                handle reservations for trains, long-distance buses, and
                specialized transport.
              </li>
              <li>
                <strong className="text-forest">
                  Safety &amp; security monitoring:
                </strong>{" "}
                Share your live location with our team during solo treks or night
                journeys for peace of mind.
              </li>
              <li>
                <strong className="text-forest">
                  Emergency &amp; medical coordination:
                </strong>{" "}
                Access to the Meridiano Care network if things don&apos;t go as
                planned.
              </li>
            </ul>
          </section>

          <section className="border-t border-lagoon/20 pt-8">
            <h3 className="font-serif text-lg font-semibold text-forest">
              How it works
            </h3>
            <ol className="mt-4 list-inside list-decimal space-y-3 text-sm leading-relaxed text-stone-700">
              <li>
                <strong className="text-forest">Book your free planning:</strong>{" "}
                Contact us via the website before you travel.
              </li>
              <li>
                <strong className="text-forest">Get your itinerary:</strong>{" "}
                Receive our recommendations for stays and routes.
              </li>
              <li>
                <strong className="text-forest">Confirm your support:</strong>{" "}
                Upon arrival, confirm your journey through our site to activate
                your on-ground support and specialized services.
              </li>
            </ol>
          </section>
        </Card>
      </div>
    </div>
  );
}
