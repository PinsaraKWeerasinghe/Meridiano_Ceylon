import type { Metadata } from "next";
import Link from "next/link";
import { PackagesSectionShell } from "@/components/packages/PackagesSectionShell";
import { packagesSubNavItems } from "@/lib/packages-nav";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Packages & tours",
  description:
    "Browse fixed itineraries by length, add-ons, and specialty tours — Meridiano Ceylon.",
};

const hubLinks = packagesSubNavItems.filter((item) => item.href !== "/packages");

export default function PackagesPage() {
  return (
    <PackagesSectionShell showSubnav={false}>
      <header>
        <h1 className="font-serif text-4xl font-semibold text-forest">
          Packages &amp; tours
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-stone-700">
          Fixed itineraries anchor your dates; add-ons and specialty experiences
          layer on the details that matter to you. Enquire via{" "}
          <em>Build your journey</em> or WhatsApp for a tailored quote.
        </p>
      </header>

      <section aria-labelledby="packages-hub-heading">
        <h2
          id="packages-hub-heading"
          className="font-serif text-xl font-semibold text-forest"
        >
          Browse by category
        </h2>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {hubLinks.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "flex min-h-[3.5rem] items-center rounded-xl border border-lagoon/25 bg-white/90 px-4 py-3 text-sm font-semibold text-forest shadow-sm",
                  "transition hover:border-lagoon/40 hover:bg-lagoon/10 hover:shadow",
                )}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </PackagesSectionShell>
  );
}
