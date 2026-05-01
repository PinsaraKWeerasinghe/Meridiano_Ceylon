"use client";

import type { HeroSlide } from "@/data/hero-slides";
import Image from "next/image";
import { useEffect, useState } from "react";

/** Matches main nav bar (`Navbar` FlowbiteNavbar `bg-[#e0ebe7]`). */
const LOGO_SLIDE_BG = "bg-[#e0ebe7]";

type HeroSlideshowProps = {
  slides: readonly HeroSlide[];
  intervalMs?: number;
  onActiveIndexChange?: (index: number, slide: HeroSlide) => void;
};

export function HeroSlideshow({
  slides,
  intervalMs = 6500,
  onActiveIndexChange,
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
    const slide = slides[index];
    if (slide && onActiveIndexChange) {
      onActiveIndexChange(index, slide);
    }
  }, [index, slides, onActiveIndexChange]);

  useEffect(() => {
    if (reduceMotion || slides.length <= 1) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [slides.length, intervalMs, reduceMotion]);

  if (slides.length === 0) return null;

  const first = slides[0];

  function imageClasses(slide: HeroSlide): string {
    const base = "h-full w-full ";
    return slide.fit === "logo"
      ? `${base} object-contain object-center px-10 py-16 sm:px-16 sm:py-24`
      : `${base} object-cover object-center`;
  }

  if (reduceMotion) {
    return (
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute inset-0 bg-neutral-900" />
        <div
          className={`absolute inset-0 ${first.fit === "logo" ? LOGO_SLIDE_BG : ""}`}
        >
          <Image
            src={first.src}
            alt=""
            fill
            className={imageClasses(first)}
            sizes="100vw"
            priority
            quality={first.fit === "logo" ? 95 : 85}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden>
      <div className="absolute inset-0 bg-neutral-900" aria-hidden />
      {slides.map((slide, i) => (
        <div
          key={slide.src}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            i === index ? "z-[1] opacity-100" : "z-0 opacity-0"
          } ${slide.fit === "logo" ? LOGO_SLIDE_BG : ""}`}
        >
          <Image
            src={slide.src}
            alt=""
            fill
            className={imageClasses(slide)}
            sizes="100vw"
            priority={i === 0}
            quality={slide.fit === "logo" ? 95 : 85}
          />
        </div>
      ))}
    </div>
  );
}
