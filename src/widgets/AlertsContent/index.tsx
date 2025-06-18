import * as React from "react"
import OutlinedInput from "@mui/material/OutlinedInput"
import InputLabel from "@mui/material/InputLabel"
import FormControl from "@mui/material/FormControl"
import ListItemText from "@mui/material/ListItemText"
import Select, { SelectChangeEvent } from "@mui/material/Select"
import Checkbox from "@mui/material/Checkbox"

import { Box, Stack, Typography, TextField, MenuItem, InputAdornment, Button } from "@mui/material"
import SearchIcon from "@mui/icons-material/Search"
import { useState, useEffect, useRef } from "react"
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

function MultipleSelectCheckmarks({ list, selected, onSelect, disabled, width = 200 }) {
    const handleChange = (event: SelectChangeEvent) => {
        const {
            target: { value },
        } = event
        onSelect(value)
    }

    const { mode, setMode } = useColorScheme()
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
                    renderValue={(selected) => selected.join(", ")}
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

const SensorAndModelSelection = ({
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
        <Stack direction={"row"} spacing={1}>
            <Stack>
                <Typography>{t("widgets.alertsContent.sensor_selection")}</Typography>
                <MultipleSelectCheckmarks
                    width={220}
                    list={sensors || []}
                    selected={selectedSensors || []}
                    onSelect={handleSensorChange}
                    disabled={sensorsLoading}
                />
            </Stack>
            <Stack>
                <Typography>{t("widgets.alertsContent.model_selection")}</Typography>
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
            <Typography variant="h4">{t("widgets.alertsContent.alert_rules")}</Typography>
        </Stack>
    )
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
}) => {
    const theme = useTheme()
    const { mode, setMode } = useColorScheme()
    const isDark = mode === "dark"
    const bgPalette = ["var(--mui-palette-secondary-main)", "var(--mui-palette-primary-main)"]
    const bg = bgPalette[~~isDark]

    const { t } = useTranslation()

    return (
        <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{
                background: bg,
                margin: `0.5rem 0`,
                padding: `1rem`,
                borderRadius: `var(--mui-shape-borderRadius)`,
                flex: "0 0 auto",
            }}
        >
            <Stack direction="row" spacing={1} alignItems="center">
                <Stack direction="row" spacing={1} alignItems="center">
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
                    <Stack direction={"row"} spacing={1}>
                        <Stack>
                            <Typography>{t("widgets.alertsContent.search")}</Typography>
                            <TextField
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder={t("widgets.alertsContent.search_alerts_placeholder")}
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
            <Stack>
                <Button
                    variant="contained"
                    color="success"
                    sx={{
                        boxShadow: "none",
                    }}
                    onClick={() => setOpenCreate(true)}
                >
                    {t("widgets.alertsContent.create_button")}
                </Button>
            </Stack>
        </Stack>
    )
}

const AlertBlocks = ({
    filteredAlerts,
    expandedIdx,
    setExpandedIdx,
    setSelectedAlert,
    setOpenEdit,
    handleDeleteAlert,
}) => {
    return (
        <Stack
            style={{
                overflowY: `auto`,
                width: "100%",
                height: "100%",
            }}
        >
            <Box sx={{ margin: `1rem  1rem 0 1rem` }}>
                {filteredAlerts.map(({ alert, file_name }: { [key: string]: any }, idx: number) => (
                    <AlertBlock
                        key={idx}
                        {...alert}
                        state="normal"
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
    const {
        data: sensors,
        isLoading: sensorsLoading,
        error: sensorsError,
    } = useFuncGetSensorIdListBackendV1GetSensorIdListGetQuery()
    const [triggerForecast, { data: forecastData, isLoading: forecastLoading, error: forecastError }] =
        useFuncGetForecastDataBackendV1GetForecastDataPostMutation()
    const {
        data: alertsData,
        isLoading: isLoadingAlerts,
        error: alertsError,
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
            setSelectedSensors(sensors)
        }
    }, [sensors, selectedSensors])

    // Initialize model selection when metrics data arrives
    useEffect(() => {
        if (forecastData && forecastData.length > 0 && !selectedModels) {
            const availableModels = Array.from(
                new Set(forecastData.map((e) => Object.keys(e[Object.keys(e)]["metrix_tables"])).flat())
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
            ? Array.from(new Set(forecastData.map((e) => Object.keys(e[Object.keys(e)]["metrix_tables"])).flat()))
            : []

    const filteredAlerts = alerts
        // by sensor & model
        .filter(({ alert }) => {
            const { sensor_id, model } = alert
            if (selectedSensors.length == 0 && selectedModels.length == 0) {
                return true
            }
            if (selectedSensors.length != 0 && selectedModels.length == 0) {
                return selectedSensors.includes(sensor_id)
            }
            if (selectedSensors.length == 0 && selectedModels.length != 0) {
                return selectedModels.includes(model)
            }

            return selectedModels.includes(model) && selectedSensors.includes(sensor_id)
        })
        // by name
        .filter(({ alert }) => {
            const { name, message } = alert
            if (search.length != 0)
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
    const [loading, setLoading] = useState(false)
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
            console.error(t("widgets.alertsContent.error_creating_alert"), error)
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
            console.error(t("widgets.alertsContent.error_deleting_alert"), error)
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
                availableModels={availableModels}
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
                    setSelectedAlert={setSelectedAlert}
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
