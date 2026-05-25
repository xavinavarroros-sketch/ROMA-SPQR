FROM node:20-alpine AS build
WORKDIR /app
ENV NODE_ENV=development
ENV NPM_CONFIG_PRODUCTION=false
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=8080
COPY package.json package-lock.json ./
RUN npm install --omit=dev
COPY --from=build /app/dist ./dist
COPY server.js ./server.js
COPY seed ./seed
EXPOSE 8080
CMD ["node", "server.js"]
