import { useEffect, useMemo, useRef, useState } from "react"
import { UPlotChart } from "@/shared/ui/uplot/UPlotChart"
import { Stack, useColorScheme } from "@mui/material"
import { createPopper } from "@popperjs/core"
import { Options } from "uplot"
import uPlot, { Series } from "uplot"
import "@/widgets/LoadForecastGraphBlock/LoadForecastPureGraph/theme.css"

function tooltipPlugin(opts: { series: Series[] }) {
    let overlay: HTMLElement
    let popperInstance: unknown

    // Create tooltip element
    overlay = document.createElement("div")
    overlay.className = "uplot-tooltip"
    Object.assign(overlay.style, {
        position: "absolute",
        display: "none",
        background: "rgba(255, 255, 255, 0.8)",
        color: "black",
        padding: "4px 8px",
        borderRadius: "3px",
        fontSize: "12px",
        pointerEvents: "none",
        zIndex: "1000",
    })
    document.body.appendChild(overlay)

    return {
        hooks: {
            init: (u: uPlot) => {
                u.over.addEventListener("mouseenter", () => {
                    overlay.style.display = "block"
                })
                u.over.addEventListener("mouseleave", () => {
                    overlay.style.display = "none"
                })
            },
            setCursor: (u: uPlot) => {
                const { left, top, idx } = u.cursor
                if (idx == null) return
                overlay.innerHTML = ""
                u.data.slice(1).forEach((e: unknown, i: number) => {
                    const val = document.createElement("div")
                    val.style.display = `flex`
                    val.style.flexDirection = `row`
                    val.style.justifyContent = `start`
                    val.style.alignItems = `center`
                    val.style.padding = `2px`
                    const label = document.createElement("div")
                    label.style.marginRight = `8px`
                    const text = document.createElement("div")
                    const value = document.createElement("div")
                    text.style.lineHeight = `1rem`
                    text.style.fontFamily = `monospace`
                    value.style.fontFamily = `monospace`
                    text.style.textTransform = `uppercase`
                    label.style.width = `10px`
                    label.style.height = `10px`
                    label.style.background = opts.series.slice(1)[i].stroke as string
                    val.append(label)
                    val.append(text)
                    val.append(value)
                    text.innerHTML = `${u.series.slice(1)[i].label}:`
                    // @ts-expect-error: e is array of y values
                    value.innerHTML = e[idx] || "none"
                    overlay.append(val)
                })
                const virtualAnchor = {
                    getBoundingClientRect: (): DOMRect => {
                        const rect = u.over.getBoundingClientRect()
                        return {
                            width: 0,
                            height: 0,
                            top: rect.top + (top ?? 0),
                            right: rect.left + (left ?? 0),
                            bottom: rect.top + (top ?? 0),
                            left: rect.left + (left ?? 0),
                            x: rect.left + (left ?? 0),
                            y: rect.top + (top ?? 0),
                            toJSON: () => ({}),
                        } as DOMRect
                    },
                    contextElement: u.over,
                }
                if (!popperInstance) {
                    popperInstance = createPopper(virtualAnchor as unknown, overlay, {
                        placement: "right-start",
                        modifiers: [
                            {
                                name: "offset",
                                options: {
                                    offset: [20, 20],
                                },
                            },
                            {
                                name: "preventOverflow",
                                options: {
                                    boundary: u.root,
                                },
                            },
                            {
                                name: "flip",
                                options: {
                                    boundary: u.root,
                                    padding: 10,
                                },
                            },
                        ],
                    })
                } else {
                    // @ts-expect-error: popperInstance is unknown
                    popperInstance.state.elements.reference = virtualAnchor
                    // @ts-expect-error: popperInstance is unknown
                    popperInstance.update()
                }
            },
            destroy: () => {
                if (popperInstance) {
                    // @ts-expect-error: popperInstance is unknown
                    popperInstance.destroy()
                }
                overlay.remove()
            },
        },
    }
}

interface ForecastPureGraphProps {
    payload: {
        forecast: {
            map_data: {
                data: {
                    last_real_data: {
                        [key: string]: string | number
                    }[]
                    predictions: {
                        [key: string]: string | number
                    }[]
                }
                legend: {
                    [key: string]: {
                        color: string
                    }
                }
                title: string
            }
        }
        data: {
            df: {
                [key: string]: string | number
            }[]
            time_column: string
            col_target: string
            forecast_horizon_time: string
        }
        target_time: string
        target_value: string
    }
}

export const DataChart = ({ payload }: ForecastPureGraphProps) => {
    const { forecast, target_time, target_value } = payload

    // TODO: decrease rerenders
    // console.log(`update`)
    const { mode } = useColorScheme()
    const isDark = mode === "dark"
    //
    const containerRef = useRef<HTMLDivElement>(null)
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
    const plotRef = useRef<uPlot | null>(null)
    const animFrame = useRef<number | null>(null)
    //

    // --- Новый способ: история и прогноз как две отдельные линии ---
    // История берём из payload.data.df, прогноз — из forecast.map_data.data.predictions
    const history = payload.data?.df || []
    const predictions = forecast.map_data.data?.predictions || []

    const toTS = (s: unknown) => {
        if (!s || typeof s !== "object") return NaN
        const obj = s as Record<string, unknown>
        // @ts-expect-error: dynamic access
        return new Date(obj.Datetime || obj[target_time]).valueOf()
    }
    const xsHistory = history.map(toTS)
    const ysHistory = history.map((e: unknown) => (e as Record<string, unknown>)[target_value] ?? null)
    const xsForecast = predictions.map(toTS)
    const ysForecast = predictions.map((e: unknown) => (e as Record<string, unknown>)[target_value] ?? null)

    let chart_data: any[]
    let series: any[]
    if (predictions.length === 0) {
        // Только история
        chart_data = [xsHistory, ysHistory]
        series = [{}, { label: "История", stroke: "#1976d2" }]
    } else {
        // История + прогноз
        const xs = [...xsHistory, ...xsForecast]
        const ys1 = [...ysHistory, ...Array(xsForecast.length).fill(null)]
        const ys2 = [...Array(xsHistory.length).fill(null), ...ysForecast]
        chart_data = [xs, ys1, ys2]
        series = [{}, { label: "История", stroke: "#1976d2" }, { label: "Прогноз", stroke: "#ff9800" }]
    }

    // Create a function to generate options based on current mode
    const getOptions = (width: number, height: number): Options => ({
        title: `${forecast.map_data.title}`,
        width,
        height,
        pxAlign: false,
        scales: {
            x: { time: true },
            y: {}, // range: [from,to]
        },
        series,
        axes: [
            {
                label: "X Axis (Time)",
                stroke: isDark ? `rgba(255, 255, 255, 1)` : `rgba(0, 0, 0, 1)`,
                grid: {
                    width: 1,
                    stroke: isDark ? `rgba(255, 255, 255, 0.1)` : `rgba(0, 0, 0, 0.1)`,
                },
            },
            {
                side: 1,
                label: "Y Axis (Amount)",
                stroke: isDark ? `rgba(255, 255, 255, 1)` : `rgba(0, 0, 0, 1)`,
                grid: {
                    width: 1,
                    stroke: isDark ? `rgba(255, 255, 255, 0.1)` : `rgba(0, 0, 0, 0.1)`,
                },
            },
        ],
        legend: {
            markers: {
                fill: (u: any, seriesIdx: number) => {
                    const stroke = u.series[seriesIdx].stroke
                    return typeof stroke === "function" ? stroke(u, seriesIdx) : stroke || "#1976d2"
                },
                stroke: "transparent",
            },
        },
    })

    // Memoize options to prevent unnecessary recalculations
    const opts = useMemo(() => {
        return getOptions(dimensions.width, dimensions.height)
    }, [dimensions.width, dimensions.height, isDark])

    // Resize handler
    // Throttled resize handler
    useEffect(() => {
        const updateDimensions = () => {
            if (!containerRef.current) return
            const { clientWidth, clientHeight } = containerRef.current

            // Only update state if dimensions actually changed
            if (clientWidth !== dimensions.width || clientHeight !== dimensions.height) {
                setDimensions({ width: clientWidth, height: clientHeight })
            }
        }

        const handleResize = () => {
            // Cancel any pending animation frame
            if (animFrame.current !== null) {
                cancelAnimationFrame(animFrame.current)
            }

            // Schedule new update
            animFrame.current = requestAnimationFrame(updateDimensions)
        }

        const resizeObserver = new ResizeObserver(handleResize)
        if (containerRef.current) {
            resizeObserver.observe(containerRef.current)
        }

        return () => {
            resizeObserver.disconnect()
            if (animFrame.current !== null) {
                cancelAnimationFrame(animFrame.current)
            }
        }
    }, [dimensions.width, dimensions.height]) // Only recreate when dimensions change

    return (
        <Stack
            sx={{
                padding: `1rem`,
                overflow: `auto`,
                minHeight: `100%`,
            }}
        >
            <div
                ref={containerRef}
                style={{
                    minWidth: "512px",
                    height: "480px",
                }}
            >
                {chart_data && (
                    <UPlotChart
                        data={chart_data}
                        opts={opts}
                        plugins={[
                            // box_whisker__legendAsTooltipPlugin()
                            tooltipPlugin({ series } as unknown),
                        ]}
                        callback={(u: uPlot) => {
                            plotRef.current = u
                            // Set initial size
                            if (containerRef.current) {
                                u.setSize({
                                    width: containerRef.current.clientWidth,
                                    height: containerRef.current.clientHeight,
                                })
                            }
                        }}
                    />
                )}
            </div>
        </Stack>
    )
}
