"use client";

import { usePathname } from "next/navigation";
import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
import { homeMorphProgress } from "@/lib/home-nav-morph";

const HomeScrollContext = createContext<number>(1);

export function useHomeMorphProgress(): number {
  return useContext(HomeScrollContext);
}

type HomeScrollProviderProps = {
  children: React.ReactNode;
};

function readScrollY() {
  return window.scrollY ?? document.documentElement.scrollTop ?? 0;
}

export function HomeScrollProvider({ children }: HomeScrollProviderProps) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrollY, setScrollY] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onMq = () => setReducedMotion(mq.matches);
    mq.addEventListener("change", onMq);
    return () => mq.removeEventListener("change", onMq);
  }, []);

  useLayoutEffect(() => {
    if (!isHome) return;
    setScrollY(readScrollY());
  }, [isHome]);

  useEffect(() => {
    if (!isHome) return;

    const sync = () => setScrollY(readScrollY());

    sync();
    window.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("load", sync);
    window.addEventListener("pageshow", sync);

    return () => {
      window.removeEventListener("scroll", sync);
      window.removeEventListener("load", sync);
      window.removeEventListener("pageshow", sync);
    };
  }, [isHome]);

  const progress = useMemo(() => {
    if (!isHome) return 1;
    if (reducedMotion) return scrollY > 80 ? 1 : 0;
    return homeMorphProgress(scrollY);
  }, [isHome, reducedMotion, scrollY]);

  const value = useMemo(() => progress, [progress]);

  return (
    <HomeScrollContext.Provider value={value}>
      {children}
    </HomeScrollContext.Provider>
  );
}
