import { Skeleton, Stack } from "@mui/material"

export const AlertBlockSkeleton = () => {
    return (
        <Stack sx={{ margin: "0.5rem 0" }} spacing={1}>
            <Skeleton sx={{ padding: "1rem", margin: "0.5rem 0" }} variant="rounded" width="100%" height={112} />
            <Skeleton sx={{ padding: "1rem", margin: "0.5rem 0" }} variant="rounded" width="100%" height={112} />
            <Skeleton sx={{ padding: "1rem", margin: "0.5rem 0" }} variant="rounded" width="100%" height={112} />
            <Skeleton sx={{ padding: "1rem", margin: "0.5rem 0" }} variant="rounded" width="100%" height={112} />
            <Skeleton sx={{ padding: "1rem", margin: "0.5rem 0" }} variant="rounded" width="100%" height={112} />
        </Stack>
    )
}
