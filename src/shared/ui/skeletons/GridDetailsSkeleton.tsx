import { Box, Card, Skeleton, Stack } from "@mui/material"

export const GridDetailsSkeleton = () => {
    return (
        <Stack direction={"column"}>
            <Box
                sx={{
                    height: 630,
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                }}
            >
                {/* Выбор сенсора и модели */}

                {/* Таблица */}
                <Card variant="outlined" sx={{ flex: 1, p: 1 }}>
                    {/* Заголовок таблицы */}
                    <Box sx={{ mb: 1 }}>
                        <Skeleton variant="rounded" width="100%" height={38} animation="wave" />
                    </Box>

                    {/* Строки таблицы */}
                    {[...Array(13)].map((_, rowIndex) => (
                        <Box
                            key={rowIndex}
                            sx={{
                                mb: 1,
                                borderRadius: 1,
                            }}
                        >
                            <Skeleton variant="rounded" width="100%" height={36} animation="wave" />
                        </Box>
                    ))}

                    {/* Пагинация */}
                    <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
                        <Skeleton variant="rounded" width="100%" height={52} animation="wave" />
                    </Box>
                </Card>
            </Box>
        </Stack>
    )
}
