import { createBrowserRouter, Navigate } from "react-router-dom"
import { MainPage, AlertsPage } from "@/pages/main"

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
        path: "*",
        element: <Navigate to="/" replace />,
    },
])
