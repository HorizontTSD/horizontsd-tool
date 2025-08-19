import React, { useEffect, useState, useMemo } from "react"
import { LoadForecastPureGraph } from "@/widgets/LoadForecastGraphBlock/LoadForecastPureGraph"
import { ForecastGraphSkeleton } from "@/shared/ui/skeletons/ForecastGraphSkeleton"
import type { ForecastDataArray } from "./AlertPreviewModal"

interface ForecastGraphPanelProps {
    selectedSensor: string | null
    forecastData?: ForecastDataArray
}

type ForecastData = Record<string, unknown>

export const ForecastGraphPanel: React.FC<ForecastGraphPanelProps> = ({ selectedSensor, forecastData }) => {
    const [currentData, setCurrentData] = useState<ForecastData | null>(null)

    useEffect(() => {
        if (selectedSensor && forecastData) {
            const sensorData = forecastData?.[0]?.[selectedSensor]
            if (sensorData) {
                setCurrentData(sensorData)
            } else {
                setCurrentData(null)
            }
        } else {
            setCurrentData(null)
        }
    }, [selectedSensor, forecastData])

    const memoizedGraph = useMemo(() => {
        if (!currentData) return null
        return <LoadForecastPureGraph initialData={currentData} />
    }, [currentData])

    if (!selectedSensor) {
        return <ForecastGraphSkeleton height={600} width="100%" />
    }
    if (!currentData) return <ForecastGraphSkeleton height={600} width="100%" />

    return (
        <div
            style={{
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
            }}
        >
            {memoizedGraph}
        </div>
    )
}
