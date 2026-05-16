"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import Link from "next/link";
import {
  listPublishedSiteReviews,
  type SiteReviewWithId,
} from "@/lib/site-reviews";
import { cn } from "@/lib/utils";

const MAX_HOME_REVIEWS = 12;

function displayNameInitials(name: string) {
  const p = name.trim().split(/\s+/).filter(Boolean);
  if (p.length >= 2) {
    return (
      (p[0]!.charAt(0) + p[1]!.charAt(0)).toUpperCase()
    );
  }
  if (p.length === 1 && p[0]!.length >= 2) {
    return p[0]!.slice(0, 2).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase() || "?";
}

function StarRow({ value }: { value: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={cn(
            "h-4 w-4 shrink-0",
            i <= value ? "fill-gold text-gold" : "fill-stone-200 text-stone-300",
          )}
          strokeWidth={1.5}
        />
      ))}
    </div>
  );
}

export function SiteReviewsPanel() {
  const [reviews, setReviews] = useState<SiteReviewWithId[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const list = await listPublishedSiteReviews(MAX_HOME_REVIEWS);
        if (!cancelled) setReviews(list);
      } catch {
        if (!cancelled) setError("Could not load guest reviews.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="rounded-2xl border border-lagoon/20 bg-white/60 px-5 py-8 text-center text-sm text-stone-600">
        Loading guest reviews…
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50/80 px-5 py-4 text-sm text-amber-900">
        {error}
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-lagoon/30 bg-lagoon/5 px-5 py-8 text-center text-sm text-stone-600">
        <p>Be the first to leave a review after your journey.</p>
        <Link
          href="/reviews"
          className="mt-3 inline-block font-semibold text-lagoon underline-offset-2 hover:underline"
        >
          Reviews &amp; experiences
        </Link>
      </div>
    );
  }

  return (
    <div className="flex gap-4 overflow-x-auto pb-2 pt-1 [scrollbar-width:thin] md:gap-6">
      {reviews.map((r) => (
        <article
          key={r.id}
          className="min-w-[min(100%,20rem)] max-w-[20rem] flex-shrink-0 rounded-2xl border border-lagoon/20 bg-white/90 p-5 shadow-sm shadow-lagoon/10"
        >
          <div className="flex items-start gap-3">
            {r.authorPhotoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element -- external OAuth URLs
              <img
                src={r.authorPhotoUrl}
                alt=""
                className="h-12 w-12 shrink-0 rounded-full border border-lagoon/20 bg-stone-100 object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-lagoon/25 bg-lagoon/15 font-mono text-sm font-semibold text-forest"
                aria-hidden
              >
                {displayNameInitials(r.authorName)}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold text-forest">{r.authorName}</p>
              <p className="mt-0.5 text-xs text-stone-500">{r.tourType}</p>
              <div className="mt-2">
                <StarRow value={Math.round(r.ratingOverall)} />
              </div>
            </div>
          </div>
          <p className="mt-4 line-clamp-6 text-sm leading-relaxed text-stone-700">
            {r.story}
          </p>
        </article>
      ))}
    </div>
  );
}
