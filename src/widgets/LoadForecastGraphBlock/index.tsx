import React from "react"
import { Card, Stack, Typography } from "@mui/material"
import { LoadForecastPureGraph } from "@/widgets/LoadForecastGraphBlock/LoadForecastPureGraph"
import { useState, useEffect } from "react"
import {
    useFuncGetForecastDataBackendV1GetForecastDataPostMutation,
    useFuncGetSensorIdListBackendV1GetSensorIdListGetQuery,
} from "@/shared/api/model_fast_api"
import { useTranslation } from "react-i18next"
import { FetchBaseQueryError } from "@reduxjs/toolkit/query/react"
import { ForecastGraphSkeleton } from "@/shared/ui/skeletons/ForecastGraphSkeleton"
import { Navbar } from "./Navbar"
import { NavbarSkeleton } from "@/shared/ui/skeletons/NavbarSkeleton"

// Helper function to convert time string (e.g., "5m", "1h") to milliseconds
const timeStringToMilliseconds = (timeString: string): number => {
    const value = parseInt(timeString.slice(0, -1), 10)
    const unit = timeString.slice(-1)
    switch (unit) {
        case "m":
            return value * 60 * 1000 // minutes to milliseconds
        case "h":
            return value * 60 * 60 * 1000 // hours to milliseconds
        default:
            return 0 // Default to no refresh if unit is unknown
    }
}

export const LoadForecastGraphBlock = () => {
    const {
        data: sensorsList,
        error: sensorsListError,
        isLoading: sensorsListLoading,
    } = useFuncGetSensorIdListBackendV1GetSensorIdListGetQuery()
    const [triggerForecast, { data, error }] = useFuncGetForecastDataBackendV1GetForecastDataPostMutation()
    const { t } = useTranslation()

    // Track selected model and refresh interval
    const [selectedModel, setSelectedModel] = useState<string | null>(null)
    const [selectedRefreshInterval, setSelectedRefreshInterval] = useState<string | null>(null)

    // Set initial selected model and trigger first forecast when sensors load
    useEffect(() => {
        if (sensorsList?.[0]) {
            const firstSensor = sensorsList[0]
            setSelectedModel(firstSensor)

            // Trigger initial forecast
            triggerForecast({
                forecastData: {
                    sensor_ids: [firstSensor],
                },
            })
                .unwrap()
                .catch((err) => console.error("Failed to fetch initial forecast:", err))
        }
    }, [sensorsList, triggerForecast])

    // Effect to manage the auto-refresh interval
    useEffect(() => {
        let intervalId: ReturnType<typeof setInterval> | null = null

        if (selectedModel && selectedRefreshInterval) {
            const intervalMs = timeStringToMilliseconds(selectedRefreshInterval)

            if (intervalMs > 0) {
                intervalId = setInterval(() => {
                    console.log(`Auto-refreshing chart for sensor ${selectedModel} at ${selectedRefreshInterval}`)
                    triggerForecast({
                        forecastData: {
                            sensor_ids: [selectedModel],
                        },
                    })
                        .unwrap()
                        .catch((err) => console.error("Failed to auto-refresh forecast:", err))
                }, intervalMs)
            }
        }

        // Cleanup function to clear the interval
        return () => {
            if (intervalId) {
                clearInterval(intervalId)
            }
        }
    }, [selectedModel, selectedRefreshInterval, triggerForecast])

    const handleSubmit = async (selected: string) => {
        setSelectedModel(selected)
        // When sensor changes, clear previous refresh interval selection
        setSelectedRefreshInterval(null)
        try {
            await triggerForecast({
                forecastData: {
                    sensor_ids: [selected],
                },
            }).unwrap()
        } catch (err) {
            console.error("Failed to fetch forecast:", err)
        }
    }

    const handleRefreshChart = (period: string) => {
        setSelectedRefreshInterval(period)
        console.log(`Selected refresh period: ${period}`)
        // The useEffect hook will handle triggering the forecast based on this state change
    }

    // Get current forecast data based on selection
    const currentData = data?.[0]?.[selectedModel || ""]

    return (
        <Stack direction={"column"} sx={{ margin: `1rem 0` }}>
            <Stack direction={"column"} sx={{ margin: `1rem 0` }}>
                <Typography variant="h4">{t("widgets.LoadForecastGraphBlock.title")}</Typography>
            </Stack>
            <Card variant="outlined" sx={{ width: "100%", p: 2, minHeight: `650px` }}>
                {sensorsListLoading ? (
                    <NavbarSkeleton />
                ) : sensorsListError ? (
                    <div>{t("widgets.LoadForecastGraphBlock.sensorsError")}</div>
                ) : (
                    <Navbar
                        availableModels={sensorsList || []}
                        selectedModel={selectedModel || ""}
                        onSelect={handleSubmit}
                        onRefreshSelect={handleRefreshChart}
                    />
                )}

                {error && (
                    <div style={{ color: "red" }}>
                        {t("widgets.LoadForecastGraphBlock.errorPrefix")}
                        {(error as FetchBaseQueryError)?.data &&
                        typeof ((error as FetchBaseQueryError).data as { detail: string }).detail === "string"
                            ? ((error as FetchBaseQueryError).data as { detail: string }).detail
                            : t("widgets.LoadForecastGraphBlock.unknownError")}
                    </div>
                )}
                {currentData ? <LoadForecastPureGraph initialData={currentData} /> : <ForecastGraphSkeleton />}
            </Card>
        </Stack>
    )
}
