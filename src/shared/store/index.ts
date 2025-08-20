import { configureStore } from "@reduxjs/toolkit"
import { backend } from "@/shared/api/backend"
import { alert } from "@/shared/api/alert"
import { model_fast_api } from "@/shared/api/model_fast_api"
import { agentApi } from "@/shared/api/agent_injection"

export const store = configureStore({
    reducer: {
        [backend.reducerPath]: backend.reducer,
        [alert.reducerPath]: alert.reducer,
        [model_fast_api.reducerPath]: model_fast_api.reducer,
        [agentApi.reducerPath]: agentApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(backend.middleware)
            .concat(alert.middleware)
            .concat(model_fast_api.middleware)
            .concat(agentApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
