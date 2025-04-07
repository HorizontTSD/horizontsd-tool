import { alpha, Box, Stack } from "@mui/material";
import { AlertSettings, Header, LoadForecast, OriginalProjectInfo } from "components";
import { useSelector } from "react-redux";
import { RootState } from "store/store";

export const Dashboard = () => {
  const activeComponent = useSelector(
    (state: RootState) => state.dashboardNavigation.activeComponent
  );

  return (
    <Box
      component="main"
      sx={(theme) => ({
        flexGrow: 1,
        backgroundColor: theme.vars
          ? `rgba(${theme.vars.palette.background.defaultChannel} / 1)`
          : alpha(theme.palette.background.default, 1),
        overflow: "auto",
      })}
    >
      <Stack
        spacing={2}
        sx={{
          alignItems: "center",
          mx: 3,
          pb: 2,
          mt: { xs: 8, md: 0 },
        }}
      >
        <Header />
        {activeComponent === "forecast" && <LoadForecast />}
        {activeComponent === "alerts" && <AlertSettings />}
        <OriginalProjectInfo />
      </Stack>
    </Box>
  );
};
