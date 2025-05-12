import { useColorScheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { LanguageDropdown } from "../dropdowns/LanguageDropdown";
import { ColorModeIconDropdown } from "../ColorModeIconDropdown";
import React from "react";
import { useTheme } from "@mui/material/styles";

interface HeaderProps {
  copyright?: string;
  theme?: "light" | "dark";
  language?: "ru" | "en" | "it";
  width?: "xs" | "sm" | "md" | "lg" | "xl";
  height?: "xs" | "sm" | "md" | "lg" | "xl";
  title?: string;
}

export function Header({
  copyright = "© 2025 Horizon TSD",
  theme,
  language,
  width,
  height,
  title = "FORECAST",
}: HeaderProps) {
  const { mode, setMode } = useColorScheme();
  const themeMUI = useTheme();
  const isDark = mode === "dark";
  const bgPalette = ["var(--mui-palette-secondary-dark)", "var(--mui-palette-secondary-main)"];
  const bg = bgPalette[~~!isDark];

  const getWidthStyles = () => {
    if (!width) return { width: "100%" };

    const breakpoints = {
      xs: { minWidth: 0, maxWidth: 600 },
      sm: { minWidth: 600, maxWidth: 900 },
      md: { minWidth: 900, maxWidth: 1200 },
      lg: { minWidth: 1200, maxWidth: 1536 },
      xl: { minWidth: 1536, maxWidth: "100%" },
    };

    return {
      minWidth: breakpoints[width].minWidth,
      maxWidth: breakpoints[width].maxWidth,
      width: "100%",
    };
  };

  const getHeightStyles = () => {
    if (!height) return { height: "60px" };

    const breakpoints = {
      xs: { height: "40px" },
      sm: { height: "50px" },
      md: { height: "60px" },
      lg: { height: "70px" },
      xl: { height: "80px" },
    };

    return {
      height: breakpoints[height].height,
    };
  };

  React.useEffect(() => {
    if (theme) {
      setMode(theme);
    }
  }, [theme, setMode]);

  return (
    <Stack
      sx={{
        alignItems: "center",
        background: bg,
        display: "flex",
        flexDirection: `row`,
        justifyContent: "center",
        padding: `1rem`,
        margin: "0 auto",
        ...getWidthStyles(),
        ...getHeightStyles(),
      }}
    >
      <Stack
        direction={"row"}
        justifyContent={"start"}
        alignItems={"baseline"}
        sx={{ width: `100%` }}
      >
        <Typography variant="h5" sx={{ color: `var(--mui-palette-common-white)` }}>
          {title}
        </Typography>
        <Typography variant="caption" sx={{ color: `var(--mui-palette-common-white)` }}>
          {copyright}
        </Typography>
      </Stack>
      <Stack
        direction="row"
        justifySelf="end"
        spacing={1}
        sx={{
          width: "100%",
          justifyContent: "end",
          alignItems: "center",
        }}
      >
        <LanguageDropdown />
        <ColorModeIconDropdown />
      </Stack>
    </Stack>
  );
}
