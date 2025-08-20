import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export const agentApi = createApi({
    reducerPath: "agentApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `/orchestrator/horizon_orchestrator/`,
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
