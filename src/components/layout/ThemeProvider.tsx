"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";
interface ThemeCtx { theme: Theme; toggle: () => void; }
const ThemeContext = createContext<ThemeCtx>({ theme: "light", toggle: () => {} });

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = (localStorage.getItem("theme") as Theme) || "light";
    setTheme(saved);
    document.documentElement.classList.toggle("dark", saved === "dark");
  }, []);

  const toggle = () => {
    setTheme((prev) => {
      const next = prev === "light" ? "dark" : "light";
      localStorage.setItem("theme", next);
      document.documentElement.classList.toggle("dark", next === "dark");
      return next;
    });
  };

  return (
    <ThemeContext.Provider value={{ theme: mounted ? theme : "light", toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
