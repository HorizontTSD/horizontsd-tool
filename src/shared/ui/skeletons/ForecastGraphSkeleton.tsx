import { Box, Skeleton, Stack } from "@mui/material"

interface ForecastGraphSkeletonProps {
    height?: number
    width?: string
}

export const ForecastGraphSkeleton = ({ height = 615, width = "100%" }: ForecastGraphSkeletonProps) => {
    return (
        <Box
            sx={{
                height,
                width,
                display: "flex",
                flexDirection: "column",
                gap: 2,
                padding: 2,
            }}
        >
            {/* Заголовок графика */}
            <Stack direction="row" spacing={2} alignItems="center" justifyContent="center">
                <Skeleton variant="rounded" width="31%" height={25} animation="wave" />
            </Stack>

            {/* Основной график */}
            <Box sx={{ position: "relative", flexGrow: 1 }}>
                {/* Оси графика */}

                {/* Линии графика */}
                <Box sx={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0 }}>
                    <Skeleton
                        variant="rounded"
                        height="100%"
                        animation="wave"
                        sx={{
                            borderRadius: 1,
                            background: (theme) =>
                                `linear-gradient(90deg, 
                                    ${
                                        theme.palette.mode === "dark"
                                            ? "rgba(255, 255, 255, 0.05)"
                                            : "rgba(0, 0, 0, 0.05)"
                                    } 25%, 
                                    ${
                                        theme.palette.mode === "dark"
                                            ? "rgba(255, 255, 255, 0.1)"
                                            : "rgba(0, 0, 0, 0.1)"
                                    } 50%, 
                                    ${
                                        theme.palette.mode === "dark"
                                            ? "rgba(255, 255, 255, 0.05)"
                                            : "rgba(0, 0, 0, 0.05)"
                                    } 75%)`,
                        }}
                    />
                </Box>
            </Box>

            {/* Легенда и элементы управления */}

            {/* Нижняя панель с информацией */}
            <Stack direction="row" spacing={2} justifyContent="center" alignItems="center">
                <Skeleton variant="rounded" width="53%" height={20} animation="wave" />
            </Stack>
        </Box>
    )
}
