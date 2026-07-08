// @ts-nocheck
import type { ReactNode } from "react";
import { createContext, useContext } from "react";

type Theme = "light" | "dark";

const ThemeContext = createContext<Theme | null>(null);

export function ThemeProvider({
  theme,
  children,
}: {
  theme: Theme;
  children: ReactNode;
}) {
  return <ThemeContext value={theme}>{children}</ThemeContext>;
}

export function useTheme() {
  const theme = useContext(ThemeContext);
  if (theme === null) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }
  return theme;
}
