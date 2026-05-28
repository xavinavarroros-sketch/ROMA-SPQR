FROM node:20-alpine
WORKDIR /app
COPY dist ./dist
COPY start-server.cjs ./start-server.cjs
EXPOSE 8080
CMD ["node", "start-server.cjs"]
