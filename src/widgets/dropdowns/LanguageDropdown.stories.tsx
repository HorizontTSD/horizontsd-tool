import React from "react"
import { LanguageDropdown as LanguageDropdownComponent } from "./LanguageDropdown"
import type { Meta, StoryObj } from "@storybook/react"
import { AppTheme } from "@/shared/theme"

interface LanguageDropdownStoryArgs {
    selectedLanguage: "en" | "ru" | "it"
}

const meta: Meta<typeof LanguageDropdownComponent> = {
    title: "widgets/LanguageDropdown",
    component: LanguageDropdownComponent,
    argTypes: {
        selectedLanguage: {
            control: { type: "radio" },
            options: ["en", "ru", "it"],
            defaultValue: "en",
            description: "Selected language",
        },
    },
}
export default meta

type Story = StoryObj<LanguageDropdownStoryArgs>

export const WithControls: Story = {
    args: {
        selectedLanguage: "en",
    },
    render: (args) => {
        const [lang, setLang] = React.useState<LanguageDropdownStoryArgs["selectedLanguage"]>(args.selectedLanguage)
        React.useEffect(() => {
            setLang(args.selectedLanguage)
        }, [args.selectedLanguage])
        return (
            <AppTheme>
                <div
                    style={{
                        padding: 64,
                        background: "#f5f5f5",
                        minWidth: 120,
                        minHeight: 80,
                        zIndex: 1000,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <LanguageDropdownComponent selectedLanguage={lang} onChange={setLang} />
                </div>
            </AppTheme>
        )
    },
}
