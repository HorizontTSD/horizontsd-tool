import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import { Box, Stack, StepLabel, Typography, useColorScheme } from "@mui/material"
import { ColorlibConnector, ColorlibStepIcon } from "./NewForecastStepperComponents"
import { DataChart } from "./dataChart"
import { DataTable } from "./dataTable"
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { SelectDataSource } from "./dataSelect"
import { useEffect, useState, useRef, useMemo } from "react"
import * as React from "react"
import Button from "@mui/material/Button"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import dayjs, { Dayjs } from "dayjs"
import ErrorIcon from "@mui/icons-material/Error"
import Step from "@mui/material/Step"
import Stepper from "@mui/material/Stepper"
import { useFuncGenerateForecastBackendV1GenerateForecastPostMutation } from "@/shared/api/backend"
import { useFuncGeneratePossibleDateBackendV1GeneratePossibleDatePostMutation } from "@/shared/api/backend"
import { Options } from "uplot"
import uPlot from "uplot"

import "./index.css"
import "dayjs/locale/en-gb"
import { useTranslation } from "react-i18next"
import { ForecastGraphSkeleton } from "@/shared/ui/skeletons/ForecastGraphSkeleton"
import { UPlotChart } from "@/shared/ui/uplot/UPlotChart"

interface DataRow {
    [key: string]: string | number
}

// Новый компонент для отображения пользовательских данных без прогноза
const UserDataChart = ({ data, XY }: { data: DataRow[]; XY: string[] }) => {
    const { mode } = useColorScheme()
    const isDark = mode === "dark"
    const containerRef = useRef<HTMLDivElement>(null)
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
    const plotRef = useRef<uPlot | null>(null)
    const animFrame = useRef<number | null>(null)

    // Подготовка данных для графика
    const timeKey = XY[0]
    const valueKey = XY[1]
    if (!timeKey || !valueKey) return null

    const toTS = (s: string | number): number => new Date(s).valueOf()
    const xs = data.map((row) => toTS(row[timeKey]) / 1000)
    const ys = data.map((row) => (typeof row[valueKey] === "number" ? row[valueKey] : Number(row[valueKey])))
    const chart_data = [xs, ys]

    // Create a function to generate options based on current mode
    const getOptions = (width: number, height: number): Options => ({
        title: `Визуализация ваших данных (${valueKey})`,
        width,
        height,
        pxAlign: false,
        scales: {
            x: { time: true },
            y: {}, // range: [from,to]
        },
        series: [{}, { label: valueKey, stroke: "#1976d2" }],
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
                fill: () => "#1976d2",
                stroke: "transparent",
            },
        },
    })

    // Memoize options to prevent unnecessary recalculations
    const opts = useMemo(() => {
        return getOptions(dimensions.width, dimensions.height)
    }, [dimensions.width, dimensions.height, isDark])

    // Resize handler
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
    }, [dimensions.width, dimensions.height])

    return (
        <Stack sx={{ padding: `1rem`, minHeight: `100%`, overflow: `visible` }}>
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
            <Typography variant="caption" color="info.main" sx={{ mt: 1 }}>
                Это ваши данные. После отправки появится прогноз.
            </Typography>
        </Stack>
    )
}

const LoadData = ({
    dataChartLoading,
    data,
    forecast,
    XY,
    forecast_horizon_time,
    setForecast_horizon_time,
    dateLimits,
    minForecastHorizon,
}: {
    dataChartLoading: boolean
    data: DataRow[] | null
    forecast: unknown
    XY: string[]
    forecast_horizon_time: string | Dayjs | null
    setForecast_horizon_time: React.Dispatch<React.SetStateAction<string | Dayjs | null>>
    dateLimits: { min: string; max: string } | null
    minForecastHorizon: string | null
}) => {
    const stts = (s: string | number | Date | Dayjs | null | undefined) => {
        if (s === null || s === undefined) return NaN
        if (s instanceof Date) return s.valueOf()
        if (dayjs.isDayjs(s)) return s.valueOf()
        if (typeof s === "string" && isNaN(Number(s))) {
            const parsedDate = new Date(s)
            if (!isNaN(parsedDate.valueOf())) return parsedDate.valueOf()
        }
        return new Date(Number(s)).valueOf()
    }
    const newest_date =
        data && data.length > 0
            ? data.slice().sort((a: DataRow, b: DataRow) => {
                  const dateA = a[XY[0]]
                  const dateB = b[XY[0]]
                  return stts(dateB) - stts(dateA)
              })[0]
            : undefined

    const [value, setValue] = React.useState<Dayjs | null>(
        newest_date && newest_date[XY[0]] ? dayjs(newest_date[XY[0]]) : null
    )

    const { t } = useTranslation("common")

    const forecastData =
        forecast && typeof forecast === "object" && "data" in forecast
            ? (forecast as Record<string, unknown>).data
            : undefined

    // Проверка на наличие map_data
    const hasMapData = forecastData && typeof forecastData === "object" && "map_data" in forecastData

    return (
        <Stack>
            <Stack spacing={1} sx={{ padding: `1rem 0`, width: "240px" }}>
                <Typography>{t("widgets.newForecast.controlled_picker_label")}</Typography>
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={"en-gb"}>
                    <DateTimePicker
                        label={t("widgets.newForecast.controlled_picker_label")}
                        value={value}
                        onChange={(newValue) => {
                            setValue(newValue as Dayjs | null)
                            setForecast_horizon_time(newValue as Dayjs | null)
                        }}
                        minDate={dateLimits ? dayjs(dateLimits.min) : undefined}
                        maxDate={dateLimits ? dayjs(dateLimits.max) : undefined}
                        shouldDisableDate={(date) => {
                            if (!dateLimits) return false
                            const min = dayjs(dateLimits.min)
                            const max = dayjs(dateLimits.max)
                            const d = dayjs(date)
                            return d.isBefore(min) || d.isAfter(max)
                        }}
                    />
                </LocalizationProvider>
                {minForecastHorizon && (
                    <Typography variant="caption" color="info.main">
                        {t("widgets.newForecast.min_forecast_horizon_time")}: {minForecastHorizon}
                    </Typography>
                )}
            </Stack>
            {dataChartLoading ? (
                <ForecastGraphSkeleton />
            ) : hasMapData && data ? (
                <DataChart
                    dataChartLoading={dataChartLoading}
                    payload={{
                        data: {
                            df: data.map((row: DataRow) => {
                                const formattedRow: { [key: string]: string | number } = {}
                                for (const key in row) {
                                    if (Object.prototype.hasOwnProperty.call(row, key)) {
                                        const value = row[key]
                                        formattedRow[key] =
                                            typeof value === "string" || typeof value === "number"
                                                ? value
                                                : String(value)
                                    }
                                }
                                return formattedRow
                            }),
                            time_column: XY[0],
                            col_target: XY[1],
                            forecast_horizon_time: forecast_horizon_time
                                ? dayjs(forecast_horizon_time).toISOString().replace(`T`, ` `).replace(`.000Z`, ``)
                                : "",
                        },
                        forecast: forecastData,
                        target_time: XY[0],
                        target_value: XY[1],
                    }}
                />
            ) : data && data.length > 0 && XY[0] && XY[1] ? (
                <UserDataChart data={data} XY={XY} />
            ) : (
                <ForecastGraphSkeleton />
            )}
        </Stack>
    )
}

// Функция для нормализации данных: преобразует числовые строки в числа
function normalizeDataRows(data: DataRow[], timeColumn: string): DataRow[] {
    return data.map((row) => {
        const newRow: DataRow = {}
        for (const key in row) {
            if (
                key !== timeColumn && // не преобразуем колонку времени
                row[key] !== "" &&
                row[key] !== null &&
                typeof row[key] === "string" &&
                !isNaN(Number(row[key]))
            ) {
                newRow[key] = Number(row[key])
            } else {
                newRow[key] = row[key]
            }
        }
        return newRow
    })
}

export const NewForecast = () => {
    const { mode } = useColorScheme()
    const isDark = mode === "dark"
    const bgPalette = ["var(--mui-palette-primary-light)", "var(--mui-palette-primary-dark)"]
    const bg = bgPalette[~~isDark]

    const { t } = useTranslation("common")
    const steps = [
        t("widgets.newForecast.steps.select_data"),
        t("widgets.newForecast.steps.choose_xy"),
        t("widgets.newForecast.steps.choose_time"),
    ]

    // State declarations
    const [selected_data, setSelected] = useState<string | null>(null)
    const [load_data, setLoaddata] = useState(false)
    const [data, setData] = useState<DataRow[] | null>(null)
    const [selected_axis, setSelected_axis] = useState<string[]>(["", ""])
    const [dataChartLoading, setDataChartLoading] = useState(true)
    const [activeStep, setActiveStep] = React.useState(0)
    const [forecast_horizon_time, setForecast_horizon_time] = React.useState<string | Dayjs | null>(null)
    const [completed, setCompleted] = React.useState<{
        [k: number]: boolean
    }>({})
    const [generatePossibleDate] = useFuncGeneratePossibleDateBackendV1GeneratePossibleDatePostMutation()
    const [dateLimits, setDateLimits] = useState<{ min: string; max: string } | null>(null)
    const [minForecastHorizon, setMinForecastHorizon] = useState<string | null>(null)

    // Effects
    const [generateForecast, result] = useFuncGenerateForecastBackendV1GenerateForecastPostMutation()

    useEffect(() => {
        if (
            selected_data != null &&
            selected_axis.every((value) => value.length !== 0) &&
            completedSteps() === totalSteps() &&
            data != null
        ) {
            generateForecast({
                predictRequest: {
                    df: data ? normalizeDataRows(data, selected_axis[0]) : [],
                    col_target: selected_axis[1],
                    time_column: selected_axis[0],
                    forecast_horizon_time: forecast_horizon_time
                        ? dayjs(forecast_horizon_time).toISOString().replace(`T`, ` `).replace(`.000Z`, ``)
                        : "",
                },
            })
                .unwrap()
                .then((payload) => {
                    return payload
                })
                .catch((error) => {
                    console.error(t("widgets.newForecast.error_generating_forecast"), error)
                })
        }
    }, [selected_data, selected_axis, completed, data, forecast_horizon_time, t])

    useEffect(() => {
        setDataChartLoading(result.isLoading)
    }, [result.isLoading])

    useEffect(() => {
        if (selected_axis.every((value) => value.length !== 0) && data && data.length > 0) {
            generatePossibleDate({
                convertRequest: {
                    df: data,
                    time_column: selected_axis[0],
                },
            })
                .unwrap()
                .then((res) => {
                    if (res && res.date) {
                        setDateLimits(res.date)
                        setMinForecastHorizon(res.min_forecast_horizon_time)
                    }
                })
                .catch(() => {
                    setDateLimits(null)
                    setMinForecastHorizon(null)
                })
        }
    }, [selected_axis, data])

    const totalSteps = () => steps.length

    const completedSteps = () => Object.keys(completed).length

    const isLastStep = () => activeStep === totalSteps() - 1

    const allStepsCompleted = () => completedSteps() === totalSteps()

    const handleNext = () => {
        const newActiveStep =
            isLastStep() && !allStepsCompleted() ? steps.findIndex((step, i) => !(i in completed)) : activeStep + 1
        setActiveStep(newActiveStep)
    }

    const handleBack = () => setActiveStep((prevActiveStep) => prevActiveStep - 1)

    const handleComplete = () => {
        setCompleted({
            ...completed,
            [activeStep]: true,
        })
        handleNext()
    }

    const handleReset = () => {
        setActiveStep(0)
        setCompleted({})
        setSelected(null)
        setLoaddata(false)
        setSelected_axis(["", ""])
        setDataChartLoading(true)
    }

    const handleDownload = () => {
        if (result.data) {
            const jsonString = JSON.stringify(result.data, null, 2)
            const blob = new Blob([jsonString], { type: "application/json" })
            const url = URL.createObjectURL(blob)
            const link = document.createElement("a")
            link.href = url
            link.download = "forecast.json"
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            URL.revokeObjectURL(url)
        }
    }

    const steps_requrements = [
        [selected_data != null, load_data == true || selected_data == "Example" || selected_data == "ExampleCSV"],
        [selected_axis.every((value) => value.length !== 0)],
        [selected_data != null, selected_axis.every((value) => value.length !== 0)],
    ]

    const steps_description = [
        () => (
            <Stack direction={"column"}>
                <Stack direction={"row"}>
                    {selected_data != null && <CheckCircleIcon color="success" fontSize="small" />}
                    <Typography variant="overline" sx={{ marginLeft: `0.3rem`, lineHeight: `1.4rem` }}>
                        {t("widgets.newForecast.select_data_description")}
                    </Typography>
                </Stack>
                <Stack direction={"row"}>
                    {load_data || selected_data == "Example" ? (
                        <CheckCircleIcon color="success" fontSize="small" />
                    ) : (
                        <ErrorIcon color="error" fontSize="small" />
                    )}
                    <Typography variant="overline" sx={{ marginLeft: `0.3rem`, lineHeight: `1.4rem` }}>
                        {t("widgets.newForecast.load_data_description")}
                    </Typography>
                </Stack>
            </Stack>
        ),
        () => (
            <Stack direction={"column"}>
                <Stack direction={"row"}>
                    {selected_axis[0].length != 0 && <CheckCircleIcon color="success" fontSize="small" />}
                    <Typography>{t("widgets.newForecast.select_x_axis_description")}</Typography>
                </Stack>
                <Stack direction={"row"}>
                    {selected_axis[1].length != 0 && <CheckCircleIcon color="success" fontSize="small" />}
                    <Typography>{t("widgets.newForecast.select_y_axis_description")}</Typography>
                </Stack>
            </Stack>
        ),
        () => (
            <>
                <Typography>{t("widgets.newForecast.select_forecast_date_description")}</Typography>
                <Typography>{t("widgets.newForecast.send_button_description")}</Typography>
            </>
        ),
    ]

    const MsetData = (args: unknown) => {
        const timeColumn = selected_axis[0]
        if (Array.isArray(args)) {
            setData(normalizeDataRows(args, timeColumn))
        } else if (args && typeof args === "object") {
            const firstKey = Object.keys(args)[0]
            const value = (args as Record<string, unknown>)[firstKey]
            if (Array.isArray(value)) {
                setData(normalizeDataRows(value, timeColumn))
            } else {
                setData([])
            }
        } else {
            setData([])
        }
    }

    return (
        <Stack
            sx={{
                padding: `1rem`,
                overflow: `auto`,
                minHeight: `50%`,
            }}
        >
            <header
                style={{
                    top: `0`,
                    position: `sticky`,
                    background: bg,
                    padding: `1rem`,
                    borderRadius: `1rem`,
                    zIndex: 100,
                }}
            >
                <Stepper nonLinear alternativeLabel activeStep={activeStep} connector={<ColorlibConnector />}>
                    {steps.map((label, index) => (
                        <Step
                            key={label}
                            completed={completed[index]}
                            sx={{
                                display: `flex`,
                                flexDirection: `column`,
                                justifyContent: `center`,
                                alignItems: `center`,
                            }}
                        >
                            <StepLabel
                                StepIconComponent={ColorlibStepIcon}
                                onClick={() => completed[index] && setActiveStep(index)}
                            >
                                <Typography
                                    variant="subtitle2"
                                    color={
                                        completed[index] ? "success" : index == activeStep ? "warning" : "textDisabled"
                                    }
                                >
                                    {label}
                                </Typography>
                            </StepLabel>
                            {!allStepsCompleted() && index == activeStep && (
                                <Stack
                                    direction={"column"}
                                    sx={{
                                        display: `flex`,
                                        margin: `0`,
                                        padding: `0`,
                                        border: `none`,
                                        justifyContent: `center`,
                                    }}
                                >
                                    {steps_description[index]()}
                                </Stack>
                            )}
                        </Step>
                    ))}
                </Stepper>
                <div>
                    {allStepsCompleted() ? (
                        <React.Fragment>
                            <Typography sx={{ mt: 2, mb: 1 }}>
                                {t("widgets.newForecast.all_steps_completed")}
                            </Typography>
                            <Stack direction={"row"} spacing={1}>
                                <Box sx={{ flex: "1 1 auto" }} />
                                <Button variant="contained" onClick={handleReset}>
                                    {t("widgets.newForecast.reset_button")}
                                </Button>
                                <Button variant="contained" onClick={handleDownload}>
                                    {t("widgets.newForecast.download_button")}
                                </Button>
                            </Stack>
                        </React.Fragment>
                    ) : (
                        <React.Fragment>
                            <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                                <Button
                                    variant="contained"
                                    color="inherit"
                                    disabled={activeStep === 0}
                                    onClick={handleBack}
                                    sx={{ mr: 1 }}
                                >
                                    {t("widgets.newForecast.back_button")}
                                </Button>
                                <Box sx={{ flex: "1 1 auto" }} />
                                {completed[activeStep] && (
                                    <Button onClick={handleNext} sx={{ mr: 1 }} variant="contained">
                                        {t("widgets.newForecast.next_button")}
                                    </Button>
                                )}
                                {activeStep !== steps.length &&
                                    (completed[activeStep] ? (
                                        <Typography variant="caption" sx={{ display: "inline-block" }}>
                                            {t("widgets.newForecast.step_completed_message", {
                                                stepNumber: activeStep + 1,
                                            })}
                                        </Typography>
                                    ) : (
                                        <Button
                                            onClick={
                                                completedSteps() < totalSteps() - 1 ? handleComplete : handleComplete
                                            }
                                            variant="contained"
                                            disabled={steps_requrements[activeStep].some((value) => value == false)}
                                        >
                                            {completedSteps() < totalSteps() - 1
                                                ? t("widgets.newForecast.complete_step_button")
                                                : t("widgets.newForecast.send_button")}
                                        </Button>
                                    ))}
                            </Box>
                        </React.Fragment>
                    )}
                </div>
            </header>
            <section style={{ height: `100%` }}>
                {
                    [
                        <SelectDataSource
                            selected_data={selected_data}
                            setSelected={setSelected}
                            setLoaddata={setLoaddata}
                            setData={MsetData}
                        />,
                        <DataTable selected_axis={selected_axis} setSelected_axis={setSelected_axis} data={data} />,
                        <LoadData
                            dataChartLoading={dataChartLoading}
                            data={data}
                            forecast={result}
                            XY={selected_axis}
                            forecast_horizon_time={forecast_horizon_time}
                            setForecast_horizon_time={setForecast_horizon_time}
                            dateLimits={dateLimits}
                            minForecastHorizon={minForecastHorizon}
                        />,
                    ][activeStep]
                }
            </section>
            <footer>
                <Typography sx={{ mt: 2, mb: 1, py: 1 }}>
                    {t("widgets.newForecast.current_step_message", { stepNumber: activeStep + 1 })}
                </Typography>
            </footer>
        </Stack>
    )
}
