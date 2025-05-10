import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { visualizer } from "rollup-plugin-visualizer";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    visualizer({
      open: true,
      filename: "bundle-analysis.html",
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  build: {
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom", "react-router"],
          mui: ["@mui/material", "@mui/icons-material", "@emotion/react", "@emotion/styled"],
          muiX: [
            "@mui/x-data-grid",
            "@mui/x-date-pickers",
            "@mui/x-charts",
            "@mui/x-tree-view",
          ],
        },
        entryFileNames: "assets/[name]-[hash].js",
        chunkFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash][extname]",
      },
    },
  },
  optimizeDeps: {
    include: [
      "@mui/material",
      "@mui/icons-material",
      "@mui/x-data-grid",
      "@emotion/react",
      "@emotion/styled",
    ],
  },
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"],
    alias: {
      styles: "/src/styles",
      components: "/src/components",
      pages: "/src/pages",
      assets: "/src/assets",
      services: "/src/services",
      hooks: "/src/hooks",
      interface: "/src/interface",
      store: "/src/store",
      router: "/src/router",
      utils: "/src/utils",
      layouts: "/src/layouts",
      theme: "/src/theme",
      lib: "/src/lib",
      i18: "/src/i18",
    },
  },
  base: "/",
});
