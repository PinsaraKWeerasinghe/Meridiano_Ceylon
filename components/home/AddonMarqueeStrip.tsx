"use client";

import { useEffect, useState } from "react";
import type { TourItem } from "@/data/tours";
import { fixedPackageGalleryById } from "@/data/tour-galleries";
import { TourCard } from "@/components/tours/TourCard";
import { cn } from "@/lib/utils";

type AddonMarqueeStripProps = {
  tours: TourItem[];
  cardClassName?: string;
  cardVariant?: "default" | "onDark";
  /** Edge-to-edge marquee (e.g. home add-ons). */
  fullWidth?: boolean;
};

export function AddonMarqueeStrip({
  tours,
  cardClassName,
  cardVariant = "default",
  fullWidth = false,
}: AddonMarqueeStripProps) {
  const [paused, setPaused] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    const onChange = () => setReduceMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  if (tours.length === 0) return null;

  const cardShell = fullWidth
    ? "w-[min(20rem,calc(100vw-2rem))]"
    : "w-[min(17.5rem,calc(100vw-3rem))]";

  if (reduceMotion) {
    return (
      <div
        className={cn(
          "flex flex-wrap justify-center gap-6",
          fullWidth && "px-4 sm:px-6",
        )}
      >
        {tours.map((tour) => (
          <div
            key={tour.id}
            className={cn(
              "max-w-sm shrink-0",
              fullWidth
                ? "w-[min(19rem,calc(100vw-2rem))] sm:w-[min(20rem,28vw)]"
                : "w-full sm:w-[min(20rem,calc(100vw-2rem))]",
            )}
          >
            <TourCard
              tour={tour}
              variant={cardVariant}
              className={cardClassName}
              coverImageSrc={fixedPackageGalleryById[tour.id]?.[0]}
            />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative overflow-hidden py-8",
        fullWidth && "w-full",
      )}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      role="region"
      aria-label="Add-on tours, auto-scrolling. Hover to pause."
    >
      <div
        className={cn(
          "flex w-max gap-6 will-change-transform",
          "animate-addon-marquee",
          fullWidth && "pl-4 sm:pl-6",
        )}
        style={{
          animationPlayState: paused ? "paused" : "running",
        }}
      >
        {[0, 1].map((loop) =>
          tours.map((tour) => (
            <div
              key={`${loop}-${tour.id}`}
              className={cn(
                "shrink-0 origin-center",
                cardShell,
                "transition-[transform,box-shadow] duration-300 ease-out",
                "hover:z-20 hover:scale-[1.07] hover:shadow-xl",
              )}
            >
              <TourCard
                tour={tour}
                variant={cardVariant}
                className={cn("h-full", cardClassName)}
                coverImageSrc={fixedPackageGalleryById[tour.id]?.[0]}
              />
            </div>
          )),
        )}
      </div>
    </div>
  );
}
