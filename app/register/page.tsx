import type { Metadata } from "next";
import Link from "next/link";
import { RegisterForm } from "@/components/auth/RegisterForm";

export const metadata: Metadata = {
  title: "Create account",
  description: "Create a Meridiano Ceylon account.",
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-lagoon/10 px-4 py-12 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-md">
        <Link
          href="/login"
          className="text-sm font-semibold text-lagoon underline-offset-4 transition hover:text-lagoon/80 hover:underline"
        >
          ← Login
        </Link>
        <h1 className="mt-6 font-serif text-3xl font-semibold text-forest sm:text-4xl">
          Create account
        </h1>
        <p className="mt-2 text-sm text-stone-600">
          Register with email and password. You can use the same account on
          future visits.
        </p>
        <div className="mt-8">
          <RegisterForm />
        </div>
      </div>
    </div>
  );
}
