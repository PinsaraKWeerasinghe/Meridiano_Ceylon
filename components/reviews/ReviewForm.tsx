"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuthUser } from "@/components/auth/useAuthUser";
import { Card } from "@/components/ui/Card";
import { StarRatingInput } from "@/components/ui/StarRatingInput";
import { reviewTourOptions } from "@/data/tours";
import { packagesGreenCard } from "@/lib/packages-section-theme";
import { fetchUserProfile } from "@/lib/user-profile";
import { SITE_REVIEW_STORY_MAX, submitSiteReview } from "@/lib/site-reviews";
import { cn } from "@/lib/utils";

function buildFullName(
  profile: { firstName: string; lastName: string } | null,
  displayName: string | null | undefined,
): string {
  if (profile) {
    const fromProfile = [profile.firstName, profile.lastName]
      .filter((s) => s.trim())
      .join(" ")
      .trim();
    if (fromProfile) return fromProfile;
  }
  return displayName?.trim() ?? "";
}

export function ReviewForm() {
  const { user, ready: authReady } = useAuthUser();
  const [fullName, setFullName] = useState("");
  const [profileLoading, setProfileLoading] = useState(true);
  const [tourType, setTourType] = useState(reviewTourOptions[0] ?? "");
  const [story, setStory] = useState("");
  const [driver, setDriver] = useState(0);
  const [vehicle, setVehicle] = useState(0);
  const [safety, setSafety] = useState(0);
  const [overall, setOverall] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!authReady || !user?.uid) {
      setProfileLoading(false);
      return;
    }
    let cancelled = false;
    void (async () => {
      try {
        const doc = await fetchUserProfile(user.uid);
        if (cancelled) return;
        const name = buildFullName(doc, user.displayName);
        setFullName((prev) => (prev.trim() === "" ? name : prev));
      } catch {
        if (!cancelled) setFullName((prev) => (prev.trim() === "" ? (user.displayName ?? "") : prev));
      } finally {
        if (!cancelled) setProfileLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [authReady, user?.uid, user?.displayName]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    if (!user?.uid) return;
    const name = fullName.trim();
    if (!name) {
      setFormError("We need your name from your profile. Update your profile and try again.");
      return;
    }
    if (!overall || !driver || !vehicle || !safety) {
      setFormError("Please tap a star rating in each category.");
      return;
    }
    const body = story.trim();
    if (body.length > SITE_REVIEW_STORY_MAX) {
      setFormError(`Your review must be ${SITE_REVIEW_STORY_MAX} characters or less.`);
      return;
    }
    if (body.length === 0) {
      setFormError("Please write a few words for your review.");
      return;
    }

    setSubmitting(true);
    try {
      await submitSiteReview({
        authorUid: user.uid,
        authorName: name,
        authorPhotoUrl: user.photoURL?.trim() ?? null,
        tourType,
        story: body,
        ratingOverall: overall,
        ratingDriver: driver,
        ratingVehicle: vehicle,
        ratingSafety: safety,
      });
      setSubmitted(true);
    } catch (err) {
      setFormError(
        err instanceof Error ? err.message : "Could not submit your review. Try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (!authReady) {
    return (
      <Card className={cn("text-center text-sm text-stone-600", packagesGreenCard)}>
        Loading…
      </Card>
    );
  }

  if (!user) {
    return (
      <Card className={cn("text-center", packagesGreenCard)}>
        <p className="font-serif text-lg font-semibold text-forest">
          Sign in to leave a review
        </p>
        <p className="mt-2 text-sm text-stone-700">
          Reviews are tied to your account so we can show your name fairly on the site.
        </p>
        <Link
          href="/login?next=/reviews"
          className="mt-6 inline-flex rounded-full bg-forest px-6 py-3 text-sm font-semibold text-cream transition hover:bg-forest-hover"
        >
          Sign in
        </Link>
      </Card>
    );
  }

  if (submitted) {
    return (
      <Card className={cn("text-center", packagesGreenCard)}>
        <p className="font-serif text-xl font-semibold text-forest">
          Thank you, {fullName.trim()}!
        </p>
        <p className="mt-2 text-sm text-stone-700">
          Your review has been saved and will appear in our guest reviews on the home page.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block text-sm font-semibold text-lagoon underline-offset-2 hover:underline"
        >
          Back to home
        </Link>
      </Card>
    );
  }

  if (user && profileLoading) {
    return (
      <Card className={cn("text-center text-sm text-stone-600", packagesGreenCard)}>
        Loading your profile…
      </Card>
    );
  }

  if (!profileLoading && !fullName.trim()) {
    return (
      <Card className={cn("text-center", packagesGreenCard)}>
        <p className="font-serif text-lg font-semibold text-forest">
          Add your name in Profile first
        </p>
        <p className="mt-2 text-sm text-stone-700">
          We use your first and last name from your account for this review.
        </p>
        <Link
          href="/profile"
          className="mt-6 inline-flex rounded-full bg-forest px-6 py-3 text-sm font-semibold text-cream transition hover:bg-forest-hover"
        >
          Open profile
        </Link>
      </Card>
    );
  }

  return (
    <Card className={packagesGreenCard}>
      <form onSubmit={(e) => void handleSubmit(e)} className="space-y-8">
        <div>
          <label htmlFor="review-name" className="text-sm font-medium text-forest">
            Your name
          </label>
          <p className="mt-1 text-xs text-stone-500">
            From your account profile ({profileLoading ? "loading…" : "update in Profile if needed"}).
          </p>
          <input
            id="review-name"
            readOnly
            value={fullName}
            className="mt-1 w-full cursor-not-allowed rounded-xl border border-stone-200 bg-stone-100 px-3 py-2.5 text-stone-900 outline-none"
          />
        </div>

        <div>
          <label htmlFor="review-tour" className="text-sm font-medium text-forest">
            Tour type
          </label>
          <select
            id="review-tour"
            value={tourType}
            onChange={(e) => setTourType(e.target.value)}
            className="mt-1 w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-stone-900 outline-none ring-lagoon/25 focus:ring-2"
          >
            {reviewTourOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="review-story" className="text-sm font-medium text-forest">
            Write your review
          </label>
          <textarea
            id="review-story"
            rows={5}
            value={story}
            onChange={(e) => setStory(e.target.value)}
            placeholder="What was the highlight of your journey?"
            maxLength={SITE_REVIEW_STORY_MAX}
            className="mt-1 w-full resize-y rounded-xl border border-stone-200 bg-stone-50/50 px-3 py-2.5 text-stone-900 outline-none ring-lagoon/25 focus:ring-2"
          />
          <p className="mt-1 text-xs text-stone-500">
            {story.length}/{SITE_REVIEW_STORY_MAX} characters
          </p>
        </div>

        <fieldset className="space-y-6 border-0 p-0">
          <legend className="text-sm font-semibold text-forest">Ratings</legend>
          <StarRatingInput
            id="driver"
            label="Driver & guide"
            value={driver}
            onChange={setDriver}
          />
          <StarRatingInput
            id="vehicle"
            label="Vehicle quality"
            value={vehicle}
            onChange={setVehicle}
          />
          <StarRatingInput
            id="safety"
            label="Safety"
            value={safety}
            onChange={setSafety}
          />
          <StarRatingInput
            id="overall"
            label="Overall experience"
            value={overall}
            onChange={setOverall}
          />
        </fieldset>

        {formError ? (
          <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-900">
            {formError}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={submitting}
          className={cn(
            "w-full rounded-full bg-forest py-3.5 text-sm font-semibold text-cream transition hover:bg-forest-hover",
            submitting && "opacity-60",
          )}
        >
          {submitting ? "Submitting…" : "Submit review"}
        </button>
      </form>
    </Card>
  );
}
