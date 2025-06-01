import type { ConfigFile } from "@rtk-query/codegen-openapi"

const config: ConfigFile = {
    schemaFile: `${process.env.VITE_ALERT_ENDPOINT}/alert_manager/v1/openapi.json`,
    apiFile: "./src/shared/api/alert_injection.ts",
    apiImport: "alert",
    outputFile: "./src/shared/api/alert.ts",
    exportName: "alert",
    hooks: true,
}

export default config
