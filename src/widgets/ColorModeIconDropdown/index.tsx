import * as React from "react"
import { styled, useColorScheme } from "@mui/material/styles"
import Switch from "@mui/material/Switch"

export interface ColorModeIconDropdownProps {
    // mode?: "light" | "dark" // убираем управляемость
}

const getColors = (mode: "light" | "dark", theme: any) => {
    const isDark = mode === "dark"
    return {
        isDark,
        bodyColor: isDark ? `var(--mui-palette-grey-900)` : `var(--mui-palette-grey-50)`,
        // Исправляем innerColor: в светлой теме делаем желтым, в темной — ярким
        innerColor: isDark ? theme.palette.warning.light : theme.palette.warning.main,
        trackColor: `var(--mui-palette-grey-50)`,
        borderColor: !isDark ? "--mui-palette-secondary-dark" : "--mui-palette-secondary-light",
        trackBorderColor: !isDark ? "--mui-palette-secondary-dark" : "--mui-palette-primary-main",
    }
}

const MaterialUISwitch = styled(Switch, {
    shouldForwardProp: (prop) => prop !== "modeProp",
})<{
    modeProp: "light" | "dark"
}>(({ theme, modeProp }) => {
    const { isDark, bodyColor, innerColor, trackColor, borderColor, trackBorderColor } = getColors(modeProp, theme)
    return {
        width: 62,
        height: 34,
        padding: 7,
        "& .MuiSwitch-switchBase": {
            margin: 1,
            padding: 0,
            transform: "translateX(6px)",
            "&.Mui-checked": {
                color: "#fff",
                transform: "translateX(22px)",
                "& .MuiSwitch-thumb:before": {
                    backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" height=\"20\" width=\"20\" viewBox=\"0 0 20 20\"><path fill=\"${encodeURIComponent(
                        innerColor
                    )}\" d=\"M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z\"/></svg>')`,
                },
                "& + .MuiSwitch-track": {
                    opacity: 1,
                    background: trackColor,
                },
            },
        },
        "& .MuiSwitch-thumb": {
            border: `1px solid var(${borderColor})`,
            background: bodyColor,
            width: 32,
            height: 32,
            "&::before": {
                content: "''",
                position: "absolute",
                width: "100%",
                height: "100%",
                left: 0,
                top: 0,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" height=\"20\" width=\"20\" viewBox=\"0 0 20 20\"><path fill=\"${encodeURIComponent(
                    innerColor
                )}\" d=\"M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z\"/></svg>')`,
            },
        },
        "& .MuiSwitch-track": {
            border: `1px solid var(${trackBorderColor})`,
            opacity: 1,
            background: trackColor,
            borderRadius: 10,
        },
    }
})

export default function ColorModeIconDropdown() {
    const { mode, setMode } = useColorScheme()
    const safeMode: "light" | "dark" = mode === "dark" ? "dark" : "light"
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setMode(event.target.checked ? "dark" : "light")
    }
    return (
        <div
            style={{
                padding: 48,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minWidth: 200,
                minHeight: 120,
            }}
        >
            <MaterialUISwitch checked={safeMode === "dark"} onChange={handleChange} modeProp={safeMode} />
        </div>
    )
}
