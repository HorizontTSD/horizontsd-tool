import React, { useEffect, useState, useMemo } from "react"
import { LoadForecastPureGraph } from "@/widgets/LoadForecastGraphBlock/LoadForecastPureGraph"

interface ForecastGraphPanelProps {
    selectedSensor: string | null
    forecastData?: any // Pass data from parent instead of fetching
}

type ForecastData = Record<string, unknown>

export const ForecastGraphPanel: React.FC<ForecastGraphPanelProps> = ({ selectedSensor, forecastData }) => {
    const [currentData, setCurrentData] = useState<ForecastData | null>(null)

    useEffect(() => {
        if (selectedSensor && forecastData) {
            const sensorData = forecastData?.[0]?.[selectedSensor]
            if (sensorData) {
                setCurrentData(sensorData)
            }
        }
    }, [selectedSensor, forecastData])

    const memoizedGraph = useMemo(() => {
        if (!currentData) return null
        return <LoadForecastPureGraph initialData={currentData} />
    }, [currentData])

    if (!selectedSensor) {
        return <div style={{ width: 700, height: 200, background: "#e3ecf5", borderRadius: 16 }} />
    }
    if (!currentData) return <div style={{ width: 700, height: 200, background: "#e3ecf5", borderRadius: 16 }} />

    return <div style={{ width: 700, height: 200 }}>{memoizedGraph}</div>
}
