import type { Metadata } from "next";
import { Card } from "@/components/ui/Card";
import { packagesGreenCard } from "@/lib/packages-section-theme";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Terms & Conditions",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-lagoon/10 px-4 py-12 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-serif text-4xl font-semibold text-forest">
          Terms &amp; Conditions
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-stone-700">
          Plain-language summary of how booking, payments, cancellations, and
          on-tour responsibilities work.
        </p>

        <div className="mt-8 space-y-8 text-sm leading-relaxed text-stone-700">
          <Card className={cn("space-y-3", packagesGreenCard)}>
            <h2 className="font-serif text-lg font-semibold text-forest">
              1. Booking &amp; security deposit
            </h2>
            <ul className="list-inside list-disc space-y-2">
              <li>
                Confirming your trip: to lock in your driver and vehicle, we
                require a debit or credit card on file.
              </li>
              <li>
                Security hold: a small security deposit may be held on your
                card to protect the custom itinerary we create for you.
              </li>
              <li>
                Final payment: you can settle the remaining balance at the end
                of your journey unless otherwise agreed in writing.
              </li>
            </ul>
          </Card>

          <Card className={cn("space-y-3", packagesGreenCard)}>
            <h2 className="font-serif text-lg font-semibold text-forest">
              2. Cancellation &amp; refunds
            </h2>
            <ul className="list-inside list-disc space-y-2">
              <li>
                Free cancellation: available if you cancel before the free
                cancellation window stated on your confirmation (for example,
                7 days before start).
              </li>
              <li>
                Late cancellation: fees may apply after the free window to
                cover locked logistics.
              </li>
              <li>
                Ending a tour early: if you stop the tour before completion, a
                percentage of the total price may be charged to cover costs.
              </li>
              <li>
                Emergencies: for genuine accidents or reasonable errors, the
                owner will review your case fairly and may offer a partial or
                full refund where appropriate.
              </li>
            </ul>
          </Card>

          <Card className={cn("space-y-3", packagesGreenCard)}>
            <h2 className="font-serif text-lg font-semibold text-forest">
              3. Care Promise (medical &amp; safety)
            </h2>
            <ul className="list-inside list-disc space-y-2">
              <li>24/7 help for medical emergencies.</li>
              <li>
                Free transport to hospital and back to your hotel when urgently
                required.
              </li>
              <li>
                At government hospitals we provide translation and support at
                no extra charge.
              </li>
              <li>
                At private hospitals, you or your insurer are responsible for
                medical bills.
              </li>
            </ul>
          </Card>

          <Card className={cn("space-y-3", packagesGreenCard)}>
            <h2 className="font-serif text-lg font-semibold text-forest">
              4. Vehicle &amp; driver rules
            </h2>
            <ul className="list-inside list-disc space-y-2">
              <li>
                Every tour includes a clean, safe, standard vehicle unless you
                select an upgrade.
              </li>
              <li>
                Luxury or budget vehicle choices affect pricing — quotes will
                reflect your selection.
              </li>
              <li>
                Self-drive (car or scooter): you are responsible for damage to
                the rental vehicle per the rental agreement.
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
