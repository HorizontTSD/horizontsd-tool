import type { ConfigFile } from "@rtk-query/codegen-openapi"

const config: ConfigFile = {
    schemaFile: `${process.env.VITE_MODEL_FAST_API_ENDPOINT}/model_fast_api/v1/openapi.json`,
    apiFile: "./src/shared/api/model_fast_api_injection.ts",
    apiImport: "model_fast_api",
    outputFile: "./src/shared/api/model_fast_api.ts",
    exportName: "model_fast_api",
    hooks: true,
}

export default config
