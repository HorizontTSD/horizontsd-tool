![alt text](/readme_materials/dashboard.png "Dashboard")

# `.env`

Example:

```txt
# .env

# to build client
VITE_BACKEND_ENDPOINT=/backend_endpoint
VITE_ALERT_ENDPOINT=/alert_endpoint
VITE_MODEL_FAST_API_ENDPOINT=/model_fast_api_endpoint
VITE_ORCHESTRATOR_ENDPOINT=/orchestrator
VITE_ORCHESTRATOR_PATH_PREFIX=horizon_orchestrator
# Абсолютный URL для продакшена (опционально, тогда клиент бьет напрямую)
# VITE_ORCHESTRATOR_ABSOLUTE=https://horizon-tool.ru/orchestrator
# to run server
NODE_BACKEND_ENDPOINT=http://XX.XX.XX.XX:XXXX
NODE_ALERT_ENDPOINT=http://XX.XX.XX.XX:XXXX
NODE_MODEL_FAST_API_ENDPOINT=http://XX.XX.XX.XX:XXXX
NODE_ORCHESTRATOR_ENDPOINT=http://XX.XX.XX.XX:XXXX

VITE_FIGMA_URL=https://www.figma.com/design/XXXXXXXXXXXXXXXXX/XXXXXXXXXXXXXXXXX?node-id=XXX-XXX
```

```txt
# .storybook/.env.development
VITE_BACKEND_URL=0.0.0.0
VITE_BACKEND=http://localhost:6006
```

<br/>

# DEVELOPMENT

```bash
# pull
git clone https://github.com/HorizontTSD/horizontsd-tool.git --branch ...

# setup .env
...
# setup .storybook/.env.development
...


# install dependencies
yarn install

# Generate OpenAPI schemas:
VITE_MODEL_FAST_API_ENDPOINT=https://1X.XX.XX.XX:XXXX npx @rtk-query/codegen-openapi ./openapi-config-model_fast_api.ts
VITE_ALERT_ENDPOINT=http://2X.XX.XX.XX:XXXX npx @rtk-query/codegen-openapi ./openapi-config-alerts.ts
VITE_BACKEND_ENDPOINT=http://3X.XX.XX.XX:XXXX npx @rtk-query/codegen-openapi ./openapi-config-model_fast_api.ts

# run development server
yarn dev

# launch for components preview and testing
yarn storybook

# run production build
yarn build

# preview production build
yarn server
```

<br/>

# DEPLOY

```bash
docker build --pull --rm -f Dockerfile -t horizontsdtool:latest . --progress=plain \
  --build-arg VITE_BACKEND_ENDPOINT=/backend_endpoint \
  --build-arg VITE_ALERT_ENDPOINT=/alert_endpoint \
  --build-arg VITE_MODEL_FAST_API_ENDPOINT=/model_fast_api_endpoint \
  --build-arg VITE_ORCHESTRATOR_ENDPOINT=/orchestrator \
  --build-arg VITE_ORCHESTRATOR_PATH_PREFIX=horizon_orchestrator \
  --build-arg NODE_BACKEND_ENDPOINT=http://XX.XX.XX.XX:XXXX \
  --build-arg NODE_ALERT_ENDPOINT=http://XX.XX.XX.XX:XXXX \
  --build-arg NODE_MODEL_FAST_API_ENDPOINT=http://XX.XX.XX.XX:XXXX \
  --build-arg NODE_ORCHESTRATOR_ENDPOINT=http://XX.XX.XX.XX:XXXX

# Прод-образ запускает Node-сервер на 3000
docker run -d --name horizontsdtool -p 3000:3000 horizontsdtool:latest
```

> На проде приложение слушает 3000 порт (Node `server/server.mjs`). Проксируйте домен на этот порт.

<br/>
<br/>
<br/>
