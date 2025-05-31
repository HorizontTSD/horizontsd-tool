import React from "react"
import { Box, Stack } from "@mui/material"
import { Sidebar } from "@/widgets/Sidebar"
import { Header } from "@/widgets/Header"
import { DataForecast } from "@/widgets/DataForecast"

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <Stack
            direction={"row"}
            sx={{
                height: `100vh`,
                width: `100vw`,
                overflow: `auto`,
            }}
        >
            <Sidebar />
            <Box
                sx={{
                    display: `grid`,
                    width: `100%`,
                    overflow: `auto`,
                    gridTemplateRows: `max-content`
                }}>
                <Header />
                {children}
            </Box>
        </Stack>
    )
}
