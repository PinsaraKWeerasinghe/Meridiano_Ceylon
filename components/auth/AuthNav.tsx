"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut, type User } from "firebase/auth";
import { useNavbarContext } from "flowbite-react";
import { UserRound } from "lucide-react";
import { useAuthUser } from "@/components/auth/useAuthUser";
import { useUserRole } from "@/components/auth/useUserRole";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getFirebaseAuth, isFirebaseConfigured } from "@/lib/firebase";

const PROFILE_ROUTE = "/profile";
const ADMIN_USERS_ROUTE = "/admin/users";
/** Wire when the page exists (`null` = disabled). */
const TRIP_HISTORY_ROUTE = null as string | null;

export function AuthNav() {
  const router = useRouter();
  const { user, ready } = useAuthUser();
  const { role, roleReady } = useUserRole(user, ready);
  const { setIsOpen: setNavbarOpen } = useNavbarContext();

  async function handleSignOut() {
    if (!isFirebaseConfigured()) return;
    setNavbarOpen(false);
    await signOut(getFirebaseAuth());
    router.push("/");
    router.refresh();
  }

  const avatarNavClass =
    "flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-gold/35 bg-white/90 text-forest shadow-sm outline-none ring-offset-2 transition hover:border-gold/50 focus-visible:ring-2 focus-visible:ring-gold/40";

  if (!isFirebaseConfigured()) {
    return <LoggedOutGuestMenu avatarNavClass={avatarNavClass} />;
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
    const greeting = `Hi ${firstNameForGreeting(user)},`;

    return (
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className={avatarNavClass}
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
              {greeting}
            </p>
          </div>
          <div className="p-1">
            <PlaceholderNavItem
              href={PROFILE_ROUTE}
              label="Profile"
              onNavigate={() => setNavbarOpen(false)}
            />
            {roleReady && role === "admin" ? (
              <PlaceholderNavItem
                href={ADMIN_USERS_ROUTE}
                label="Users"
                onNavigate={() => setNavbarOpen(false)}
              />
            ) : null}
            <PlaceholderNavItem
              href={TRIP_HISTORY_ROUTE}
              label="Trip History"
              onNavigate={() => setNavbarOpen(false)}
            />
          </div>
          <DropdownMenuSeparator className="bg-gold/15" />
          <div className="p-1">
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

  return <LoggedOutGuestMenu avatarNavClass={avatarNavClass} />;
}

function LoggedOutGuestMenu({
  avatarNavClass,
}: {
  avatarNavClass: string;
}) {
  const pathname = usePathname();
  const { setIsOpen: setNavbarOpen } = useNavbarContext();

  const loginHref =
    pathname && pathname !== "/login"
      ? `/login?next=${encodeURIComponent(pathname)}`
      : "/login";
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={avatarNavClass}
          aria-label="Account menu"
        >
          <UserAvatar photoURL={null} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="z-[70] min-w-[17rem] border-gold/20 bg-[#e0ebe7] p-0 text-forest shadow-lg"
      >
        <div className="border-b border-gold/15 px-3 py-3">
          <p className="text-sm font-semibold text-forest">Hi Traveller,</p>
        </div>
        <div className="flex flex-col gap-4 px-3 py-4">
          <div className="space-y-2">
            <p className="text-sm leading-snug text-forest/90">
              Do you have an account?
            </p>
            <DropdownMenuItem
              className="cursor-pointer justify-center rounded-full bg-gold py-2.5 font-semibold text-cream focus:bg-gold focus:text-cream"
              asChild
            >
              <Link href={loginHref} onClick={() => setNavbarOpen(false)}>
                Login
              </Link>
            </DropdownMenuItem>
          </div>
          <div className="space-y-2">
            <p className="text-sm leading-snug text-forest/90">
              Still no account?
            </p>
            <DropdownMenuItem
              className="cursor-pointer justify-center rounded-full border border-forest/25 bg-white/60 py-2.5 font-semibold text-forest focus:bg-gold/15 focus:text-forest"
              asChild
            >
              <Link href="/register" onClick={() => setNavbarOpen(false)}>
                Create an account
              </Link>
            </DropdownMenuItem>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function PlaceholderNavItem({
  href,
  label,
  onNavigate,
}: {
  href: string | null;
  label: string;
  onNavigate?: () => void;
}) {
  if (href) {
    return (
      <DropdownMenuItem
        className="cursor-pointer rounded-lg text-forest focus:bg-gold/15 focus:text-forest"
        asChild
      >
        <Link href={href} onClick={onNavigate}>
          {label}
        </Link>
      </DropdownMenuItem>
    );
  }

  return (
    <DropdownMenuItem
      disabled
      className="rounded-lg text-forest data-[disabled]:pointer-events-none data-[disabled]:opacity-55"
    >
      {label}
    </DropdownMenuItem>
  );
}

/** First token of displayName, else a reasonable guess from email local part, else “there”. */
function firstNameForGreeting(user: User): string {
  const name = user.displayName?.trim();
  if (name) {
    const first = name.split(/\s+/)[0];
    if (first) return first;
  }
  const email = user.email?.trim();
  if (email) {
    const local = email.split("@")[0] ?? "";
    const segment = local.split(/[._-]/)[0] ?? local;
    if (segment) {
      return segment.charAt(0).toUpperCase() + segment.slice(1).toLowerCase();
    }
  }
  return "there";
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
