import { Skeleton, Stack } from "@mui/material"

export const NavbarSkeleton = () => {
    return (
        <Stack direction="row" spacing={2} alignItems="center">
            <Skeleton variant="rounded" width={"100%"} height={60} animation="wave" />
        </Stack>
    )
}
