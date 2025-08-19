import React from "react"
import { Dialog, DialogContent, IconButton, Box, Typography, Stack, useColorScheme } from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"
import { ForecastGraphPanel } from "./ForecastGraphPanel"

type SensorForecastMap = Record<string, Record<string, unknown>>

export type ForecastDataArray = SensorForecastMap[]

interface AlertPreviewModalProps {
    open: boolean
    onClose: () => void
    sensorId: string
    forecastData?: ForecastDataArray
}

export const AlertPreviewModal = ({ open, onClose, sensorId, forecastData }: AlertPreviewModalProps) => {
    const { mode } = useColorScheme()
    const isDark = mode === "dark"

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth={false}
            slotProps={{
                paper: {
                    sx: {
                        borderRadius: `var(--mui-shape-borderRadius)`,
                        background: isDark ? "#1a1a1a" : "white",
                        width: `90%`,
                        height: `80%`,
                    },
                },
            }}
        >
            <DialogContent
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    width: "100%",
                    height: "100%",
                    p: 3,
                    color: "text.primary",
                }}
            >
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Typography
                        variant="h5"
                        sx={{
                            color: "text.primary",
                            fontWeight: 600,
                        }}
                    >
                        Просмотр оповещения
                    </Typography>
                    <IconButton
                        onClick={onClose}
                        sx={{
                            color: "text.secondary",
                            "&:hover": {
                                background: "rgba(0, 0, 0, 0.04)",
                            },
                        }}
                        aria-label="close"
                    >
                        <CloseIcon />
                    </IconButton>
                </Stack>
                <Box
                    sx={{
                        flex: 1,
                        minHeight: 0,
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    <ForecastGraphPanel selectedSensor={sensorId} forecastData={forecastData} />
                </Box>
            </DialogContent>
        </Dialog>
    )
}
