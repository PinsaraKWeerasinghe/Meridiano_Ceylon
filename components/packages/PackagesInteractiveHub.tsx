"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useReducedMotion,
} from "framer-motion";
import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { FixedPackagePanel } from "@/components/tours/FixedPackagePanel";
import {
  addonTours,
  fixedPackages10Day,
  fixedPackages16Day,
  fixedPackages5Day,
  fixedPackages7Day,
  specialtyTours,
} from "@/data/tours";
import {
  packageSectionById,
  packageSectionDefinitions,
  packagesSectionHref,
  parsePackagesSection,
  type PackageSectionId,
} from "@/lib/packages-nav";
import {
  packagesGreenCard,
  packagesGreenPlaceholder,
  packagesGreenSlideshow,
} from "@/lib/packages-section-theme";
import { cn } from "@/lib/utils";
import type { TourItem } from "@/data/tours";

/** Slide direction for section ↔ section (not overview). Forward = next in hub order. */
function useSectionPanelSlideDirection(
  section: PackageSectionId | null,
): 1 | -1 | 0 {
  const prevRef = useRef<PackageSectionId | null>(null);
  const indexById = useMemo(
    () =>
      Object.fromEntries(
        packageSectionDefinitions.map((d, i) => [d.id, i]),
      ) as Record<PackageSectionId, number>,
    [],
  );

  let direction: 1 | -1 | 0 = 0;
  const prev = prevRef.current;
  if (section && prev && prev !== section) {
    direction = indexById[section] > indexById[prev] ? 1 : -1;
  }

  useLayoutEffect(() => {
    prevRef.current = section;
  });

  return direction;
}

function toursForSection(id: PackageSectionId): TourItem[] {
  switch (id) {
    case "fixed-5-day":
      return fixedPackages5Day;
    case "fixed-7-day":
      return fixedPackages7Day;
    case "fixed-10-day":
      return fixedPackages10Day;
    case "fixed-16-day":
      return fixedPackages16Day;
    case "add-ons":
      return addonTours;
    case "specialty-tours":
      return specialtyTours;
    default:
      return [];
  }
}

/** Same rounded-xl card shape for overview grid and section subnav grid. */
function categoryNavLinkClass({
  hasSection,
  active,
}: {
  hasSection: boolean;
  active: boolean;
}) {
  return cn(
    "flex w-full items-center justify-center rounded-xl border text-center font-semibold shadow-sm transition",
    !hasSection &&
      "min-h-[3.5rem] px-4 py-3 text-sm border-lagoon/25 bg-white/90 hover:border-lagoon/40 hover:bg-lagoon/10 hover:shadow",
    hasSection &&
      cn(
        "min-h-[2.75rem] px-2 py-2 text-xs leading-snug sm:min-h-[3rem] sm:px-2.5 sm:py-2.5 sm:text-sm lg:px-3",
        active
          ? "border-lagoon bg-lagoon text-cream shadow-md"
          : "border-lagoon/25 bg-white/90 text-forest hover:border-lagoon/40 hover:bg-lagoon/10 hover:shadow",
      ),
  );
}

export function PackagesInteractiveHub({
  initialSection,
}: {
  initialSection: PackageSectionId | null;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reduceMotion = useReducedMotion();

  const raw = searchParams.get("section");
  const section = parsePackagesSection(raw) ?? initialSection;

  useEffect(() => {
    if (raw != null && raw !== "" && parsePackagesSection(raw) === null) {
      router.replace("/packages", { scroll: false });
    }
  }, [raw, router]);

  const hasSection = section != null;
  const hubMotionDurationS = 1;
  const transition = reduceMotion
    ? { duration: 0 }
    : { duration: hubMotionDurationS, ease: [0.22, 1, 0.36, 1] as const };

  const meta = section ? packageSectionById[section] : null;
  const tours = section ? toursForSection(section) : [];

  const sectionPanelSlideDir = useSectionPanelSlideDirection(section);
  const slidePx = 48;
  const sectionPanelVariants = {
    initial: (dir: 1 | -1 | 0) => {
      if (reduceMotion) return {};
      if (dir === 0) return { opacity: 0, y: 16 };
      return { opacity: 0, x: dir * slidePx };
    },
    animate: (_dir: 1 | -1 | 0) => {
      if (reduceMotion) return {};
      return { opacity: 1, x: 0, y: 0 };
    },
    exit: (dir: 1 | -1 | 0) => {
      if (reduceMotion) return {};
      if (dir === 0) return { opacity: 0, y: 8 };
      return { opacity: 0, x: -dir * slidePx };
    },
  };

  return (
    <div className="min-h-screen bg-lagoon/10 px-4 py-12 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-6xl space-y-10">
        <LayoutGroup id="packages-hub">
          <header className="space-y-6">
            <div>
              <h1 className="font-serif text-4xl font-semibold text-forest">
                Packages &amp; tours
              </h1>
              <p className="mt-3 max-w-2xl text-sm text-stone-700">
                Fixed itineraries anchor your dates; add-ons and specialty
                experiences layer on the details that matter to you. Enquire via{" "}
                <em>Build your journey</em> or WhatsApp for a tailored quote.
              </p>
            </div>
            <div>
              <h2
                id="packages-hub-heading"
                className="font-serif text-xl font-semibold text-forest"
              >
                Browse by category
              </h2>
            </div>
          </header>

          {/*
            Plain div (no parent layout): chips animate only. Section mode uses a
            responsive grid so all six buttons stay in the viewport — no horizontal scroll.
          */}
          <div
            className={cn(
              !hasSection
                ? "grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
                : "grid w-full grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 lg:grid-cols-6 lg:gap-3",
            )}
          >
            {packageSectionDefinitions.map((d) => {
              const active = section === d.id;
              return (
                <motion.div
                  key={d.id}
                  layoutId={`pkg-cat-${d.id}`}
                  layout={reduceMotion ? false : "position"}
                  transition={transition}
                  whileTap={
                    reduceMotion
                      ? undefined
                      : { scale: 0.94, transition: { duration: 0.12 } }
                  }
                  className={cn(
                    "min-w-0 origin-center",
                    hasSection && "w-full",
                  )}
                >
                  <Link
                    href={packagesSectionHref(d.id)}
                    scroll={false}
                    className={categoryNavLinkClass({
                      hasSection,
                      active,
                    })}
                  >
                    {d.label}
                  </Link>
                </motion.div>
              );
            })}
          </div>

          <div className="overflow-x-hidden">
            <AnimatePresence mode="sync" initial={false}>
              {hasSection && meta ? (
                <motion.div
                  key={section}
                  role="region"
                  aria-label={meta.pageTitle}
                  custom={sectionPanelSlideDir}
                  variants={sectionPanelVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={transition}
                  className="space-y-10"
                >
                <header>
                  <h1 className="font-serif text-3xl font-semibold text-forest sm:text-4xl">
                    {meta.pageTitle}
                  </h1>
                  <p className="mt-3 max-w-2xl text-sm text-stone-700">
                    {meta.pageDescription}
                  </p>
                </header>
                <div className="flex flex-col gap-14">
                  {tours.map((tour, index) => (
                    <FixedPackagePanel
                      key={tour.id}
                      tour={tour}
                      index={index}
                      cardClassName={packagesGreenCard}
                      placeholderClassName={packagesGreenPlaceholder}
                      slideshowClassName={packagesGreenSlideshow}
                      verticallyCenterCardContent
                      alignTextTowardImages
                      previewMaxImages={2}
                    />
                  ))}
                </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </LayoutGroup>
      </div>
    </div>
  );
}
