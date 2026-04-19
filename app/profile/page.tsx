import type { Metadata } from "next";
import Link from "next/link";
import { ProfileForm } from "@/components/profile/ProfileForm";

export const metadata: Metadata = {
  title: "Profile",
  description: "View and edit your Meridiano Ceylon profile.",
};

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-lagoon/10 px-4 py-12 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-lg">
        <Link
          href="/"
          className="text-sm font-semibold text-lagoon underline-offset-4 transition hover:text-lagoon/80 hover:underline"
        >
          ← Home
        </Link>
        <h1 className="mt-6 font-serif text-3xl font-semibold text-forest sm:text-4xl">
          Profile
        </h1>
        <p className="mt-2 text-sm text-stone-600">
          Update your photo, name, travel details, and email.
        </p>
        <div className="mt-8">
          <ProfileForm />
        </div>
      </div>
    </div>
  );
}
