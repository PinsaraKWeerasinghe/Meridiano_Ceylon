import type { Metadata } from "next";
import { Card } from "@/components/ui/Card";
import { packagesGreenCard } from "@/lib/packages-section-theme";
import { cn } from "@/lib/utils";

/** International display; tel: uses E.164 (+94…). */
const CONTACT_PHONE_DISPLAY = "+9477 505 5370";
const CONTACT_PHONE_HREF = "tel:+94775055370";

const CONTACT_EMAILS = [
  {
    label: "Bookings",
    address: "bookings@meridianoceylon.com",
  },
  {
    label: "More information",
    address: "info@meridianoceylon.com",
  },
] as const;

export const metadata: Metadata = {
  title: "Contact us",
  description:
    "Visit Meridiano Ceylon in Wellawaya — address, phone, email, and local manager.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-lagoon/10 px-4 py-12 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-serif text-4xl font-semibold text-forest">
          Contact us
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-stone-600">
          Reach us at our Wellawaya office, by phone or email — we&apos;ll get
          back to you during business hours.
        </p>

        <Card
          className={cn(
            "mt-8 space-y-10 text-sm leading-relaxed text-stone-700",
            packagesGreenCard,
          )}
        >
          <section>
            <h2 className="font-serif text-xl font-semibold text-forest">
              Address
            </h2>
            <address className="mt-4 not-italic">
              <p>2<sup>nd</sup> floor</p>
              <p>In front of the new filling station</p>
              <p>Ceylinco Building</p>
              <p>Monaragala Road</p>
              <p>Wellawaya 90192</p>
            </address>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-forest">
              Phone
            </h2>
            <p className="mt-4">
              <a
                href={CONTACT_PHONE_HREF}
                className="font-semibold text-lagoon underline-offset-4 transition hover:text-forest hover:underline"
              >
                {CONTACT_PHONE_DISPLAY}
              </a>
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-forest">
              Email
            </h2>
            <ul className="mt-4 space-y-2">
              {CONTACT_EMAILS.map(({ label, address }) => (
                <li
                  key={address}
                  className="flex flex-wrap items-baseline gap-x-2"
                >
                  <span className="font-medium text-forest">{label}:</span>
                  <a
                    href={`mailto:${address}`}
                    className="font-semibold text-lagoon underline-offset-4 transition hover:text-forest hover:underline"
                  >
                    {address}
                  </a>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-forest">
              Managed by
            </h2>
            <p className="mt-4 font-medium text-forest">
              Mr. Dumindu Passan Hewage
            </p>
          </section>
        </Card>
      </div>
    </div>
  );
}
