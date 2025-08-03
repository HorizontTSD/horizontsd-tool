import { Box, Stack, Typography, Button, Menu, MenuItem, useColorScheme } from "@mui/material"
import VisibilityIcon from "@mui/icons-material/Visibility"
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown"
import React, { useState } from "react"
import { useTranslation } from "react-i18next"

const AlertBlock = ({
    name,
    threshold,
    scheme,
    triggerFrequency,
    message,
    notifications: { email, telegram },
    includeGraph,
    timeInterval,
    startWarningInterval,
    sensorId,
    model,
    expanded,
    onToggle,
    onEdit,
    onDelete,
}: {
    name: string
    threshold: string | number
    scheme: string
    triggerFrequency: string | number
    message: string
    notifications: {
        email: string[]
        telegram: string[]
    }
    includeGraph: boolean
    timeInterval?: {
        endDate: string
        startDate: string
    }
    startWarningInterval: string | number
    sensorId: string
    model: string
    expanded: boolean
    onToggle: () => void
    onEdit?: () => void
    onDelete?: () => void
}) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation()
        setAnchorEl(event.currentTarget)
    }
    const handleMenuClose = () => setAnchorEl(null)
    const handleEdit = () => {
        handleMenuClose()
        if (onEdit) onEdit()
    }
    const handleDelete = () => {
        handleMenuClose()
        if (onDelete) onDelete()
    }

    const { mode } = useColorScheme()
    const isDark = mode === "dark"
    const bgPalettExp = ["var(--mui-palette-secondary-main)", "var(--mui-palette-primary-main)"]
    const bgPalette = ["var(--mui-palette-primary-light)", "var(--mui-palette-primary-light)"]
    const bg = bgPalette[~~isDark]
    const bgExp = bgPalettExp[~~isDark]

    const colorPalette = ["var(--mui-palette-text-primary)", "var(--mui-palette-secondary-dark)"]
    const colorPaletteExp = ["var(--mui-palette-secondary-light)", "var(--mui-palette-secondary-light)"]

    const color = colorPalette[~~isDark]
    const colorExp = colorPaletteExp[~~isDark]

    const { t } = useTranslation()

    return (
        <Box
            sx={{
                background: expanded ? bgExp : bg,
                borderRadius: `var(--mui-shape-borderRadius)`,
                padding: `1rem`,
                margin: `0.5rem 0`,
                cursor: "pointer",
                boxShadow: expanded
                    ? isDark
                        ? "0 2px 12px 0 rgba(0, 51, 190, 0.25)"
                        : "0 2px 12px 0 rgba(0,0,0,0.10)"
                    : "none",
                overflow: "hidden",
                color: expanded ? colorExp : color,
            }}
            onClick={onToggle}
        >
            {!expanded && (
                <Stack direction="row" alignItems="start" spacing={1}>
                    <Stack direction="column">
                        <Typography variant="caption">{t("widgets.alertsContent.alertBlockName")}</Typography>
                        <Typography variant="body2" color="info">
                            {name}
                        </Typography>
                        <Typography variant="caption">
                            {t("widgets.alertsContent.alertBlockTriggerFrequency")}
                        </Typography>
                        <Typography variant="body2">{triggerFrequency}</Typography>
                    </Stack>
                    <Stack direction="column">
                        <Typography variant="caption">{t("widgets.alertsContent.alertBlockMessage")}</Typography>
                        <Typography variant="body2">{message}</Typography>
                    </Stack>
                    <Stack direction="column">
                        <Typography variant="caption">{t("widgets.alertsContent.alertBlockStartDate")}</Typography>
                        <Typography variant="body2">
                            {timeInterval?.startDate ? new Date(timeInterval.startDate).toUTCString() : ""}
                        </Typography>
                        <Typography variant="caption">{t("widgets.alertsContent.alertBlockEndDate")}</Typography>
                        <Typography variant="body2">
                            {timeInterval?.startDate ? new Date(timeInterval.startDate).toUTCString() : ""}
                        </Typography>
                    </Stack>
                    <Stack direction="column">
                        <Typography variant="caption">
                            {t("widgets.alertsContent.alertBlockStartWarningInterval")}
                        </Typography>
                        <Typography variant="body2">{startWarningInterval}</Typography>
                        <Typography variant="caption">{t("widgets.alertsContent.alertBlockSensorId")}</Typography>
                        <Typography variant="body2">{sensorId}</Typography>
                    </Stack>
                    <Stack direction="column">
                        <Typography variant="caption">{t("widgets.alertsContent.alertBlockModel")}</Typography>
                        <Typography variant="body2">{model}</Typography>
                    </Stack>
                </Stack>
            )}
            <Box
                sx={{
                    height: expanded ? "auto" : "0",
                    opacity: expanded ? 1 : 0,
                    transition: "height 0.3s ease, opacity 0.3s ease",
                    pointerEvents: expanded ? "auto" : "none",
                    overflow: "hidden",
                }}
            >
                {expanded && (
                    <Stack direction="row" alignItems="start" spacing={1}>
                        <Stack direction="column">
                            <Typography variant="caption">{t("widgets.alertsContent.alertBlockName")}</Typography>
                            <Typography variant="body2">{name}</Typography>
                            <Typography variant="caption">
                                {t("widgets.alertsContent.alertBlockThresholdValue")}
                            </Typography>
                            <Typography variant="body2">{threshold}</Typography>
                            <Typography variant="caption">{t("widgets.alertsContent.alertBlockScheme")}</Typography>
                            <Typography variant="body2">{scheme}</Typography>
                            <Typography variant="caption">
                                {t("widgets.alertsContent.alertBlockTriggerFrequency")}
                            </Typography>
                            <Typography variant="body2">{triggerFrequency}</Typography>
                        </Stack>
                        <Stack direction="column">
                            <Typography variant="caption">{t("widgets.alertsContent.alertBlockMessage")}</Typography>
                            <Typography variant="body2">{message}</Typography>
                            <Typography variant="caption">{t("widgets.alertsContent.alertBlockTelegram")}</Typography>
                            <Typography variant="body2">{telegram?.join(" ") || ""}</Typography>
                            <Typography variant="caption">{t("widgets.alertsContent.alertBlockEmail")}</Typography>
                            <Typography variant="body2">{email?.join(" ") || ""}</Typography>
                            <Typography variant="caption">
                                {t("widgets.alertsContent.alertBlockIncludeGraph")}
                            </Typography>
                            {includeGraph}
                        </Stack>
                        <Stack direction="column">
                            <Typography variant="caption">{t("widgets.alertsContent.alertBlockStartDate")}</Typography>
                            <Typography variant="body2">
                                {timeInterval?.startDate ? new Date(timeInterval.startDate).toUTCString() : ""}
                            </Typography>
                            <Typography variant="caption">{t("widgets.alertsContent.alertBlockEndDate")}</Typography>
                            <Typography variant="body2">
                                {timeInterval?.endDate ? new Date(timeInterval.endDate).toUTCString() : ""}
                            </Typography>
                        </Stack>
                        <Stack direction="column">
                            <Typography variant="caption">
                                {t("widgets.alertsContent.alertBlockStartWarningInterval")}
                            </Typography>
                            <Typography variant="body2">{startWarningInterval}</Typography>
                            <Typography variant="caption">{t("widgets.alertsContent.alertBlockSensorId")}</Typography>
                            <Typography variant="body2">{sensorId}</Typography>
                            <Typography variant="caption">{t("widgets.alertsContent.alertBlockModel")}</Typography>
                            <Typography variant="body2">{model}</Typography>
                        </Stack>
                        <Box>
                            <Typography fontWeight={700} fontSize={28} color="white">
                                {t("widgets.alertsContent.alertBlockActions")}
                            </Typography>
                            <Stack direction="row" spacing={1} mt={2} alignItems="center">
                                <Button
                                    size="small"
                                    variant="contained"
                                    sx={{
                                        background: "#01579B",
                                        borderRadius: 999,
                                        textTransform: "none",
                                        width: "77px",
                                        height: "28px",
                                        color: "#F5F5F5",
                                    }}
                                    startIcon={<VisibilityIcon sx={{ color: "#F5F5F5" }} />}
                                >
                                    {t("widgets.alertsContent.alertBlockViewButton")}
                                </Button>
                                <Button
                                    size="small"
                                    variant="contained"
                                    sx={{
                                        background: "#01579B",
                                        borderRadius: 999,
                                        textTransform: "none",
                                        width: "93px",
                                        height: "28px",
                                        color: "#F5F5F5",
                                    }}
                                    endIcon={<KeyboardArrowDownIcon sx={{ color: "#F5F5F5" }} />}
                                    onClick={handleMenuOpen}
                                >
                                    {t("widgets.alertsContent.alertBlockMoreButton")}
                                </Button>
                                <Menu
                                    anchorEl={anchorEl}
                                    open={Boolean(anchorEl)}
                                    onClose={handleMenuClose}
                                    anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                                    transformOrigin={{ vertical: "top", horizontal: "center" }}
                                    slotProps={{ paper: { sx: { mt: 0.5, width: "93px" } } }}
                                >
                                    <MenuItem onClick={handleEdit}>
                                        {t("widgets.alertsContent.alertBlockEditMenuItem")}
                                    </MenuItem>
                                    <MenuItem onClick={handleDelete} sx={{ color: "error.main" }}>
                                        {t("widgets.alertsContent.alertBlockDeleteMenuItem")}
                                    </MenuItem>
                                </Menu>
                            </Stack>
                        </Box>
                    </Stack>
                )}
            </Box>
        </Box>
    )
}

export default AlertBlock
