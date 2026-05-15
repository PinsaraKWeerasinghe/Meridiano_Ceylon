/** Slugs for `/legal/[slug]` routes (authoritative policy pages). */
export const LEGAL_POLICY_SLUGS = ["terms", "privacy", "refund"] as const;
export type LegalPolicySlug = (typeof LEGAL_POLICY_SLUGS)[number];

const DOCUMENT_FILES: Record<LegalPolicySlug, string> = {
  terms: "Terms_and_Conditions.md",
  privacy: "Privacy_Policy.md",
  refund: "Refund_Policy.md",
};

/** Path segment under `public/Documents` */
export function legalPolicyFileName(slug: LegalPolicySlug): string {
  return DOCUMENT_FILES[slug];
}

export function legalPolicyHref(slug: LegalPolicySlug): string {
  return `/Documents/${DOCUMENT_FILES[slug]}`;
}

export function isLegalPolicySlug(s: string): s is LegalPolicySlug {
  return (LEGAL_POLICY_SLUGS as readonly string[]).includes(s);
}
