import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export const backend = createApi({
    reducerPath: "backend",
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_BACKEND_ENDPOINT}/`,
        prepareHeaders: (headers) => {
            const token = import.meta.env.VITE_BACKEND_TOKEN
            if (token) {
                headers.set("Authorization", `Bearer ${token}`)
            }
            return headers
        },
    }),
    endpoints: () => ({}),
})
