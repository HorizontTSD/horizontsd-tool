import { useColorScheme } from "@mui/material/styles"
import Typography from "@mui/material/Typography"
import Stack from "@mui/material/Stack"
import { LanguageDropdown } from "../dropdowns/LanguageDropdown"
import ColorModeIconDropdown from "../ColorModeIconDropdown"
import React from "react"
import { useTheme } from "@mui/material/styles"
import useMediaQuery from "@mui/material/useMediaQuery"
import { getWidthStyles } from "@/shared/lib/styles/breakpoints"

interface HeaderProps {
    copyright?: string
    theme?: "light" | "dark"
    language?: "ru" | "en" | "it"
    width?: "xs" | "sm" | "md" | "lg" | "xl"
    title?: string
}

// eslint-disable-next-line
export function Header({ copyright = "local", theme, language, width, title = "FORECAST" }: HeaderProps) {
    const { mode, setMode } = useColorScheme()
    const themeMUI = useTheme()
    const isDark = mode === "dark"
    const bgPalette = ["var(--mui-palette-secondary-dark)", "var(--mui-palette-secondary-main)"]
    const bg = bgPalette[~~!isDark]

    const isLessThanMd = useMediaQuery(themeMUI.breakpoints.down("md"))

    React.useEffect(() => {
        if (theme) {
            setMode(theme)
        }
    }, [theme, setMode])

    return (
        <Stack
            sx={{
                alignItems: "center",
                background: bg,
                display: "flex",
                flexDirection: `row`,
                justifyContent: "center",
                padding: `1rem`,
                margin: "0 auto",
                height: isLessThanMd ? "40px" : "60px",
                ...getWidthStyles(width),
            }}
        >
            <Stack direction={"row"} justifyContent={"start"} alignItems={"baseline"} sx={{ width: `100%` }}>
                <Typography variant="h6" sx={{ color: `var(--mui-palette-common-white)` }}>
                    {title}
                </Typography>
                <Typography variant="caption" sx={{ fontSize: `0.6rem`, color: `var(--mui-palette-text-secondary)` }}>
                    {copyright}
                </Typography>
            </Stack>
            <Stack
                direction="row"
                justifySelf="end"
                spacing={1}
                sx={{
                    width: "100%",
                    justifyContent: "end",
                    alignItems: "center",
                }}
            >
                <LanguageDropdown />
                <ColorModeIconDropdown />
            </Stack>
        </Stack>
    )
}
