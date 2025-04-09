import { Box } from "@mui/material";
import { CircularProgress } from "@mui/material";

export const Loader = () => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",

      color: (theme) => theme.palette.background.paper,
    }}
  >
    <CircularProgress />
  </Box>
);
