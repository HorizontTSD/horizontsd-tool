import React from "react"
import { createRoot } from "react-dom/client"

import { AppProvider } from "@/app/providers"
import { App } from "@/app"

import "./main.css"

// async function enableMocking() {
//     if (process.env.NODE_ENV !== "development") return
//     const { worker } = await import("@/mocks/browser")
//     return worker.start()
// }

// enableMocking().then(() => {
const root = createRoot(document.getElementById("root")!)
if (process.env.NODE_ENV !== "development") {
    root.render(
        <AppProvider>
            <App />
        </AppProvider>
    )
} else {
    root.render(
        <React.StrictMode>
            <AppProvider>
                <App />
            </AppProvider>
        </React.StrictMode>
    )
}
// })
