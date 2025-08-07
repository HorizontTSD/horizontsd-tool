import React, { useState, useEffect } from "react"
import Dialog from "@mui/material/Dialog"
import DialogContent from "@mui/material/DialogContent"
import {
    Box,
    Stack,
    Typography,
    OutlinedInput,
    Select,
    MenuItem,
    Button,
    Checkbox,
    useColorScheme,
} from "@mui/material"
import { ForecastGraphPanel } from "./ForecastGraphPanel"
import { CreateAlertFormValues } from "./types"
import { Alert } from "@/shared/types/Alert"
import { useFuncGetSensorIdListBackendV1GetSensorIdListGetQuery } from "@/shared/api/model_fast_api"
import { useTranslation } from "react-i18next"
import { AlertConfigRequest } from "@/shared/api/alert"

interface CreateAlertModalProps {
    open: boolean
    onClose: () => void
    alert?: Alert | null
    onSubmit?: (alert: Alert | Omit<Alert, "id" | "eventId">) => Promise<void>
    forecastData?: any
}

interface AlerModalFormProps {
    isEdit: boolean
    formValues: CreateAlertFormValues
    handleChange: <K extends keyof CreateAlertFormValues>(field: K, value: CreateAlertFormValues[K]) => void
    handleSubmit: (e?: React.FormEvent) => void
    onClose: () => void
    handleReset: () => void
    availableModels: string[]
    sensors: string[]
}
const AlerModalForm = ({
    isEdit,
    formValues,
    handleChange,
    handleSubmit,
    onClose,
    handleReset,
    availableModels,
    sensors,
}: AlerModalFormProps) => {
    const { t } = useTranslation()

    return (
        <Box sx={{ flex: 1, pr: 2 }}>
            <Typography variant="h4" sx={{ color: "white", mb: 2 }}>
                {isEdit
                    ? t("widgets.alertsContent.createAlertModalTitleEdit")
                    : t("widgets.alertsContent.createAlertModalTitleCreate")}
            </Typography>
            <Stack spacing={1}>
                {/**/}
                <Box>
                    <Typography sx={{ color: "white", mb: 1, fontSize: 15 }}>
                        {t("widgets.alertsContent.createAlertModalAlertNameLabel")}
                    </Typography>
                    <OutlinedInput
                        fullWidth
                        value={formValues.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                        sx={{
                            background: "white",
                            color: "black",
                            borderRadius: `var(--mui-shape-borderRadius)`,
                            height: 30,
                        }}
                        size="small"
                    />
                </Box>

                {/**/}
                <Stack direction="row" spacing={2} alignItems="flex-end">
                    <Box sx={{ flex: 1 }}>
                        <Typography sx={{ color: "white", mb: 1, fontSize: 15 }}>
                            {t("widgets.alertsContent.createAlertModalSensorLabel")}
                        </Typography>
                        <Select
                            value={formValues.sensorId}
                            onChange={(e) => handleChange("sensorId", e.target.value)}
                            size="small"
                            sx={{
                                background: "white",
                                color: "black",
                                borderRadius: `var(--mui-shape-borderRadius)`,
                                height: 30,
                                width: "100%",
                                fontSize: 16,
                                "& fieldset": { border: "none" },
                                ".MuiSelect-select": { p: "4px 12px" },
                            }}
                        >
                            {sensors.map((sensor) => (
                                <MenuItem key={sensor} value={sensor}>
                                    {sensor}
                                </MenuItem>
                            ))}
                        </Select>
                    </Box>
                    <Box sx={{ flex: 1 }}>
                        <Typography sx={{ color: "white", mb: 1, fontSize: 15 }}>
                            {t("widgets.alertsContent.createAlertModalModelLabel")}
                        </Typography>
                        <Select
                            value={formValues.model}
                            onChange={(e) => handleChange("model", e.target.value)}
                            size="small"
                            sx={{
                                background: "white",
                                color: "black",
                                borderRadius: `var(--mui-shape-borderRadius)`,
                                height: 30,
                                width: "100%",
                                fontSize: 16,
                                "& fieldset": { border: "none" },
                                ".MuiSelect-select": { p: "4px 12px" },
                            }}
                        >
                            {availableModels.map((model) => (
                                <MenuItem key={model} value={model}>
                                    {model}
                                </MenuItem>
                            ))}
                        </Select>
                    </Box>
                </Stack>

                {/**/}
                <Stack direction="row" spacing={4} alignItems="flex-end">
                    <Box>
                        <Typography sx={{ color: "white", mb: 1, fontSize: 15 }}>
                            {t("widgets.alertsContent.createAlertModalThresholdValueLabel")}
                        </Typography>
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                background: "white",
                                borderRadius: `var(--mui-shape-borderRadius)`,
                                pl: 2,
                                pr: 1,
                                height: 30,
                            }}
                        >
                            <OutlinedInput
                                fullWidth
                                value={formValues.thresholdValue}
                                onChange={(e) => handleChange("thresholdValue", Number(e.target.value))}
                                sx={{
                                    background: "transparent",
                                    color: "black",
                                    border: "none",
                                    boxShadow: "none",
                                    fontSize: 16,
                                    p: 0,
                                    minWidth: 120,
                                    "& fieldset": { border: "none" },
                                }}
                                inputProps={{ style: { padding: 0, textAlign: "left" } }}
                            />
                            <Box sx={{ display: "flex", alignItems: "center", ml: 1 }}>
                                <Button
                                    sx={{
                                        minWidth: 28,
                                        width: 28,
                                        height: 28,
                                        borderRadius: "50%",
                                        background: "#002C50",
                                        color: "white",
                                        p: 0,
                                        mx: 0.25,
                                        "&:hover": { background: "#002C50" },
                                    }}
                                    onClick={() =>
                                        handleChange(
                                            "thresholdValue",
                                            Math.max(0, Number(formValues.thresholdValue) - 1)
                                        )
                                    }
                                >
                                    -
                                </Button>
                                <Button
                                    sx={{
                                        minWidth: 28,
                                        width: 28,
                                        height: 28,
                                        borderRadius: "50%",
                                        background: "#002C50",
                                        color: "white",
                                        p: 0,
                                        mx: 0.25,
                                        "&:hover": { background: "#002C50" },
                                    }}
                                    onClick={() =>
                                        handleChange("thresholdValue", Number(formValues.thresholdValue) + 1)
                                    }
                                >
                                    +
                                </Button>
                            </Box>
                        </Box>
                    </Box>
                    <Box>
                        <Typography sx={{ color: "white", mb: 1, fontSize: 15 }}>
                            {t("widgets.alertsContent.createAlertModalAlertSchemeLabel")}
                        </Typography>
                        <Select
                            value={formValues.alertScheme}
                            onChange={(e) => handleChange("alertScheme", e.target.value)}
                            size="small"
                            sx={{
                                background: "white",
                                color: "black",
                                borderRadius: `var(--mui-shape-borderRadius)`,
                                height: 30,
                                width: 180,
                                fontSize: 16,
                                "& fieldset": { border: "none" },
                                ".MuiSelect-select": { p: "4px 12px" },
                            }}
                        >
                            <MenuItem value="Выше значения">
                                {t("widgets.alertsContent.createAlertModalAlertSchemeAboveValue")}
                            </MenuItem>
                            <MenuItem value="Ниже значения">
                                {t("widgets.alertsContent.createAlertModalAlertSchemeBelowValue")}
                            </MenuItem>
                        </Select>
                    </Box>
                </Stack>

                {/**/}
                {/**/}
                <Box>
                    <Typography sx={{ color: "white", mb: 1, fontSize: 15 }}>
                        {t("widgets.alertsContent.createAlertModalTriggerFrequencyLabel")}
                    </Typography>
                    <Select
                        value={formValues.triggerFrequency}
                        onChange={(e) => handleChange("triggerFrequency", e.target.value)}
                        size="small"
                        sx={{
                            background: "white",
                            color: "black",
                            borderRadius: `var(--mui-shape-borderRadius)`,
                            height: 30,
                            width: 120,
                            fontSize: 16,
                            mb: 1,
                            "& fieldset": { border: "none" },
                            ".MuiSelect-select": { p: "4px 12px" },
                        }}
                    >
                        <MenuItem value={"Каждый день"}>Каждый день</MenuItem>
                        <MenuItem value={"Каждый час"}>Каждый час</MenuItem>
                    </Select>
                </Box>

                {/**/}
                <Stack direction="row" spacing={2}>
                    <Box>
                        <Typography sx={{ color: "white", mb: 1, fontSize: 15 }}>
                            {t("widgets.alertsContent.createAlertModalStartDateLabel")}
                        </Typography>
                        <OutlinedInput
                            type="date"
                            value={formValues.dateStart}
                            onChange={(e) => handleChange("dateStart", e.target.value)}
                            sx={{
                                background: "white",
                                color: "black",
                                borderRadius: `var(--mui-shape-borderRadius)`,
                                height: 30,
                                "& fieldset": { border: "none" },
                            }}
                            inputProps={{ style: { padding: "6px 12px" } }}
                        />
                    </Box>
                    <Box>
                        <Typography sx={{ color: "white", mb: 1, fontSize: 15 }}>
                            {t("widgets.alertsContent.createAlertModalStartTimeLabel")}
                        </Typography>
                        <OutlinedInput
                            type="time"
                            value={formValues.timeStart}
                            onChange={(e) => handleChange("timeStart", e.target.value)}
                            sx={{
                                background: "white",
                                color: "black",
                                borderRadius: `var(--mui-shape-borderRadius)`,
                                height: 30,
                                "& fieldset": { border: "none" },
                            }}
                            inputProps={{ style: { padding: "6px 12px" } }}
                        />
                    </Box>
                </Stack>

                <Stack direction="row" spacing={2}>
                    <Box>
                        <Typography sx={{ color: "white", mb: 1, fontSize: 15 }}>
                            {t("widgets.alertsContent.createAlertModalEndDateLabel")}
                        </Typography>
                        <OutlinedInput
                            type="date"
                            value={formValues.dateEnd}
                            onChange={(e) => handleChange("dateEnd", e.target.value)}
                            sx={{
                                background: "white",
                                color: "black",
                                borderRadius: `var(--mui-shape-borderRadius)`,
                                height: 30,
                                "& fieldset": { border: "none" },
                            }}
                            inputProps={{ style: { padding: "6px 12px" } }}
                        />
                    </Box>
                    <Box>
                        <Typography sx={{ color: "white", mb: 1, fontSize: 15 }}>
                            {t("widgets.alertsContent.createAlertModalEndTimeLabel")}
                        </Typography>
                        <OutlinedInput
                            type="time"
                            value={formValues.timeEnd}
                            onChange={(e) => handleChange("timeEnd", e.target.value)}
                            sx={{
                                background: "white",
                                color: "black",
                                borderRadius: `var(--mui-shape-borderRadius)`,
                                height: 30,
                                "& fieldset": { border: "none" },
                            }}
                            inputProps={{ style: { padding: "6px 12px" } }}
                        />
                    </Box>
                </Stack>

                {/**/}
                <Stack direction="row" spacing={2} mt={2}>
                    <Box sx={{ flex: 1 }}>
                        <Typography sx={{ color: "white", mb: 1, fontSize: 15 }}>
                            {t("widgets.alertsContent.createAlertModalEmailAddressesLabel")}
                        </Typography>
                        <OutlinedInput
                            fullWidth
                            value={formValues.emailAddresses.join(", ")}
                            onChange={(e) =>
                                handleChange(
                                    "emailAddresses",
                                    e.target.value.split(",").map((email) => email.trim())
                                )
                            }
                            sx={{
                                background: "white",
                                color: "black",
                                borderRadius: `var(--mui-shape-borderRadius)`,
                                height: 30,
                            }}
                            size="small"
                            placeholder={t("widgets.alertsContent.createAlertModalEmailAddressesPlaceholder")}
                        />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                        <Typography sx={{ color: "white", mb: 1, fontSize: 15 }}>
                            {t("widgets.alertsContent.createAlertModalTelegramNicknamesLabel")}
                        </Typography>
                        <OutlinedInput
                            fullWidth
                            value={formValues.telegramNicknames.join(", ")}
                            onChange={(e) =>
                                handleChange(
                                    "telegramNicknames",
                                    e.target.value.split(",").map((name) => name.trim())
                                )
                            }
                            sx={{
                                background: "white",
                                color: "black",
                                borderRadius: `var(--mui-shape-borderRadius)`,
                                height: 30,
                            }}
                            size="small"
                            placeholder={t("widgets.alertsContent.createAlertModalTelegramNicknamesPlaceholder")}
                        />
                    </Box>
                </Stack>

                {/**/}
                <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Checkbox
                        checked={formValues.includeGraph}
                        onChange={(e) => handleChange("includeGraph", e.target.checked)}
                        sx={{ color: "white", "&.Mui-checked": { color: "white" } }}
                    />
                    <Typography sx={{ color: "white", fontSize: 15 }}>
                        {t("widgets.alertsContent.createAlertModalIncludeGraphLabel")}
                    </Typography>
                </Box>

                {/**/}
                <Box>
                    <Typography sx={{ color: "white", mb: 1, fontSize: 15 }}>
                        {t("widgets.alertsContent.createAlertModalMessageLabel")}
                    </Typography>
                    <OutlinedInput
                        fullWidth
                        multiline
                        minRows={3}
                        value={formValues.message}
                        onChange={(e) => handleChange("message", e.target.value)}
                        sx={{
                            background: "white",
                            color: "black",
                            borderRadius: "16px",
                            height: 132,
                            alignItems: "flex-start",
                        }}
                        size="small"
                        inputProps={{ style: { verticalAlign: "top" } }}
                    />
                </Box>

                {/**/}
                <Stack direction="row" spacing={2} mt={2}>
                    {isEdit ? (
                        <>
                            <Button
                                variant="contained"
                                sx={{
                                    background: "#73BF69",
                                    color: "white",
                                    px: 5,
                                    borderRadius: 2,
                                    textTransform: "none",
                                    width: 167,
                                    height: 36,
                                }}
                                onClick={handleSubmit}
                            >
                                {t("widgets.alertsContent.createAlertModalSaveButton")}
                            </Button>
                            <Button
                                variant="contained"
                                sx={{
                                    background: "#B94A4A",
                                    color: "white",
                                    px: 5,
                                    borderRadius: 2,
                                    textTransform: "none",
                                    width: 167,
                                    height: 36,
                                }}
                                onClick={onClose}
                            >
                                {t("widgets.alertsContent.createAlertModalDeleteButton")}
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button
                                variant="contained"
                                sx={{
                                    background: "#73BF69",
                                    color: "white",
                                    px: 5,
                                    borderRadius: 2,
                                    textTransform: "none",
                                    width: 167,
                                    height: 36,
                                }}
                                onClick={handleSubmit}
                            >
                                {t("widgets.alertsContent.createAlertModalCreateButton")}
                            </Button>
                            <Button
                                variant="contained"
                                sx={{
                                    background: "#5B9DF6",
                                    color: "white",
                                    px: 5,
                                    borderRadius: 2,
                                    textTransform: "none",
                                    width: 167,
                                    height: 36,
                                }}
                                onClick={handleReset}
                            >
                                {t("widgets.alertsContent.createAlertModalResetButton")}
                            </Button>
                            <Button
                                variant="contained"
                                sx={{
                                    background: "#B94A4A",
                                    color: "white",
                                    px: 5,
                                    borderRadius: 2,
                                    textTransform: "none",
                                    width: 167,
                                    height: 36,
                                }}
                                onClick={onClose}
                            >
                                {t("widgets.alertsContent.createAlertModalCancelButton")}
                            </Button>
                        </>
                    )}
                </Stack>
            </Stack>
        </Box>
    )
}

const AlertModalChart = ({ formValues, forecastData }: { formValues: CreateAlertFormValues; forecastData?: any }) => {
    const { mode } = useColorScheme()
    const isDark = mode === "dark"
    const bgPalette = ["var(--mui-palette-primary-main)", "var(--mui-palette-primary-light)"]
    const bg = bgPalette[~~!isDark]
    return (
        <Box
            sx={{
                background: bg,
                borderRadius: `var(--mui-shape-borderRadius)`,
                padding: `1rem`,
                marginTop: `5.5rem`,
                maxHeight: `79%`,
            }}
        >
            <ForecastGraphPanel selectedSensor={formValues.sensorId} forecastData={forecastData} />
        </Box>
    )
}

export const CreateAlertModal = ({ open, onClose, alert, onSubmit, forecastData }: CreateAlertModalProps) => {
    const { data: sensors } = useFuncGetSensorIdListBackendV1GetSensorIdListGetQuery()

    const [availableModels, setAvailableModels] = useState<string[]>([])
    const [selectedSensor, setSelectedSensor] = useState<string>("")

    // Initialize form values
    const [formValues, setFormValues] = useState<CreateAlertFormValues>({
        name: "",
        thresholdValue: 0.0,
        alertScheme: "Выше значения",
        triggerFrequency: "Каждый день",
        message: "",
        telegramNicknames: [] as string[],
        emailAddresses: [] as string[],
        includeGraph: false,
        dateStart: new Date().toISOString().split("T")[0],
        dateEnd: new Date(Date.now() + 86400000 * 2).toISOString().split("T")[0],
        timeStart: "00:00",
        timeEnd: "23:59",
        startWarningInterval: "60m",
        sensorId: "",
        model: availableModels[0],
        atValue: 0,
        betweenValue1: 0,
        betweenValue2: 0,
        refreshRate: "",
        from: "",
        to: "",
        email: "",
        telegram: "",
    })

    // Function to convert CreateAlertFormValues to AlertConfigRequest
    const convertToAlertConfigRequest = (formData: CreateAlertFormValues): AlertConfigRequest => {
        return {
            name: formData.name,
            threshold_value: Number(formData.thresholdValue),
            alert_scheme: formData.alertScheme,
            trigger_frequency: String(formData.triggerFrequency),
            message: formData.message,
            telegram_nicknames: formData.telegramNicknames,
            email_addresses: formData.emailAddresses,
            include_graph: formData.includeGraph,
            date_start: formData.dateStart,
            date_end: formData.dateEnd,
            time_start: formData.timeStart,
            time_end: formData.timeEnd,
            start_warning_interval: String(formData.startWarningInterval),
            sensor_id: formData.sensorId,
            model: formData.model,
        }
    }

    // Initialize sensor selection
    useEffect(() => {
        if (sensors && sensors.length > 0 && !selectedSensor) {
            setSelectedSensor(sensors[0])
            setFormValues((prev) => ({
                ...prev,
                sensorId: sensors[0],
            }))
        }
    }, [sensors, selectedSensor])

    // Extract available models from forecast data
    useEffect(() => {
        if (forecastData && forecastData.length > 0) {
            const models = Array.from(
                new Set(
                    forecastData.flatMap((e: unknown) => {
                        const obj = e as Record<string, unknown>
                        const firstKey = Object.keys(obj)[0]
                        const metrixTables = (obj[firstKey] as { metrix_tables?: Record<string, unknown> })
                            ?.metrix_tables
                        return Object.keys(metrixTables || {})
                    }) as string[]
                )
            )
            setAvailableModels(models)

            if (models.length > 0) {
                setFormValues((prev) => ({
                    ...prev,
                    model: String(models[0]),
                }))
            }
        }
    }, [forecastData])

    type HandleChange = <K extends keyof CreateAlertFormValues>(field: K, value: CreateAlertFormValues[K]) => void
    const handleChange: HandleChange = (field, value) => {
        setFormValues((prev) => ({ ...prev, [field]: value }))

        // Special handling for sensor and model changes
        if (field === "sensorId") {
            setSelectedSensor(value as string)
        }
    }

    const handleSubmit = (e?: unknown) => {
        if (e && typeof (e as { preventDefault?: () => void }).preventDefault === "function") {
            ;(e as { preventDefault: () => void }).preventDefault()
        }
        if (onSubmit) {
            const alertConfigRequest = convertToAlertConfigRequest(formValues)
            onSubmit(alertConfigRequest as any)
            onClose()
        }
    }

    const handleReset = () => {
        setFormValues({
            name: "",
            thresholdValue: 0.0,
            alertScheme: "Выше значения",
            triggerFrequency: "Каждый день",
            message: "",
            telegramNicknames: [] as string[],
            emailAddresses: [] as string[],
            includeGraph: false,
            dateStart: new Date().toISOString().split("T")[0],
            dateEnd: new Date(Date.now() + 86400000 * 2).toISOString().split("T")[0],
            timeStart: "00:00",
            timeEnd: "23:59",
            startWarningInterval: "60m",
            sensorId: sensors?.[0] || "",
            model: availableModels?.[0] || "",
            atValue: 0,
            betweenValue1: 0,
            betweenValue2: 0,
            refreshRate: "",
            from: "",
            to: "",
            email: "",
            telegram: "",
        })
        setSelectedSensor(Array.isArray(sensors) ? ((sensors as string[])[0] ?? "") : "")
    }

    const isEdit = !!alert

    const { mode } = useColorScheme()
    const isDark = mode === "dark"
    const bgPalette = ["var(--mui-palette-secondary-dark)", "var(--mui-palette-primary-main)"]
    const bg = bgPalette[~~isDark]

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth={false}
            slotProps={{
                paper: {
                    sx: {
                        borderRadius: `var(--mui-shape-borderRadius)`,
                        background: bg,
                        width: `80%`,
                        height: `90%`,
                    },
                },
            }}
        >
            <DialogContent
                sx={{
                    display: "flex",
                    minWidth: 0,
                    minHeight: 0,
                    width: `100%`,
                }}
            >
                {/**/}
                <AlerModalForm
                    formValues={formValues as CreateAlertFormValues}
                    handleChange={handleChange}
                    handleReset={handleReset}
                    handleSubmit={handleSubmit}
                    isEdit={isEdit}
                    onClose={onClose}
                    availableModels={availableModels || []}
                    sensors={sensors || []}
                />
                {/**/}
                <AlertModalChart formValues={formValues} forecastData={forecastData} />
            </DialogContent>
        </Dialog>
    )
}
