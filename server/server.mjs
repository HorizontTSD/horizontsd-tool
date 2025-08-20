// import { fileURLToPath } from "node:url"
import path from "node:path"
import dotenv from "dotenv"

// Загружаем переменные окружения из .env файла
dotenv.config()

import express from "express"
import { createProxyMiddleware } from "http-proxy-middleware"

// const __filename = fileURLToPath(import.meta.url)

const app = express()
const port = process.env.PORT || 3000

const distPath = path.resolve(process.cwd(), "dist")
app.use(express.static(distPath))

const alertTarget = process.env.NODE_ALERT_ENDPOINT
const backendTarget = process.env.NODE_BACKEND_ENDPOINT
const modelTarget = process.env.NODE_MODEL_FAST_API_ENDPOINT
const orchestratorTarget = process.env.NODE_ORCHESTRATOR_ENDPOINT

const withAuth = (opts, tokenEnvName) => ({
    ...opts,
    onProxyReq: (proxyReq) => {
        const token = process.env[tokenEnvName]
        if (token) {
            proxyReq.setHeader("Authorization", `Bearer ${token}`)
        }
    },
})

const alertProxy = alertTarget
    ? createProxyMiddleware(withAuth({ target: alertTarget, changeOrigin: true }, "VITE_ALERT_TOKEN"))
    : null
const backendProxy = backendTarget
    ? createProxyMiddleware(withAuth({ target: backendTarget, changeOrigin: true }, "VITE_BACKEND_TOKEN"))
    : null
const modelProxy = modelTarget
    ? createProxyMiddleware(withAuth({ target: modelTarget, changeOrigin: true }, "VITE_CASE_TOKEN"))
    : null
const orchestratorProxy = orchestratorTarget
    ? createProxyMiddleware(withAuth({ target: orchestratorTarget, changeOrigin: true }, "VITE_ORCHESTRATOR_TOKEN"))
    : null

const orchestratorProxy = createProxyMiddleware({
    target: process.env.NODE_ORCHESTRATOR_ENDPOINT,
    changeOrigin: true,
})

// Proxy API requests
if (alertProxy) {
    app.use(
        "/alert_endpoint",
        (req, res, next) => {
            if (process.env.VITE_ALERT_ENDPOINT) {
                req.url = req.url.replaceAll(process.env.VITE_ALERT_ENDPOINT, "")
            }
            next()
        },
        alertProxy
    )
} else {
    console.warn("[server] NODE_ALERT_ENDPOINT is not set; /alert_endpoint proxy disabled")
}

if (backendProxy) {
    app.use(
        "/backend_endpoint",
        (req, res, next) => {
            if (process.env.VITE_BACKEND_ENDPOINT) {
                req.url = req.url.replaceAll(process.env.VITE_BACKEND_ENDPOINT, "")
            }
            next()
        },
        backendProxy
    )
} else {
    console.warn("[server] NODE_BACKEND_ENDPOINT is not set; /backend_endpoint proxy disabled")
}

if (modelProxy) {
    app.use(
        "/model_fast_api_endpoint",
        (req, res, next) => {
            if (process.env.VITE_MODEL_FAST_API_ENDPOINT) {
                req.url = req.url.replaceAll(process.env.VITE_MODEL_FAST_API_ENDPOINT, "")
            }
            next()
        },
        modelProxy
    )
} else {
    console.warn("[server] NODE_MODEL_FAST_API_ENDPOINT is not set; /model_fast_api_endpoint proxy disabled")
}

// Proxy orchestrator requests
if (orchestratorProxy) {
    app.use(
        "/orchestrator",
        (req, res, next) => {
            // Remove /orchestrator prefix to match upstream paths like /horizon_orchestrator/...
            req.url = req.url.replace(/^\/orchestrator/, "")
            next()
        },
        orchestratorProxy
    )
} else {
    console.warn("[server] NODE_ORCHESTRATOR_ENDPOINT is not set; /orchestrator proxy disabled")
}

// Proxy orchestrator requests
app.use(
    "/orchestrator",
    (req, res, next) => {
        // Remove /orchestrator prefix to match upstream paths like /horizon_orchestrator/...
        req.url = req.url.replace(/^\/orchestrator/, "")
        next()
    },
    orchestratorProxy
)

// SPA fallback
app.get("/", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"))
})
app.get("/alert", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"))
})
app.get("/forecast", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"))
})

app.get("/healthz", (req, res) => res.json({ status: "ok" }))

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`)
})
