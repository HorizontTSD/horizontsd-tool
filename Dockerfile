FROM node:22-alpine

WORKDIR /app

COPY package.json ./

RUN npm cache clean --force && \
    rm -rf node_modules && \
    rm package-lock.json && \
    npm install

COPY . .

EXPOSE 5174

CMD ["npm", "run", "dev"]