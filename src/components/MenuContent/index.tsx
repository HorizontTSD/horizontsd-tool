import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import EditNotificationsIcon from "@mui/icons-material/EditNotifications";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { setActiveDashboardComponent } from "store";
import { useState } from "react";
import { Button } from "@mui/material";

export const MenuContent = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const mainListItems = [
    {
      text: t("sidebar.menu.data_forecast"),
      icon: <QueryStatsIcon />,
      value: "forecast",
    },
    {
      text: t("sidebar.menu.alert_settings"),
      icon: <EditNotificationsIcon />,
      value: "alerts",
    },
    {
      text: t("sidebar.menu.data_analysis"),
      icon: <AnalyticsIcon />,
      value: "analytics",
    },
    {
      text: t("sidebar.menu.quick_forecast"),
      icon: <RocketLaunchIcon />,
      value: "quick-forecast",
    },
  ];

  const handleMenuClick = (value: string, index: number) => {
    dispatch(
      setActiveDashboardComponent(
        value as "forecast" | "alerts" | "analytics" | "quick-forecast" | "about"
      )
    );
    setSelectedIndex(index);
  };

  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: "space-between", display: "flex" }}>
      <List dense>
        {mainListItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: "block" }}>
            <ListItemButton
              onClick={() => handleMenuClick(item.value, index)}
              selected={selectedIndex === index}
              sx={{
                ...(selectedIndex === index && {
                  backgroundColor: "rgba(0, 0, 0, 0.08)",
                }),
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText sx={{ color: "text.primary" }} primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
<Button
//   variant="contained"
  onClick={() => window.open("http://77.37.136.11:8601/ru", "_blank", "noopener noreferrer")}
  sx={{
    backgroundColor: "#1A7BD7",
    color: "white",
    "&:hover": {
      backgroundColor: "#2291FF",
    },
    "&.MuiButton-contained": {
      backgroundColor: "#2291FF",
    },
  }}
>
  {t("sidebar.menu.about")}
</Button>




    </Stack>
  );
};
