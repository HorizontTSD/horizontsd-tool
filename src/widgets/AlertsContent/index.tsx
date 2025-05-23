import { Box, Stack, Typography, TextField, MenuItem, InputAdornment, Button } from "@mui/material"
import SearchIcon from "@mui/icons-material/Search"
import { useState, useEffect } from "react"
import { useTheme } from "@mui/material/styles"
import { Scrollbars } from "react-custom-scrollbars-2"
import {
    useFuncGetForecastDataBackendV1GetForecastDataPostMutation,
    useFuncGetSensorIdListBackendV1GetSensorIdListGetQuery,
} from "@/shared/api/backend"
import AlertBlock from "./AlertBlock"
import { CreateAlertModal } from "./CreateAlertModal"
import { Alert } from "@/shared/types/Alert"

export const AlertsContent = () => {
    const [dataSource, setDataSource] = useState("search alerts")
    const [search, setSearch] = useState("")
    const [expandedIdx, setExpandedIdx] = useState<number | null>(null)
    const [openCreate, setOpenCreate] = useState(false)
    const [openEdit, setOpenEdit] = useState(false)
    const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null)
    const [alerts, setAlerts] = useState<Alert[]>([])
    const [loading, setLoading] = useState(false)
    const theme = useTheme()

    // --- State for modal form ---
    const [atValue, setAtValue] = useState(0.0)
    const [betweenValue1, setBetweenValue1] = useState(0.0)
    const [betweenValue2, setBetweenValue2] = useState(0.0)
    const [refreshRate, setRefreshRate] = useState("1h")
    const [from, setFrom] = useState("-1d")
    const [to, setTo] = useState("+1d")
    const [email, setEmail] = useState("")
    const [telegram, setTelegram] = useState("")
    const [message, setMessage] = useState("")

    const {
        data: sensorsList,
        error: sensorsListError,
        isLoading: sensorsListLoading,
    } = useFuncGetSensorIdListBackendV1GetSensorIdListGetQuery()
    const [triggerForecast, { data: forecastData, isLoading: forecastLoading, error: forecastError }] =
        useFuncGetForecastDataBackendV1GetForecastDataPostMutation()
    const [selectedSensor, setSelectedSensor] = useState<string | null>(null)

    // Fetch alerts
    const fetchAlerts = async () => {
        try {
            setLoading(true)
            const response = await fetch("/backend/v1/alerts")
            const data = await response.json()
            setAlerts(data)
        } catch (error) {
            console.error("Error fetching alerts:", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchAlerts()
    }, [])

    // Запросить данные при появлении сенсоров
    useEffect(() => {
        if (sensorsList?.[0] && !selectedSensor) {
            setSelectedSensor(sensorsList[0])
            triggerForecast({ forecastData: { sensor_ids: [sensorsList[0]] } }).catch(() => {})
        }
    }, [sensorsList, selectedSensor, triggerForecast])

    const currentData = forecastData?.[0]?.[selectedSensor || ""]

    const handleReset = () => {
        setAtValue(0.0)
        setBetweenValue1(0.0)
        setBetweenValue2(0.0)
        setRefreshRate("1h")
        setFrom("-1d")
        setTo("+1d")
        setEmail("")
        setTelegram("")
        setMessage("")
    }

    // Create alert
    const handleCreateAlert = async (alert: Omit<Alert, "id" | "eventId">) => {
        try {
            const response = await fetch("/backend/v1/alerts", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(alert),
            })
            if (!response.ok) throw new Error("Failed to create alert")
            await fetchAlerts()
            setOpenCreate(false)
        } catch (error) {
            console.error("Error creating alert:", error)
        }
    }

    // Update alert
    const handleUpdateAlert = async (alert: Alert) => {
        try {
            const response = await fetch(`/backend/v1/alerts/${alert.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(alert),
            })
            if (!response.ok) throw new Error("Failed to update alert")
            await fetchAlerts()
            setOpenEdit(false)
            setSelectedAlert(null)
        } catch (error) {
            console.error("Error updating alert:", error)
        }
    }

    // Delete alert
    const handleDeleteAlert = async (id: string) => {
        try {
            const response = await fetch(`/backend/v1/alerts/${id}`, {
                method: "DELETE",
            })
            if (!response.ok) throw new Error("Failed to delete alert")
            await fetchAlerts()
            setOpenEdit(false)
            setSelectedAlert(null)
        } catch (error) {
            console.error("Error deleting alert:", error)
        }
    }

    // Фильтрация по поиску
    const filteredAlerts = alerts.filter(
        (alert) =>
            alert.name.toLowerCase().includes(search.toLowerCase()) ||
            alert.summary.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <Stack sx={{ height: "100vh", minHeight: 0 }}>
            {/* Header */}
            <Stack sx={{ px: 2, py: 2, flex: "0 0 auto" }}>
                <Typography variant="h4" fontWeight={700} sx={{ color: "#002C50" }}>
                    Alert rules
                </Typography>
            </Stack>
            {/* Filters bar */}
            <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ background: "#21384B", px: 2, py: 2, flex: "0 0 auto" }}
            >
                <Stack direction="row" spacing={3} alignItems="center">
                    <Box>
                        <Typography fontSize={14} mb={0.5} color="white">
                            Data source
                        </Typography>
                        <TextField
                            select
                            value={dataSource}
                            onChange={(e) => setDataSource(e.target.value)}
                            size="small"
                            sx={{
                                minWidth: 276,
                                maxWidth: 276,
                                height: 30,
                                background: theme.palette.background.paper,
                                borderRadius: 0,
                                "& .MuiInputBase-input": {
                                    fontSize: 15,
                                    color: theme.palette.text.primary,
                                    height: 30,
                                    padding: "0 14px",
                                    boxSizing: "border-box",
                                },
                                "& .MuiOutlinedInput-root": {
                                    height: 30,
                                    borderRadius: 0,
                                },
                                "& .MuiPopover-paper": {
                                    borderRadius: 0,
                                },
                            }}
                            slotProps={{
                                select: {
                                    MenuProps: {
                                        PaperProps: {
                                            sx: {
                                                borderRadius: 0,
                                            },
                                        },
                                    },
                                },
                            }}
                        >
                            <MenuItem value="search alerts">search alerts</MenuItem>
                            <MenuItem value="system alerts">system alerts</MenuItem>
                            <MenuItem value="user alerts">user alerts</MenuItem>
                        </TextField>
                    </Box>
                    <Box>
                        <Typography fontSize={14} mb={0.5} color="white">
                            Search
                        </Typography>
                        <TextField
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            size="small"
                            placeholder="search alerts"
                            sx={{
                                minWidth: 276,
                                maxWidth: 276,
                                height: 30,
                                background: theme.palette.background.paper,
                                borderRadius: 16,
                                "& .MuiInputBase-input": {
                                    fontSize: 15,
                                    color: theme.palette.text.primary,
                                    height: 30,
                                    padding: "0 14px",
                                    boxSizing: "border-box",
                                    "&::placeholder": {
                                        color: "black",
                                        opacity: 1,
                                    },
                                },
                                "& .MuiOutlinedInput-root": {
                                    height: 30,
                                },
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
                    </Box>
                </Stack>
                <Button
                    variant="contained"
                    color="inherit"
                    sx={{
                        borderRadius: 2,
                        px: 5,
                        backgroundColor: "#73BF69",
                        fontWeight: 500,
                        boxShadow: "none",
                        textTransform: "none",
                    }}
                    onClick={() => setOpenCreate(true)}
                >
                    Create
                </Button>
            </Stack>
            {/* Alert blocks */}
            <Scrollbars
                style={{
                    width: "100%",
                    height: "100%",
                }}
                renderThumbVertical={({ style, ...props }) => (
                    <div
                        {...props}
                        style={{
                            ...style,
                            paddingTop: "30px",
                            width: "14px",
                            backgroundColor: "#F5F5F5",
                            borderRadius: "24px",
                            border: "1px solid #01579B",
                        }}
                    />
                )}
                renderTrackVertical={({ style, ...props }) => (
                    <div
                        {...props}
                        style={{
                            ...style,
                            width: "14px",
                            backgroundColor: "#002C50",
                            borderRadius: "24px",
                            right: "4px",
                            bottom: "2px",
                            top: "2px",
                        }}
                    />
                )}
            >
                <Box sx={{ pr: 1, mr: "16px", marginTop: "16px" }}>
                    {filteredAlerts.map((alert, idx) => (
                        <AlertBlock
                            key={alert.id}
                            {...alert}
                            expanded={expandedIdx === idx}
                            onToggle={() => setExpandedIdx(expandedIdx === idx ? null : idx)}
                            onEdit={() => {
                                setSelectedAlert(alert)
                                setOpenEdit(true)
                            }}
                            onDelete={() => handleDeleteAlert(alert.id)}
                        />
                    ))}
                </Box>
            </Scrollbars>
            <CreateAlertModal open={openCreate} onClose={() => setOpenCreate(false)} onSubmit={handleCreateAlert} />
            <CreateAlertModal
                open={openEdit}
                onClose={() => {
                    setOpenEdit(false)
                    setSelectedAlert(null)
                }}
                alert={selectedAlert}
                onSubmit={(alert) => handleUpdateAlert(alert as Alert)}
            />
        </Stack>
    )
}
