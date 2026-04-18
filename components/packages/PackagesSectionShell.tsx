import { PackagesSubnav } from "@/components/packages/PackagesSubnav";

export function PackagesSectionShell({
  children,
  /** Hide on `/packages` overview — category grid replaces the pill bar. */
  showSubnav = true,
}: {
  children: React.ReactNode;
  showSubnav?: boolean;
}) {
  return (
    <div className="min-h-screen bg-lagoon/10 px-4 py-12 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-6xl space-y-10">
        {showSubnav ? <PackagesSubnav /> : null}
        {children}
      </div>
    </div>
  );
}
