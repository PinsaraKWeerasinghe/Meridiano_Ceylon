import type { TourItem } from "@/data/tours";
import { fixedPackageGalleryById } from "@/data/tour-galleries";
import { Card } from "@/components/ui/Card";
import { TourGallerySlideshow } from "@/components/tours/TourGallerySlideshow";

type FixedPackagePanelProps = {
  tour: TourItem;
  /** Even index (0,2,4…): text left, images right. Odd index: images left, text right. */
  index: number;
};

export function FixedPackagePanel({ tour, index }: FixedPackagePanelProps) {
  const srcs = fixedPackageGalleryById[tour.id] ?? [];

  return (
    <div
      className={
        index % 2 === 1
          ? "flex w-full flex-row-reverse items-stretch gap-3 sm:gap-6 md:gap-10"
          : "flex w-full flex-row items-stretch gap-3 sm:gap-6 md:gap-10"
      }
    >
      <Card className="flex min-w-0 flex-1 basis-0 flex-col justify-center transition hover:shadow-md">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-serif text-xl font-semibold text-forest">
            {tour.title}
          </h3>
          <span className="shrink-0 rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-stone-600">
            {tour.duration}
          </span>
        </div>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-stone-600">
          {tour.description}
        </p>
      </Card>
      <div className="min-w-0 flex-1 basis-0">
        {srcs.length > 0 ? (
          <TourGallerySlideshow srcs={srcs} />
        ) : (
          <div className="flex aspect-[4/3] items-center justify-center rounded-xl bg-stone-100 text-sm text-stone-400">
            Gallery coming soon
          </div>
        )}
      </div>
    </div>
  );
}
