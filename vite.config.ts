import { defineConfig, loadEnv } from "vite"
import react from "@vitejs/plugin-react"
import path from "node:path"
import dotenv from "dotenv"

// Загружаем переменные окружения
dotenv.config()

// Конфигурация прокси
const alertProxy = {
    target: process.env.NODE_ALERT_ENDPOINT,
    changeOrigin: true,
    rewrite: (path: string) => path.replace(/^\/alert_endpoint/, ""),
}

const backendProxy = {
    target: process.env.NODE_BACKEND_ENDPOINT,
    changeOrigin: true,
    rewrite: (path: string) => path.replace(/^\/backend_endpoint/, ""),
}

const modelProxy = {
    target: process.env.NODE_MODEL_FAST_API_ENDPOINT,
    changeOrigin: true,
    rewrite: (path: string) => path.replace(/^\/model_fast_api_endpoint/, ""),
}

// eslint-disable-next-line
export default defineConfig(async ({ command, mode }) => {
    const env = loadEnv(mode, process.cwd())
    const tsconfigPaths = (await import("vite-tsconfig-paths")).default

    return {
        resolve: {
            alias: {
                "@app": path.resolve(__dirname, "./src/app"),
                "@features": path.resolve(__dirname, "./src/features"),
            },
        },
        plugins: [react(), tsconfigPaths()],
        server: {
            port: 3000,
            host: true,
            watch: {
                usePolling: true,
            },
            proxy: {
                "/alert_endpoint": alertProxy,
                "/backend_endpoint": backendProxy,
                "/model_fast_api_endpoint": modelProxy,
            },
            esbuild: {
                target: "esnext",
                platform: "linux",
            },
        },
        define: {
            // VITE_APP_BACKEND_ADDRESS: JSON.stringify(env.VITE_APP_BACKEND_ADDRESS),
            // VITE_BACKEND: JSON.stringify(`${process.env.VITE_BACKEND}`),
        },
        build: {
            sourcemap: true,
        },
    }
})
