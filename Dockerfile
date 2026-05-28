FROM node:20-alpine AS build
WORKDIR /app

# SPQR FINAL FIX: do not run any extra npm install for vite.
# Install dependencies once, then run local Vite directly.
COPY package.json package-lock.json ./
RUN echo "[SPQR FIX] clean Dockerfile v3 - no extra npm install command" \
  && npm install --no-audit --no-fund \
  && ./node_modules/.bin/vite --version

COPY . .
RUN ./node_modules/.bin/vite build

FROM node:20-alpine
WORKDIR /app
RUN npm install -g serve@14.2.4 --no-audit --no-fund
COPY --from=build /app/dist ./dist
COPY --from=build /app/start-server.cjs ./start-server.cjs
ENV PORT=8080
EXPOSE 8080
CMD ["node", "start-server.cjs"]
