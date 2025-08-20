import { fileURLToPath } from "node:url"
import path from "node:path"
import dotenv from "dotenv"

// Загружаем переменные окружения из .env файла (для разработки)
dotenv.config()

import express from "express"
import { createProxyMiddleware } from "http-proxy-middleware"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const port = process.env.PORT || 3000

const distPath = path.resolve(process.cwd(), "dist")
app.use(express.static(distPath))

// Проверка обязательных переменных окружения
console.log("Checking environment variables...")
console.log("NODE_ORCHESTRATOR_ENDPOINT:", process.env.NODE_ORCHESTRATOR_ENDPOINT)
console.log("VITE_ORCHESTRATOR_TOKEN:", process.env.VITE_ORCHESTRATOR_TOKEN ? "SET" : "MISSING")

const requiredEnvVars = ["NODE_ORCHESTRATOR_ENDPOINT", "VITE_ORCHESTRATOR_TOKEN"]

requiredEnvVars.forEach((envVar) => {
    if (!process.env[envVar]) {
        console.error(`ERROR: Missing required environment variable: ${envVar}`)
        process.exit(1)
    }
})

console.log("Environment variables check passed")

const alertProxy = createProxyMiddleware({
    target: process.env.NODE_ALERT_ENDPOINT,
    changeOrigin: true,
})

const backendProxy = createProxyMiddleware({
    target: process.env.NODE_BACKEND_ENDPOINT,
    changeOrigin: true,
})

const modelProxy = createProxyMiddleware({
    target: process.env.NODE_MODEL_FAST_API_ENDPOINT,
    changeOrigin: true,
})

const orchestratorProxy = createProxyMiddleware({
    target: process.env.NODE_ORCHESTRATOR_ENDPOINT,
    changeOrigin: true,
    onProxyReq: (proxyReq, req) => {
        // Всегда добавляем Authorization header для оркестратора
        proxyReq.setHeader("Authorization", `Bearer ${process.env.VITE_ORCHESTRATOR_TOKEN}`)

        // Логируем запрос для отладки
        console.log(`Proxying to orchestrator: ${req.method} ${req.url}`)
    },
})

// Proxy API requests
app.use(
    "/alert_endpoint",
    (req, res, next) => {
        if (process.env.VITE_ALERT_ENDPOINT) {
            req.url = req.url.replaceAll(process.env.VITE_ALERT_ENDPOINT, ``)
        }
        next()
    },
    alertProxy
)
app.use(
    "/backend_endpoint",
    (req, res, next) => {
        if (process.env.VITE_BACKEND_ENDPOINT) {
            req.url = req.url.replaceAll(process.env.VITE_BACKEND_ENDPOINT, ``)
        }
        next()
    },
    backendProxy
)
app.use(
    "/model_fast_api_endpoint",
    (req, res, next) => {
        if (process.env.VITE_MODEL_FAST_API_ENDPOINT) {
            req.url = req.url.replaceAll(process.env.VITE_MODEL_FAST_API_ENDPOINT, ``)
        }
        next()
    },
    modelProxy
)

// Оркестратор - без изменения URL
app.use("/orchestrator", orchestratorProxy)

// SPA fallback
app.get("*", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"))
})

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`)
    console.log(`Orchestrator endpoint: ${process.env.NODE_ORCHESTRATOR_ENDPOINT}`)
    console.log(`Orchestrator token: ${process.env.VITE_ORCHESTRATOR_TOKEN ? "SET" : "MISSING"}`)
})
