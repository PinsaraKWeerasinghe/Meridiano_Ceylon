"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  isPackagesSectionPath,
  packagesSubNavItems,
} from "@/lib/packages-nav";
import { cn } from "@/lib/utils";

type PackagesNavDropdownProps = {
  pathname: string;
};

export function PackagesNavDropdown({ pathname }: PackagesNavDropdownProps) {
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
        {packagesSubNavItems.map((item) => (
          <DropdownMenuItem key={item.href} asChild>
            <Link
              href={item.href}
              className={cn(
                "cursor-pointer focus:bg-gold/15 focus:text-forest",
                pathname === item.href ||
                  (item.href !== "/packages" &&
                    pathname.startsWith(item.href))
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
