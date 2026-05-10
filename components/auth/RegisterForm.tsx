"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { Card } from "@/components/ui/Card";
import { getFirebaseAuth, isFirebaseConfigured } from "@/lib/firebase";
import { formatAuthError } from "@/lib/firebase/auth-errors";
import {
  ensureUserTravelerDefaults,
  seedNewRegisteredUser,
} from "@/lib/user-profile";

export function RegisterForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isFirebaseConfigured()) {
    return (
      <Card className="border-lagoon/25 p-6 shadow-sm">
        <p className="text-sm text-stone-700">
          Firebase is not configured. Add{" "}
          <code className="rounded bg-stone-100 px-1 text-xs">NEXT_PUBLIC_FIREBASE_*</code>{" "}
          to your environment.
        </p>
      </Card>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(
        getFirebaseAuth(),
        email.trim(),
        password,
      );
      await seedNewRegisteredUser(cred.user.uid, cred.user.email);
      router.push("/");
      router.refresh();
    } catch (err: unknown) {
      const code =
        err && typeof err === "object" && "code" in err
          ? String((err as { code?: string }).code)
          : undefined;
      setError(formatAuthError(code));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="border-lagoon/25 p-6 shadow-sm shadow-lagoon/10 sm:p-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-forest">
            Email
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-stone-900 outline-none ring-lagoon/25 focus:ring-2"
            />
          </label>
        </div>
        <div>
          <label className="block text-sm font-medium text-forest">
            Password
            <input
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="mt-1 w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-stone-900 outline-none ring-lagoon/25 focus:ring-2"
            />
          </label>
          <p className="mt-1 text-xs text-stone-500">
            At least 6 characters (Firebase minimum).
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium text-forest">
            Confirm password
            <input
              type="password"
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              className="mt-1 w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-stone-900 outline-none ring-lagoon/25 focus:ring-2"
            />
          </label>
        </div>

        {error ? (
          <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-gold py-3 text-sm font-semibold text-cream transition hover:bg-[#1d5349] disabled:opacity-60"
        >
          {loading ? "Creating account…" : "Create account"}
        </button>

        <p className="text-center text-sm text-stone-600">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-lagoon underline-offset-4 hover:underline"
          >
            Sign in
          </Link>
        </p>
      </form>
    </Card>
  );
}
