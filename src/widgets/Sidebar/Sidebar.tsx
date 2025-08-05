import { useColorScheme } from "@mui/material/styles"
import { Divider, Stack, Typography } from "@mui/material"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemButton from "@mui/material/ListItemButton"
import ListItemText from "@mui/material/ListItemText"
import IconButton from "@mui/material/IconButton"
import Icon from "./Icon"
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft"
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight"
import ScreenShareIcon from "@mui/icons-material/ScreenShare"
import AccessAlarmIcon from "@mui/icons-material/AccessAlarm"
import AddCircleIcon from "@mui/icons-material/AddCircle"
import StorageIcon from "@mui/icons-material/Storage"
import SmartToyIcon from "@mui/icons-material/SmartToy"

import React, { useState } from "react"

export const Sidebar = () => {
    const { t } = useTranslation()
    const { mode } = useColorScheme()
    const isDark = mode === "dark"
    const bgPalette = ["var(--mui-palette-secondary-dark)", "var(--mui-palette-secondary-main)"]
    const bg = bgPalette[~~!isDark]

    const [opened, setOpened] = useState(true)

    return (
        <Stack
            direction={"column"}
            sx={{
                height: `100%`,
                width: opened ? `20%` : `0`,
                minWidth: opened ? `250px` : `50px`,
                justifyContent: `start`,
                alignItems: `center`,
                borderRight: "1px solid",
                borderColor: bg,
                overflow: `hidden`,
                padding: 0,
                margin: 0,
            }}
        >
            <Stack
                sx={{
                    width: `100%`,
                    display: "flex",
                    justifyContent: opened ? "space-between" : "center",
                    paddingLeft: opened ? `1rem` : `0`,
                    alignItems: "center",
                    flexDirection: `row`,
                    minHeight: `60px`,
                    boxSizing: `border-box`,
                    borderBottom: "1px solid",
                    borderColor: bg,
                    boxShadow: `none`,
                }}
            >
                {opened && <Icon color={bg} size={"s"} />}

                {opened && (
                    <Typography
                        variant="h5"
                        sx={{
                            marginLeft: `1rem`,
                            lineHeight: `1rem`,
                            marginBottom: `-3px`,
                        }}
                    >
                        HorizonTSD
                    </Typography>
                )}

                <IconButton
                    size="small"
                    color="primary"
                    onClick={() => {
                        setOpened(!opened)
                    }}
                >
                    {opened ? <ArrowCircleLeftIcon /> : <ArrowCircleRightIcon />}
                </IconButton>
            </Stack>
            <Stack
                direction={"column"}
                sx={{
                    height: `100%`,
                    width: `100%`,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: `start`,
                }}
            >
                <List sx={{ width: "100%" }}>
                    <ListItem disablePadding>
                        <ListItemButton component={Link} to="/" sx={{ padding: 1 }}>
                            <IconButton size="small" color="secondary">
                                <ScreenShareIcon />
                            </IconButton>
                            {opened && <ListItemText primary={t("widgets.navBar.path.main")} />}
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton component={Link} to="/alert" sx={{ padding: 1 }}>
                            <IconButton size="small" color="secondary">
                                <AccessAlarmIcon />
                            </IconButton>
                            {opened && <ListItemText primary={t("widgets.navBar.path.alerts")} />}
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton component={Link} to="/forecast" sx={{ padding: 1 }}>
                            <IconButton size="small" color="secondary">
                                <AddCircleIcon />
                            </IconButton>
                            {opened && <ListItemText primary={t("widgets.navBar.path.forecast")} />}
                        </ListItemButton>
                    </ListItem>
                    {opened && <Divider />}
                    <ListItem disablePadding>
                        <ListItemButton component={Link} to="/db-connections" sx={{ padding: 1 }}>
                            <IconButton size="small" color="secondary">
                                <StorageIcon />
                            </IconButton>
                            {opened && <ListItemText primary={t("widgets.navBar.path.dbConnections")} />}
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton component={Link} to="/ai-agent" sx={{ padding: 1 }}>
                            <IconButton size="small" color="secondary">
                                <SmartToyIcon />
                            </IconButton>
                            {opened && <ListItemText primary={t("widgets.navBar.path.aiAgent")} />}
                        </ListItemButton>
                    </ListItem>
                </List>
            </Stack>
        </Stack>
    )
}
