"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

/** Entry to Backpacker Support — Meridiano Digital Buddy (bottom-left). */
export function DigitalBuddyFloat() {
  const pathname = usePathname();
  if (pathname === "/digital-buddy") return null;

  return (
    <Button
      asChild
      variant="outline"
      size="icon"
      className="fixed bottom-6 left-4 z-40 h-11 w-11 rounded-full border-lagoon/40 bg-white/95 text-lg font-semibold text-foreground shadow-[0_10px_28px_-4px_rgba(15,23,42,0.22),0_4px_12px_-2px_rgba(11,122,115,0.18)] transition-shadow hover:bg-lagoon/10 hover:shadow-[0_14px_36px_-6px_rgba(15,23,42,0.26),0_6px_16px_-4px_rgba(11,122,115,0.2)] sm:bottom-8 sm:left-6"
    >
      <Link
        href="/digital-buddy"
        aria-label="Meridiano Digital Buddy — backpacker support"
        title="Meridiano Digital Buddy"
      >
        ?
      </Link>
    </Button>
  );
}
