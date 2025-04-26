# syntax=docker/dockerfile:1
FROM node:23-alpine AS builder
RUN apk update
RUN apk upgrade
RUN apk add --no-cache libc6-compat 
RUN npm install -g corepack 
RUN corepack enable
RUN corepack prepare yarn@4.9.1 --activate
WORKDIR /app
COPY . .
ARG VITE_APP_BACKEND_ADDRESS
ARG VITE_BACKEND
ENV VITE_APP_BACKEND_ADDRESS $VITE_APP_BACKEND_ADDRESS
ENV VITE_BACKEND $VITE_BACKEND

FROM nginx:stable-alpine-slim AS prod
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf  /etc/nginx/conf.d
EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]