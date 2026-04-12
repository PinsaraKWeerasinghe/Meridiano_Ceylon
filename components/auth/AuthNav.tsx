"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { useEffect, useState } from "react";
import { getFirebaseAuth, isFirebaseConfigured } from "@/lib/firebase";
import { cn } from "@/lib/utils";

export function AuthNav() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!isFirebaseConfigured()) {
      setReady(true);
      return;
    }
    const auth = getFirebaseAuth();
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setReady(true);
    });
    return () => unsub();
  }, []);

  async function handleSignOut() {
    if (!isFirebaseConfigured()) return;
    await signOut(getFirebaseAuth());
    router.push("/");
    router.refresh();
  }

  const linkClass =
    "rounded-lg border border-gold/30 bg-white/80 px-3 py-1.5 text-xs font-semibold text-forest transition hover:bg-gold/10 md:text-sm";

  // Production: add NEXT_PUBLIC_FIREBASE_* in Vercel (all envs) so auth works.
  // Still show Login when env is missing so the control is never hidden.
  if (!isFirebaseConfigured()) {
    return (
      <Link href="/login" className={linkClass}>
        Login
      </Link>
    );
  }

  if (!ready) {
    return (
      <span
        className="inline-block min-h-[2.25rem] min-w-[3.5rem] rounded-lg border border-transparent bg-transparent"
        aria-hidden
      />
    );
  }

  if (user) {
    return (
      <div
        className={cn(
          "flex flex-col items-stretch gap-2 md:flex-row md:items-center md:gap-3",
        )}
      >
        <span
          className="max-w-[10rem] truncate text-xs text-forest/80 md:max-w-[12rem] md:text-sm"
          title={user.email ?? undefined}
        >
          {user.email}
        </span>
        <button
          type="button"
          onClick={() => void handleSignOut()}
          className="rounded-lg border border-gold/30 bg-white/80 px-3 py-1.5 text-xs font-semibold text-forest transition hover:bg-gold/10 md:text-sm"
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <Link href="/login" className={linkClass}>
      Login
    </Link>
  );
}
