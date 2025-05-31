import { Typography, Card, Box, CircularProgress, Alert, Grid, Stack } from "@mui/material"
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import { ru } from "date-fns/locale"
import { useEffect, useRef, useState } from "react"
import { Metrics } from "@/shared/types"
import LatexEquation from "./LatexEquation"
import { useTranslation } from "react-i18next"
import {
    useFuncMetrixByPeriodBackendV1MetrixByPeriodPostMutation,
    useReadRootGetQuery,
    useFuncGetSensorIdListBackendV1GetSensorIdListGetQuery,
} from "@/shared/api/model_fast_api"

import { GridDropdown } from "@/widgets/GridDropdown"

type MetricConfig = {
    key: string
    titleKey: string
    equation: string
    unit?: string
}

const METRIC_CONFIG: MetricConfig[] = [
    {
        key: "MAE",
        titleKey: "widgets.metrix_bloc.mae",
        equation: "MAE = (1/n) ∑|y_i - ŷ_i|",
    },
    {
        key: "RMSE",
        titleKey: "widgets.metrix_bloc.rmse",
        equation: "RMSE = √(1/n ∑(y_i - ŷ_i)²)",
    },
    {
        key: "R2",
        titleKey: "widgets.metrix_bloc.r2",
        equation: "R² = 1 - (∑(y_i - ŷ_i)²) / (∑(y_i - ȳ)²)",
    },
    {
        key: "MAPE",
        titleKey: "widgets.metrix_bloc.mape",
        equation: "MAPE = (1/n) ∑ |(y_i - ŷ_i) / y_i| × 100",
        unit: "%",
    },
]

const MetricCard = ({
    title,
    value,
    unit = "",
    equation = "",
}: {
    title: string
    value: number
    unit?: string
    equation?: string
}) => (
    <Card
        variant="outlined"
        sx={{
            p: 2,
            overflowX: "auto",
            minWidth: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
        }}
    >
        <Typography variant="subtitle2" color="text.secondary">
            {title}
        </Typography>
        <Typography variant="h5" sx={{ mt: 1 }}>
            {value.toFixed(2)}
            {unit}
        </Typography>

        {equation && (
            <Box sx={{ mt: 2 }}>
                <LatexEquation equation={equation} />
            </Box>
        )}
    </Card>
)

const ModelSection = ({ modelName, metrics }: { modelName: string; metrics: Metrics }) => {
    const { t } = useTranslation();
    return (
        <Box
            sx={{
                mb: 4,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: "100%",
                justifyContent: "center",
            }}
        >
            <Typography variant="h6" sx={{ mb: 3, fontWeight: "medium" }}>
                {modelName}
            </Typography>

            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: {
                        xs: "1fr",
                        sm: "repeat(1, 1fr)",
                        md: "repeat(2, 1fr)",
                        lg: "repeat(2, 1fr)",
                        xl: "repeat(4, 1fr)",
                    },
                    gap: 3,
                    width: "100%",
                    minWidth: 0,
                }}
            >
                {
                    // eslint-disable-next-line
                    METRIC_CONFIG.map(({ key, titleKey, equation, unit }) => (
                        <MetricCard
                            key={key}
                            title={t(titleKey)}
                            value={metrics[key as keyof Metrics] ?? 0}
                            equation={equation}
                            unit={unit}
                        />
                    ))
                }
            </Box>
        </Box>
    )
}

export const Metrix = () => {
    const { t } = useTranslation()
    // Data fetching hooks
    const { data: rootData, isLoading: isRootLoading } = useReadRootGetQuery()
    const { data: sensors, isLoading: isSensorsLoading } = useFuncGetSensorIdListBackendV1GetSensorIdListGetQuery()
    const [triggerMetrix, { data: metricsData, isLoading: isMetricsLoading, error }] = useFuncMetrixByPeriodBackendV1MetrixByPeriodPostMutation()

    // State for selections
    const [selectedSensor, setSelectedSensor] = useState<string | null>(null)
    const [selectedModel, setSelectedModel] = useState<string | null>(null)

    // Date range state
    const earliestDate = rootData?.earliest_date ? new Date(rootData.earliest_date) : null
    const maxDate = rootData?.max_date ? new Date(rootData.max_date) : null
    const startDefaultDate = useRef(
        rootData?.start_default_date
            ? new Date(rootData.start_default_date)
            : new Date(Date.now() - 1000 * 60 * 60 * 24)
    )
    const endDefaultDate = useRef(rootData?.end_default_date ? new Date(rootData.end_default_date) : new Date())

    const [startDate, setStartDate] = useState<Date | null>(startDefaultDate.current)
    const [endDate, setEndDate] = useState<Date | null>(endDefaultDate.current)
    const [pickerOpen, setPickerOpen] = useState<boolean>(false)

    // Initialize sensor selection
    useEffect(() => {
        if (sensors?.[0] && !selectedSensor) {
            setSelectedSensor(sensors[0])
        }
    }, [sensors, selectedSensor])

    // Initialize dates when root data loads
    useEffect(() => {
        setStartDate(startDefaultDate.current)
        setEndDate(endDefaultDate.current)
    }, [startDefaultDate.current, endDefaultDate.current])

    // Fetch metrics when selections or dates change
    useEffect(() => {
        if (selectedSensor && startDate && endDate && pickerOpen == false) {
            triggerMetrix({
                metrixByPeriod: {
                    sensor_ids: [selectedSensor],
                    date_start: startDate.toISOString(),
                    date_end: endDate.toISOString(),
                },
            })
                .unwrap()
                .catch(console.error)
        }
    }, [selectedSensor, startDate, endDate, triggerMetrix, pickerOpen])

    // Initialize model selection when metrics data arrives
    useEffect(() => {
        if (metricsData && metricsData.length > 0 && !selectedModel) {
            // Assuming the first available model is the default
            const availableModels = Object.keys(metricsData[0])
            if (availableModels.length > 0) {
                setSelectedModel(availableModels[0])
            }
        }
    }, [metricsData, selectedModel])

    const handleSensorChange = (sensor: string) => {
        setSelectedSensor(sensor)
        // Reset model selection when sensor changes
        setSelectedModel(null)
    }

    const handleModelChange = (model: string) => {
        setSelectedModel(model)
    }

    const availableModels = metricsData && metricsData.length > 0 ? Object.keys(metricsData[0]) : []

    const isLoading = isRootLoading || isSensorsLoading || isMetricsLoading

    return (
        <Stack direction={"column"} sx={{ margin: `1rem 0` }}>
            <Stack direction={"column"} sx={{ margin: `1rem 0` }}>
                <Typography variant="h4">{t("widgets.Metrix.data")}</Typography>
            </Stack>
            <Card variant="outlined" sx={{ width: "100%", p: 2, minHeight: `400px` }}>

                {isLoading && (
                    <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                        <CircularProgress />
                    </Box>
                )}

                {/* Sensor and Model Selection */}
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        width: "100%",
                        mb: 3,
                    }}
                >
                    <Stack>
                        <Typography>{t("widgets.Metrix.sensor_selection")}</Typography>
                        <GridDropdown
                            list={sensors || []}
                            selected={selectedSensor || ""}
                            onSelect={handleSensorChange}
                        />
                    </Stack>

                    <Stack>
                        <Typography>{t("widgets.Metrix.model_selection")}</Typography>
                        <GridDropdown
                            list={availableModels}
                            selected={selectedModel || ""}
                            onSelect={handleModelChange}
                        />
                    </Stack>
                </Box>

                <Typography variant="h6" sx={{ mb: 3 }}>
                    {t("widgets.Metrix.select_data_range")}
                </Typography>

                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ru}>
                    <Grid container spacing={2}>
                        <Grid component="div">
                            <DateTimePicker
                                label={t("widgets.Metrix.start_date")}
                                ampm={false}
                                format="dd.MM.yyyy HH:mm"
                                value={startDate}
                                onChange={setStartDate}
                                onClose={() => setPickerOpen(false)}
                                onOpen={() => setPickerOpen(true)}
                                minDate={earliestDate || undefined}
                                maxDate={endDate || maxDate || undefined}
                                slotProps={{ textField: { fullWidth: true } }}
                            />
                        </Grid>
                        <Grid component="div">
                            <DateTimePicker
                                label={t("widgets.Metrix.end_date")}
                                ampm={false}
                                format="dd.MM.yyyy HH:mm"
                                value={endDate}
                                onChange={setEndDate}
                                onClose={() => setPickerOpen(false)}
                                onOpen={() => setPickerOpen(true)}
                                minDate={startDate ?? startDefaultDate.current ?? undefined}
                                maxDate={maxDate || undefined}
                                slotProps={{ textField: { fullWidth: true } }}
                            />
                        </Grid>
                    </Grid>
                </LocalizationProvider>

                <Box sx={{ mt: 2 }}>
                    {error && (
                        <Alert severity="error" sx={{ mb: 3 }}>
                            {t("widgets.metrix_bloc.error_1")}: {error.toString()}
                        </Alert>
                    )}

                    {selectedModel && metricsData && metricsData.length > 0 && (
                        <ModelSection
                            modelName={selectedModel}
                            metrics={metricsData[0][selectedModel as keyof (typeof metricsData)[0]]}
                        />
                    )}
                </Box>
            </Card>
        </Stack>
    )
}
