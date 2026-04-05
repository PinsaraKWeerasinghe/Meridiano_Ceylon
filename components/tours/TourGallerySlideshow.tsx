"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type TourGallerySlideshowProps = {
  srcs: readonly string[];
  intervalMs?: number;
  className?: string;
};

export function TourGallerySlideshow({
  srcs,
  intervalMs = 4500,
  className,
}: TourGallerySlideshowProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (srcs.length <= 1) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % srcs.length);
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [srcs.length, intervalMs]);

  if (srcs.length === 0) return null;

  return (
    <div
      className={cn(
        "relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-stone-200",
        className,
      )}
    >
      {srcs.map((src, i) => (
        <div
          key={src}
          className={cn(
            "absolute inset-0 transition-opacity duration-700 ease-in-out",
            i === index ? "z-[1] opacity-100" : "z-0 opacity-0",
          )}
        >
          <Image
            src={src}
            alt=""
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 45vw, 100vw"
          />
        </div>
      ))}
    </div>
  );
}
