/** Hub + subsection routes under `/packages` (listing pages, not tour detail slugs). */
export const PACKAGES_ROOT_HREF = "/packages";

export const packagesSubNavItems = [
  { href: "/packages", label: "Overview" },
  { href: "/packages/fixed-5-day", label: "5-day packages" },
  { href: "/packages/fixed-7-day", label: "7-day packages" },
  { href: "/packages/fixed-10-day", label: "10-day packages" },
  { href: "/packages/fixed-16-day", label: "16-day packages" },
  { href: "/packages/add-ons", label: "Add-ons" },
  { href: "/packages/specialty-tours", label: "Specialty tours" },
] as const;

export type PackagesSubNavHref = (typeof packagesSubNavItems)[number]["href"];

/** True for `/packages` and any nested route (listings, tour detail, book). */
export function isPackagesSectionPath(pathname: string): boolean {
  return pathname === PACKAGES_ROOT_HREF || pathname.startsWith("/packages/");
}
