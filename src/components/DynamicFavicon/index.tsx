import { useEffect } from "react";
import { useColorScheme } from "@mui/material/styles";

export const DynamicFavicon = () => {
  const { mode } = useColorScheme();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const favicon = document.querySelector("link[rel~='icon']") as HTMLLinkElement;

      const newFavicon = mode === "dark" ? "/dark.svg" : "/light.svg";

      console.log("Changing favicon to:", newFavicon);
      if (favicon) {
        favicon.href = newFavicon;
      }
    }
  }, [mode]);

  return null;
};
