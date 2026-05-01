"use client";

import Link from "next/link";
import type { HeroSlide } from "@/data/hero-slides";
import { heroSlides } from "@/data/hero-slides";
import { HeroSlideshow } from "@/components/home/HeroSlideshow";
import { useCallback, useState } from "react";

export function Hero() {
  const [overlayVisible, setOverlayVisible] = useState(
    !heroSlides[0]?.hideOverlay,
  );

  const onActiveSlide = useCallback((_: number, slide: HeroSlide) => {
    setOverlayVisible(!slide.hideOverlay);
  }, []);

  return (
    <section className="relative flex min-h-[calc(100svh-var(--maintenance-strip-h,0px)-var(--navbar-h))] min-h-[calc(100dvh-var(--maintenance-strip-h,0px)-var(--navbar-h))] w-full flex-col overflow-hidden bg-forest text-cream">
      <div className="relative min-h-0 flex-1 overflow-hidden">
        <div className="absolute inset-0">
          <HeroSlideshow
            slides={heroSlides}
            intervalMs={6500}
            onActiveIndexChange={onActiveSlide}
          />
          <div
            className={`absolute inset-0 z-[2] bg-gradient-to-b from-black/45 via-black/38 to-black/50 transition-opacity duration-500 ${
              overlayVisible ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
            aria-hidden={!overlayVisible}
          />
        </div>
        <div
          className={`absolute inset-0 z-10 mx-auto flex max-w-3xl flex-col justify-center px-4 pb-16 pt-8 text-center transition-opacity duration-500 sm:px-6 sm:pb-24 sm:pt-12 ${
            overlayVisible ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
          aria-hidden={!overlayVisible}
        >
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-goldMint">
              Luxury Sri Lanka Tours
            </p>
            <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-stone-300">
              Tailor-made journeys across hill country, safari, coast, and culture
              — crafted with local expertise and uncompromising care.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href="#build-your-journey"
                className="inline-flex min-w-[200px] items-center justify-center rounded-full bg-gold px-8 py-3 text-sm font-semibold text-cream transition hover:bg-[#1d5349]"
              >
                Build your journey
              </a>
              <Link
                href="/packages"
                className="inline-flex min-w-[200px] items-center justify-center rounded-full border border-stone-400/60 px-8 py-3 text-sm font-semibold text-cream transition hover:border-cream hover:bg-white/5"
              >
                View packages
              </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
