import type { Metadata } from "next";
import Link from "next/link";
import { AdminUsersPageClient } from "@/components/admin/AdminUsersPageClient";

export const metadata: Metadata = {
  title: "Users",
  description: "View Meridiano Ceylon user profiles and roles (admins only).",
};

export default function AdminUsersPage() {
  return (
    <div className="min-h-screen bg-lagoon/10 px-4 py-12 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/"
          className="text-sm font-semibold text-lagoon underline-offset-4 transition hover:text-lagoon/80 hover:underline"
        >
          ← Home
        </Link>
        <h1 className="mt-6 font-serif text-3xl font-semibold text-forest sm:text-4xl">
          Users
        </h1>
        <p className="mt-2 text-sm text-stone-600">
          Email, role, created and last modified times from the data source. New
          accounts default to Traveller.
        </p>
        <div className="mt-10">
          <AdminUsersPageClient />
        </div>
      </div>
    </div>
  );
}
