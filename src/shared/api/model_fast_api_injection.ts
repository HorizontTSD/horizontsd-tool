import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
export const model_fast_api = createApi({
    reducerPath: `model_fast_api`,
    baseQuery: fetchBaseQuery({ baseUrl: `${import.meta.env.VITE_MODEL_FAST_API_ENDPOINT}/` }),
    endpoints: () => ({}),
})
