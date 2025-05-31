import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
export const alert = createApi({
	reducerPath: 'alert',
	baseQuery: fetchBaseQuery({ baseUrl: `${import.meta.env.VITE_ALERT_ENDPOINT}/` }),
	endpoints: () => ({}),
})
