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
          base: "w-full border-0 bg-[#e0ebe7] md:block md:w-auto md:bg-transparent",
          list: "mt-4 flex flex-col md:mt-0 md:flex-row md:space-x-8 md:text-sm md:font-medium",
        },
        toggle: {
          base: "inline-flex items-center rounded-lg p-2 text-forest hover:bg-gold/15 hover:text-gold focus:outline-none focus:ring-2 focus:ring-gold/30 md:hidden",
          icon: "h-6 w-6 shrink-0",
          title: "sr-only",
        },
        link: {
          base: "block py-2 pl-3 pr-4 transition-colors duration-150 md:p-0",
          active: {
            on: "bg-gold/15 text-forest md:bg-transparent md:font-semibold md:text-gold",
            off: "text-forest/90 hover:bg-gold/10 md:hover:bg-transparent md:hover:text-gold",
          },
        },
      }}
      className={cn(
        "z-50 min-h-[var(--navbar-h)] w-full border-b border-gold/20 bg-[#e0ebe7] px-2 py-1.5 text-forest sm:px-4",
      )}
    >
      <NavbarBrand as={Link} href="/" className="shrink-0 gap-2 sm:gap-3">
        <Image
          src={LOGO_SRC}
          alt={LOGO_ALT}
          width={280}
          height={82}
          className="block h-7 w-auto max-w-[min(52vw,200px)] sm:h-9 sm:max-w-[220px] md:h-10 md:max-w-[260px]"
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
