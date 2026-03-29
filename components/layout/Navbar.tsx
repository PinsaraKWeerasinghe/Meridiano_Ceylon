"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ChevronDown, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const primaryLinks = [
  { href: "/", label: "Home" },
  { href: "/packages", label: "Packages" },
  { href: "/reviews", label: "Reviews" },
] as const;

const moreLinks = [
  { href: "/about", label: "About" },
  { href: "/care", label: "Care Promise" },
  { href: "/terms", label: "Terms" },
] as const;

const allLinks = [...primaryLinks, ...moreLinks];

function pathActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function moreSectionActive(pathname: string) {
  return moreLinks.some((l) => pathActive(pathname, l.href));
}

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b-2 border-primary/10 bg-background shadow-sm">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid h-[3.75rem] grid-cols-[1fr_auto] items-center gap-3 sm:h-16 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] md:gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <Link
              href="/"
              className="shrink-0 font-serif text-lg font-semibold tracking-tight text-primary sm:text-xl"
              onClick={() => setMobileOpen(false)}
            >
              Meridiano<span className="text-gold"> Ceylon</span>
            </Link>
            <Separator
              orientation="vertical"
              className="hidden h-7 md:block"
            />
          </div>

          <div className="hidden items-center justify-center gap-1 md:flex">
            <div className="flex flex-wrap items-center justify-center gap-1 rounded-full border border-border bg-muted/70 p-1 shadow-inner">
              {primaryLinks.map((l) => {
                const active = pathActive(pathname, l.href);
                return (
                  <Button
                    key={l.href}
                    asChild
                    variant={active ? "secondary" : "ghost"}
                    size="sm"
                    className={cn(
                      "rounded-full px-3 lg:px-4 text-foreground",
                      active && "bg-background text-primary shadow-sm",
                    )}
                  >
                    <Link href={l.href}>{l.label}</Link>
                  </Button>
                );
              })}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant={
                      moreSectionActive(pathname) ? "secondary" : "ghost"
                    }
                    size="sm"
                    className={cn(
                      "gap-1 rounded-full px-3 text-foreground lg:px-4",
                      moreSectionActive(pathname) &&
                        "bg-background text-primary shadow-sm",
                    )}
                  >
                    More
                    <ChevronDown className="h-3.5 w-3.5 opacity-70" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center" className="w-48">
                  {moreLinks.map((l) => (
                    <DropdownMenuItem key={l.href} asChild>
                      <Link href={l.href}>{l.label}</Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2">
            <Button
              asChild
              size="sm"
              className="hidden rounded-full shadow-sm md:inline-flex"
            >
              <Link href="/#build-your-journey">Build journey</Link>
            </Button>
            <Button
              asChild
              size="sm"
              variant="secondary"
              className="shrink-0 rounded-full px-3 text-xs font-semibold shadow-sm md:hidden sm:px-4 sm:text-sm"
            >
              <Link href="/#build-your-journey">Build</Link>
            </Button>

            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="default"
                  size="icon"
                  className="h-10 w-10 shrink-0 rounded-full shadow-md md:hidden"
                  aria-label="Open full menu"
                >
                  <Menu className="h-5 w-5 text-primary-foreground" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="flex w-full flex-col sm:max-w-sm"
              >
                <SheetHeader className="text-left">
                  <SheetTitle>Menu</SheetTitle>
                  <p className="text-sm font-normal text-muted-foreground">
                    Meridiano Ceylon — luxury Sri Lanka tours
                  </p>
                </SheetHeader>
                <Separator className="my-2" />
                <nav className="flex flex-1 flex-col gap-1" aria-label="Mobile">
                  {allLinks.map((l) => {
                    const active = pathActive(pathname, l.href);
                    return (
                      <Button
                        key={l.href}
                        asChild
                        variant={active ? "secondary" : "ghost"}
                        className="h-12 w-full justify-start rounded-xl text-base"
                      >
                        <Link
                          href={l.href}
                          onClick={() => setMobileOpen(false)}
                        >
                          {l.label}
                        </Link>
                      </Button>
                    );
                  })}
                </nav>
                <Separator className="my-2" />
                <Button asChild className="w-full rounded-full" size="lg">
                  <Link
                    href="/#build-your-journey"
                    onClick={() => setMobileOpen(false)}
                  >
                    Build your journey
                  </Link>
                </Button>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Mobile: always-visible quick links (desktop nav is hidden < md) */}
        <nav
          className="flex gap-1 overflow-x-auto border-t border-border/80 py-2.5 md:hidden"
          aria-label="Quick links"
        >
          {allLinks.map((l) => {
            const active = pathActive(pathname, l.href);
            return (
              <Button
                key={l.href}
                asChild
                variant={active ? "secondary" : "ghost"}
                size="sm"
                className={cn(
                  "shrink-0 rounded-full px-3 text-xs font-semibold sm:text-sm",
                  active && "ring-1 ring-primary/20",
                )}
              >
                <Link href={l.href}>{l.label}</Link>
              </Button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
