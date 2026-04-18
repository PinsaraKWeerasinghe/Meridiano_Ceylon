/** Hub + subsection routes under `/packages` (listing pages, not tour detail slugs). */
export const PACKAGES_ROOT_HREF = "/packages";

const SECTION_QUERY_KEY = "section";

export const PACKAGE_SECTION_IDS = [
  "fixed-5-day",
  "fixed-7-day",
  "fixed-10-day",
  "fixed-16-day",
  "add-ons",
  "specialty-tours",
] as const;

export type PackageSectionId = (typeof PACKAGE_SECTION_IDS)[number];

const SECTION_ID_SET = new Set<string>(PACKAGE_SECTION_IDS);

export type PackageSectionMeta = {
  id: PackageSectionId;
  label: string;
  pageTitle: string;
  pageDescription: string;
  metaTitle: string;
  metaDescription: string;
};

/** Copy for hub section + SEO (mirrors former subsection pages). */
export const packageSectionDefinitions: readonly PackageSectionMeta[] = [
  {
    id: "fixed-5-day",
    label: "5-day packages",
    pageTitle: "5-day packages",
    pageDescription:
      "Shorter itineraries with a clear rhythm — ideal when time is tight but you still want signature Sri Lankan landscapes and culture.",
    metaTitle: "5-day packages",
    metaDescription:
      "Five-day fixed itineraries — beach, safari, hills, and coast in balance.",
  },
  {
    id: "fixed-7-day",
    label: "7-day packages",
    pageTitle: "7-day packages",
    pageDescription:
      "A full week to settle into the route — from hill country and heritage to wildlife and the sea.",
    metaTitle: "7-day packages",
    metaDescription:
      "Seven-day fixed tours — highlands, safari, coast, and cultural depth.",
  },
  {
    id: "fixed-10-day",
    label: "10-day packages",
    pageTitle: "10-day packages",
    pageDescription:
      "More room to explore UNESCO sites, national parks, and slower coastal days without rushing the highlights.",
    metaTitle: "10-day packages",
    metaDescription:
      "Ten-day fixed itineraries — ancient cities, coast, safari, and specialty routes.",
  },
  {
    id: "fixed-16-day",
    label: "16-day packages",
    pageTitle: "16-day packages",
    pageDescription:
      "The full breadth of the island in one thoughtfully paced route — from the northern tip to the southern coast.",
    metaTitle: "16-day packages",
    metaDescription:
      "Sixteen-day cross-country expedition — north to south across Sri Lanka.",
  },
  {
    id: "add-ons",
    label: "Add-ons",
    pageTitle: "Add-ons",
    pageDescription:
      "Optional layers designed to bolt onto your core itinerary — nightlife, retail, wellness, and authentic village experiences.",
    metaTitle: "Add-ons",
    metaDescription:
      "Optional add-ons — village kitchen, nightlife, wellness, and curated shopping.",
  },
  {
    id: "specialty-tours",
    label: "Specialty tours",
    pageTitle: "Specialty tours",
    pageDescription:
      "Tailored for passions beyond a classic holiday — logistics, permits, long stays, and experiences built around how you travel.",
    metaTitle: "Specialty tours",
    metaDescription:
      "Specialty journeys — photography, long-stay, volunteering, transport, and adventure.",
  },
] as const;

export const packageSectionById: Record<
  PackageSectionId,
  PackageSectionMeta
> = Object.fromEntries(
  packageSectionDefinitions.map((d) => [d.id, d]),
) as Record<PackageSectionId, PackageSectionMeta>;

export const PACKAGES_OVERVIEW_META = {
  title: "Packages & tours",
  description:
    "Browse fixed itineraries by length, add-ons, and specialty tours — Meridiano Ceylon.",
} as const;

/** `/packages?section=fixed-5-day` */
export function packagesSectionHref(id: PackageSectionId): string {
  const q = new URLSearchParams();
  q.set(SECTION_QUERY_KEY, id);
  return `${PACKAGES_ROOT_HREF}?${q.toString()}`;
}

export function parsePackagesSection(
  raw: string | string[] | null | undefined,
): PackageSectionId | null {
  if (raw == null) return null;
  const v = Array.isArray(raw) ? raw[0] : raw;
  if (!v || typeof v !== "string") return null;
  return SECTION_ID_SET.has(v) ? (v as PackageSectionId) : null;
}

/** Navbar Packages dropdown: Overview plus every subsection (query URLs). */
export const packagesNavDropdownItems = [
  { href: PACKAGES_ROOT_HREF, label: "Overview" },
  ...packageSectionDefinitions.map((d) => ({
    href: packagesSectionHref(d.id),
    label: d.label,
  })),
] as const;

/** True for `/packages` and any nested route (listings, tour detail, book). */
export function isPackagesSectionPath(pathname: string): boolean {
  return pathname === PACKAGES_ROOT_HREF || pathname.startsWith("/packages/");
}
