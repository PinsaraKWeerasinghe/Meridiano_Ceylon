"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const HOME_HERO_ID = "home-hero";

/** Drop-only leads enter/exit; Backpacker follows (ms). */
const DOCK_STAGGER_MS = 320;

const DOCK_OFFSCREEN =
  "-translate-x-[calc(100vw+3rem)] opacity-0 pointer-events-none";

/** Matches hero / Build your journey CTA (`bg-gold`, `text-cream`, `hover:bg-[#1d5349]`). */
const DOCK_LINK_CLASS =
  "block max-w-[18rem] rounded-none bg-gold px-3 py-2.5 text-center text-xs font-semibold leading-snug text-cream shadow-md transition hover:bg-[#1d5349] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold/40";

const DOCK_MOTION_TRANSITION =
  "motion-reduce:transition-none motion-safe:[transition:transform_0.88s_cubic-bezier(0.4,0,0.2,1),opacity_0.45s_ease_0.32s]";

function dockLeadMotionClass(
  introActive: boolean,
  exitActive: boolean,
  resting: boolean,
): string {
  return cn(
    DOCK_MOTION_TRANSITION,
    introActive &&
      "pointer-events-none animate-backpacker-enter-left motion-reduce:animate-none motion-reduce:translate-x-0 motion-reduce:opacity-100",
    exitActive && DOCK_OFFSCREEN,
    resting && "translate-x-0 opacity-100",
  );
}

function dockFollowMotionClass(
  introActive: boolean,
  waitingToEnter: boolean,
  exitActive: boolean,
  resting: boolean,
): string {
  return cn(
    DOCK_MOTION_TRANSITION,
    waitingToEnter && DOCK_OFFSCREEN,
    introActive &&
      "pointer-events-none animate-backpacker-enter-left motion-reduce:animate-none motion-reduce:translate-x-0 motion-reduce:opacity-100",
    exitActive && DOCK_OFFSCREEN,
    resting && "translate-x-0 opacity-100",
  );
}

/** Home hero dock — staggered enter/exit from the left. */
export function DigitalBuddyFloat() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  const [heroInView, setHeroInView] = useState(isHome);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [playIntroAnim, setPlayIntroAnim] = useState(false);
  const [introDropActive, setIntroDropActive] = useState(false);
  const [introBackpackerActive, setIntroBackpackerActive] = useState(false);
  const [exitDropActive, setExitDropActive] = useState(false);
  const [exitBackpackerActive, setExitBackpackerActive] = useState(false);
  const prevHeroRef = useRef<boolean | null>(null);
  const introStaggerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const exitStaggerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (isHome) setHeroInView(true);
    else setHeroInView(false);
  }, [isHome]);

  useLayoutEffect(() => {
    const rm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReduceMotion(rm);
    if (!isHome) {
      setPlayIntroAnim(false);
      setIntroDropActive(false);
      setIntroBackpackerActive(false);
      setExitDropActive(false);
      setExitBackpackerActive(false);
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
      if (rm) {
        setPlayIntroAnim(false);
        setIntroDropActive(false);
        setIntroBackpackerActive(false);
        setExitDropActive(false);
        setExitBackpackerActive(false);
      }
    };
    mq.addEventListener("change", onPrefChange);
    return () => mq.removeEventListener("change", onPrefChange);
  }, []);

  /** Re-enter hero after scroll-away: replay entrance from the left (unless reduced motion). */
  useEffect(() => {
    if (!isHome) return;
    const wasAway = prevHeroRef.current === false;
    prevHeroRef.current = heroInView;
    if (wasAway && heroInView && !reduceMotion) {
      setPlayIntroAnim(true);
    }
  }, [isHome, heroInView, reduceMotion]);

  /** Staggered enter: Drop-only first, then Backpacker. */
  useEffect(() => {
    if (introStaggerRef.current) {
      clearTimeout(introStaggerRef.current);
      introStaggerRef.current = null;
    }

    const introRunning = playIntroAnim && heroInView;
    if (!introRunning || reduceMotion) {
      setIntroDropActive(false);
      setIntroBackpackerActive(false);
      return;
    }

    setExitDropActive(false);
    setExitBackpackerActive(false);
    setIntroDropActive(true);
    setIntroBackpackerActive(false);
    introStaggerRef.current = setTimeout(() => {
      setIntroBackpackerActive(true);
      introStaggerRef.current = null;
    }, DOCK_STAGGER_MS);

    return () => {
      if (introStaggerRef.current) {
        clearTimeout(introStaggerRef.current);
        introStaggerRef.current = null;
      }
    };
  }, [playIntroAnim, heroInView, reduceMotion]);

  /** Staggered exit: Drop-only first, then Backpacker (mirrors enter). */
  useEffect(() => {
    if (exitStaggerRef.current) {
      clearTimeout(exitStaggerRef.current);
      exitStaggerRef.current = null;
    }

    if (!isHome || heroInView) {
      setExitDropActive(false);
      setExitBackpackerActive(false);
      return;
    }

    setPlayIntroAnim(false);
    setIntroDropActive(false);
    setIntroBackpackerActive(false);

    if (reduceMotion) {
      setExitDropActive(true);
      setExitBackpackerActive(true);
      return;
    }

    setExitDropActive(true);
    setExitBackpackerActive(false);
    exitStaggerRef.current = setTimeout(() => {
      setExitBackpackerActive(true);
      exitStaggerRef.current = null;
    }, DOCK_STAGGER_MS);

    return () => {
      if (exitStaggerRef.current) {
        clearTimeout(exitStaggerRef.current);
        exitStaggerRef.current = null;
      }
    };
  }, [isHome, heroInView, reduceMotion]);

  /** Failsafe if Backpacker `animationend` does not fire. */
  useEffect(() => {
    if (!introBackpackerActive || reduceMotion || !heroInView) return;
    const t = window.setTimeout(() => {
      setPlayIntroAnim(false);
      setIntroDropActive(false);
      setIntroBackpackerActive(false);
    }, 820 + DOCK_STAGGER_MS);
    return () => window.clearTimeout(t);
  }, [introBackpackerActive, reduceMotion, heroInView]);

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
      { threshold: [0, 0.02, 0.06, 0.15], rootMargin: "0px 0px -48px 0px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [isHome]);

  if (!isHome) return null;

  const resting =
    heroInView &&
    !introDropActive &&
    !introBackpackerActive &&
    !exitDropActive &&
    !exitBackpackerActive;
  const introSequenceRunning = introDropActive || introBackpackerActive;
  const backpackerWaiting =
    introDropActive && !introBackpackerActive && heroInView;

  function handleBackpackerIntroEnd(ev: React.AnimationEvent<HTMLDivElement>) {
    if (ev.target !== ev.currentTarget) return;
    const name =
      typeof ev.animationName === "string" ? ev.animationName : "";
    if (!name.includes("backpacker-slide-enter-left")) return;
    setPlayIntroAnim(false);
    setIntroDropActive(false);
    setIntroBackpackerActive(false);
  }

  return (
    <div
      className="fixed bottom-6 left-0 z-40 w-max md:z-50 sm:bottom-8"
      aria-hidden={!resting && !introSequenceRunning}
    >
      <div className="flex flex-col gap-2">
        <div
          className={dockLeadMotionClass(
            introDropActive,
            exitDropActive,
            resting,
          )}
        >
          <Link
            href="/packages/drop-only-tours"
            aria-label="Drop only tours"
            className={DOCK_LINK_CLASS}
          >
            Drop only tours
          </Link>
        </div>
        <div
          className={dockFollowMotionClass(
            introBackpackerActive,
            backpackerWaiting,
            exitBackpackerActive,
            resting,
          )}
          onAnimationEnd={handleBackpackerIntroEnd}
        >
          <Link
            href="/digital-buddy"
            aria-label="Backpacker corner — Meridiano backpacker support"
            className={DOCK_LINK_CLASS}
          >
            Backpacker corner
          </Link>
        </div>
      </div>
    </div>
  );
}
