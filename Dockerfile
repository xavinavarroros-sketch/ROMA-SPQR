FROM node:20-alpine AS build
WORKDIR /app

# Force full dependency installation during the build stage.
# Some Railway environments can pass production-style npm flags; this prevents Vite from being omitted.
ENV NODE_ENV=development
ENV NPM_CONFIG_PRODUCTION=false
ENV npm_config_omit=

COPY package.json package-lock.json ./
RUN npm ci --include=dev \
  && npm install vite@5.4.11 @vitejs/plugin-react@4.3.4 --no-save \
  && test -x ./node_modules/.bin/vite

COPY . .
RUN ./node_modules/.bin/vite build

FROM node:20-alpine
WORKDIR /app
RUN npm install -g serve@14.2.4
COPY --from=build /app/dist ./dist
COPY --from=build /app/start-server.cjs ./start-server.cjs
ENV PORT=8080
EXPOSE 8080
CMD ["node", "start-server.cjs"]
