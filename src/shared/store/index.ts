import { configureStore } from "@reduxjs/toolkit"
import { backend } from "@/shared/api/backend"

export const store = configureStore({
    reducer: {
        [backend.reducerPath]: backend.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(backend.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
