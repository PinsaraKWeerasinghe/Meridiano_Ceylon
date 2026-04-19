"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function ClientMain({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <main
      className={cn(
        "flex-1",
        isHome ? "pt-0" : "pt-[var(--navbar-h)]",
      )}
    >
      {children}
    </main>
  );
}
