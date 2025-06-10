import { Card, Skeleton, Stack } from "@mui/material"

export const WeatherStatCardSkeleton = () => {
    return (
        <Stack
            direction={"row"}
            sx={{
                justifyContent: `space-between`,
                width: `100%`,
                alignItems: `center`,
                padding: `1rem 0`,
            }}
        >
            {[1, 2, 3, 4].map((_, index) => (
                <Card
                    key={index}
                    variant="outlined"
                    sx={{
                        maxHeight: `360px`,
                        width: `100%`,
                        "&:not(:last-child)": {
                            mr: "1rem",
                        },
                    }}
                >
                    <Stack direction="column" sx={{ padding: `1rem` }}>
                        <Skeleton variant="rounded" width="60%" height={30} />
                        <Stack sx={{ mt: 2, height: "70px" }}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                                <Skeleton variant="rounded" width="50%" height={40} />
                                <Skeleton variant="rounded" width="15%" height={30} />
                            </Stack>
                            <Skeleton sx={{ mt: 1 }} variant="rounded" width="30%" height={20} />
                        </Stack>
                        <Skeleton variant="rounded" height={128} sx={{ mt: 1 }} />
                    </Stack>
                </Card>
            ))}
        </Stack>
    )
}
