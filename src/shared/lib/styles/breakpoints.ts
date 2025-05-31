type BreakpointKey = "xs" | "sm" | "md" | "lg" | "xl"

interface BreakpointStyles {
    minWidth: string
    maxWidth: string
    width: string
}

export const getWidthStyles = (width?: BreakpointKey): BreakpointStyles => {
    if (!width)
        return {
            width: "100%",
            maxWidth: "100%",
            minWidth: "100%",
        }

    const breakpoints = {
        xs: { minWidth: "0px", maxWidth: "600px" },
        sm: { minWidth: "600px", maxWidth: "900px" },
        md: { minWidth: "900px", maxWidth: "1200px" },
        lg: { minWidth: "1200px", maxWidth: "1536px" },
        xl: { minWidth: "1536px", maxWidth: "100%" },
    }

    return {
        ...breakpoints[width],
        width: "100%",
    }
}
