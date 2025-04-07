import { RouterProvider } from "react-router";
import { CssBaseline } from "@mui/material";
import { Provider } from "react-redux";

import {
  chartsCustomizations,
  dataGridCustomizations,
  datePickersCustomizations,
  treeViewCustomizations,
  loaderCustomizations,
  AppTheme,
} from "theme";
import "i18/index";

import { router } from "router";
import { store } from "store";

const xThemeComponents = {
  ...chartsCustomizations,
  ...dataGridCustomizations,
  ...datePickersCustomizations,
  ...treeViewCustomizations,
  ...loaderCustomizations,
};

export function App() {
  return (
    <>
      <Provider store={store}>
        <AppTheme themeComponents={xThemeComponents}>
          <CssBaseline enableColorScheme />
          <RouterProvider router={router} />
        </AppTheme>
      </Provider>
    </>
  );
}
