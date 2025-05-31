import { ReactNode } from "react"
import { Provider as ReduxProvider } from "react-redux"
import { CssBaseline } from "@mui/material"
import { StyledEngineProvider } from "@mui/material/styles"
import { I18nextProvider } from "react-i18next"
import { useEffect } from "react"

import { store } from "@/shared/store"
import { AppTheme } from "@/shared/theme"
import i18n from "@/shared/i18"

import { chartsCustomizations, treeViewCustomizations, loaderCustomizations } from "@/shared/theme"

type Props = {
    children: ReactNode
    initialTheme?: "light" | "dark"
    initialLanguage?: "ru" | "en" | "it"
}

const themeComponents = {
    ...chartsCustomizations,
    ...treeViewCustomizations,
    ...loaderCustomizations,
}

export function AppProvider({ children, initialTheme, initialLanguage }: Props) {
    useEffect(() => {
        if (initialLanguage) {
            i18n.changeLanguage(initialLanguage)
        }
    }, [initialLanguage])

    return (
        <ReduxProvider store={store}>
            <I18nextProvider i18n={i18n}>
                <StyledEngineProvider injectFirst>
                    <AppTheme themeComponents={themeComponents} initialMode={initialTheme}>
                        <CssBaseline enableColorScheme />
                        {children}
                    </AppTheme>
                </StyledEngineProvider>
            </I18nextProvider>
        </ReduxProvider>
    )
}
