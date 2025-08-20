import { CustomizedDataGrid } from "@/widgets/GridDetails"
import { LoadForecastGraphBlock } from "@/widgets/LoadForecastGraphBlock"
import { Metrix } from "@/widgets/Metrix"
import { WeatherStatCard } from "@/widgets/WeatherStatCard"
import { Stack, Typography } from "@mui/material"
import { useTranslation } from "react-i18next"

// TODO: move to \src\shared\ui\Layout\MainLayout.tsx
export const DataForecast = () => {
    const { t } = useTranslation()

    return (
        <Stack
            sx={{
                padding: `1rem`,
                overflow: `auto`,
            }}
        >
            <Stack direction={"column"} sx={{ margin: `0.25rem 0` }}>
                <Typography variant="h4">{t("widgets.weatherData")}</Typography>
            </Stack>
            <WeatherStatCard />
            <LoadForecastGraphBlock />
            <Metrix />
            <CustomizedDataGrid />
        </Stack>
    )
}
