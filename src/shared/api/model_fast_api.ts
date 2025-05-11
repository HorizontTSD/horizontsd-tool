import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
export const model_fast_api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: `${import.meta.env.VITE_BACKEND}/` }),
  endpoints: () => ({}),
})