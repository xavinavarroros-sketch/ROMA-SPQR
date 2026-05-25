FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
RUN npm install -g serve@14.2.4
COPY --from=build /app/dist ./dist
COPY --from=build /app/start-server.cjs ./start-server.cjs
ENV PORT=8080
EXPOSE 8080
CMD ["node", "start-server.cjs"]
