"use client";

import { useState } from "react";
import { ThemeMode } from "./themes";

const STORAGE_KEY = "noteflow-theme";

function getInitialTheme(): ThemeMode {
  if (typeof window === "undefined") {
    return "light";
  }

  const saved = window.localStorage.getItem(STORAGE_KEY);

  return saved === "dark" || saved === "light" ? saved : "light";
}

export function useTheme() {
  const [theme, setTheme] = useState<ThemeMode>(getInitialTheme);

  const changeTheme = (mode: ThemeMode) => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, mode);
    }

    setTheme(mode);
  };

  return {
    theme,
    changeTheme,
  };
}