"use client";

import Link from "next/link";
import { PolicyMarkdown } from "@/components/legal/PolicyMarkdown";
import { Card } from "@/components/ui/Card";

export function LegalPolicyPageClient({ content }: { content: string }) {
  return (
    <div className="min-h-screen bg-lagoon/10 px-4 py-12 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/"
          className="text-sm font-semibold text-lagoon underline-offset-4 transition hover:text-lagoon/80 hover:underline"
        >
          ← Home
        </Link>

        <Card className="mt-8 border-lagoon/20 p-6 shadow-sm sm:p-10">
          <PolicyMarkdown content={content} variant="page" />
        </Card>
      </div>
    </div>
  );
}
