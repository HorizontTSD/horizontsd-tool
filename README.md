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
```
yarn install # install dependencies
yarn dev # run development server
yarn build # run production build
yarn storybook # launch for components preview and testing
yarn preview # preview production build
```

<br/>

# DEPLOY
VITE_BACKEND="https://XX.XX.XX.XX:XXXX" - backend data enpoint
```cmd
docker build --pull --rm -f Dockerfile -t horizontsdtool:latest . --progress=plain --build-arg VITE_BACKEND="https://XX.XX.XX.XX:XXXX"
docker run -d -p 3000:80 -e --name horizontsdtool:latest
```

> map 3000 to 80 port

<br/>
<br/>
<br/>
<br/>

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