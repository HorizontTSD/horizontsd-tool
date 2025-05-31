import React, { useState } from "react"
import ColorModeIconDropdown from "."
import { AppTheme } from "@/shared/theme"
import type { Meta, StoryObj } from "@storybook/react"

interface ColorModeIconDropdownStoryArgs {
    mode: "light" | "dark"
}

const meta: Meta<typeof ColorModeIconDropdown> = {
    title: "widgets/ColorModeIconDropdown",
    component: ColorModeIconDropdown,
    argTypes: {
        mode: {
            control: { type: "radio" },
            options: ["light", "dark"],
            defaultValue: "light",
            description: "Color scheme (light/dark)",
        },
    },
}
export default meta

type Story = StoryObj<ColorModeIconDropdownStoryArgs>

export const WithControls: Story = {
    args: {
        mode: "light",
    },
    render: (args) => {
        const [mode, setMode] = useState<ColorModeIconDropdownStoryArgs["mode"]>(args.mode)
        React.useEffect(() => {
            setMode(args.mode)
        }, [args.mode])
        return (
            <AppTheme initialMode={mode}>
                <div
                    style={{
                        padding: 64,
                        background: mode === "dark" ? "#222" : "#f5f5f5",
                        minWidth: 120,
                        minHeight: 80,
                        zIndex: 1000,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <ColorModeIconDropdown />
                </div>
            </AppTheme>
        )
    },
}
