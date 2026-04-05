import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-stone-200/80 bg-white p-6 shadow-sm",
        className,
      )}
    >
      {children}
    </div>
  );
}
