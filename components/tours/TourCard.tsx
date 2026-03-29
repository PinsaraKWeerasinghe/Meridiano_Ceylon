import type { TourItem } from "@/data/tours";
import { Card } from "@/components/ui/Card";

interface TourCardProps {
  tour: TourItem;
}

export function TourCard({ tour }: TourCardProps) {
  return (
    <Card className="flex h-full flex-col transition hover:shadow-md">
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
      {tour.highlights && tour.highlights.length > 0 ? (
        <ul className="mt-4 space-y-1 text-sm text-stone-700">
          {tour.highlights.map((h) => (
            <li key={h} className="flex gap-2">
              <span className="text-gold" aria-hidden>
                ·
              </span>
              <span>{h}</span>
            </li>
          ))}
        </ul>
      ) : null}
      {tour.note ? (
        <p className="mt-4 rounded-lg bg-amber-50/80 px-3 py-2 text-xs text-amber-900/90">
          {tour.note}
        </p>
      ) : null}
    </Card>
  );
}
