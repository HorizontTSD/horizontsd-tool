import { fileURLToPath } from "node:url";
import path from "node:path";

import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

const distPath = path.resolve(process.cwd(), "dist");
app.use(express.static(distPath));

const alertProxy = createProxyMiddleware({
  target: process.env.NODE_ALERT_ENDPOINT,
  changeOrigin: true
})

const backendProxy = createProxyMiddleware({
  target: process.env.NODE_BACKEND_ENDPOINT,
  changeOrigin: true
})

const modelProxy = createProxyMiddleware({
  target: process.env.NODE_MODEL_FAST_API_ENDPOINT,
  changeOrigin: true,
})

// Proxy API requests
app.use("/alert_endpoint",
  (req, res, next) => {
    req.url = req.url.replaceAll(process.env.VITE_ALERT_ENDPOINT, ``)
    next();
  },
  alertProxy
);
app.use("/backend_endpoint",
  (req, res, next) => {
    req.url = req.url.replaceAll(process.env.VITE_BACKEND_ENDPOINT, ``)
    next();
  },
  backendProxy);
app.use("/model_fast_api_endpoint",
  (req, res, next) => {
    req.url = req.url.replaceAll(process.env.VITE_MODEL_FAST_API_ENDPOINT, ``)
    next();
  },
  modelProxy
);

// SPA fallback
app.get("/", (req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});
app.get("/alert", (req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});
app.get("/forecast", (req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
