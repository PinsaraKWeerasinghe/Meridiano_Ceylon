"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useReducedMotion,
} from "framer-motion";
import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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

/** Start offset between each of the non-selected chips (they may overlap). */
const STAGGER_BETWEEN_CHIPS_SEC = 0.1;

/**
 * Selected chip starts at 0. Others follow in hub order (5d → 7d → …) with a small
 * stagger — they can overlap the selected chip; no need to wait for it to finish.
 */
function chipLayoutDelaySec(
  categoryId: PackageSectionId,
  selectedId: PackageSectionId,
): number {
  if (categoryId === selectedId) return 0;
  const ordered = packageSectionDefinitions.map((d) => d.id);
  const others = ordered.filter((id) => id !== selectedId);
  const idx = others.indexOf(categoryId);
  if (idx < 0) return 0;
  return STAGGER_BETWEEN_CHIPS_SEC * (idx + 1);
}

/** Time until all category chips finish layout (parallel, or staggered starts). */
function chipLayoutSequenceTotalSec(
  leadDurationSec: number,
  useStagger: boolean,
): number {
  if (!useStagger) return leadDurationSec;
  const othersCount = packageSectionDefinitions.length - 1;
  const maxStartDelay = STAGGER_BETWEEN_CHIPS_SEC * othersCount;
  return maxStartDelay + leadDurationSec;
}

/** Overview entrance: drop from above with spring bounce (stagger per chip). */
const OVERVIEW_DROP_STAGGER_SEC = 0.09;
const overviewDropSpring = {
  type: "spring" as const,
  /** Slower / heavier feel to align with ~1s hub motion (still light bounce). */
  stiffness: 165,
  damping: 15,
  mass: 1.05,
};

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

  /** True after a category link click — staggers chips; false on first paint / overview. */
  const [staggerCategoryLayout, setStaggerCategoryLayout] = useState(false);

  /** Bumps when returning to overview so chip entrance replays. */
  const [overviewEntranceReplay, setOverviewEntranceReplay] = useState(0);
  const prevHasSectionRef = useRef<boolean | null>(null);

  useEffect(() => {
    if (!hasSection) setStaggerCategoryLayout(false);
  }, [hasSection]);

  useEffect(() => {
    if (prevHasSectionRef.current === true && hasSection === false) {
      setOverviewEntranceReplay((n) => n + 1);
    }
    prevHasSectionRef.current = hasSection;
  }, [hasSection]);

  const staggerChipMotion =
    staggerCategoryLayout && hasSection && !reduceMotion && section != null;

  const packageDetailsEntranceDelaySec = useMemo(() => {
    if (!hasSection || reduceMotion) return 0;
    return chipLayoutSequenceTotalSec(hubMotionDurationS, staggerChipMotion);
  }, [hasSection, reduceMotion, staggerChipMotion, hubMotionDurationS]);

  /** Exit runs first (`mode="wait"`); shift enter delay so we still align with chip motion end. */
  const sectionPanelExitDurationSec = hubMotionDurationS * 0.72;
  const packageDetailsAnimateDelaySec = useMemo(() => {
    if (!hasSection || reduceMotion) return 0;
    return Math.max(
      0,
      packageDetailsEntranceDelaySec - sectionPanelExitDurationSec,
    );
  }, [
    hasSection,
    reduceMotion,
    packageDetailsEntranceDelaySec,
    sectionPanelExitDurationSec,
  ]);

  useEffect(() => {
    if (!staggerCategoryLayout || !hasSection || reduceMotion) return;
    const ms =
      Math.ceil(
        chipLayoutSequenceTotalSec(hubMotionDurationS, true) * 1000,
      ) + 200;
    const id = window.setTimeout(() => setStaggerCategoryLayout(false), ms);
    return () => window.clearTimeout(id);
  }, [section, staggerCategoryLayout, hasSection, reduceMotion, hubMotionDurationS]);

  const meta = section ? packageSectionById[section] : null;
  const tours = section ? toursForSection(section) : [];

  const sectionPanelSlideDir = useSectionPanelSlideDirection(section);
  /** Horizontal slide distance for section ↔ section (enter vs exit are opposite). */
  const slidePx = 64;
  const panelEase = [0.22, 1, 0.36, 1] as const;
  /**
   * dir: forward in hub order → new panel enters from the right; old exits left.
   * Backward → new enters from left; old exits right. (Opposite directions.)
   */
  const sectionPanelVariants = {
    initial: (dir: 1 | -1 | 0) => {
      if (reduceMotion) return {};
      if (dir === 0) return { opacity: 0, y: 16 };
      return { opacity: 0, x: dir * slidePx };
    },
    animate: (_dir: 1 | -1 | 0) => {
      if (reduceMotion) {
        return {
          opacity: 1,
          x: 0,
          y: 0,
          transition: { duration: 0 },
        };
      }
      return {
        opacity: 1,
        x: 0,
        y: 0,
        transition: {
          duration: hubMotionDurationS,
          ease: panelEase,
          delay: packageDetailsAnimateDelaySec,
        },
      };
    },
    exit: (dir: 1 | -1 | 0) => {
      if (reduceMotion) return {};
      const t = {
        duration: sectionPanelExitDurationSec,
        ease: panelEase,
      };
      if (dir === 0) return { opacity: 0, y: 8, transition: t };
      /* Leave toward -dir so outgoing side matches opposite of incoming (+dir). */
      return { opacity: 0, x: -dir * slidePx, transition: t };
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
          </header>

          <div
            className={cn(
              hasSection &&
                "lg:grid lg:min-h-[calc(100dvh-var(--navbar-h)-8rem)] lg:grid-cols-[minmax(260px,18rem)_minmax(0,1fr)] lg:items-stretch lg:gap-x-10 xl:gap-x-14",
            )}
          >
            <aside
              className={cn(
                !hasSection && "space-y-6",
                hasSection &&
                  "flex flex-col gap-6 lg:h-full lg:min-h-0 lg:border-r lg:border-lagoon/20 lg:pr-8 xl:pr-10",
              )}
            >
              <h2
                id="packages-hub-heading"
                className="font-serif text-xl font-semibold text-forest"
              >
                Browse by category
              </h2>

              {/*
                Overview: chips drop from above (spring bounce, staggered). Section: full
                layout morph to compact grid; left column stretches to viewport on lg.
              */}
              <div
                className={cn(
                  !hasSection
                    ? "grid gap-4 overflow-hidden sm:grid-cols-2 lg:grid-cols-3"
                    : "grid w-full grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 lg:grid-cols-1 lg:gap-3 lg:flex-1 lg:auto-rows-min lg:overflow-y-auto lg:overflow-x-hidden lg:pr-2",
                )}
              >
                {packageSectionDefinitions.map((d, index) => {
                  const active = section === d.id;
                  const chipTransition = reduceMotion
                    ? transition
                    : {
                        ...transition,
                        delay:
                          staggerChipMotion && section
                            ? chipLayoutDelaySec(d.id, section)
                            : 0,
                      };
                  const showOverviewDrop = !hasSection && !reduceMotion;
                  return (
                    <motion.div
                      key={
                        hasSection
                          ? d.id
                          : `${d.id}-ov-${overviewEntranceReplay}`
                      }
                      layoutId={`pkg-cat-${d.id}`}
                      layout={hasSection && !reduceMotion}
                      initial={
                        showOverviewDrop
                          ? { opacity: 0, y: "-70vh" }
                          : false
                      }
                      animate={
                        showOverviewDrop
                          ? {
                              opacity: 1,
                              y: 0,
                              transition: {
                                ...overviewDropSpring,
                                delay: index * OVERVIEW_DROP_STAGGER_SEC,
                              },
                            }
                          : undefined
                      }
                      transition={hasSection ? chipTransition : undefined}
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
                        onClick={() => setStaggerCategoryLayout(true)}
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
            </aside>

            {hasSection ? (
              <div className="min-w-0 overflow-x-hidden lg:min-h-0">
                <AnimatePresence
                  mode="wait"
                  initial={false}
                  custom={sectionPanelSlideDir}
                >
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
            ) : null}
          </div>
        </LayoutGroup>
      </div>
    </div>
  );
}
