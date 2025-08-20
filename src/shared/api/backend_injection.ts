import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

const orchestratorPrefix =
    import.meta.env.VITE_ORCHESTRATOR_PATH_PREFIX?.replace(/(^\/+|\/+?$)/g, "") || "horizon_orchestrator"

const resolvedBaseUrl = (() => {
    const absolute = (import.meta.env.VITE_ORCHESTRATOR_ABSOLUTE as string | undefined)?.replace(/\/+$/, "")
    if (absolute) {
        return `${absolute}/${orchestratorPrefix ? orchestratorPrefix + "/" : ""}`
    }
    const configured = (import.meta.env.VITE_ORCHESTRATOR_ENDPOINT as string | undefined)?.replace(/\/+$/, "")
    const base = configured && configured.length > 0 ? configured : "/orchestrator"
    return `${base}/${orchestratorPrefix ? orchestratorPrefix + "/" : ""}`
})()

export const backend = createApi({
    reducerPath: "backend",
    baseQuery: fetchBaseQuery({
        baseUrl: resolvedBaseUrl,
        prepareHeaders: (headers) => {
            const token = import.meta.env.VITE_ORCHESTRATOR_TOKEN
            if (token) {
                headers.set("Authorization", `Bearer ${token}`)
            }
            return headers
        },
    }),
    endpoints: () => ({}),
})
