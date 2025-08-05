import { MainLayout } from "@/shared/ui/Layout/MainLayout"
import { Box, Typography } from "@mui/material"
import { useTranslation } from "react-i18next"

export const AiAgentPage = () => {
    const { t } = useTranslation()

    return (
        <MainLayout>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100vh",
                    width: "100%",
                }}
            >
                <Typography variant="h4" color="text.secondary">
                    {t("widgets.comingSoon")}
                </Typography>
            </Box>
        </MainLayout>
    )
}
