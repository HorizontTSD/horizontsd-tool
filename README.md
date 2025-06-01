![alt text](/readme_materials/logo_line_white.svg "Title")

# `.env`

Example:

```txt
# .env

# to build client
VITE_BACKEND_ENDPOINT=/backend_endpoint
VITE_ALERT_ENDPOINT=/alert_endpoint
VITE_MODEL_FAST_API_ENDPOINT=/model_fast_api_endpoint
# to run server
NODE_BACKEND_ENDPOINT=http://XX.XX.XX.XX:XXXX
NODE_ALERT_ENDPOINT=http://XX.XX.XX.XX:XXXX
NODE_MODEL_FAST_API_ENDPOINT=http://XX.XX.XX.XX:XXXX

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
--build-arg NODE_BACKEND_ENDPOINT=http://XX.XX.XX.XX:XXXX \
--build-arg NODE_ALERT_ENDPOINT=http://XX.XX.XX.XX:XXXX \
--build-arg NODE_MODEL_FAST_API_ENDPOINT=http://XX.XX.XX.XX:XXXX

docker run -d -p 3000:80 -e --name horizontsdtool:latest
```

> map 3000 to 80 port

<br/>
<br/>
<br/>

---

# [<span style="color:orange"> Git Workflow & Contribution Guidelines </span>]("./readme_materials/Git_Workflow_and_Contribution_Guidelines.md")

---

<br/>
<br/>
<br/>

## Development details:

![alt text](/readme_materials/storybook_figma.png "Title")

<br/>
<br/>
<br/>

## run alongside with storybook

<br/>
<br/>
<br/>

![alt text](/readme_materials/storybook_smoke.png "Title")

<br/>
<br/>
<br/>

### Design:

![alt text](/_design/palette.png "Title")

<br/>
<br/>
<br/>

![alt text](/_design/1920w_dark.png "Title")

<br/>
<br/>
<br/>

![alt text](/_design/1920w_light.png "Title")
