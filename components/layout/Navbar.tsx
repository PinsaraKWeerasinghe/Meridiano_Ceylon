"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
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

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

export function Navbar({ maintenanceActive = false }: NavbarProps) {
  const pathname = usePathname();
  const prefersReducedMotion = usePrefersReducedMotion();
  const [scrollHidden, setScrollHidden] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    if (prefersReducedMotion) return;

    const onScroll = () => {
      const y = window.scrollY || document.documentElement.scrollTop;
      const threshold = 72;

      if (y < 12) {
        setScrollHidden(false);
      } else if (y > lastScrollY.current && y > threshold) {
        setScrollHidden(true);
      } else if (y < lastScrollY.current) {
        setScrollHidden(false);
      }
      lastScrollY.current = y;
    };

    lastScrollY.current = window.scrollY || 0;
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [prefersReducedMotion]);

  const hideOnScroll = !prefersReducedMotion && scrollHidden;

  return (
    <div
      className={cn(
        "fixed left-0 right-0 z-50 transition-transform duration-300 ease-out motion-reduce:transition-none",
        maintenanceActive
          ? "top-[var(--maintenance-strip-h,4.75rem)]"
          : "top-0",
        hideOnScroll &&
          "pointer-events-none -translate-y-full motion-reduce:translate-y-0 motion-reduce:pointer-events-auto",
      )}
    >
    <FlowbiteNavbar
      fluid
      theme={{
        collapse: {
          base: "w-full border-0 bg-black/25 backdrop-blur-sm md:block md:w-auto md:bg-transparent md:backdrop-blur-none",
          list: "mt-4 flex flex-col md:mt-0 md:flex-row md:space-x-8 md:text-sm md:font-medium",
        },
        toggle: {
          base: "inline-flex items-center rounded-lg p-2 text-goldMint hover:bg-goldMint/15 hover:text-goldMint focus:outline-none focus:ring-2 focus:ring-goldMint/35 md:hidden dark:text-goldMint dark:hover:bg-goldMint/15 dark:focus:ring-goldMint/35",
          icon: "h-6 w-6 shrink-0",
          title: "sr-only",
        },
        link: {
          base: "block py-2 pl-3 pr-4 transition-colors duration-150 md:p-0",
          active: {
            on: "bg-lagoon/15 text-white [text-shadow:0_0_12px_rgba(255,255,255,0.45)] md:bg-transparent md:font-semibold md:text-white md:[text-shadow:0_0_14px_rgba(255,255,255,0.4)] dark:bg-lagoon/15 dark:text-white dark:[text-shadow:0_0_12px_rgba(255,255,255,0.35)]",
            off: "text-goldMint hover:bg-goldMint/15 md:hover:bg-transparent md:text-goldMint md:hover:text-white/90 dark:text-goldMint dark:hover:bg-goldMint/15 md:dark:hover:bg-transparent md:dark:hover:text-white/90",
          },
        },
      }}
      className={cn(
        "z-50 min-h-[var(--navbar-h)] w-full border-0 bg-black/25 px-2 py-2.5 backdrop-blur-sm sm:px-4 dark:bg-black/25",
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

      <div className="flex items-center md:order-2">
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
    </div>
  );
}
