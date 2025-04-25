import { RouterProvider } from "react-router";
import { CssBaseline } from "@mui/material";
import { Provider } from "react-redux";
import { DynamicFavicon } from "components";
import {
  chartsCustomizations,
  treeViewCustomizations,
  loaderCustomizations,
  AppTheme,
} from "theme";
import "i18/index";

import { router } from "router";
import { store } from "store";

const xThemeComponents = {
  ...chartsCustomizations,
  ...treeViewCustomizations,
  ...loaderCustomizations,
};

export function App() {
  return (
    <>
      <Provider store={store}>
        <AppTheme themeComponents={xThemeComponents}>
          <DynamicFavicon />
          <CssBaseline enableColorScheme />
          <RouterProvider router={router} />
        </AppTheme>
      </Provider>
    </>
  );
}
