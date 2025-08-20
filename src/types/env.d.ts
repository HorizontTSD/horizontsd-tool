/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_BACKEND_ENDPOINT?: string
    readonly VITE_ALERT_ENDPOINT?: string
    readonly VITE_MODEL_FAST_API_ENDPOINT?: string
    readonly VITE_BACKEND_TOKEN?: string
    readonly VITE_CASE_TOKEN?: string
    readonly VITE_AGENT_ENDPOINT?: string
    readonly VITE_ORCHESTRATOR_ENDPOINT: string
    readonly VITE_ORCHESTRATOR_TOKEN: string
    readonly VITE_ORCHESTRATOR_PUBLIC_BASE?: string
    readonly VITE_ORCHESTRATOR_PATH_PREFIX?: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
