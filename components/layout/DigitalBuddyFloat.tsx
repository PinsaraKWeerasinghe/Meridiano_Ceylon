"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/** `public/BackPackersImage/...` → `/BackPackersImage/...` */
export const BACKPACKER_BUTTON_IMAGE =
  "/BackPackersImage/traveler-backpacker-girl-with-suitcase-running-happily-3d-icon-png-download-14043606.webp";

const HOME_HERO_ID = "home-hero";

/** Entry to Backpacker Support — home hero only; all motion from/on the left; replay enter when hero is visible again. */
export function DigitalBuddyFloat() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  const [heroInView, setHeroInView] = useState(isHome);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [playIntroAnim, setPlayIntroAnim] = useState(false);
  const prevHeroRef = useRef<boolean | null>(null);

  useEffect(() => {
    if (isHome) setHeroInView(true);
    else setHeroInView(false);
  }, [isHome]);

  useLayoutEffect(() => {
    const rm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReduceMotion(rm);
    if (!isHome) {
      setPlayIntroAnim(false);
      prevHeroRef.current = null;
      return;
    }
    setPlayIntroAnim(!rm);
  }, [isHome]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onPrefChange = () => {
      const rm = mq.matches;
      setReduceMotion(rm);
      if (rm) setPlayIntroAnim(false);
    };
    mq.addEventListener("change", onPrefChange);
    return () => mq.removeEventListener("change", onPrefChange);
  }, []);

  /** When hero leaves viewport, clear intro flag after layout so exiting transform can tween (keyframes removed next frame). */
  useEffect(() => {
    if (!isHome || heroInView) return;
    let cancelled = false;
    let inner = 0;
    const outer = window.requestAnimationFrame(() => {
      inner = window.requestAnimationFrame(() => {
        if (!cancelled) setPlayIntroAnim(false);
      });
    });
    return () => {
      cancelled = true;
      window.cancelAnimationFrame(outer);
      window.cancelAnimationFrame(inner);
    };
  }, [isHome, heroInView]);

  /** Re-enter hero after scroll-away: replay entrance from the left (unless reduced motion). */
  useEffect(() => {
    if (!isHome) return;
    const wasAway = prevHeroRef.current === false;
    prevHeroRef.current = heroInView;
    if (wasAway && heroInView && !reduceMotion) {
      setPlayIntroAnim(true);
    }
  }, [isHome, heroInView, reduceMotion]);

  /** Failsafe if `animationend` does not fire. */
  useEffect(() => {
    if (!playIntroAnim || reduceMotion || !heroInView) return;
    const t = window.setTimeout(() => setPlayIntroAnim(false), 820);
    return () => window.clearTimeout(t);
  }, [playIntroAnim, reduceMotion, heroInView]);

  useEffect(() => {
    if (!isHome) return;
    const el = document.getElementById(HOME_HERO_ID);
    if (!el) {
      setHeroInView(false);
      return;
    }
    const obs = new IntersectionObserver(
      ([entry]) => {
        setHeroInView(entry.isIntersecting && entry.intersectionRatio > 0);
      },
      /** Negative bottom margin: treat hero as leaving a bit sooner so slide-out feels continuous, not a hard pop. */
      { threshold: [0, 0.02, 0.06, 0.15], rootMargin: "0px 0px -48px 0px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [isHome]);

  if (!isHome) return null;

  const scrolledAway = !heroInView;
  const resting = heroInView && !playIntroAnim;
  /** Keyframe entrance only while hero is visible; exit path uses transitions only so it slides smoothly off the left edge. */
  const introRunning = Boolean(playIntroAnim && heroInView);

  function handleIntroEnd(ev: React.AnimationEvent<HTMLDivElement>) {
    if (ev.target !== ev.currentTarget) return;
    const name =
      typeof ev.animationName === "string" ? ev.animationName : "";
    if (!name.includes("backpacker-slide-enter-left")) return;
    setPlayIntroAnim(false);
  }

  return (
    <div
      className={cn(
        "fixed bottom-6 left-4 z-40 w-max md:z-50 sm:bottom-8 sm:left-6",
        /** Long transform + staggered fade so sliding toward the left edge feels smooth instead of snapping off. */
        !introRunning &&
          "motion-reduce:transition-none motion-safe:[transition:transform_0.88s_cubic-bezier(0.4,0,0.2,1),opacity_0.45s_ease_0.32s]",
        scrolledAway &&
          "pointer-events-none -translate-x-[calc(100vw+4rem)] opacity-0 sm:-translate-x-[calc(100vw+5rem)]",
        introRunning &&
          "pointer-events-none animate-backpacker-enter-left motion-reduce:animate-none motion-reduce:translate-x-0 motion-reduce:opacity-100",
        resting && "translate-x-0 opacity-100",
      )}
      aria-hidden={!resting}
      onAnimationEnd={handleIntroEnd}
    >
      <Link
        href="/digital-buddy"
        aria-label="Meridiano Digital Buddy — backpacker support"
        className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-gold/20 bg-[#e0ebe7] p-1 shadow-md transition-colors transition-shadow hover:border-gold/30 hover:bg-gold/10 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold/40 sm:h-16 sm:w-16 sm:p-1.5"
      >
        <Image
          src={BACKPACKER_BUTTON_IMAGE}
          alt=""
          width={64}
          height={64}
          className="h-full w-full object-contain object-center"
          sizes="64px"
        />
      </Link>
      <p
        className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 max-w-[min(18rem,calc(100vw-2rem))] -translate-x-1/2 rounded-lg border border-gold/20 bg-[#e0ebe7] px-3 py-2 text-center text-xs font-medium leading-snug text-forest shadow-md"
      >
        Backpackers corner..
      </p>
    </div>
  );
}
