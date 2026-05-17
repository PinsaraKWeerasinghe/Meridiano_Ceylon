"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  type CSSProperties,
  type ReactNode,
  Suspense,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Navbar as FlowbiteNavbar,
  NavbarBrand,
  NavbarCollapse,
  NavbarLink,
  NavbarToggle,
  useNavbarContext,
} from "flowbite-react";
import { AuthNav } from "@/components/auth/AuthNav";
import { PackagesNavDropdown } from "@/components/layout/PackagesNavDropdown";
import { LOGO_ALT, LOGO_SRC } from "@/lib/branding";
import { cn } from "@/lib/utils";

const homeLink = { href: "/", label: "Home" } as const;

const navLinksAfterPackagesBase = [
  { href: "/care", label: "Care Promise" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

type NavItem = { href: string; label: string };

function pathActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

type NavbarProps = {
  maintenanceActive?: boolean;
};

/** Invisible tap target to close the drawer (no dimmed overlay). */
function MobileNavBackdrop() {
  const { isOpen, setIsOpen } = useNavbarContext();
  return (
    <div
      className={cn(
        "md:hidden fixed inset-x-0 bottom-0 z-[30] bg-transparent transition-opacity duration-300 ease-out motion-reduce:transition-none",
        "top-[var(--nav-mobile-menu-top)]",
        isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
      )}
      aria-hidden
      onClick={() => setIsOpen(false)}
    />
  );
}

/**
 * Mobile: slide-in panel from the right (Flowbite `hidden` removed via theme so transforms work).
 */
function AppNavbarCollapse({ children }: { children: ReactNode }) {
  const { isOpen } = useNavbarContext();
  return (
    <NavbarCollapse
      className={cn(
        "max-md:fixed max-md:bottom-0 max-md:left-auto max-md:right-0 max-md:top-[var(--nav-mobile-menu-top)] max-md:z-40 max-md:flex max-md:min-h-0 max-md:w-[min(100vw,22rem)] max-md:max-w-[min(100vw,22rem)] max-md:flex-col",
        "max-md:h-[calc(100dvh-var(--nav-mobile-menu-top))] max-md:max-h-[calc(100dvh-var(--nav-mobile-menu-top))] max-md:overflow-y-auto max-md:border-0 max-md:border-l max-md:border-gold/25 max-md:bg-[#e0ebe7]",
        "max-md:pb-[max(0.75rem,env(safe-area-inset-bottom))]",
        "max-md:shadow-[-12px_0_40px_-16px_rgba(15,23,42,0.2)]",
        "max-md:transition-transform max-md:duration-300 max-md:ease-out motion-reduce:max-md:transition-none",
        !isOpen && "max-md:pointer-events-none max-md:translate-x-full",
        isOpen && "max-md:translate-x-0",
        "md:static md:inset-auto md:top-auto md:z-auto md:h-auto md:min-h-0 md:w-auto md:max-w-none md:translate-x-0 md:overflow-visible md:border-0 md:bg-transparent md:shadow-none md:pb-0",
        "md:order-1",
      )}
    >
      {children}
    </NavbarCollapse>
  );
}

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
    setScrollHidden(false);
  }, [pathname]);

  /* Hide when scrolling down the page; show again when scrolling up or near the top. Applies on all routes (including home). */
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
  }, [prefersReducedMotion, pathname]);

  const hideOnScroll = !prefersReducedMotion && scrollHidden;

  const navAfterPackages: NavItem[] = [...navLinksAfterPackagesBase];

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
      style={
        {
          "--nav-mobile-menu-top": maintenanceActive
            ? "calc(var(--maintenance-strip-h, 4.75rem) + var(--navbar-h))"
            : "var(--navbar-h)",
        } as CSSProperties
      }
    >
      <FlowbiteNavbar
        fluid
        theme={{
          collapse: {
            base: "w-full border-0 bg-[#e0ebe7] md:block md:w-auto md:bg-transparent",
            list: "mt-4 flex min-h-0 flex-1 flex-col md:mt-0 md:flex-none md:flex-row md:space-x-8 md:text-sm md:font-medium",
            hidden: { on: "", off: "" },
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
        <NavbarBrand
          as={Link}
          href="/"
          className="relative z-[50] shrink-0 gap-2 sm:gap-3"
        >
          <Image
            src={LOGO_SRC}
            alt={LOGO_ALT}
            width={280}
            height={82}
            className="block h-7 w-auto max-w-[min(52vw,200px)] sm:h-9 sm:max-w-[220px] md:h-10 md:max-w-[260px]"
            priority
          />
        </NavbarBrand>

        <div className="relative z-[50] flex items-center gap-2 md:order-2">
          <AuthNav />
          <NavbarToggle />
        </div>

        <MobileNavBackdrop />

        <AppNavbarCollapse>
          <NavbarLink
            as={Link}
            href={homeLink.href}
            active={pathActive(pathname, homeLink.href)}
          >
            {homeLink.label}
          </NavbarLink>
          <Suspense
            fallback={
              <span className="block py-2 pl-3 pr-4 text-forest/90 md:inline-block md:p-0">
                Packages
              </span>
            }
          >
            <PackagesNavDropdown pathname={pathname} />
          </Suspense>
          {navAfterPackages.map((l) => (
            <NavbarLink
              key={l.href}
              as={Link}
              href={l.href}
              active={pathActive(pathname, l.href)}
            >
              {l.label}
            </NavbarLink>
          ))}
        </AppNavbarCollapse>
      </FlowbiteNavbar>
    </div>
  );
}
