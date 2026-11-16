# ---------- build ----------
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx ng build --configuration production

# ---------- run ----------
FROM nginx:alpine
COPY --from=build /app/dist/AGRUPA/browser /usr/share/nginx/html

# SPA: qualquer rota cai no index.html
RUN printf 'server {\n  listen 80;\n  root /usr/share/nginx/html;\n  location / { try_files $uri $uri/ /index.html; }\n  location = /env.js { add_header Cache-Control "no-store"; }\n}\n' > /etc/nginx/conf.d/default.conf

# Gera env.js com a URL da API (variavel API_URL do Coolify) ao iniciar o container
RUN printf '#!/bin/sh\necho "window.__API_URL__ = \\"${API_URL:-}\\";" > /usr/share/nginx/html/env.js\n' > /docker-entrypoint.d/40-env.sh \
 && chmod +x /docker-entrypoint.d/40-env.sh

EXPOSE 80
