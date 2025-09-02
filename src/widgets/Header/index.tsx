import { useColorScheme } from "@mui/material/styles"
import Typography from "@mui/material/Typography"
import Stack from "@mui/material/Stack"
import { LanguageDropdown } from "../dropdowns/LanguageDropdown"
import ColorModeIconDropdown from "../ColorModeIconDropdown"
import React from "react"
import useMediaQuery from "@mui/material/useMediaQuery"
import { getWidthStyles } from "@/shared/lib/styles/breakpoints"
import IconButton from "@mui/material/IconButton"
import MenuIcon from "@mui/icons-material/Menu"
import AuthUserDisplay from "../AuthUserDisplay/AuthUserDisplay"

interface HeaderProps {
    copyright?: string
    theme?: "light" | "dark"
    language?: "ru" | "en" | "it"
    width?: "xs" | "sm" | "md" | "lg" | "xl"
    title?: string
    onMenuClick?: () => void
}

// eslint-disable-next-line
export function Header({ copyright = "local", theme, language, width, title = "FORECAST", onMenuClick }: HeaderProps) {
    const { mode, setMode } = useColorScheme()
    const isDark = mode === "dark"
    const bgPalette = ["var(--mui-palette-secondary-dark)", "var(--mui-palette-secondary-main)"]
    const bg = bgPalette[~~!isDark]

    const isVerySmall = useMediaQuery("(max-width:320px)")

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
                gap: 1,
                height: isVerySmall ? "36px" : "60px",
                ...getWidthStyles(width),
            }}
        >
            <Stack direction={"row"} justifyContent={"start"} alignItems={"center"} sx={{ width: `100%` }}>
                {onMenuClick && (
                    <IconButton onClick={onMenuClick} sx={{ mr: 1, color: "white" }}>
                        <MenuIcon />
                    </IconButton>
                )}
                <Typography
                    variant="h6"
                    sx={{
                        color: `var(--mui-palette-common-white)`,
                        fontSize: isVerySmall ? "0.9rem" : undefined,
                    }}
                >
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
                    gap: 1,
                }}
            >
                <AuthUserDisplay />
                <LanguageDropdown isVerySmall={isVerySmall} />
                <ColorModeIconDropdown />
            </Stack>
        </Stack>
    )
}
