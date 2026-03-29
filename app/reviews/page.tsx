import type { Metadata } from "next";
import { ReviewForm } from "@/components/reviews/ReviewForm";

export const metadata: Metadata = {
  title: "Reviews & experiences",
};

export default function ReviewsPage() {
  return (
    <div className="bg-cream px-4 py-12 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-xl">
        <h1 className="font-serif text-4xl font-semibold text-forest">
          Reviews &amp; experiences
        </h1>
        <p className="mt-3 text-sm text-stone-600">
          Share how your journey felt — overall, with your driver, in the
          vehicle, and on the road. Your story helps fellow travellers trust
          the Meridiano way.
        </p>
        <div className="mt-10">
          <ReviewForm />
        </div>
      </div>
    </div>
  );
}
