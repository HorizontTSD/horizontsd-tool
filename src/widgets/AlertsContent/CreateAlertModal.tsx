import React, { useState, useEffect } from "react"
import Dialog from "@mui/material/Dialog"
import DialogContent from "@mui/material/DialogContent"
import { Box, Stack, Typography, OutlinedInput, Select, MenuItem, InputAdornment, Button } from "@mui/material"
import { ForecastGraphPanel } from "./ForecastGraphPanel"
import { CreateAlertFormValues } from "./types"
import { Alert, AlertState, AlertHealth } from "@/shared/types/Alert"
import { useFuncGetSensorIdListBackendV1GetSensorIdListGetQuery } from "@/shared/api/backend"

interface CreateAlertModalProps {
    open: boolean
    onClose: () => void
    alert?: Alert | null
    onSubmit?: (alert: Alert | Omit<Alert, "id" | "eventId">) => Promise<void>
}

export const CreateAlertModal: React.FC<CreateAlertModalProps> = ({ open, onClose, alert, onSubmit }) => {
    const { data: sensorsList = [] } = useFuncGetSensorIdListBackendV1GetSensorIdListGetQuery()
    const [formValues, setFormValues] = useState<CreateAlertFormValues>({
        atValue: 0.0,
        betweenValue1: 0.0,
        betweenValue2: 0.0,
        refreshRate: "1h",
        from: "-1d",
        to: "+1d",
        email: "",
        telegram: "",
        message: "",
        selectedSensor: sensorsList[0] || null,
    })

    useEffect(() => {
        if (sensorsList.length && !formValues.selectedSensor) {
            setFormValues((prev) => ({ ...prev, selectedSensor: sensorsList[0] }))
        }
    }, [sensorsList])

    useEffect(() => {
        if (alert) {
            // Здесь можно заполнить formValues из alert, если нужно
            // setFormValues(...)
        } else {
            setFormValues({
                atValue: 0.0,
                betweenValue1: 0.0,
                betweenValue2: 0.0,
                refreshRate: "1h",
                from: "-1d",
                to: "+1d",
                email: "",
                telegram: "",
                message: "",
                selectedSensor: sensorsList[0] || null,
            })
        }
    }, [alert, sensorsList])

    const handleChange = (field: keyof CreateAlertFormValues, value: any) => {
        setFormValues((prev) => ({ ...prev, [field]: value }))
    }

    const handleSubmit = (e?: React.FormEvent) => {
        if (e) e.preventDefault()
        if (onSubmit) {
            const alertData = {
                name: formValues.selectedSensor || "",
                state: "pending" as AlertState,
                health: "ok" as AlertHealth,
                summary: formValues.message,
                nextEval: new Date().toISOString(),
                evaluateEvery: formValues.refreshRate,
                keepFiringFor: "0s",
                labels: [
                    `atValue=${formValues.atValue}`,
                    `betweenValue1=${formValues.betweenValue1}`,
                    `betweenValue2=${formValues.betweenValue2}`,
                    `from=${formValues.from}`,
                    `to=${formValues.to}`,
                    `email=${formValues.email}`,
                    `telegram=${formValues.telegram}`,
                ],
            }

            if (alert) {
                onSubmit({
                    ...alert,
                    ...alertData,
                })
            } else {
                onSubmit(alertData)
            }
        }
        onClose()
    }

    const handleReset = () => {
        setFormValues({
            atValue: 0.0,
            betweenValue1: 0.0,
            betweenValue2: 0.0,
            refreshRate: "1h",
            from: "-1d",
            to: "+1d",
            email: "",
            telegram: "",
            message: "",
            selectedSensor: sensorsList[0] || null,
        })
    }

    const isEdit = !!alert

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth={false}
            slotProps={{
                paper: {
                    sx: {
                        borderRadius: "36px",
                        background: "#07345b",
                        width: 1446,
                        height: 673,
                    },
                },
            }}
        >
            <DialogContent
                sx={{
                    display: "flex",
                    p: 4,
                    minWidth: 0,
                    minHeight: 0,
                    width: 1446,
                    height: 673,
                }}
            >
                {/* Левая часть — форма */}
                <Box sx={{ flex: 1, pr: 4, p: "30px" }}>
                    <Typography variant="h4" sx={{ color: "white", mb: 3 }}>
                        {isEdit ? `Edit alert` : "Create alert"}
                    </Typography>
                    <Stack spacing={2}>
                        <Stack direction="row" spacing={4} alignItems="flex-end">
                            {/* At value */}
                            <Box>
                                <Typography sx={{ color: "white", mb: 1, fontSize: 15 }}>At value</Typography>
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        background: "white",
                                        borderRadius: "20px",
                                        pl: 2,
                                        pr: 1,
                                        height: 30,
                                    }}
                                >
                                    <OutlinedInput
                                        fullWidth
                                        value={formValues.atValue}
                                        onChange={(e) => handleChange("atValue", Number(e.target.value))}
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
                                                    "atValue",
                                                    Math.max(0, Number((formValues.atValue - 1).toFixed(1)))
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
                                                handleChange("atValue", Number((formValues.atValue + 1).toFixed(1)))
                                            }
                                        >
                                            +
                                        </Button>
                                    </Box>
                                </Box>
                            </Box>
                            {/* Between values */}
                            <Box>
                                <Typography sx={{ color: "white", mb: 1, fontSize: 15 }}>Between values</Typography>
                                <Box sx={{ display: "flex", gap: 1 }}>
                                    <OutlinedInput
                                        fullWidth
                                        value={formValues.betweenValue1}
                                        onChange={(e) => handleChange("betweenValue1", Number(e.target.value))}
                                        sx={{
                                            background: "white",
                                            color: "black",
                                            borderRadius: "20px",
                                            height: 30,
                                            width: 80,
                                            fontSize: 16,
                                            "& fieldset": { border: "none" },
                                        }}
                                        inputProps={{ style: { padding: "0 12px", textAlign: "center" } }}
                                    />
                                    <OutlinedInput
                                        fullWidth
                                        value={formValues.betweenValue2}
                                        onChange={(e) => handleChange("betweenValue2", Number(e.target.value))}
                                        sx={{
                                            background: "white",
                                            color: "black",
                                            borderRadius: "20px",
                                            height: 30,
                                            width: 80,
                                            fontSize: 16,
                                            "& fieldset": { border: "none" },
                                        }}
                                        inputProps={{ style: { padding: "0 12px", textAlign: "center" } }}
                                    />
                                </Box>
                            </Box>
                        </Stack>
                        <Stack direction="row" spacing={4} alignItems="flex-end">
                            {/* Refresh rate, From, To */}
                            <Box>
                                <Typography sx={{ color: "white", mb: 1, fontSize: 15 }}>Refresh rate</Typography>
                                <Select
                                    value={formValues.refreshRate}
                                    onChange={(e) => handleChange("refreshRate", e.target.value)}
                                    size="small"
                                    sx={{
                                        background: "white",
                                        color: "black",
                                        borderRadius: "20px",
                                        height: 30,
                                        width: 120,
                                        fontSize: 16,
                                        mb: 1,
                                        "& fieldset": { border: "none" },
                                        ".MuiSelect-select": { p: "4px 12px" },
                                    }}
                                >
                                    <MenuItem value={"1h"}>1h</MenuItem>
                                    <MenuItem value={"6h"}>6h</MenuItem>
                                    <MenuItem value={"12h"}>12h</MenuItem>
                                    <MenuItem value={"24h"}>24h</MenuItem>
                                </Select>
                                <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
                                    <Box>
                                        <Typography sx={{ color: "white", mb: 1, fontSize: 15 }}>From</Typography>
                                        <OutlinedInput
                                            fullWidth
                                            type="text"
                                            value={formValues.from.replace("d", "")}
                                            onChange={(e) =>
                                                handleChange("from", e.target.value.replace(/[^0-9\-]/g, "") + "d")
                                            }
                                            sx={{
                                                background: "white",
                                                color: "black",
                                                borderRadius: "20px",
                                                width: 80,
                                                fontSize: 16,
                                                "& fieldset": { border: "none" },
                                                height: 30,
                                            }}
                                            inputProps={{ style: { padding: "0 12px", textAlign: "center" } }}
                                            endAdornment={<InputAdornment position="end">d</InputAdornment>}
                                        />
                                    </Box>
                                    <Box>
                                        <Typography sx={{ color: "white", mb: 1, fontSize: 15 }}>To</Typography>
                                        <OutlinedInput
                                            fullWidth
                                            type="text"
                                            value={formValues.to.replace("d", "")}
                                            onChange={(e) =>
                                                handleChange("to", e.target.value.replace(/[^0-9\+]/g, "") + "d")
                                            }
                                            sx={{
                                                background: "white",
                                                color: "black",
                                                borderRadius: "20px",
                                                width: 80,
                                                fontSize: 16,
                                                "& fieldset": { border: "none" },
                                                height: 30,
                                            }}
                                            inputProps={{ style: { padding: "0 12px", textAlign: "center" } }}
                                            endAdornment={<InputAdornment position="end">d</InputAdornment>}
                                        />
                                    </Box>
                                </Box>
                            </Box>
                        </Stack>
                        {/* Email и Telegram */}
                        <Stack direction="row" spacing={2} mt={2}>
                            <Box sx={{ flex: 1 }}>
                                <Typography sx={{ color: "white", mb: 1, fontSize: 15 }}>Email*</Typography>
                                <OutlinedInput
                                    fullWidth
                                    value={formValues.email}
                                    onChange={(e) => handleChange("email", e.target.value)}
                                    sx={{ background: "white", color: "black", borderRadius: "20px", height: 30 }}
                                    size="small"
                                />
                            </Box>
                            <Box sx={{ flex: 1 }}>
                                <Typography sx={{ color: "white", mb: 1, fontSize: 15 }}>Telegram</Typography>
                                <OutlinedInput
                                    fullWidth
                                    value={formValues.telegram}
                                    onChange={(e) => handleChange("telegram", e.target.value)}
                                    sx={{ background: "white", color: "black", borderRadius: "20px", height: 30 }}
                                    size="small"
                                />
                            </Box>
                        </Stack>
                        <Box>
                            <Typography sx={{ color: "white", mb: 1, fontSize: 15 }}>Message</Typography>
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
                        {/* Кнопки */}
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
                                        save
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
                                        delete
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
                                        create
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
                                        reset
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
                                        cancel
                                    </Button>
                                </>
                            )}
                        </Stack>
                    </Stack>
                </Box>
                {/* Правая часть — график */}
                <Box
                    sx={{
                        flex: 1,
                        background: "white",
                        borderRadius: "24px",
                        ml: 4,
                        p: 2,
                        minWidth: 700,
                        width: 700,
                        minHeight: 480,
                    }}
                >
                    <ForecastGraphPanel selectedSensor={formValues.selectedSensor} />
                </Box>
            </DialogContent>
        </Dialog>
    )
}
