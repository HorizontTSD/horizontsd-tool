import { alpha, Theme } from "@mui/material/styles";
import type { Components } from "@mui/material/styles";
import { gray } from "../themePrimitives";

export const loaderCustomizations: Components<Theme> = {
  MuiCircularProgress: {
    styleOverrides: {
      root: ({ theme }: { theme: Theme }) => ({
        color: gray[900],

        [`&.MuiCircularProgress-indeterminate`]: {
          color: alpha(gray[900], 0.8),
        },

        [theme.breakpoints.down("sm")]: {
          color: gray[900],
        },

        ...theme.applyStyles("dark", {
          color: gray[100],
          [`&.MuiCircularProgress-indeterminate`]: {
            color: alpha(gray[300], 0.8),
          },
        }),
      }),
    },
  },
};
