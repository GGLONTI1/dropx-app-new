"use client";

import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import React, { ReactNode } from "react";

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  return <NextThemesProvider attribute="class">{children}</NextThemesProvider>;
}
