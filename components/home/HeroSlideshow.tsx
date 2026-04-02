"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type Slide = { src: string; alt: string };

type HeroSlideshowProps = {
  slides: readonly Slide[];
  intervalMs?: number;
};

export function HeroSlideshow({
  slides,
  intervalMs = 6500,
}: HeroSlideshowProps) {
  const [index, setIndex] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    const onChange = () => setReduceMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (reduceMotion || slides.length <= 1) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [slides.length, intervalMs, reduceMotion]);

  if (slides.length === 0) return null;

  const first = slides[0];

  if (reduceMotion) {
    return (
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute inset-0 bg-forest" />
        <div className="absolute inset-0">
          <Image
            src={first.src}
            alt=""
            fill
            className="object-cover object-top"
            sizes="100vw"
            priority
            quality={85}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden>
      <div className="absolute inset-0 bg-gradient-to-b from-forest to-[#142e29]" />
      {slides.map((slide, i) => (
        <div
          key={slide.src}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            i === index ? "z-[1] opacity-100" : "z-0 opacity-0"
          }`}
        >
          <Image
            src={slide.src}
            alt=""
            fill
            className="object-cover object-top"
            sizes="100vw"
            priority={i === 0}
            quality={85}
          />
        </div>
      ))}
    </div>
  );
}
