import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginBackLink } from "@/components/auth/LoginBackLink";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Login",
  description: "Sign in to your Meridiano Ceylon account.",
};

function LoginFormFallback() {
  return (
    <div
      className="h-48 animate-pulse rounded-xl border border-stone-200 bg-white/60"
      aria-hidden
    />
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-lagoon/10 px-4 py-12 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-md">
        <LoginBackLink className="cursor-pointer text-sm font-semibold text-lagoon underline-offset-4 transition hover:text-lagoon/80 hover:underline" />
        <h1 className="mt-6 font-serif text-3xl font-semibold text-forest sm:text-4xl">
          Login
        </h1>
        <p className="mt-2 text-sm text-stone-600">
          Sign in with Google or the email and password you used to register.
        </p>
        <div className="mt-8">
          <Suspense fallback={<LoginFormFallback />}>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
