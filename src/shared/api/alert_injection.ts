import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export const alert = createApi({
    reducerPath: "alert",
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_ALERT_ENDPOINT}/`,
        prepareHeaders: (headers) => {
            const token = import.meta.env.VITE_ALERT_TOKEN
            if (token) {
                headers.set("Authorization", `Bearer ${token}`)
            }
            return headers
        },
    }),
    endpoints: () => ({}),
})
