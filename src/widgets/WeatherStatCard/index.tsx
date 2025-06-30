import { Theme, useTheme } from "@mui/material/styles"
import Card from "@mui/material/Card"
import Chip from "@mui/material/Chip"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { SparkLineChart } from "@mui/x-charts/SparkLineChart"
import { areaElementClasses } from "@mui/x-charts/LineChart"
import { useFuncGetMiniChartsDataBackendV1GetMiniChartsDataGetQuery } from "@/shared/api/model_fast_api"
import { useTranslation } from "react-i18next"
import { MiniChartStat } from "@/shared/types/MiniChartData"
import { WeatherStatCardSkeleton } from "@/shared/ui/skeletons/WeatherStatCardSkeleton"
import useMediaQuery from "@mui/material/useMediaQuery"

const trendColors = (theme: Theme) => ({
    positive: theme.palette.success.main,
    negative: theme.palette.error.main,
})

const trendLabels = {
    positive: "↑",
    negative: "↓",
} as const

const chipColors = {
    positive: "success",
    negative: "error",
} as const

export const WeatherStatCard = () => {
    const theme = useTheme()
    const colors = trendColors(theme)
    const { data: charts, isLoading, error } = useFuncGetMiniChartsDataBackendV1GetMiniChartsDataGetQuery()
    const { t } = useTranslation()
    const isMobile = useMediaQuery(theme.breakpoints.down("md"))

    if (isLoading) return <WeatherStatCardSkeleton />
    if (error) return <div>{t("widgets.weatherStatCard.error_loading_charts_data")}</div>
    if (!charts) return null

    return (
        <Stack
            component="div"
            sx={{
                display: "grid",
                gridTemplateColumns: {
                    xs: "1fr", // до 768px — 1 карточка в ряд
                    lg: "1fr 1fr 1fr 1fr", // с 1200px и выше — 4 карточки в ряд
                },
                gap: "1rem",
                width: "100%",
                alignItems: "stretch",
                padding: "1rem 0",
                "@media (min-width:768px) and (max-width:1199.98px)": {
                    gridTemplateColumns: "1fr 1fr", // только между 768px и 1200px — 2 карточки в ряд
                },
            }}
        >
            {charts.map((stat: MiniChartStat, i: number) => (
                <Card
                    key={i}
                    variant="outlined"
                    sx={{
                        maxHeight: `360px`,
                        width: `100%`,
                        marginRight: !isMobile && i < charts.length - 1 ? `1rem` : 0,
                        marginBottom: isMobile && i < charts.length - 1 ? `1rem` : 0,
                    }}
                >
                    <Stack direction="column" sx={{ padding: `1rem` }}>
                        <Typography variant="h6" gutterBottom>
                            {stat.title["en"]}
                        </Typography>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Typography variant="h4">{stat.values}</Typography>
                            <Chip
                                sx={{ lineHeight: `1rem`, fontSize: `1rem` }}
                                size="small"
                                label={`${stat.percentages.value} ${t(`widgets.weatherStatCard.trend_${stat.percentages.mark}`) || trendLabels[stat.percentages.mark]}`}
                                color={chipColors[stat.percentages.mark]}
                            />
                        </Stack>
                        <Typography variant="caption" sx={{ color: "text.secondary" }}>
                            {stat.description["en"]}
                        </Typography>
                        <SparkLineChart
                            color={colors[stat.percentages.mark]}
                            data={stat.data.map((el: { value: number; datetime: string }) => el.value)}
                            area
                            showHighlight
                            showTooltip
                            xAxis={{
                                scaleType: "point",
                                data: stat.data.map((el: { value: number; datetime: string }) => new Date(el.datetime)),
                            }}
                            sx={{
                                [`& .${areaElementClasses.root}`]: {
                                    fill: colors[stat.percentages.mark],
                                    opacity: 0.3,
                                },
                            }}
                        />
                    </Stack>
                </Card>
            ))}
        </Stack>
    )
}
