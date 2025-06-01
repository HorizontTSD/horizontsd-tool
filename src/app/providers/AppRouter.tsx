import { RouterProvider } from "react-router-dom"
import { router } from "@/shared/router"

export function AppRouter() {
    return <RouterProvider router={router} />
}
