import type { Metadata } from "next";
import { Card } from "@/components/ui/Card";

export const metadata: Metadata = {
  title: "Meridiano Care Promise",
};

export default function CarePage() {
  return (
    <div className="bg-cream px-4 py-12 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-serif text-4xl font-semibold text-forest">
          Meridiano Care Promise
        </h1>
        <p className="mt-3 text-sm text-stone-600">
          Medical and safety support designed for real journeys — not fine
          print on a generic policy.
        </p>

        <div className="mt-8 space-y-6">
          <Card>
            <h2 className="font-serif text-lg font-semibold text-forest">
              24/7 support
            </h2>
            <p className="mt-2 text-sm text-stone-700">
              Assistance with any medical emergency, whenever you need us on
              the road.
            </p>
          </Card>
          <Card>
            <h2 className="font-serif text-lg font-semibold text-forest">
              Free transport
            </h2>
            <p className="mt-2 text-sm text-stone-700">
              Complimentary rides to any hospital and back to your hotel when
              you need urgent care.
            </p>
          </Card>
          <Card>
            <h2 className="font-serif text-lg font-semibold text-forest">
              Hospitalization
            </h2>
            <ul className="mt-3 list-inside list-disc space-y-2 text-sm text-stone-700">
              <li>
                <strong className="text-forest">Government hospitals</strong> —
                A Meridiano staff member provides translation and logistical
                support until you recover.
              </li>
              <li>
                <strong className="text-forest">Private hospitals</strong> —
                Immediate transport is arranged; medical bills are paid by the
                guest or their insurance.
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
