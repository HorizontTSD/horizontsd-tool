import { styled, useColorScheme } from "@mui/material/styles";
import MuiDrawer, { drawerClasses } from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import { SelectContent, MenuContent } from "components";
import { Stack } from "@mui/material";

// const drawerWidth = 250;
const drawerWidth = 260;


import macosLightUrl from "assets/svg/logoMacosx/white.svg?url";
import macosDarkUrl from "assets/svg/logoMacosx/dark.svg?url";
import windowsLightUrl from "assets/svg/logoPc/white.svg?url";
import windowsDarkUrl from "assets/svg/logoPc/dark.svg?url";
import { useState } from "react";

const LOGO_THEMES = [
  {
    code: "windows",
    name: "Windows",
    lightUrl: windowsLightUrl,
    darkUrl: windowsDarkUrl,
  },
  {
    code: "macos",
    name: "macOS",
    lightUrl: macosLightUrl,
    darkUrl: macosDarkUrl,
  },
];

const Drawer = styled(MuiDrawer)({
  width: drawerWidth,
  flexShrink: 0,
  boxSizing: "border-box",
  mt: 10,
  [`& .${drawerClasses.paper}`]: {
    width: drawerWidth,
    boxSizing: "border-box",
  },
});

export const SideMenu = () => {
  const { mode } = useColorScheme();
  const [currentOS] = useState("windows");

  const currentLogoData = LOGO_THEMES.find((os) => os.code === currentOS);

  const logoUrl = mode === "dark" ? currentLogoData?.lightUrl : currentLogoData?.darkUrl;

  return (
    <Drawer
      variant="permanent"
      sx={{
        display: { xs: "none", md: "block" },
        [`& .${drawerClasses.paper}`]: {
          backgroundColor: "background.paper",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: 64,
          px: 2,
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        {logoUrl && (
          <Box
            component="img"
            src={logoUrl}
            alt={currentLogoData?.name || "Logo"}
            sx={{
              height: 207,
              width: 207,
              maxWidth: "100%",
              objectFit: "contain",
              display: "block",
            }}
          />
        )}
      </Box>

      <Divider />
      <Box
        sx={{
          overflow: "auto",
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <MenuContent />
        {/* <CardAlert /> */}
      </Box>
      <Stack
        direction="row"
        sx={{
          p: 2,
          gap: 1,
          alignItems: "center",
          borderTop: "1px solid",
          borderColor: "divider",
        }}
      >
        <SelectContent />
        {/* <Avatar
          sizes="small"
          alt="Riley Carter"
          src="/static/images/avatar/7.jpg"
          sx={{ width: 36, height: 36 }}
        /> */
        /* <Box sx={{ mr: "auto" }}>
          <Typography variant="body2" sx={{ fontWeight: 500, lineHeight: "16px" }}>
            Riley Carter
          </Typography>
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            riley@email.com
          </Typography>
        </Box> */
        /* <OptionsMenu /> */}
      </Stack>
    </Drawer>
  );
};
