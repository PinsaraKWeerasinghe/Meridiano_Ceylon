"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

/** `public/images/BackPackersImage/...` → served at `/images/BackPackersImage/...` */
export const BACKPACKER_BUTTON_IMAGE =
  "/images/BackPackersImage/traveler-backpacker-girl-with-suitcase-running-happily-3d-icon-png-download-14043606.webp";

/** Entry to Backpacker Support — Meridiano Digital Buddy (bottom-left). */
export function DigitalBuddyFloat() {
  const pathname = usePathname();
  if (pathname === "/digital-buddy") return null;

  return (
    <div className="group fixed bottom-6 left-4 z-50 sm:bottom-8 sm:left-6">
      <Link
        href="/digital-buddy"
        aria-label="Meridiano Digital Buddy — backpacker support"
        className="relative flex h-14 w-14 shrink-0 animate-float-soft items-center justify-center overflow-hidden rounded-full bg-gold p-1 shadow-[0_10px_28px_-4px_rgba(15,23,42,0.22),0_8px_24px_-4px_rgba(36,104,92,0.35)] transition-colors transition-shadow motion-reduce:animate-none hover:bg-[#1d5349] hover:shadow-[0_14px_36px_-6px_rgba(15,23,42,0.26),0_10px_28px_-4px_rgba(36,104,92,0.35)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream sm:h-16 sm:w-16 sm:p-1.5"
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
        role="tooltip"
        className="pointer-events-none absolute bottom-full left-0 z-50 mb-2 max-w-[min(18rem,calc(100vw-2rem))] rounded-lg border border-white/15 bg-gold px-3 py-2 text-left text-xs font-medium leading-snug text-cream opacity-0 shadow-md ring-1 ring-black/10 transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100"
      >
        Welcome to Backpackers corner..
      </p>
    </div>
  );
}
