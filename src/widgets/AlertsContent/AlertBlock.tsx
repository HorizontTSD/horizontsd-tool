import React, { useState } from "react"
import {
    Box,
    Stack,
    Typography,
    Button,
    Menu,
    MenuItem,
    useColorScheme,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from "@mui/material"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import ExpandLessIcon from "@mui/icons-material/ExpandLess"
import MoreVertIcon from "@mui/icons-material/MoreVert"
import VisibilityIcon from "@mui/icons-material/Visibility"
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
    onView,
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
    onView?: (sensorId: string) => void
}) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

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

    const { t } = useTranslation()

    const formatDate = (dateString: string) => {
        if (!dateString) return "—"
        return new Date(dateString).toLocaleDateString("ru-RU", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    return (
        <>
            <Box
                sx={{
                    background: isDark ? "rgba(255, 255, 255, 0.05)" : "white",
                    borderRadius: `var(--mui-shape-borderRadius)`,
                    padding: 3,
                    margin: "1rem 0",
                    cursor: "pointer",
                    boxShadow: isDark ? "0 4px 20px rgba(0, 0, 0, 0.15)" : "0 2px 12px rgba(0, 0, 0, 0.08)",
                    border: `1px solid ${isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.06)"}`,
                    transition: "all 0.2s ease-in-out",
                    width: "100%",
                    "&:hover": {
                        boxShadow: isDark ? "0 8px 32px rgba(0, 0, 0, 0.25)" : "0 4px 20px rgba(0, 0, 0, 0.12)",
                        transform: "translateY(-2px)",
                    },
                }}
                onClick={onToggle}
            >
                {/* Header */}
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={2}>
                    <Box sx={{ flex: 1 }}>
                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 600,
                                color: "text.primary",
                                mb: 0.5,
                            }}
                        >
                            {name}
                        </Typography>
                        <Typography
                            variant="body2"
                            sx={{
                                color: "text.secondary",
                                lineHeight: 1.4,
                            }}
                        >
                            {message}
                        </Typography>
                    </Box>
                    <Stack direction="row" spacing={1} alignItems="center">
                        {expanded ? (
                            <ExpandLessIcon sx={{ color: "text.primary" }} />
                        ) : (
                            <ExpandMoreIcon sx={{ color: "text.primary" }} />
                        )}
                    </Stack>
                </Stack>

                {/* Compact Info */}
                {!expanded && (
                    <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems="flex-start">
                        <Stack direction="row" spacing={3} flex={1}>
                            <Box>
                                <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 500 }}>
                                    {t("widgets.alertsContent.alertBlockSensorId")}
                                </Typography>
                                <Typography variant="body2" sx={{ fontWeight: 500, color: "text.primary" }}>
                                    {sensorId}
                                </Typography>
                            </Box>
                            <Box>
                                <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 500 }}>
                                    {t("widgets.alertsContent.alertBlockModel")}
                                </Typography>
                                <Typography variant="body2" sx={{ fontWeight: 500, color: "text.primary" }}>
                                    {model}
                                </Typography>
                            </Box>
                            <Box>
                                <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 500 }}>
                                    {t("widgets.alertsContent.alertBlockTriggerFrequency")}
                                </Typography>
                                <Typography variant="body2" sx={{ fontWeight: 500, color: "text.primary" }}>
                                    {triggerFrequency}
                                </Typography>
                            </Box>
                        </Stack>
                        <Stack direction="row" spacing={1} sx={{ pointerEvents: "auto" }}>
                            <Button
                                size="small"
                                variant="contained"
                                sx={{
                                    borderRadius: `var(--mui-shape-borderRadius)`,
                                    textTransform: "none",
                                    fontWeight: 500,
                                    background: "#1976d2",
                                    color: "white",
                                    "&:hover": {
                                        background: "#1565c0",
                                    },
                                }}
                                startIcon={<VisibilityIcon sx={{ color: "white" }} />}
                                onClick={(e) => {
                                    e.stopPropagation()
                                    if (onView) onView(sensorId)
                                }}
                            >
                                {t("widgets.alertsContent.alertBlockViewButton")}
                            </Button>
                            <Button
                                size="small"
                                variant="outlined"
                                sx={{
                                    borderRadius: `var(--mui-shape-borderRadius)`,
                                    textTransform: "none",
                                    fontWeight: 500,
                                    borderColor: "text.secondary",
                                    color: "text.primary",
                                    "&:hover": {
                                        borderColor: "text.primary",
                                        background: "rgba(0, 0, 0, 0.04)",
                                    },
                                }}
                                endIcon={<MoreVertIcon sx={{ color: "text.primary" }} />}
                                onClick={(e) => {
                                    e.stopPropagation()
                                    handleMenuOpen(e)
                                }}
                            >
                                {t("widgets.alertsContent.alertBlockMoreButton")}
                            </Button>
                        </Stack>
                    </Stack>
                )}

                {/* Expanded Content */}
                <Box
                    sx={{
                        height: expanded ? "auto" : 0,
                        opacity: expanded ? 1 : 0,
                        transition: "all 0.3s ease-in-out",
                        pointerEvents: expanded ? "auto" : "none",
                        overflow: "hidden",
                    }}
                >
                    {expanded && (
                        <>
                            {/* <Divider sx={{ my: 2 }} /> */}

                            <Stack spacing={3}>
                                {/* Main Details */}
                                <Stack direction={{ xs: "column", lg: "row" }} spacing={3}>
                                    <Box sx={{ flex: 1 }}>
                                        <Typography
                                            variant="subtitle2"
                                            sx={{ fontWeight: 600, mb: 2, color: "text.primary" }}
                                        >
                                            {t("widgets.alertsContent.alertBlockMainParameters")}
                                        </Typography>
                                        <Stack spacing={2}>
                                            <Stack direction="row" justifyContent="space-between">
                                                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                                                    {t("widgets.alertsContent.alertBlockSensorId")}
                                                </Typography>
                                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                    {sensorId}
                                                </Typography>
                                            </Stack>
                                            <Stack direction="row" justifyContent="space-between">
                                                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                                                    {t("widgets.alertsContent.alertBlockModel")}
                                                </Typography>
                                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                    {model}
                                                </Typography>
                                            </Stack>
                                            <Stack direction="row" justifyContent="space-between">
                                                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                                                    {t("widgets.alertsContent.alertBlockThresholdValue")}
                                                </Typography>
                                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                    {threshold}
                                                </Typography>
                                            </Stack>
                                            <Stack direction="row" justifyContent="space-between">
                                                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                                                    {t("widgets.alertsContent.alertBlockScheme")}
                                                </Typography>
                                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                    {scheme}
                                                </Typography>
                                            </Stack>
                                            <Stack direction="row" justifyContent="space-between">
                                                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                                                    {t("widgets.alertsContent.alertBlockTriggerFrequency")}
                                                </Typography>
                                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                    {triggerFrequency}
                                                </Typography>
                                            </Stack>
                                        </Stack>
                                    </Box>

                                    <Box sx={{ flex: 1 }}>
                                        <Typography
                                            variant="subtitle2"
                                            sx={{ fontWeight: 600, mb: 2, color: "text.primary" }}
                                        >
                                            {t("widgets.alertsContent.alertBlockNotifications")}
                                        </Typography>
                                        <Stack spacing={2}>
                                            <Box>
                                                <Typography variant="body2" sx={{ color: "text.secondary", mb: 0.5 }}>
                                                    {t("widgets.alertsContent.alertBlockEmail")}
                                                </Typography>
                                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                    {email && email.length > 0 ? email.join(", ") : "—"}
                                                </Typography>
                                            </Box>
                                            <Box>
                                                <Typography variant="body2" sx={{ color: "text.secondary", mb: 0.5 }}>
                                                    {t("widgets.alertsContent.alertBlockTelegram")}
                                                </Typography>
                                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                    {telegram && telegram.length > 0 ? telegram.join(", ") : "—"}
                                                </Typography>
                                            </Box>
                                            <Stack direction="row" justifyContent="space-between">
                                                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                                                    {t("widgets.alertsContent.alertBlockIncludeGraph")}
                                                </Typography>
                                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                    {includeGraph ? t("common.yes") : t("common.no")}
                                                </Typography>
                                            </Stack>
                                        </Stack>
                                    </Box>

                                    <Box sx={{ flex: 1 }}>
                                        <Typography
                                            variant="subtitle2"
                                            sx={{ fontWeight: 600, mb: 2, color: "text.primary" }}
                                        >
                                            {t("widgets.alertsContent.alertBlockTimeParameters")}
                                        </Typography>
                                        <Stack spacing={2}>
                                            <Box>
                                                <Typography variant="body2" sx={{ color: "text.secondary", mb: 0.5 }}>
                                                    {t("widgets.alertsContent.alertBlockStartDate")}
                                                </Typography>
                                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                    {formatDate(timeInterval?.startDate || "")}
                                                </Typography>
                                            </Box>
                                            <Box>
                                                <Typography variant="body2" sx={{ color: "text.secondary", mb: 0.5 }}>
                                                    {t("widgets.alertsContent.alertBlockEndDate")}
                                                </Typography>
                                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                    {formatDate(timeInterval?.endDate || "")}
                                                </Typography>
                                            </Box>
                                            <Stack direction="row" justifyContent="space-between">
                                                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                                                    {t("widgets.alertsContent.alertBlockStartWarningInterval")}
                                                </Typography>
                                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                    {startWarningInterval}
                                                </Typography>
                                            </Stack>
                                        </Stack>
                                    </Box>
                                </Stack>

                                {/* Actions */}
                                <Box sx={{ pt: 2 }}>
                                    <Typography
                                        variant="subtitle2"
                                        sx={{ fontWeight: 600, mb: 2, color: "text.primary" }}
                                    >
                                        {t("widgets.alertsContent.alertBlockActions")}
                                    </Typography>
                                    <Stack direction="row" spacing={2} flexWrap="wrap">
                                        <Button
                                            variant="contained"
                                            sx={{
                                                background: "#1976d2",
                                                borderRadius: `var(--mui-shape-borderRadius)`,
                                                textTransform: "none",
                                                fontWeight: 500,
                                                px: 3,
                                                color: "white",
                                                "&:hover": {
                                                    background: "#1565c0",
                                                },
                                            }}
                                            startIcon={<VisibilityIcon sx={{ color: "white" }} />}
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                if (onView) onView(sensorId)
                                            }}
                                        >
                                            {t("widgets.alertsContent.alertBlockViewButton")}
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            sx={{
                                                borderRadius: `var(--mui-shape-borderRadius)`,
                                                textTransform: "none",
                                                fontWeight: 500,
                                                px: 3,
                                                borderColor: "text.secondary",
                                                color: "text.primary",
                                                "&:hover": {
                                                    borderColor: "text.primary",
                                                    background: "rgba(0, 0, 0, 0.04)",
                                                },
                                            }}
                                            endIcon={<MoreVertIcon sx={{ color: "text.primary" }} />}
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                handleMenuOpen(e)
                                            }}
                                        >
                                            {t("widgets.alertsContent.alertBlockMoreButton")}
                                        </Button>
                                    </Stack>
                                </Box>
                            </Stack>
                        </>
                    )}
                </Box>
            </Box>

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                slotProps={{ paper: { sx: { mt: 1, borderRadius: `var(--mui-shape-borderRadius)`, minWidth: 160 } } }}
            >
                <MenuItem onClick={handleEdit} sx={{ borderRadius: 1, mx: 0.5, my: 0.25 }}>
                    {t("widgets.alertsContent.alertBlockEditMenuItem")}
                </MenuItem>
                <MenuItem
                    onClick={() => {
                        setShowDeleteConfirm(true)
                        handleMenuClose()
                    }}
                    sx={{ color: "error.main", borderRadius: 1, mx: 0.5, my: 0.25 }}
                >
                    {t("widgets.alertsContent.alertBlockDeleteMenuItem")}
                </MenuItem>
            </Menu>

            <Dialog open={showDeleteConfirm} onClose={() => setShowDeleteConfirm(false)} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ color: isDark ? "white" : "text.primary" }}>
                    {t("widgets.alertsContent.confirmDeleteTitle")}
                </DialogTitle>
                <DialogContent>
                    <Typography sx={{ color: isDark ? "white" : "text.primary" }}>
                        {t("widgets.alertsContent.confirmDeleteMessage")}
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setShowDeleteConfirm(false)}
                        sx={{ color: isDark ? "white" : "text.primary" }}
                    >
                        {t("widgets.alertsContent.createAlertModalCancelButton")}
                    </Button>
                    <Button
                        onClick={() => {
                            handleDelete()
                            setShowDeleteConfirm(false)
                        }}
                        color="error"
                        variant="contained"
                        sx={{ background: "#B94A4A" }}
                    >
                        {t("widgets.alertsContent.createAlertModalDeleteButton")}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default AlertBlock
