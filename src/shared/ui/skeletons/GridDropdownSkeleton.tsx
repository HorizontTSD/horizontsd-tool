import { Box, Skeleton, Stack } from "@mui/material"

export const GridDropdownSkeleton = () => {
    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
            }}
        >
            <Stack gap={0.5}>
                <Skeleton variant="rounded" width={130} height={24} animation="wave" />
                <Skeleton variant="rounded" width={200} height={30} animation="wave" />
            </Stack>

            <Stack gap={0.5}>
                <Skeleton variant="rounded" width={130} height={24} animation="wave" />
                <Skeleton variant="rounded" width={160} height={30} animation="wave" />
            </Stack>
        </Box>
    )
}
