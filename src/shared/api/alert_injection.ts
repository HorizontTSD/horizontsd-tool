import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

const orchestratorPrefix =
    import.meta.env.VITE_ORCHESTRATOR_PATH_PREFIX?.replace(/(^\/+|\/+?$)/g, "") || "horizon_orchestrator"

export const alert = createApi({
    reducerPath: "alert",
    baseQuery: fetchBaseQuery({
        baseUrl: `/orchestrator/${orchestratorPrefix ? orchestratorPrefix + "/" : ""}`,
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
