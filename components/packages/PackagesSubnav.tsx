"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { packagesSubNavItems } from "@/lib/packages-nav";
import { cn } from "@/lib/utils";

export function PackagesSubnav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Packages sections"
      className="-mx-1 flex flex-wrap gap-1 border-b border-lagoon/20 pb-4 sm:gap-2"
    >
      {packagesSubNavItems.map((item) => {
        const active =
          item.href === "/packages"
            ? pathname === "/packages"
            : pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "rounded-full px-3 py-1.5 text-xs font-semibold transition sm:text-sm",
              active
                ? "bg-forest text-cream shadow-sm"
                : "bg-white/80 text-forest ring-1 ring-lagoon/20 hover:bg-lagoon/10",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
