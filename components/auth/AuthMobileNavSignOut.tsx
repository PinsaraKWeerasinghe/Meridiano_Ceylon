"use client";

import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { useNavbarContext } from "flowbite-react";
import { getFirebaseAuth, isFirebaseConfigured } from "@/lib/firebase";
import { useAuthUser } from "@/components/auth/useAuthUser";

/** Sign out at the bottom of the mobile nav sheet (md:hidden). Desktop uses AuthNav dropdown. */
export function AuthMobileNavSignOut() {
  const router = useRouter();
  const { setIsOpen: setNavbarOpen } = useNavbarContext();
  const { user, ready } = useAuthUser();

  async function handleSignOut() {
    if (!isFirebaseConfigured()) return;
    setNavbarOpen(false);
    await signOut(getFirebaseAuth());
    router.push("/");
    router.refresh();
  }

  if (!isFirebaseConfigured() || !ready || !user) return null;

  return (
    <button
      type="button"
      onClick={() => void handleSignOut()}
      className="inline-flex min-w-0 max-w-[11rem] shrink-0 items-center justify-center rounded-lg bg-forest px-5 py-2 text-sm font-semibold text-cream shadow-sm transition hover:bg-forestHover"
    >
      Sign out
    </button>
  );
}
