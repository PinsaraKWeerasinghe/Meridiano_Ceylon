"use client";

import { ThemeProvider } from "flowbite-react";

export function FlowbiteThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ThemeProvider>{children}</ThemeProvider>;
}
