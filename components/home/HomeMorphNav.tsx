"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLayoutEffect, useMemo, useState } from "react";
import { useHomeMorphProgress } from "@/components/layout/HomeScrollContext";
import { LOGO_ALT, LOGO_SRC } from "@/lib/branding";
import { cn } from "@/lib/utils";
import {
  HOME_VIRTUAL_LAYER_FADE_START_PROGRESS,
  HOME_VIRTUAL_LOGO_CORNER_END_PROGRESS,
  easeInOutCubic,
  lerp,
} from "@/lib/home-nav-morph";

function readViewportWidth() {
  if (typeof document === "undefined") return 390;
  return document.documentElement.clientWidth;
}

function useViewportWidth() {
  const [vw, setVw] = useState(390);
  useLayoutEffect(() => {
    const onResize = () => setVw(readViewportWidth());
    onResize();
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return vw;
}

/** Mobile-first: tall strip + large centered logo; scales up on larger breakpoints. */
function useMorphSizes(vw: number) {
  return useMemo(() => {
    if (vw >= 1024) {
      return {
        stripStartH: 220,
        startW: 680,
        startH: 200,
        endW: 140,
        endH: 40,
      };
    }
    if (vw >= 768) {
      return {
        stripStartH: 200,
        startW: 560,
        startH: 180,
        endW: 200,
        endH: 36,
      };
    }
    if (vw >= 640) {
      return {
        stripStartH: 184,
        startW: 480,
        startH: 168,
        endW: 120,
        endH: 36,
      };
    }
    return {
      stripStartH: 200,
      startW: Math.min(340, vw * 0.92),
      startH: 168,
      endW: Math.min(vw * 0.42, 148),
      endH: 28,
    };
  }, [vw]);
}

function useNavbarHPx(): number {
  const [px, setPx] = useState(40);
  useLayoutEffect(() => {
    const read = () => {
      const raw = getComputedStyle(document.documentElement).getPropertyValue(
        "--navbar-h",
      );
      const n = parseFloat(raw);
      if (!Number.isFinite(n) || n <= 0) return;
      setPx(raw.trim().endsWith("rem") ? n * 16 : n);
    };
    read();
    window.addEventListener("resize", read, { passive: true });
    return () => window.removeEventListener("resize", read);
  }, []);
  return px;
}

type HomeMorphNavProps = {
  maintenanceActive?: boolean;
};

export function HomeMorphNav({ maintenanceActive = false }: HomeMorphNavProps) {
  const pathname = usePathname();
  const progressRaw = useHomeMorphProgress();
  const vw = useViewportWidth();
  const navH = useNavbarHPx();
  const { stripStartH, startW, startH, endW, endH } = useMorphSizes(vw);
  const edgePad = vw >= 640 ? 16 : 10;

  if (pathname !== "/") return null;

  const tStrip = easeInOutCubic(progressRaw);
  const stripH = Math.round(lerp(stripStartH, navH, tStrip));

  const u = Math.min(1, progressRaw / HOME_VIRTUAL_LOGO_CORNER_END_PROGRESS);
  const uEase = easeInOutCubic(u);
  const logoW = lerp(startW, endW, uEase);
  const logoH = lerp(startH, endH, uEase);
  const logoCenterX = lerp(vw / 2, edgePad + endW / 2, uEase);
  const logoLeft = logoCenterX - logoW / 2;
  const logoTop = stripH / 2 - logoH / 2;

  const morphOpacity =
    progressRaw < HOME_VIRTUAL_LAYER_FADE_START_PROGRESS
      ? 1
      : Math.max(
          0,
          1 -
            (progressRaw - HOME_VIRTUAL_LAYER_FADE_START_PROGRESS) /
              (1 - HOME_VIRTUAL_LAYER_FADE_START_PROGRESS),
        );

  return (
    <div
      className="pointer-events-none fixed inset-x-0 z-[60]"
      style={{
        opacity: morphOpacity,
        top: maintenanceActive ? "var(--maintenance-strip-h, 4.75rem)" : 0,
      }}
      aria-hidden
    >
      <div
        className="absolute box-border border-b border-gold/20 bg-[#e0ebe7]"
        style={{
          top: 0,
          height: stripH,
          left: "50%",
          width: "100vw",
          transform: "translateX(-50%)",
        }}
      />
      <Link
        href="/"
        className={cn(
          "pointer-events-auto absolute flex overflow-hidden",
          uEase > 0.82 ? "items-center justify-start" : "items-center justify-center",
        )}
        style={{
          left:
            vw < 640
              ? `calc(${logoLeft}px + env(safe-area-inset-left, 0px))`
              : logoLeft,
          top: logoTop,
          width: logoW,
          height: logoH,
          pointerEvents: morphOpacity < 0.05 ? "none" : "auto",
        }}
        aria-label={LOGO_ALT}
      >
        <Image
          src={LOGO_SRC}
          alt=""
          width={520}
          height={152}
          className="max-h-full max-w-full object-contain"
          style={{
            objectPosition: uEase > 0.82 ? "left center" : "center center",
          }}
          sizes="(max-width: 640px) 90vw, (max-width: 1024px) 400px, 520px"
          priority
        />
      </Link>
    </div>
  );
}
