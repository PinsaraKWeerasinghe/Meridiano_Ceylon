"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

/** `public/BackPackersImage/...` → `/BackPackersImage/...` */
export const BACKPACKER_BUTTON_IMAGE =
  "/BackPackersImage/traveler-backpacker-girl-with-suitcase-running-happily-3d-icon-png-download-14043606.webp";

function showBackpackerCorner(pathname: string) {
  if (pathname === "/") return true;
  if (pathname === "/packages" || pathname.startsWith("/packages/")) return true;
  return false;
}

/** Entry to Backpacker Support — Meridiano Digital Buddy (bottom-left). Matches main nav bar colours. */
export function DigitalBuddyFloat() {
  const pathname = usePathname();
  if (!showBackpackerCorner(pathname)) return null;

  return (
    <div className="fixed bottom-6 left-4 z-40 w-max md:z-50 sm:bottom-8 sm:left-6">
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
