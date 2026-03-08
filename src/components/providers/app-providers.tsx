"use client";

import type { ReactNode } from "react";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { AuthProvider } from "@/lib/auth-context";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
      <AuthProvider>{children}</AuthProvider>
    </ThemeProvider>
  );
}
