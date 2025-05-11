![alt text](/readme_materials/logo_line_white.svg "Title")


# `.env`

Example:
```txt
# .env
VITE_EMAIL_SERVICE_URL="https://0.0.0.0:8080"
VITE_PUBLIC_YANDEX_ANALYTICS_ID="000000000"
VITE_PUBLIC_EMAIL_LEGAL="legal@domain.com"
VITE_FIGMA_URL=https://www.figma.com/design/DIRECT_LINK_TO_FIGMA
```

<br/>

# DEVELOPMENT
```bash
# install dependencies
yarn install 
# Generate OpenAPI schema:
VITE_BACKEND=https://XX.XX.XX.XX:XXXX npx @rtk-query/codegen-openapi ./openapi-config.ts
# run development server
yarn dev 
# launch for components preview and testing
yarn storybook 
# run production build
yarn build 
# preview production build
yarn preview 
```

<br/>

# DEPLOY
VITE_BACKEND="https://XX.XX.XX.XX:XXXX" - backend data enpoint
```bash
docker build --pull --rm -f Dockerfile -t horizontsdtool:latest . --progress=plain --build-arg VITE_BACKEND="https://XX.XX.XX.XX:XXXX"
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