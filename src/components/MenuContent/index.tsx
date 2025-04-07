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

export const MenuContent = () => {
  const { t } = useTranslation();

  const mainListItems = [
    { text: t("sidebar.menu.load_forecast"), icon: <QueryStatsIcon /> },
    { text: t("sidebar.menu.alert_settings"), icon: <EditNotificationsIcon /> },
    { text: t("sidebar.menu.data_analysis"), icon: <AnalyticsIcon /> },
    { text: t("sidebar.menu.quick_forecast"), icon: <RocketLaunchIcon /> },
  ];

  const secondaryListItems = [{ text: t("sidebar.menu.about"), icon: <InfoRoundedIcon /> }];

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
      <List dense>
        {secondaryListItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: "block" }}>
            <ListItemButton>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Stack>
  );
};
