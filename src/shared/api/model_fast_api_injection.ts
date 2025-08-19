import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export const model_fast_api = createApi({
    reducerPath: `model_fast_api`,
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
