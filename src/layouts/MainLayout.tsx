import { Outlet } from "react-router";
import { Box } from "@mui/material";
import { SideMenu } from "@/components";

export const MainLayout = () => {
  return (
    <Box sx={{ display: "flex" }}>
      <SideMenu />
      <Box sx={{ flexGrow: 1, overflow: "auto" }}>
        <Outlet />
      </Box>
    </Box>
  );
};
