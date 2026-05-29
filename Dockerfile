FROM node:20-alpine
WORKDIR /app
COPY package.json ./
RUN npm install
COPY index.html vite.config.js ./
COPY src ./src
RUN npm run build
COPY start-server.cjs ./start-server.cjs
EXPOSE 8080
CMD ["node", "start-server.cjs"]
