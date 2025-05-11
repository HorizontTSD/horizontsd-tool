import type { ConfigFile } from '@rtk-query/codegen-openapi'

const config: ConfigFile = {
  schemaFile: `${process.env.VITE_BACKEND}/model_fast_api/v1/openapi.json`,
  apiFile: './src/shared/api/model_fast_api.ts',
  apiImport: 'model_fast_api',
  outputFile: './src/shared/api/backend.ts',
  exportName: 'backend',
  hooks: true,
}

export default config