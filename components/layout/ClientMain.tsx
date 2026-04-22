import type { ReactNode } from "react";

export function ClientMain({ children }: { children: ReactNode }) {
  return (
    <main className="flex-1 pt-[var(--navbar-h)]">{children}</main>
  );
}
