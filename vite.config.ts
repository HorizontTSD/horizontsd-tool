import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig(async ({ command, mode }) => {
  const env = loadEnv(mode, process.cwd());
  const tsconfigPaths = (await import("vite-tsconfig-paths")).default;

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
      esbuild: {
        target: "esnext",
        platform: "linux",
      },
    },
    define: {
      VITE_APP_BACKEND_ADDRESS: JSON.stringify(env.VITE_APP_BACKEND_ADDRESS),
      VITE_BACKEND: JSON.stringify(`${process.env.VITE_BACKEND}`),
    },
  };
});
