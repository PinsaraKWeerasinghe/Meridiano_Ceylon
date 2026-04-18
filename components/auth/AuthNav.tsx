"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
      <>
        <span
          className="inline-block md:hidden h-9 w-9 shrink-0 rounded-full bg-stone-200/80 animate-pulse"
          aria-hidden
        />
        <span
          className="hidden md:inline-block min-h-[2.25rem] min-w-[3.5rem] rounded-lg border border-transparent bg-transparent"
          aria-hidden
        />
      </>
    );
  }

  if (user) {
    return (
      <>
        <div className="md:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gold/35 bg-white/90 text-forest shadow-sm outline-none transition hover:bg-gold/10 focus-visible:ring-2 focus-visible:ring-gold/40",
                )}
                aria-label="Account"
              >
                <UserRound
                  className="h-[1.125rem] w-[1.125rem] opacity-90"
                  aria-hidden
                />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="z-[60] min-w-[10rem] border-gold/20 bg-[#e0ebe7] text-forest shadow-lg"
            >
              <DropdownMenuItem
                className="cursor-pointer focus:bg-gold/15 focus:text-forest"
                onSelect={() => void handleSignOut()}
              >
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div
          className={cn(
            "hidden md:flex md:flex-row md:items-center md:gap-3",
          )}
        >
          <span
            className="max-w-[12rem] truncate text-sm text-forest/80"
            title={user.email ?? undefined}
          >
            {user.email}
          </span>
          <button
            type="button"
            onClick={() => void handleSignOut()}
            className="rounded-lg border border-gold/30 bg-white/80 px-3 py-1.5 text-sm font-semibold text-forest transition hover:bg-gold/10"
          >
            Sign out
          </button>
        </div>
      </>
    );
  }

  return (
    <Link href="/login" className={linkClass}>
      Login
    </Link>
  );
}
