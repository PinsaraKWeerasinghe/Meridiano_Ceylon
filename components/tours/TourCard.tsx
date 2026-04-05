import Image from "next/image";
import type { TourItem } from "@/data/tours";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

interface TourCardProps {
  tour: TourItem;
  className?: string;
  /** White text on glass / dark sections (e.g. home add-ons marquee). */
  variant?: "default" | "onDark";
  /** Fills the card behind text (gradient overlay for readability). */
  coverImageSrc?: string;
}

export function TourCard({
  tour,
  className,
  variant = "default",
  coverImageSrc,
}: TourCardProps) {
  const onDark = variant === "onDark";
  const withCover = Boolean(coverImageSrc);
  const lightText = onDark || withCover;

  const body = (
    <>
      <div className="flex items-start justify-between gap-2">
        <h3
          className={cn(
            "font-serif text-xl font-semibold",
            lightText ? "text-white" : "text-forest",
          )}
        >
          {tour.title}
        </h3>
        {tour.duration ? (
          <span
            className={cn(
              "shrink-0 rounded-full px-3 py-1 text-xs font-medium",
              lightText
                ? "bg-white/15 text-white"
                : "bg-stone-100 text-stone-600",
            )}
          >
            {tour.duration}
          </span>
        ) : null}
      </div>
      <p
        className={cn(
          "mt-3 flex-1 text-sm leading-relaxed",
          lightText ? "text-stone-200" : "text-stone-600",
        )}
      >
        {tour.description}
      </p>
      {tour.highlights && tour.highlights.length > 0 ? (
        <ul
          className={cn(
            "mt-4 space-y-1 text-sm",
            lightText ? "text-stone-100" : "text-stone-700",
          )}
        >
          {tour.highlights.map((h) => (
            <li key={h} className="flex gap-2">
              <span
                className={lightText ? "text-goldMint" : "text-gold"}
                aria-hidden
              >
                ·
              </span>
              <span>{h}</span>
            </li>
          ))}
        </ul>
      ) : null}
      {tour.note ? (
        <p
          className={cn(
            "mt-4 rounded-lg px-3 py-2 text-xs",
            lightText
              ? "border border-amber-200/25 bg-amber-950/40 text-amber-100"
              : "bg-amber-50/80 text-amber-900/90",
          )}
        >
          {tour.note}
        </p>
      ) : null}
    </>
  );

  if (withCover && coverImageSrc) {
    return (
      <Card
        className={cn(
          "group relative flex min-h-[19rem] flex-col overflow-hidden border-white/15 p-0 shadow-xl shadow-black/30 transition hover:shadow-2xl",
          className,
        )}
      >
        <Image
          src={coverImageSrc}
          alt=""
          fill
          className="object-cover brightness-[0.62] contrast-[1.02] transition duration-500 group-hover:scale-105 group-hover:brightness-[0.68]"
          sizes="(max-width: 640px) 90vw, 280px"
        />
        <div
          className="absolute inset-0 bg-black/28"
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/88 via-black/58 to-black/32"
          aria-hidden
        />
        <div className="relative z-10 flex min-h-[19rem] flex-col justify-end gap-3 p-5">
          {body}
        </div>
      </Card>
    );
  }

  return (
    <Card
      className={cn(
        "flex h-full flex-col transition hover:shadow-md",
        onDark &&
          "border-white/20 bg-black/35 text-cream shadow-lg shadow-black/30 backdrop-blur-md",
        className,
      )}
    >
      {body}
    </Card>
  );
}
