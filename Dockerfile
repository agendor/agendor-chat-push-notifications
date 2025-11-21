FROM node:20-alpine AS base
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY tsconfig.json ./
COPY . .

RUN npm run build

EXPOSE 3000
CMD ["node", "dist/server.js"]

