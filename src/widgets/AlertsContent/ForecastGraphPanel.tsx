import React, { useEffect, useState, useMemo } from "react"
import { LoadForecastPureGraph } from "@/widgets/LoadForecastGraphBlock/LoadForecastPureGraph"
import {
    useFuncGetForecastDataBackendV1GetForecastDataPostMutation,
    useFuncGetSensorIdListBackendV1GetSensorIdListGetQuery,
} from "@/shared/api/backend"

interface ForecastGraphPanelProps {
    selectedSensor: string | null
}

export const ForecastGraphPanel: React.FC<ForecastGraphPanelProps> = ({ selectedSensor }) => {
    const [triggerForecast] = useFuncGetForecastDataBackendV1GetForecastDataPostMutation()
    const [dataCache, setDataCache] = useState<Record<string, any>>({})
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [currentData, setCurrentData] = useState<any>(null)

    useEffect(() => {
        if (!selectedSensor || dataCache[selectedSensor]) return
        setLoading(true)
        setError(null)
        triggerForecast({ forecastData: { sensor_ids: [selectedSensor] } })
            .then((res: any) => {
                setDataCache((prev) => ({ ...prev, [selectedSensor]: res?.data?.[0]?.[selectedSensor] }))
            })
            .catch(() => setError("Error loading graph"))
            .finally(() => setLoading(false))
    }, [selectedSensor, triggerForecast, dataCache])

    useEffect(() => {
        if (selectedSensor && dataCache[selectedSensor]) {
            setCurrentData(dataCache[selectedSensor])
        }
    }, [selectedSensor, dataCache])

    const memoizedGraph = useMemo(() => {
        if (!currentData) return null
        return <LoadForecastPureGraph initialData={currentData} />
    }, [currentData])

    if (!selectedSensor) {
        return <div style={{ width: 700, height: 200, background: "#e3ecf5", borderRadius: 16 }} />
    }
    if (loading) return <div>Loading...</div>
    if (error) return <div style={{ color: "red" }}>{error}</div>
    if (!currentData) return <div style={{ width: 700, height: 200, background: "#e3ecf5", borderRadius: 16 }} />

    return <div style={{ width: 700, height: 200 }}>{memoizedGraph}</div>
}
