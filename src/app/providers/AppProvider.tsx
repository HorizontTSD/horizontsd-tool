import { ReactNode, useState } from "react"
import { Provider as ReduxProvider } from "react-redux"
import { CssBaseline } from "@mui/material"
import { StyledEngineProvider } from "@mui/material/styles"
import { I18nextProvider } from "react-i18next"
import { useEffect } from "react"

import { store } from "@/shared/store"
import { AppTheme } from "@/shared/theme"
import i18n from "@/shared/i18"

import { chartsCustomizations, treeViewCustomizations, loaderCustomizations } from "@/shared/theme"
import { AuthModal } from "@/widgets/AuthModal/AuthModal"
import { useAuth } from "./AuthProvider"
// import { useNavigate } from "react-router"

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
    const { showLoginModal } = useAuth()
    console.log("showLoginModal", showLoginModal)
    // const navigate = useNavigate()

    useEffect(() => {
        if (initialLanguage) {
            i18n.changeLanguage(initialLanguage)
        }
    }, [initialLanguage])

    const handleCloseModal = () => {
        // closeLoginModal()
    }

    const handleAuthSuccess = () => {
        // closeLoginModal()
    }

    return (
        <ReduxProvider store={store}>
            <I18nextProvider i18n={i18n}>
                <StyledEngineProvider injectFirst>
                    <AppTheme themeComponents={themeComponents} initialMode={initialTheme}>
                        <CssBaseline enableColorScheme />
                        {children} {/* Всегда рендерим children */}
                        {showLoginModal && (
                            <AuthModal
                                isOpen={showLoginModal}
                                onClose={handleCloseModal}
                                onAuthSuccess={handleAuthSuccess}
                            />
                        )}
                        {/* {showLoginModal ? (
                            <AuthModal
                                isOpen={showLoginModal}
                                onClose={handleCloseModal}
                                onAuthSuccess={handleAuthSuccess}
                                navigate={() => (window.location.href = "/register")}
                            ></AuthModal>
                        ) : (
                            children
                        )} */}
                    </AppTheme>
                </StyledEngineProvider>
            </I18nextProvider>
        </ReduxProvider>
    )
}
