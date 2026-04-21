"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const current = (mounted ? resolvedTheme ?? theme : "light") as "light" | "dark";

  return (
    <button
      type="button"
      aria-label="Toggle theme"
      className="btn btn-ghost"
      onClick={() => setTheme(current === "dark" ? "light" : "dark")}
    >
      <span aria-hidden>{mounted ? (current === "dark" ? "☾" : "☀") : "☀"}</span>
      <span className="hidden sm:inline">{current === "dark" ? "Dark" : "Light"}</span>
    </button>
  );
}
