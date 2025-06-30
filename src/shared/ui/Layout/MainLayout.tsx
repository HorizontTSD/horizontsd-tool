import React, { useState } from "react"
import { Box, Stack, Drawer, useMediaQuery, useTheme } from "@mui/material"
import { Sidebar } from "@/widgets/Sidebar"
import { Header } from "@/widgets/Header"

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down("md"))
    const [drawerOpen, setDrawerOpen] = useState(false)

    const handleDrawerOpen = () => setDrawerOpen(true)
    const handleDrawerClose = () => setDrawerOpen(false)

    return (
        <Stack
            direction={"row"}
            sx={{
                height: `100vh`,
                width: `100vw`,
                overflow: `auto`,
            }}
        >
            {!isMobile && <Sidebar />}
            {isMobile && (
                <Drawer
                    sx={{ zIndex: 100 }}
                    anchor="left"
                    open={drawerOpen}
                    onClose={handleDrawerClose}
                    ModalProps={{ keepMounted: true }}
                >
                    <Sidebar />
                </Drawer>
            )}
            <Box
                sx={{
                    display: `grid`,
                    width: `100%`,
                    overflow: `auto`,
                    gridTemplateRows: `max-content`,
                }}
            >
                <Header onMenuClick={isMobile ? handleDrawerOpen : undefined} />
                {children}
            </Box>
        </Stack>
    )
}
