import React from "react"
import { Stack } from "@mui/material"
import { Sidebar } from "@/widgets/Sidebar"
import { Header } from "@/widgets/Header"
import { DataForecast } from "@/widgets/DataForecast"

export const MainLayout = () => {
    return (
        <Stack
            direction={"row"}
            sx={{
                height: `100vh`,
                width: `100vw`,
                overflow: `hidden`,
            }}
        >
            <Sidebar />
            <Stack
                direction={"column"}
                sx={{
                    width: `100%`,
                    height: `100%`,
                }}
            >
                <Header />
                <DataForecast />
            </Stack>
        </Stack>
    )
}
