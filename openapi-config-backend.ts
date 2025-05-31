import type { ConfigFile } from "@rtk-query/codegen-openapi"

const config: ConfigFile = {
    schemaFile: `${process.env.VITE_BACKEND_ENDPOINT}/backend/v1/openapi.json`,
    apiFile: "./src/shared/api/backend_injection.ts",
    apiImport: "backend",
    outputFile: "./src/shared/api/backend.ts",
    exportName: "backend",
    hooks: true,
}

export default config