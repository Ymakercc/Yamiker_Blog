"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type Theme = "pixel" | "glass";

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (t: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Default pixel; the no-flash inline script in layout sets the real value
  // on <html data-theme> before paint, and we read it back on mount.
  const [theme, setThemeState] = useState<Theme>("pixel");

  useEffect(() => {
    const current =
      (document.documentElement.getAttribute("data-theme") as Theme) || "pixel";
    setThemeState(current);
  }, []);

  const applyTheme = (t: Theme) => {
    document.documentElement.setAttribute("data-theme", t);
    try {
      localStorage.setItem("theme", t);
    } catch {
      /* private mode — ignore */
    }
    setThemeState(t);
  };

  const toggleTheme = () => applyTheme(theme === "pixel" ? "glass" : "pixel");

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme: applyTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
  return ctx;
}
