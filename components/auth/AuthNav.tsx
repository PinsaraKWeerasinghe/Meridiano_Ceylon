"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { useNavbarContext } from "flowbite-react";
import { UserRound } from "lucide-react";
import { useAuthUser } from "@/components/auth/useAuthUser";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getFirebaseAuth, isFirebaseConfigured } from "@/lib/firebase";

export function AuthNav() {
  const router = useRouter();
  const { user, ready } = useAuthUser();
  const { setIsOpen: setNavbarOpen } = useNavbarContext();

  async function handleSignOut() {
    if (!isFirebaseConfigured()) return;
    setNavbarOpen(false);
    await signOut(getFirebaseAuth());
    router.push("/");
    router.refresh();
  }

  const linkClass =
    "rounded-lg border border-gold/30 bg-white/80 px-3 py-1.5 text-xs font-semibold text-forest transition hover:bg-gold/10 md:text-sm";

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
        className="inline-block h-9 w-9 shrink-0 rounded-full bg-stone-200/80 animate-pulse"
        aria-hidden
      />
    );
  }

  if (user) {
    const displayLabel = user.displayName?.trim() || "Your account";

    return (
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-gold/35 bg-white/90 text-forest shadow-sm outline-none ring-offset-2 transition hover:border-gold/50 focus-visible:ring-2 focus-visible:ring-gold/40"
            aria-label="Account menu"
          >
            <UserAvatar photoURL={user.photoURL} />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          sideOffset={8}
          className="z-[70] min-w-[16rem] border-gold/20 bg-[#e0ebe7] p-0 text-forest shadow-lg"
        >
          <div className="border-b border-gold/15 px-3 py-3">
            <p className="truncate text-sm font-semibold text-forest">
              {displayLabel}
            </p>
            {user.email ? (
              <p className="mt-1.5 break-all text-xs leading-snug text-stone-600">
                {user.email}
              </p>
            ) : (
              <p className="mt-1.5 text-xs text-stone-500">No email on file</p>
            )}
          </div>
          <div className="hidden p-1 md:block">
            <DropdownMenuItem
              className="cursor-pointer rounded-lg font-semibold text-forest focus:bg-gold/15 focus:text-forest"
              onSelect={(e) => {
                e.preventDefault();
                void handleSignOut();
              }}
            >
              Sign out
            </DropdownMenuItem>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Link href="/login" className={linkClass}>
      Login
    </Link>
  );
}

const avatarClass = "h-full w-full object-cover";

function UserAvatar({ photoURL }: { photoURL: string | null }) {
  if (photoURL) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- OAuth URLs; avoid remotePatterns for every provider
      <img
        src={photoURL}
        alt=""
        className={avatarClass}
        referrerPolicy="no-referrer"
      />
    );
  }

  return (
    <UserRound
      className="h-[1.125rem] w-[1.125rem] opacity-90"
      aria-hidden
    />
  );
}
