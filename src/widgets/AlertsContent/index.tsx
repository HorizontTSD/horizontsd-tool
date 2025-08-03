import React from "react"
import OutlinedInput from "@mui/material/OutlinedInput"
import FormControl from "@mui/material/FormControl"
import ListItemText from "@mui/material/ListItemText"
import Select, { SelectChangeEvent } from "@mui/material/Select"
import Checkbox from "@mui/material/Checkbox"
import { Box, Stack, Typography, TextField, MenuItem, InputAdornment, Button } from "@mui/material"
import SearchIcon from "@mui/icons-material/Search"
import { useState, useEffect } from "react"
import { useColorScheme, useTheme } from "@mui/material/styles"
import {
    useFuncGetForecastDataBackendV1GetForecastDataPostMutation,
    useFuncGetSensorIdListBackendV1GetSensorIdListGetQuery,
} from "@/shared/api/model_fast_api"
import AlertBlock from "./AlertBlock"
import { CreateAlertModal } from "./CreateAlertModal"
import { Alert } from "@/shared/types/Alert"
import {
    AlertConfigRequest,
    useCreateAlertEndpointAlertManagerV1CreatePostMutation,
    useDeleteAlertEndpointAlertManagerV1DeleteDeleteMutation,
    useListAlertConfigsAlertManagerV1ListGetQuery,
} from "@/shared/api/alert"
import { useTranslation } from "react-i18next"
import { AlertBlockSkeleton } from "@/shared/ui/skeletons/AlertBlockSkeleton"

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
}

interface MultipleSelectCheckmarksProps {
    list: string[]
    selected: string[]
    onSelect: (selected: string[]) => void
    disabled?: boolean
    width?: number
}
const MultipleSelectCheckmarks: React.FC<MultipleSelectCheckmarksProps> = ({
    list,
    selected,
    onSelect,
    width = 200,
}) => {
    const handleChange = (event: SelectChangeEvent<string[]>) => {
        onSelect(event.target.value as string[])
    }

    const { mode } = useColorScheme()
    const isDark = mode === "dark"
    const bgPalette = ["var(--mui-palette-secondary-light)", "var(--mui-palette-primary-dark)"]
    const bg = bgPalette[~~isDark]

    return (
        <Stack direction={"row"}>
            <FormControl sx={{ minWidth: width }}>
                <Select
                    id="multiple-checkbox"
                    multiple
                    value={selected}
                    onChange={handleChange}
                    input={<OutlinedInput />}
                    renderValue={(selected) => (selected as string[]).join(", ")}
                    MenuProps={MenuProps}
                    sx={{
                        height: `2rem`,
                        background: bg,
                        color: `var(--mui-palette-text-primary)`,
                    }}
                >
                    {list.map((name) => (
                        <MenuItem key={name} value={name}>
                            <Checkbox checked={selected.includes(name)} />
                            <ListItemText primary={name} />
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Stack>
    )
}

interface SensorAndModelSelectionProps {
    sensors: string[]
    selectedSensors: string[]
    handleSensorChange: (sensors: string[]) => void
    sensorsLoading: boolean
    availableModels: string[]
    selectedModels: string[]
    handleModelChange: (models: string[]) => void
}
const SensorAndModelSelection: React.FC<SensorAndModelSelectionProps> = ({
    sensors,
    selectedSensors,
    handleSensorChange,
    sensorsLoading,
    availableModels,
    selectedModels,
    handleModelChange,
}) => {
    const { t } = useTranslation()

    return (
        <Stack direction={{ xs: "column", sm: "row" }} spacing={1} sx={{ width: "100%" }}>
            <Stack sx={{ width: { xs: "100%", sm: 220 } }}>
                <Typography>{t("widgets.alertsContent.sensorSelection")}</Typography>
                <MultipleSelectCheckmarks
                    width={220}
                    list={sensors || []}
                    selected={selectedSensors || []}
                    onSelect={handleSensorChange}
                    disabled={sensorsLoading}
                />
            </Stack>
            <Stack sx={{ width: { xs: "100%", sm: 140 } }}>
                <Typography>{t("widgets.alertsContent.modelSelection")}</Typography>
                <MultipleSelectCheckmarks
                    width={140}
                    list={availableModels || []}
                    selected={selectedModels || []}
                    onSelect={handleModelChange}
                    disabled={!selectedSensors || availableModels.length === 0}
                />
            </Stack>
        </Stack>
    )
}

const Header = () => {
    const { t } = useTranslation()

    return (
        <Stack>
            <Typography variant="h4">{t("widgets.alertsContent.alertRules")}</Typography>
        </Stack>
    )
}

interface FiltersBarProps {
    availableModels: string[]
    handleModelChange: (models: string[]) => void
    handleSensorChange: (sensors: string[]) => void
    selectedModels: string[]
    selectedSensors: string[]
    sensors: string[]
    sensorsLoading: boolean
    search: string
    setSearch: (s: string) => void
    setOpenCreate: (open: boolean) => void
}
const FiltersBar = ({
    availableModels,
    handleModelChange,
    handleSensorChange,
    selectedModels,
    selectedSensors,
    sensors,
    sensorsLoading,
    search,
    setSearch,
    setOpenCreate,
}: FiltersBarProps) => {
    const theme = useTheme()
    const { mode } = useColorScheme()
    const isDark = mode === "dark"
    const bgPalette = ["var(--mui-palette-secondary-main)", "var(--mui-palette-primary-main)"]
    const bg = bgPalette[~~isDark]

    const { t } = useTranslation()

    return (
        <Stack
            direction={{ xs: "column", sm: "row" }}
            alignItems={{ xs: "stretch", sm: "center" }}
            justifyContent="space-between"
            sx={{
                background: bg,
                margin: `0.5rem 0`,
                padding: `1rem`,
                borderRadius: `var(--mui-shape-borderRadius)`,
                flex: "0 0 auto",
                flexWrap: { xs: "nowrap", sm: "nowrap" },
                "@media (max-width: 600px)": {
                    flexDirection: "column",
                    alignItems: "stretch",
                },
            }}
        >
            <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={1}
                alignItems={{ xs: "stretch", sm: "center" }}
                sx={{ width: "100%" }}
            >
                <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={1}
                    alignItems={{ xs: "stretch", sm: "center" }}
                    sx={{ width: "100%" }}
                >
                    {/* Sensor and Model Selection */}
                    <SensorAndModelSelection
                        availableModels={availableModels}
                        handleModelChange={handleModelChange}
                        handleSensorChange={handleSensorChange}
                        selectedModels={selectedModels}
                        selectedSensors={selectedSensors}
                        sensors={sensors}
                        sensorsLoading={sensorsLoading}
                    />
                    <Stack
                        direction={{ xs: "column", sm: "row" }}
                        spacing={1}
                        sx={{ mt: { xs: 2, sm: 0 }, width: "100%" }}
                    >
                        <Stack sx={{ width: { xs: "100%", sm: "auto" } }}>
                            <Typography>{t("widgets.alertsContent.search")}</Typography>
                            <TextField
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder={t("widgets.alertsContent.searchAlertsPlaceholder")}
                                sx={{
                                    minWidth: `160px`,
                                    background: theme.palette.background.paper,
                                    borderRadius: `var(--mui-shape-borderRadius)`,
                                    "& .MuiInputBase-input": {
                                        color: theme.palette.text.primary,
                                        boxSizing: "border-box",
                                        "&::placeholder": {
                                            color: "black",
                                            opacity: 1,
                                        },
                                    },
                                    "& .MuiOutlinedInput-root": {
                                        height: 30,
                                    },
                                    display: "flex",
                                    justifyContent: "space-between",
                                    width: "100%",
                                }}
                                slotProps={{
                                    input: {
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <SearchIcon sx={{ color: "black" }} />
                                            </InputAdornment>
                                        ),
                                    },
                                }}
                            />
                        </Stack>
                    </Stack>
                </Stack>
            </Stack>
            <Stack
                sx={{
                    width: { xs: "100%", sm: "auto" },
                    alignItems: { xs: "stretch", sm: "flex-end" },
                    mt: { xs: 2, sm: 0 },
                }}
            >
                <Button
                    variant="contained"
                    color="success"
                    onClick={() => setOpenCreate(true)}
                    sx={{ width: { xs: "100%", sm: "auto" }, ml: { xs: 0, sm: 2 } }}
                >
                    {t("widgets.alertsContent.createButton")}
                </Button>
            </Stack>
        </Stack>
    )
}

interface AlertBlocksProps {
    filteredAlerts: { alert: unknown; file_name: string }[]
    expandedIdx: number | null
    setExpandedIdx: (idx: number | null) => void
    setSelectedAlert: (alert: unknown) => void
    setOpenEdit: (open: boolean) => void
    handleDeleteAlert: (fileName: string) => void
}
const AlertBlocks: React.FC<AlertBlocksProps> = ({
    filteredAlerts,
    expandedIdx,
    setExpandedIdx,
    setSelectedAlert,
    setOpenEdit,
    handleDeleteAlert,
}: AlertBlocksProps) => {
    return (
        <Stack
            style={{
                overflowY: `auto`,
                width: "100%",
                height: "100%",
            }}
        >
            <Box sx={{ margin: `1rem  1rem 0 1rem` }}>
                {(filteredAlerts as { alert: Alert; file_name: string }[]).map(({ alert, file_name }, idx) => (
                    <AlertBlock
                        key={idx}
                        name={alert.name}
                        threshold={alert.threshold_value}
                        scheme={alert.alert_scheme}
                        trigger_frequency={alert.trigger_frequency}
                        message={alert.message}
                        notifications={{ email: alert.email_addresses, telegram: alert.telegram_nicknames }}
                        include_graph={alert.include_graph}
                        time_interval={{ start_date: alert.date_start, end_date: alert.date_end }}
                        start_warning_interval={alert.start_warning_interval}
                        sensor_id={alert.sensor_id}
                        model={alert.model}
                        expanded={expandedIdx === idx}
                        onToggle={() => setExpandedIdx(expandedIdx === idx ? null : idx)}
                        onEdit={() => {
                            setSelectedAlert(alert)
                            setOpenEdit(true)
                        }}
                        onDelete={() => handleDeleteAlert(file_name)}
                    />
                ))}
            </Box>
        </Stack>
    )
}

export const AlertsContent = () => {
    const { t } = useTranslation()
    // Data fetching hooks
    const { data: sensors, isLoading: sensorsLoading } = useFuncGetSensorIdListBackendV1GetSensorIdListGetQuery()
    const [triggerForecast, { data: forecastData }] = useFuncGetForecastDataBackendV1GetForecastDataPostMutation()
    const {
        data: alertsData,
        isLoading: isLoadingAlerts,
        refetch: refetchAlerts,
    } = useListAlertConfigsAlertManagerV1ListGetQuery()
    const alerts = alertsData?.yaml_files || []

    const [selectedSensors, setSelectedSensors] = useState<string[]>([])
    const [selectedModels, setSelectedModels] = useState<string[]>([])
    const [search, setSearch] = useState("")

    // get a load of this guy
    useEffect(() => {
        if (sensors && sensors.length > 0) {
            triggerForecast({
                forecastData: {
                    sensor_ids: [sensors[0]],
                },
            })
                .unwrap()
                .catch(console.error)
        }
    }, [sensors, selectedSensors, triggerForecast])

    // Initialize sensor selection
    useEffect(() => {
        if (sensors?.[0] && !selectedSensors) {
            setSelectedSensors(Array.isArray(sensors) ? sensors.filter((s): s is string => typeof s === "string") : [])
        }
    }, [sensors, selectedSensors])

    // Initialize model selection when metrics data arrives
    useEffect(() => {
        if (forecastData && forecastData.length > 0 && !selectedModels) {
            const availableModels = Array.from(
                new Set(
                    forecastData
                        .map((e: unknown) => {
                            const obj = e as Record<string, unknown>
                            const firstKey = Object.keys(obj)[0]
                            const metrixTables = (obj[firstKey] as { metrix_tables?: Record<string, unknown> })
                                ?.metrix_tables
                            return Object.keys(metrixTables || {})
                        })
                        .flat()
                )
            ) as string[]
            if (availableModels.length > 0) {
                setSelectedModels(availableModels)
            }
        }
    }, [forecastData, selectedModels])

    //
    const handleSensorChange = (sensors: string[]) => {
        setSelectedSensors(sensors)
    }

    //
    const handleModelChange = (models: string[]) => {
        setSelectedModels(models)
    }

    //
    const availableModels =
        forecastData && forecastData.length > 0
            ? Array.from(
                  new Set(
                      forecastData
                          .map((e: unknown) => {
                              const obj = e as Record<string, unknown>
                              const firstKey = Object.keys(obj)[0]
                              const metrixTables = (obj[firstKey] as { metrix_tables?: Record<string, unknown> })
                                  ?.metrix_tables
                              return Object.keys(metrixTables || {})
                          })
                          .flat()
                  )
              )
            : []

    const filteredAlerts = alerts
        // by sensor & model
        .filter(({ alert }: { alert: { sensor_id: string; model: string } }) => {
            const { sensor_id, model } = alert
            if (selectedSensors.length === 0 && selectedModels.length === 0) {
                return true
            }
            if (selectedSensors.length !== 0 && selectedModels.length === 0) {
                return selectedSensors.includes(sensor_id)
            }
            if (selectedSensors.length === 0 && selectedModels.length !== 0) {
                return selectedModels.includes(model)
            }
            return selectedModels.includes(model) && selectedSensors.includes(sensor_id)
        })
        // by name
        .filter(({ alert }: { alert: { name: string; message: string } }) => {
            const { name, message } = alert
            if (search.length !== 0)
                return (
                    name.toLowerCase().includes(search.toLowerCase()) ||
                    message.toLowerCase().includes(search.toLowerCase())
                )
            return true
        })

    /**
     *
     */

    const [openCreate, setOpenCreate] = useState(false)
    const [openEdit, setOpenEdit] = useState(false)
    const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null)
    const [expandedIdx, setExpandedIdx] = useState<number | null>(null)

    const [createAlertMutation] = useCreateAlertEndpointAlertManagerV1CreatePostMutation()
    const [deleteAlertMutation] = useDeleteAlertEndpointAlertManagerV1DeleteDeleteMutation()

    // Create alert
    const handleCreateAlert = async (alert: AlertConfigRequest) => {
        try {
            await createAlertMutation({
                alertConfigRequest: alert,
            }).unwrap()

            await refetchAlerts()
            setOpenCreate(false)
        } catch (error) {
            console.error(t("widgets.alertsContent.errorCreatingAlert"), error)
            // TODO toast
        }
    }

    //TODO Update alert

    // Delete alert
    const handleDeleteAlert = async (id: string) => {
        try {
            await deleteAlertMutation({
                deleteAlertRequest: { filename: id },
            }).unwrap()

            await refetchAlerts()
            setOpenEdit(false)
            setSelectedAlert(null)
        } catch (error) {
            console.error(t("widgets.alertsContent.errorDeletingAlert"), error)
            // TODO toast
        }
    }

    /**
     *
     */

    return (
        <Stack
            sx={{
                padding: `1rem`,
                overflow: `auto`,
            }}
        >
            Header
            <Header />
            {/* Filters bar */}
            <FiltersBar
                availableModels={availableModels as string[]}
                handleModelChange={handleModelChange}
                handleSensorChange={handleSensorChange}
                selectedModels={selectedModels}
                selectedSensors={selectedSensors}
                sensors={sensors}
                sensorsLoading={sensorsLoading}
                search={search}
                setSearch={setSearch}
                setOpenCreate={setOpenCreate}
            />
            {/* Alert blocks */}
            {isLoadingAlerts ? (
                <Box sx={{ margin: `1rem  1rem 0 1rem` }}>
                    <AlertBlockSkeleton />
                </Box>
            ) : (
                <AlertBlocks
                    filteredAlerts={filteredAlerts}
                    expandedIdx={expandedIdx}
                    setExpandedIdx={setExpandedIdx}
                    setSelectedAlert={setSelectedAlert as (alert: unknown) => void}
                    setOpenEdit={setOpenEdit}
                    handleDeleteAlert={handleDeleteAlert}
                />
            )}
            <CreateAlertModal open={openCreate} onClose={() => setOpenCreate(false)} onSubmit={handleCreateAlert} />
            <CreateAlertModal
                open={openEdit}
                onClose={() => {
                    setOpenEdit(false)
                    setSelectedAlert(null)
                }}
                alert={selectedAlert}
                // onSubmit={(alert) => handleUpdateAlert(alert as Alert)}
            />
        </Stack>
    )
}
