"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type ImageColumnRevealProps = {
  children: ReactNode;
  /** Stagger start of each panel’s entrance (left → right). */
  index: number;
};

export function ImageColumnReveal({ children, index }: ImageColumnRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  /** Matches `FixedPackagePanel`: even index → images on the right; odd → images on the left. */
  const imageOnRight = index % 2 === 0;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
          io.unobserve(entry.target);
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn(
        "min-w-0 flex-1 basis-0 will-change-transform",
        "transition-[opacity,transform] duration-700 ease-out",
        "motion-reduce:duration-0 motion-reduce:translate-x-0 motion-reduce:translate-y-0 motion-reduce:opacity-100",
        visible
          ? "translate-x-0 translate-y-0 opacity-100"
          : cn(
              "translate-y-2 opacity-0",
              imageOnRight ? "translate-x-12" : "-translate-x-12",
            ),
      )}
      style={{
        transitionDelay: visible ? `${index * 120}ms` : "0ms",
      }}
    >
      <div
        className={cn(
          "h-full motion-reduce:animate-none",
          visible && "motion-safe:animate-float-soft",
        )}
      >
        {children}
      </div>
    </div>
  );
}
