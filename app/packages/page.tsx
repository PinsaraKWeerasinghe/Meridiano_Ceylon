import type { Metadata } from "next";
import { Suspense } from "react";
import { PackagesInteractiveHub } from "@/components/packages/PackagesInteractiveHub";
import {
  PACKAGES_OVERVIEW_META,
  packageSectionById,
  parsePackagesSection,
  type PackageSectionId,
} from "@/lib/packages-nav";

type PageProps = {
  searchParams: { section?: string | string[] };
};

function parseInitialSection(
  raw: string | string[] | undefined,
): PackageSectionId | null {
  return parsePackagesSection(raw);
}

export async function generateMetadata({
  searchParams,
}: PageProps): Promise<Metadata> {
  const section = parseInitialSection(searchParams.section);
  if (!section) {
    return {
      title: PACKAGES_OVERVIEW_META.title,
      description: PACKAGES_OVERVIEW_META.description,
    };
  }
  const m = packageSectionById[section];
  return {
    title: m.metaTitle,
    description: m.metaDescription,
  };
}

function PackagesHubFallback() {
  return (
    <div className="min-h-screen bg-lagoon/10 px-4 py-12 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-6xl animate-pulse space-y-8">
        <div className="h-10 max-w-md rounded-lg bg-stone-200/80" />
        <div className="h-4 max-w-2xl rounded bg-stone-200/60" />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-14 rounded-xl border border-lagoon/10 bg-white/40"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function PackagesPage({ searchParams }: PageProps) {
  const initialSection = parseInitialSection(searchParams.section);

  return (
    <Suspense fallback={<PackagesHubFallback />}>
      <PackagesInteractiveHub initialSection={initialSection} />
    </Suspense>
  );
}
