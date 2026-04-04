"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Button,
  Navbar as FlowbiteNavbar,
  NavbarBrand,
  NavbarCollapse,
  NavbarLink,
  NavbarToggle,
} from "flowbite-react";
import { LOGO_ALT, LOGO_SRC } from "@/lib/branding";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/packages", label: "Packages" },
  { href: "/reviews", label: "Reviews" },
  { href: "/about", label: "About" },
  { href: "/care", label: "Care Promise" },
  { href: "/terms", label: "Terms" },
] as const;

function pathActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

type NavbarProps = {
  maintenanceActive?: boolean;
};

export function Navbar({ maintenanceActive = false }: NavbarProps) {
  const pathname = usePathname();

  return (
    <FlowbiteNavbar
      fluid
      border
      className={cn(
        "sticky z-50 min-h-[var(--navbar-h)] border-border bg-background/50 px-2 py-2.5 backdrop-blur-sm sm:px-4 dark:border-border dark:bg-background/50",
        maintenanceActive
          ? "-mt-px top-[var(--maintenance-strip-h,4.75rem)]"
          : "top-0",
      )}
    >
      <NavbarBrand as={Link} href="/" className="shrink-0 gap-2 sm:gap-3">
        <Image
          src={LOGO_SRC}
          alt={LOGO_ALT}
          width={280}
          height={82}
          className="block h-8 w-auto max-w-[min(52vw,220px)] sm:h-10 sm:max-w-[240px] md:h-12 md:max-w-[280px]"
          priority
        />
      </NavbarBrand>

      <div className="flex items-center gap-2 md:order-2">
        <Button
          as={Link}
          href="/#build-your-journey"
          size="sm"
          color="default"
          className="hidden md:inline-flex"
        >
          Build journey
        </Button>
        <Button
          as={Link}
          href="/#build-your-journey"
          size="xs"
          color="light"
          className="md:hidden"
        >
          Build
        </Button>
        <NavbarToggle />
      </div>

      <NavbarCollapse className="md:order-1">
        {navLinks.map((l) => (
          <NavbarLink
            key={l.href}
            as={Link}
            href={l.href}
            active={pathActive(pathname, l.href)}
          >
            {l.label}
          </NavbarLink>
        ))}
      </NavbarCollapse>
    </FlowbiteNavbar>
  );
}
