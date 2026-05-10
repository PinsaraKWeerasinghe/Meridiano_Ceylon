"use client";

import { useRouter } from "next/navigation";

type LoginBackLinkProps = {
  className?: string;
};

/**
 * Leaves login without advertising Home — uses browser history when possible.
 */
export function LoginBackLink({ className }: LoginBackLinkProps) {
  const router = useRouter();

  function handleClick() {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
      return;
    }
    router.push("/");
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={className}
    >
      ← Back
    </button>
  );
}
