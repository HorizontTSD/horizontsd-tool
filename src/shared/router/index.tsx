import { createBrowserRouter, Navigate } from "react-router-dom"
import { MainPage, AlertsPage, DbConnectionsPage, AiAgentPage } from "@/pages/main"
import { ForecastPage } from "@/pages/main/ui/ForecastPage"
// import RegisterPage from "@/widgets/Registration/Registration"
import { RegistrationPage } from "@/pages/main/ui/RegistrationPage"
// import RegisterPage from "@/pages/register"

// import AuthPage from "@/pages/auth"

export const router = createBrowserRouter([
    {
        path: "/",
        element: <MainPage />,
    },
    {
        path: "/register",
        element: <RegistrationPage />,
    },
    {
        path: "/alert",
        element: <AlertsPage />,
    },
    {
        path: "/forecast",
        element: <ForecastPage />,
    },
    {
        path: "/db-connections",
        element: <DbConnectionsPage />,
    },
    {
        path: "/ai-agent/:chatId?",
        element: <AiAgentPage />,
    },
    {
        path: "*",
        element: <Navigate to="/" replace />,
    },
])
