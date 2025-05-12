import { ThemeProvider, createTheme } from "@mui/material/styles";
import type { ThemeOptions } from "@mui/material/styles";
import { lightBlue, blue, grey, blueGrey, indigo } from "@mui/material/colors";
import { useColorScheme } from "@mui/material/styles";
import React from "react";

const bg = {
  50: "#dddee0",
  100: "#b5b6bb",
  200: "#8e9098",
  300: "#6a6c73",
  400: "#484a4e",
  500: "#292A2D",
  600: "#101112",
  700: "#0E0F10",
  800: "#0C0D0E",
  900: "#090A0B",
};

const theme = createTheme({
  cssVariables: {
    colorSchemeSelector: "class",
  },
  shape: {
    borderRadius: 18,
  },
  colorSchemes: {
    light: {
      palette: {
        info: indigo,
        primary: {
          main: grey[600],
          light: grey[100],
          dark: grey[900],
          contrastText: lightBlue[400],
        },
        secondary: {
          main: lightBlue[600],
          light: grey[50],
          dark: lightBlue[900],
          contrastText: lightBlue[500],
        },
        text: {
          primary: grey[900],
          secondary: grey[700],
        },
      },
    },
    dark: {
      palette: {
        info: blue,
        primary: {
          main: bg[500],
          light: bg[50],
          dark: bg[600],
          contrastText: blue[800],
        },
        secondary: {
          main: blueGrey[500],
          light: blueGrey[50],
          dark: blueGrey[900],
          contrastText: blue[800],
        },
        text: {
          primary: grey[100],
          secondary: grey[400],
        },
      },
    },
  },
});

interface AppThemeProps {
  children: React.ReactNode;
  disableCustomTheme?: boolean;
  themeComponents?: ThemeOptions["components"];
  initialMode?: "light" | "dark";
}

export const AppTheme = (props: AppThemeProps) => {
  const { children, disableCustomTheme, initialMode } = props;
  const { setMode } = useColorScheme();

  React.useEffect(() => {
    if (initialMode) {
      setMode(initialMode);
    }
  }, [initialMode, setMode]);

  if (disableCustomTheme) {
    return <>{children}</>;
  }

  return (
    <ThemeProvider theme={theme} disableTransitionOnChange>
      {children}
    </ThemeProvider>
  );
};
