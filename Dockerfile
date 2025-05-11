# syntax=docker/dockerfile:1
FROM node:23-alpine AS lockfile-generator
RUN apk update
RUN apk upgrade
RUN apk add --no-cache libc6-compat 
RUN npm install -g corepack 
RUN corepack enable
RUN corepack prepare yarn@4.9.1 --activate
WORKDIR /app
COPY package.json .yarnrc.yml ./
RUN yarn install

FROM node:23-alpine AS builder
RUN apk update
RUN apk upgrade
RUN apk add --no-cache libc6-compat 
RUN npm install -g corepack 
RUN corepack enable
RUN corepack prepare yarn@4.9.1 --activate
WORKDIR /app
ARG VITE_BACKEND_URL
ARG VITE_BACKEND
ENV VITE_BACKEND_URL="0.0.0.0:3000"
ENV PORT=3000
ENV VITE_BACKEND=$VITE_BACKEND
COPY package.json .yarnrc.yml ./
COPY --from=lockfile-generator /app/yarn.lock .
RUN yarn install --immutable
COPY . .
# TODO
RUN VITE_BACKEND=https://XX.XX.XX.XX:XXXX npx @rtk-query/codegen-openapi ./openapi-config.ts
RUN yarn build

FROM nginx:stable-alpine-slim AS prod
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf  /etc/nginx/conf.d
EXPOSE ${PORT}
CMD ["nginx", "-g", "daemon off;"]