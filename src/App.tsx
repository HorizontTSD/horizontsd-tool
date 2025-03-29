import { RouterProvider } from "react-router";
import { CssBaseline } from "@mui/material";
import { StrictMode } from "react";

import {
  chartsCustomizations,
  dataGridCustomizations,
  datePickersCustomizations,
  treeViewCustomizations,
  loaderCustomizations,
  AppTheme,
} from "theme";

import { router } from "router";

const xThemeComponents = {
  ...chartsCustomizations,
  ...dataGridCustomizations,
  ...datePickersCustomizations,
  ...treeViewCustomizations,
  ...loaderCustomizations,
};

export function App() {
  return (
    <StrictMode>
      <AppTheme themeComponents={xThemeComponents}>
        <CssBaseline enableColorScheme />
        <RouterProvider router={router} />
      </AppTheme>
    </StrictMode>
  );
}
