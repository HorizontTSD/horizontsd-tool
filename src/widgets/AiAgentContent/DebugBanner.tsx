import React from "react"
import { Alert, IconButton, Typography } from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"
import { useTranslation } from "react-i18next"
import { DebugBannerProps } from "./types"

export const DebugBanner: React.FC<DebugBannerProps> = ({ onClose }) => {
    const { t } = useTranslation()

    return (
        <Alert
            severity="info"
            sx={{ mb: 1 }}
            action={
                <IconButton size="small" onClick={onClose}>
                    <CloseIcon fontSize="small" />
                </IconButton>
            }
        >
            <Typography variant="body2" sx={{ mb: 0.5 }}>
                {t("widgets.aiAgent.debugBanner.title")}
            </Typography>
            <ul style={{ margin: 0, paddingInlineStart: 18 }}>
                <li>{t("widgets.aiAgent.debugBanner.capCSV")}</li>
                <li>{t("widgets.aiAgent.debugBanner.capForecast")}</li>
                <li>{t("widgets.aiAgent.debugBanner.capAnalyze")}</li>
                <li>{t("widgets.aiAgent.debugBanner.capCharts")}</li>
                <li>{t("widgets.aiAgent.debugBanner.capInteractive")}</li>
            </ul>
        </Alert>
    )
}
