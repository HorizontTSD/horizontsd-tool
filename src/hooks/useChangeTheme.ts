import { useState, useEffect, useCallback } from "react";
import { PaletteMode } from "@mui/material";

export const useChangeTheme = () => {
  const [mode, setMode] = useState<PaletteMode>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("themeMode") as PaletteMode) || "light";
    }
    return "light";
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("themeMode", mode);
      document.documentElement.setAttribute("data-mui-color-scheme", mode);
    }
  }, [mode]);

  const toggleColorMode = useCallback(() => {
    setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  }, []);

  return {
    mode,
    toggleColorMode,
  };
};
