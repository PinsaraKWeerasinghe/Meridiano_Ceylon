"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { packageGalleryJpegOnly } from "@/lib/package-gallery-images";
import { cn } from "@/lib/utils";

type TourGallerySlideshowProps = {
  srcs: readonly string[];
  intervalMs?: number;
  className?: string;
  /** `aspect`: fixed 4:3 block (packages). `fill`: stretch to cover a positioned parent (e.g. tour cards). */
  fit?: "aspect" | "fill";
  /** Applied to each slide image (e.g. brightness for glass cards). */
  imageClassName?: string;
};

export function TourGallerySlideshow({
  srcs,
  intervalMs = 4500,
  className,
  fit = "aspect",
  imageClassName,
}: TourGallerySlideshowProps) {
  const slides = useMemo(() => packageGalleryJpegOnly(srcs), [srcs]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [slides.length, intervalMs]);

  useEffect(() => {
    setIndex((i) => (slides.length === 0 ? 0 : i % slides.length));
  }, [slides]);

  if (slides.length === 0) return null;

  const currentSrc = slides[index];

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-stone-200",
        fit === "aspect" && "aspect-[4/3] w-full rounded-xl",
        fit === "fill" &&
          "absolute inset-0 h-full min-h-full w-full rounded-none",
        className,
      )}
    >
      <Image
        key={currentSrc}
        src={currentSrc}
        alt=""
        fill
        loading={index === 0 ? "eager" : "lazy"}
        className={cn("object-cover", imageClassName)}
        sizes="(min-width: 1024px) 45vw, 100vw"
      />
    </div>
  );
}
