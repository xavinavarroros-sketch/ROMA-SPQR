FROM node:20-alpine AS build
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
RUN npm install -g serve@14.2.4
COPY --from=build /app/dist ./dist
ENV PORT=8080
EXPOSE 8080
CMD ["sh", "-c", "cat > dist/env.js <<EOF
window.__ENV__ = { VITE_SUPABASE_URL: \"$VITE_SUPABASE_URL\", VITE_SUPABASE_ANON_KEY: \"$VITE_SUPABASE_ANON_KEY\" };
EOF
serve -s dist -l tcp://0.0.0.0:${PORT}"]
