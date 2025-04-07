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

const mainListItems = [
  { text: "Прогноз нагрузки", icon: <QueryStatsIcon /> },
  { text: "Настройка оповещений", icon: <EditNotificationsIcon /> },
  { text: "Анализ данных", icon: <AnalyticsIcon /> },
  { text: "Быстрый прогноз", icon: <RocketLaunchIcon /> },
];

const secondaryListItems = [{ text: "About", icon: <InfoRoundedIcon /> }];

export const MenuContent = () => {
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
