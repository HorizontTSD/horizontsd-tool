import { createBrowserRouter, Navigate } from "react-router-dom"
import { MainPage, AlertsPage, DbConnectionsPage, AiAgentPage } from "@/pages/main"
import { ForecastPage } from "@/pages/main/ui/ForecastPage"

export const router = createBrowserRouter([
    {
        path: "/",
        element: <MainPage />,
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
