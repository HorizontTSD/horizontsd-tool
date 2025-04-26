import { useMemo } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import type { ThemeOptions } from "@mui/material/styles";
import { colorSchemes, shadows, shape, typography } from "./themePrimitives";
import { useChangeTheme } from "@/hooks";
import { dataDisplayCustomizations } from "@/theme/customizations/dataDisplay";
import { feedbackCustomizations } from "@/theme/customizations/feedback";
import { inputsCustomizations } from "@/theme/customizations/inputs";
import { navigationCustomizations } from "@/theme/customizations/navigation";
import { surfacesCustomizations } from "@/theme/customizations/surfaces";

interface AppThemeProps {
  children: React.ReactNode;
  disableCustomTheme?: boolean;
  themeComponents?: ThemeOptions["components"];
}

export const AppTheme = (props: AppThemeProps) => {
  const { children, disableCustomTheme, themeComponents } = props;
  const { mode } = useChangeTheme();

  const theme = useMemo(() => {
    if (disableCustomTheme) return {};

    return createTheme({
      cssVariables: {
        colorSchemeSelector: "data-mui-color-scheme",
        cssVarPrefix: "template",
      },
      colorSchemes,
      typography,
      shadows,
      shape,
      components: {
        ...inputsCustomizations,
        ...dataDisplayCustomizations,
        ...feedbackCustomizations,
        ...navigationCustomizations,
        ...surfacesCustomizations,
        ...themeComponents,
      },
      palette: {
        mode,
      },
    });
  }, [disableCustomTheme, themeComponents, mode]);

  if (disableCustomTheme) {
    return <>{children}</>;
  }

  return (
    <ThemeProvider theme={theme} disableTransitionOnChange>
      {children}
    </ThemeProvider>
  );
};
