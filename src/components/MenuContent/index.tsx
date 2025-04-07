import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import EditNotificationsIcon from "@mui/icons-material/EditNotifications";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import { useTranslation } from "react-i18next";
import { Box, Button, Card, CircularProgress, Typography, useColorScheme } from "@mui/material";


export const MenuContent = () => {
  const { t } = useTranslation();

  const mainListItems = [
    { text: t("sidebar.menu.load_forecast"), icon: <QueryStatsIcon /> },
    { text: t("sidebar.menu.alert_settings"), icon: <EditNotificationsIcon /> },
    { text: t("sidebar.menu.data_analysis"), icon: <AnalyticsIcon /> },
    { text: t("sidebar.menu.quick_forecast"), icon: <RocketLaunchIcon /> },
  ];

  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: "space-between", display: "flex" }}>
      <List dense>
        {mainListItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: "block" }}>
            <ListItemButton selected={index === 0}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText sx={{ color: "text.primary" }} primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    <Button
      sx={{
        ml: 2,
        fontSize: 'clamp(8px, 1.5vw, 16px)',
        padding: '6px 16px',
        backgroundColor: 'rgb(100, 149, 237)',
        color: 'text.primary',
        '&:hover': {
          backgroundColor: 'rgb(70, 130, 180',
        },
      }}
      onClick={() => window.open("http://77.37.136.11:7071", "_blank", "noopener noreferrer")}
    >
      {t("sidebar.menu.about")}
    </Button>

    </Stack>
  );
};
