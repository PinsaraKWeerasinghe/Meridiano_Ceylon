"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  isPackagesSectionPath,
  packagesNavDropdownItems,
} from "@/lib/packages-nav";
import { cn } from "@/lib/utils";

function isDropdownItemActive(
  pathname: string,
  section: string | null,
  itemHref: string,
): boolean {
  if (itemHref === "/packages") {
    return pathname === "/packages" && !section;
  }
  try {
    const u = new URL(itemHref, "http://local");
    if (u.pathname !== "/packages") return false;
    return section === u.searchParams.get("section");
  } catch {
    return false;
  }
}

type PackagesNavDropdownProps = {
  pathname: string;
};

export function PackagesNavDropdown({ pathname }: PackagesNavDropdownProps) {
  const searchParams = useSearchParams();
  const section = searchParams.get("section");
  const active = isPackagesSectionPath(pathname);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "flex w-full items-center gap-1 rounded-lg py-2 pl-3 pr-4 text-left transition-colors duration-150 md:inline-flex md:w-auto md:py-0 md:pl-0 md:pr-0",
          active
            ? "bg-gold/15 text-forest md:bg-transparent md:font-semibold md:text-gold"
            : "text-forest/90 hover:bg-gold/10 md:hover:bg-transparent md:hover:text-gold",
        )}
      >
        Packages
        <ChevronDown className="h-4 w-4 shrink-0 opacity-80" aria-hidden />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="z-[60] min-w-[14rem] border-gold/20 bg-[#e0ebe7] text-forest shadow-lg"
      >
        {packagesNavDropdownItems.map((item) => (
          <DropdownMenuItem key={item.href} asChild>
            <Link
              href={item.href}
              className={cn(
                "cursor-pointer focus:bg-gold/15 focus:text-forest",
                isDropdownItemActive(pathname, section, item.href)
                  ? "font-semibold text-gold"
                  : "",
              )}
            >
              {item.label}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
