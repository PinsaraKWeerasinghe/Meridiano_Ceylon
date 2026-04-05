import Link from "next/link";
import type { TourItem } from "@/data/tours";
import { fixedPackageGalleryById } from "@/data/tour-galleries";
import { ImageColumnReveal } from "@/components/home/ImageColumnReveal";
import { Card } from "@/components/ui/Card";
import { TourGallerySlideshow } from "@/components/tours/TourGallerySlideshow";
import { cn } from "@/lib/utils";

type FixedPackagePanelProps = {
  tour: TourItem;
  /** Even index (0,2,4…): text left, images right. Odd index: images left, text right. */
  index: number;
  /** Optional card styles (e.g. packages page green theme). */
  cardClassName?: string;
  /** Optional empty-gallery placeholder styles. */
  placeholderClassName?: string;
  /** Optional slideshow frame (replaces default gray behind images). */
  slideshowClassName?: string;
  /** Home: scroll-in animation on the photo column (first time in view). */
  scrollRevealImages?: boolean;
  /** Vertically center title & copy in the card (e.g. `/packages`). */
  verticallyCenterCardContent?: boolean;
  /** When the text card sits on the left, align copy to the right (toward images); when on the right, align left. */
  alignTextTowardImages?: boolean;
};

export function FixedPackagePanel({
  tour,
  index,
  cardClassName,
  placeholderClassName,
  slideshowClassName,
  scrollRevealImages = false,
  verticallyCenterCardContent = false,
  alignTextTowardImages = false,
}: FixedPackagePanelProps) {
  const srcs = fixedPackageGalleryById[tour.id] ?? [];
  const href = tour.detailPath;
  /** Even index: card column is on the left; odd: card on the right. */
  const cardOnLeft = index % 2 === 0;
  const inwardAlignClass =
    alignTextTowardImages && cardOnLeft
      ? "text-right"
      : alignTextTowardImages
        ? "text-left"
        : "";

  const imageColumn = (
    <>
      {srcs.length > 0 ? (
        <TourGallerySlideshow srcs={srcs} className={slideshowClassName} />
      ) : (
        <div
          className={cn(
            "flex aspect-[4/3] items-center justify-center rounded-xl bg-stone-100 text-sm text-stone-400",
            placeholderClassName,
          )}
        >
          Gallery coming soon
        </div>
      )}
    </>
  );

  const mainBlock = (
    <>
      <div
        className={cn(
          "flex flex-wrap items-start gap-2",
          alignTextTowardImages && cardOnLeft && "justify-end",
        )}
      >
        <h3 className="font-serif text-xl font-semibold text-forest">
          {tour.title}
        </h3>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-stone-600">
        {tour.description}
      </p>
      {tour.duration ? (
        <div
          className={cn(
            "mt-2",
            alignTextTowardImages && cardOnLeft && "flex justify-end",
          )}
        >
          <span className="inline-flex shrink-0 rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-stone-600">
            {tour.duration}
          </span>
        </div>
      ) : null}
      {tour.highlights && tour.highlights.length > 0 ? (
        <ul className="mt-4 space-y-1 text-sm text-stone-700">
          {tour.highlights.map((h) => (
            <li
              key={h}
              className={cn(
                "flex gap-2",
                alignTextTowardImages && cardOnLeft && "justify-end",
              )}
            >
              {alignTextTowardImages && cardOnLeft ? (
                <>
                  <span>{h}</span>
                  <span className="text-lagoon" aria-hidden>
                    ·
                  </span>
                </>
              ) : (
                <>
                  <span className="text-lagoon" aria-hidden>
                    ·
                  </span>
                  <span>{h}</span>
                </>
              )}
            </li>
          ))}
        </ul>
      ) : null}
      {tour.note ? (
        <p className="mt-4 rounded-lg bg-amber-50/90 px-3 py-2 text-xs text-amber-900/90">
          {tour.note}
        </p>
      ) : null}
    </>
  );

  const cardInner = verticallyCenterCardContent ? (
    <div
      className={cn(
        "flex min-h-0 flex-1 flex-col justify-center",
        inwardAlignClass,
      )}
    >
      {mainBlock}
    </div>
  ) : (
    mainBlock
  );

  const rowClassName = cn(
    "flex w-full items-stretch gap-3 sm:gap-6 md:gap-10",
    index % 2 === 1 ? "flex-row-reverse" : "flex-row",
    href &&
      "group rounded-xl outline-offset-4 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lagoon/50 focus-visible:ring-offset-2",
  );

  const body = (
    <>
      <Card
        className={cn(
          "flex min-h-0 min-w-0 flex-1 basis-0 flex-col transition",
          verticallyCenterCardContent
            ? "justify-start"
            : href
              ? "justify-start"
              : "justify-center",
          href ? "group-hover:shadow-md" : "hover:shadow-md",
          !verticallyCenterCardContent && inwardAlignClass,
          cardClassName,
        )}
      >
        {cardInner}
      </Card>
      {scrollRevealImages ? (
        <ImageColumnReveal index={index}>{imageColumn}</ImageColumnReveal>
      ) : (
        <div className="min-w-0 flex-1 basis-0">{imageColumn}</div>
      )}
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className={rowClassName}
        aria-label={`View itinerary: ${tour.title}`}
      >
        {body}
      </Link>
    );
  }

  return <div className={rowClassName}>{body}</div>;
}
