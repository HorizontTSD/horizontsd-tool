import { Box, Card, Skeleton, Stack } from "@mui/material"

export const MetrixSkeleton = () => {
    return (
        <Stack direction={"column"}>
            <Stack direction={"row"} justifyContent={"space-between"}>
                <Stack direction={"column"} gap={"5px"}>
                    <Skeleton variant="rounded" width="122px" height={20} animation="wave" />
                    <Skeleton variant="rounded" width="205px" height={30} animation="wave" />
                </Stack>
                <Stack direction={"column"} gap={"5px"}>
                    <Skeleton variant="rounded" width="115px" height={20} animation="wave" />
                    <Skeleton variant="rounded" width="160px" height={30} animation="wave" />
                </Stack>
            </Stack>
            <Box sx={{ width: "100%", marginTop: "30px", minHeight: `400px` }}>
                {/* Выбор сенсора и модели */}
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        width: "100%",
                        mb: 3,
                    }}
                >
                    <Stack spacing={1} gap={2}>
                        <Skeleton variant="rounded" width="160px" height={30} animation="wave" />
                        <Stack direction={"row"} gap={1}>
                            <Skeleton variant="rounded" width="250px" height={56} animation="wave" />
                            <Skeleton variant="rounded" width="250px" height={56} animation="wave" />
                        </Stack>
                    </Stack>
                </Box>

                {/* Метрики */}
                <Box sx={{ mt: 3, display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <Skeleton variant="rounded" width="90px" sx={{ mb: 2 }} height={30} animation="wave" />

                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: {
                                xs: "1fr",
                                sm: "repeat(1, 1fr)",
                                md: "repeat(2, 1fr)",
                                lg: "repeat(2, 1fr)",
                                xl: "repeat(4, 1fr)",
                            },
                            gap: 3,
                            width: "100%",
                        }}
                    >
                        {[...Array(4)].map((_, index) => (
                            <Card
                                key={index}
                                variant="outlined"
                                sx={{
                                    p: 2,
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 2,
                                    minHeight: "175px",
                                }}
                            >
                                <Skeleton variant="rounded" width="60%" height={20} animation="wave" />
                                <Skeleton variant="rounded" width="30%" height={30} animation="wave" />
                                <Skeleton
                                    sx={{ mt: "20px" }}
                                    variant="rounded"
                                    width="100%"
                                    height={40}
                                    animation="wave"
                                />
                            </Card>
                        ))}
                    </Box>
                </Box>
            </Box>
        </Stack>
    )
}
