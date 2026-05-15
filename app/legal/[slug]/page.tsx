import type { Metadata } from "next";
import { readFile } from "fs/promises";
import { join } from "path";
import { notFound } from "next/navigation";
import { LegalPolicyPageClient } from "@/components/legal/LegalPolicyPageClient";
import {
  LEGAL_POLICY_SLUGS,
  isLegalPolicySlug,
  legalPolicyFileName,
  type LegalPolicySlug,
} from "@/lib/legal-documents";

const TITLES: Record<LegalPolicySlug, string> = {
  terms: "Terms & Conditions",
  privacy: "Privacy Policy",
  refund: "Refund Policy",
};

export function generateStaticParams() {
  return LEGAL_POLICY_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  if (!isLegalPolicySlug(params.slug)) return {};
  return {
    title: TITLES[params.slug],
    description: `${TITLES[params.slug]} — Meridiano Ceylon.`,
  };
}

export default async function LegalPolicyPage({
  params,
}: {
  params: { slug: string };
}) {
  if (!isLegalPolicySlug(params.slug)) notFound();

  const filePath = join(
    process.cwd(),
    "public",
    "Documents",
    legalPolicyFileName(params.slug),
  );
  const content = await readFile(filePath, "utf-8");

  return <LegalPolicyPageClient content={content} />;
}
