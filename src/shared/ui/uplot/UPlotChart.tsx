/* eslint-disable */
import React, { useEffect, useRef } from "react"
import uPlot, { Plugin, Options, Hooks, Cursor } from "uplot"
import "uplot/dist/uPlot.min.css"
import "./annotations.css"

interface UPlotChartProps {
    data: number[][]
    opts: Options
    hooks?: { [key: string]: uPlot.Hooks.Arrays }
    plugins?: Plugin[]
    callback?: any
    cursor?: Cursor
}

export const UPlotChart: React.FC<UPlotChartProps> = ({ data, opts, hooks, plugins, callback, cursor }) => {
    const chartRef = useRef<HTMLDivElement>(null)
    const plotRef = useRef<uPlot | null>(null)

    useEffect(() => {
        if (chartRef.current && data && data.length > 0) {
            const reactOpts: uPlot.Options = {
                ...opts,
                hooks,
                plugins,
                cursor,
            }
            if (plotRef.current) {
                plotRef.current.destroy()
            }
            const plot: uPlot = new uPlot(reactOpts, data, chartRef.current)
            plotRef.current = plot
            if (callback) callback(plotRef.current)
        }
        return () => {
            plotRef.current?.destroy()
            plotRef.current = null
        }
    }, [data, opts, hooks, plugins, cursor])
    return <div ref={chartRef} />
}
