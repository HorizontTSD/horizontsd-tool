FROM node:22-alpine

WORKDIR /app

COPY package.json ./

RUN npm cache clean --force && \
    rm -rf node_modules && \
    [ -f package-lock.json ] && rm package-lock.json || true && \
    npm install


COPY . .

EXPOSE 5174

CMD ["npm", "run", "dev"]