import React from "react"
import { useState } from "react"
import {
    Box,
    Button,
    ButtonGroup,
    IconButton,
    ListSubheader,
    TextField,
    Tooltip,
    Typography,
    useColorScheme,
} from "@mui/material"
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown"
import ClickAwayListener from "@mui/material/ClickAwayListener"
import Grow from "@mui/material/Grow"
import Paper from "@mui/material/Paper"
import Popper from "@mui/material/Popper"
import { Stack } from "@mui/system"
import Divider from "@mui/material/Divider"
import Autocomplete from "@mui/material/Autocomplete"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemText from "@mui/material/ListItemText"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar"
import Menu from "@mui/material/Menu"
import MenuItem from "@mui/material/MenuItem"
import { useTranslation } from "react-i18next"

// Style helpers
// eslint-disable-next-line
const highlightStyle = {
    backgroundColor: "rgba(34, 145, 255, 0.2)",
    border: "2px solid #2291FF",
    borderRadius: "12px",
    padding: "2px 8px",
    fontWeight: "bold",
}

// eslint-disable-next-line
const downloadButtonStyle = {
    width: { xs: "100%", sm: "130px" },
    backgroundColor: "#26AD50",
    "&:hover": { backgroundColor: "#218B3D" },
}

// eslint-disable-next-line
const spinnerContainerStyle = {
    height: 615,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
}

const timeSlots = Array.from(new Array(24 * 2)).map(
    (_, index) => `${index < 20 ? "0" : ""}${Math.floor(index / 2)}:${index % 2 === 0 ? "00" : "30"}`
)

export function BasicDateCalendar() {
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateCalendar />
        </LocalizationProvider>
    )
}

export function DisabledOptions() {
    const { t } = useTranslation()
    return (
        <Autocomplete
            options={timeSlots}
            getOptionDisabled={(option) => option === timeSlots[0] || option === timeSlots[2]}
            sx={{ width: 300 }}
            renderInput={(params) => <TextField {...params} label={t("widgets.LoadForecastGraphBlock.navbar.disabled_options_label")} />}
        />
    )
}

export function PinnedSubheaderList() {
    const { t } = useTranslation()
    return (
        <List
            sx={{
                width: "100%",
                maxWidth: 360,
                bgcolor: "background.paper",
                position: "relative",
                overflow: "auto",
                maxHeight: 300,
                "& ul": { padding: 0 },
            }}
            subheader={<li />}
        >
            {[`minute`, `hour`, `day`].map((sectionId, index) => (
                <li key={`section-${index}`}>
                    <ul>
                        <ListSubheader sx={{ bgcolor: "background.paper" }}>
                            {`${t(`widgets.LoadForecastGraphBlock.navbar.time_units.${sectionId}`)}:`.toUpperCase()}
                        </ListSubheader>
                        {[0, 1, 2, 3, 4].map((item) => (
                            <ListItem key={`item-${index}-${item}`}>
                                <ListItemText primary={t("widgets.LoadForecastGraphBlock.navbar.last_time_unit", { count: item + 1, unit: t(`widgets.LoadForecastGraphBlock.navbar.time_units.${sectionId}`) })} />
                            </ListItem>
                        ))}
                    </ul>
                </li>
            ))}
        </List>
    )
}

export function SplitButton() {
    const options = ["now-1d to now+1d", "yesterday", "tommorow"]
    const { t } = useTranslation()
    const [open, setOpen] = React.useState(false)
    const anchorRef = React.useRef<HTMLDivElement>(null)
    const [selectedIndex, setSelectedIndex] = React.useState(0)

    const handleClick = () => {
        console.info(`You clicked ${options[selectedIndex]}`)
    }

    // eslint-disable-next-line
    const handleMenuItemClick = (event: React.MouseEvent<HTMLLIElement, MouseEvent>, index: number) => {
        setSelectedIndex(index)
        setOpen(false)
    }

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen)
    }

    const handleClose = (event: Event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) {
            return
        }

        setOpen(false)
    }

    const timezone_list = [`UTC`].concat(
        Array.from(new Array(10)).map((_, index) => `GMT+${index < 9 ? "0" + (index + 1) : index + 1}`)
    )

    // eslint-disable-next-line
    const [selectedTimezone, setSelectedTimezone] = React.useState(timezone_list[0])

    const [anchorEl2, setAnchorEl2] = useState<null | HTMLElement>(null)

    const handleClick2 = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl2(event.currentTarget)
    }

    const handleClose2 = () => {
        setAnchorEl2(null)
    }

    // eslint-disable-next-line
    const handleModelSelect2 = (model: string) => {
        // onSelect(model);
        handleClose2()
    }

    return (
        <React.Fragment>
            <ButtonGroup
                ref={anchorRef}
                aria-label="Button group with a nested menu"
                color="primary"
                variant="outlined"
                sx={{ background: `var(--mui-palette-common-white)` }}
            >
                <Tooltip
                    title={
                        <React.Fragment>
                            <Typography color="inherit">{t("widgets.LoadForecastGraphBlock.navbar.from_label")}: {new Date().toUTCString()}</Typography>
                            <Typography color="inherit">{t("widgets.LoadForecastGraphBlock.navbar.to_label")}: {new Date().toUTCString()}</Typography>
                            <Typography color="warning">UTC</Typography>
                        </React.Fragment>
                    }
                >
                    <Button onClick={handleClick}>{options[selectedIndex]}</Button>
                </Tooltip>
                <Button
                    aria-controls={open ? "split-button-menu" : undefined}
                    aria-expanded={open ? "true" : undefined}
                    aria-label="select merge strategy"
                    aria-haspopup="menu"
                    onClick={handleToggle}
                >
                    <ArrowDropDownIcon />
                </Button>
            </ButtonGroup>

            <Popper
                sx={{ zIndex: 1 }}
                open={open}
                anchorEl={anchorRef.current}
                role={undefined}
                transition
                disablePortal
            >
                {({ TransitionProps, placement }) => (
                    <Grow
                        {...TransitionProps}
                        style={{
                            transformOrigin: placement === "bottom" ? "center top" : "center bottom",
                        }}
                    >
                        <Paper
                            sx={{
                                marginLeft: `1.5rem`,
                                marginTop: `1.5rem`,
                                border: `1px solid black`,
                            }}
                        >
                            <ClickAwayListener onClickAway={handleClose}>
                                <Box sx={{ p: 1 }}>
                                    <Stack direction={"row"}>
                                        <Stack
                                            direction={"column"}
                                            justifyContent={"space-between"}
                                            sx={{ marginBottom: `1rem` }}
                                        >
                                            <Box>
                                                <Typography variant="h6">{t("widgets.LoadForecastGraphBlock.navbar.absolute_time_range_heading")}</Typography>
                                                <Box>
                                                    <Typography>{t("widgets.LoadForecastGraphBlock.navbar.from_label")}:</Typography>
                                                    <DisabledOptions />
                                                </Box>
                                                <Box>
                                                    <Typography>{t("widgets.LoadForecastGraphBlock.navbar.to_label")}:</Typography>
                                                    <DisabledOptions />
                                                </Box>
                                            </Box>
                                            <Button variant="contained">{t("widgets.LoadForecastGraphBlock.navbar.apply_time_range_button")}</Button>
                                        </Stack>
                                        <Divider />
                                        <Stack>
                                            <PinnedSubheaderList />
                                        </Stack>
                                    </Stack>
                                    <Divider />
                                    <Stack sx={{ padding: `1rem` }}>
                                        <Typography variant="caption">
                                            {t("widgets.LoadForecastGraphBlock.navbar.timezone_caption")}
                                        </Typography>
                                        <Stack direction={"row"} sx={{ alignItems: `center` }}>
                                            <Typography
                                                variant="button"
                                                color="textPrimary"
                                                sx={{ marginRight: `1rem` }}
                                            >
                                                {t("widgets.LoadForecastGraphBlock.navbar.timezone_label")}:
                                            </Typography>
                                            <IconButton
                                                onClick={handleClick2}
                                                sx={{
                                                    background: `var(--mui-palette-common-white)`,
                                                    borderRadius: "var(--mui-shape-borderRadius)",
                                                    "&:hover": {
                                                        background: `var(--mui-palette-common-white)`,
                                                    },
                                                }}
                                            >
                                                <Typography variant="button" color="textPrimary">
                                                    {timezone_list[0] || t("widgets.LoadForecastGraphBlock.navbar.select_period_placeholder")}
                                                </Typography>
                                                <ArrowDropDownIcon />
                                            </IconButton>
                                            <Menu
                                                anchorEl={anchorEl2}
                                                open={Boolean(anchorEl2)}
                                                onClose={handleClose2}
                                                PaperProps={{
                                                    sx: {
                                                        maxHeight: 300,
                                                        mt: 0.1,
                                                        "& .MuiMenuItem-root": {
                                                            minHeight: 36,
                                                        },
                                                    },
                                                }}
                                            >
                                                {timezone_list.map((item) => (
                                                    <MenuItem
                                                        key={item}
                                                        selected={item === selectedTimezone}
                                                        onClick={() => handleModelSelect2(item)}
                                                        sx={{
                                                            "&.Mui-selected": {
                                                                backgroundColor: "action.selected",
                                                                "&:hover": {
                                                                    backgroundColor: "action.selected",
                                                                },
                                                            },
                                                        }}
                                                    >
                                                        <Typography variant="button" color="textPrimary">
                                                            {item}
                                                        </Typography>
                                                    </MenuItem>
                                                ))}
                                            </Menu>
                                        </Stack>
                                    </Stack>
                                </Box>
                            </ClickAwayListener>
                        </Paper>
                    </Grow>
                )}
            </Popper>
        </React.Fragment>
    )
}

interface ModelSelectorDropdownProps {
    availableModels: string[]
    selectedModel: string | null
    onSelect: (model: string) => void
    onRefreshSelect: (period: string) => void;
}

export function Navbar({ availableModels, selectedModel, onSelect, onRefreshSelect }: ModelSelectorDropdownProps) {
    const refreshAt = [`1m`, `5m`, `1h`]
    const { t } = useTranslation()
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const [anchorEl2, setAnchorEl2] = useState<null | HTMLElement>(null)
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget)
    }

    const handleClose = () => {
        setAnchorEl(null)
    }

    const handleModelSelect = (model: string) => {
        onSelect(model)
        handleClose()
    }

    const handleClick2 = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl2(event.currentTarget)
    }

    const handleClose2 = () => {
        setAnchorEl2(null)
    }

    const handleRefreshSelect = (period: string) => {
        onRefreshSelect(period);
        handleClose2()
    }

    const { mode } = useColorScheme()
    const isDark = mode === "dark"
    const bgPalette = ["var(--mui-palette-secondary-dark)", "var(--mui-palette-secondary-main)"]
    const bg = bgPalette[~~!isDark]
    const textColor = "var(--mui-palette-common-black)"

    return (
        <Stack
            sx={{
                borderRadius: "var(--mui-shape-borderRadius)",
                padding: `0 1rem`,
                minHeight: `60px`,
                display: `flex`,
                flexDirection: `row`,
                justifyContent: `space-between`,
                alignItems: `center`,
                background: bg,
            }}
        >
            {/* <Stack direction={"row"} sx={{ alignItems: `center` }}>
                <Typography variant="button" color="textPrimary">
                    range:
                </Typography>
                <SplitButton />
            </Stack> */}
            {/* <Button
                variant="outlined"
                sx={{
                    color: textColor,
                    maxHeight: `40px`,
                    background: `var(--mui-palette-common-white)`,
                }}
            >
                Reset zoom
            </Button> */}
            {/* <Button
                color="primary"
                variant="outlined"
                sx={{
                    color: textColor,
                    maxHeight: `40px`,
                    background: `var(--mui-palette-common-white)`,
                }}
            >
                Update
            </Button> */}
            {/* <Button
                color="primary"
                variant="outlined"
                sx={{
                    color: textColor,
                    maxHeight: `40px`,
                    background: `var(--mui-palette-common-white)`,
                }}
            >
                View Alerts
            </Button> */}
            {/* <Button
                color="primary"
                variant="outlined"
                sx={{
                    color: textColor,
                    maxHeight: `40px`,
                    background: `var(--mui-palette-common-white)`,
                }}
            >
                Create Alert
            </Button> */}
            {/* <Button
                color="primary"
                variant="outlined"
                sx={{
                    color: textColor,
                    maxHeight: `40px`,
                    background: `var(--mui-palette-common-white)`,
                }}
            >
                Details
            </Button> */}
            <Stack direction={"row"} sx={{ alignItems: `center` }} spacing={1}>
                <Typography variant="button" color="textPrimary">
                    {t("widgets.LoadForecastGraphBlock.navbar.sensor_label")}:
                </Typography>
                <IconButton
                    onClick={handleClick}
                    sx={{
                        maxHeight: `40px`,
                        background: `var(--mui-palette-common-white)`,
                        borderRadius: "var(--mui-shape-borderRadius)",
                        "&:hover": {
                            background: `var(--mui-palette-common-white)`,
                        },
                    }}
                >
                    <Typography variant="button" color="textPrimary" sx={{ color: textColor }}>
                        {selectedModel || t("widgets.LoadForecastGraphBlock.navbar.select_sensor_placeholder")}
                    </Typography>
                    <ArrowDropDownIcon sx={{ color: textColor }} />
                </IconButton>

                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                    PaperProps={{
                        sx: {
                            minWidth: 160,
                            maxHeight: 300,
                            mt: 0.1,
                            "& .MuiMenuItem-root": {
                                minHeight: 36,
                            },
                        },
                    }}
                >
                    {availableModels.map((model) => (
                        <MenuItem
                            key={model}
                            selected={model === selectedModel}
                            onClick={() => handleModelSelect(model)}
                            sx={{
                                "&.Mui-selected": {
                                    backgroundColor: "action.selected",
                                    "&:hover": {
                                        backgroundColor: "action.selected",
                                    },
                                },
                            }}
                        >
                            <Typography variant="button" color="textPrimary">
                                {model}
                            </Typography>
                        </MenuItem>
                    ))}
                </Menu>
            </Stack>

            <Stack direction={"row"} sx={{ alignItems: `center` }} spacing={1}>

                <Typography variant="button" color="textPrimary" sx={{ marginRight: `1rem` }}>
                    {t("widgets.LoadForecastGraphBlock.navbar.refresh_at_label")}:
                </Typography>
                <IconButton
                    onClick={handleClick2}
                    sx={{
                        color: textColor,
                        maxHeight: `40px`,
                        background: `var(--mui-palette-common-white)`,
                        borderRadius: "var(--mui-shape-borderRadius)",
                        "&:hover": {
                            background: `var(--mui-palette-common-white)`,
                        },
                    }}
                >
                    <Typography variant="button" sx={{ color: textColor }}>
                        {refreshAt[0] || t("widgets.LoadForecastGraphBlock.navbar.select_period_placeholder")}
                    </Typography>
                    <ArrowDropDownIcon sx={{ color: textColor }} />
                </IconButton>
                <Menu
                    anchorEl={anchorEl2}
                    open={Boolean(anchorEl2)}
                    onClose={handleClose2}
                    PaperProps={{
                        sx: {
                            maxHeight: 300,
                            mt: 0.1,
                            "& .MuiMenuItem-root": {
                                minHeight: 36,
                            },
                        },
                    }}
                >
                    {refreshAt.map((item) => (
                        <MenuItem
                            key={item}
                            selected={item === selectedModel}
                            onClick={() => handleRefreshSelect(item)}
                            sx={{
                                "&.Mui-selected": {
                                    backgroundColor: "action.selected",
                                    "&:hover": {
                                        backgroundColor: "action.selected",
                                    },
                                },
                            }}
                        >
                            <Typography variant="button" color="textPrimary">
                                {item}
                            </Typography>
                        </MenuItem>
                    ))}
                </Menu>
            </Stack>
        </Stack>
    )
}
