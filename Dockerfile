# ── Stage 1: Build ────────────────────────────────────────────────────────────
FROM oven/bun:1 AS builder

WORKDIR /app

COPY package.json bun.lock* ./
RUN --mount=type=cache,target=/root/.bun/install/cache \
    if [ -f bun.lock ]; then bun install --frozen-lockfile; else bun install; fi

COPY . .
ARG VITE_APP_NAME=liouni
ARG VITE_API_BASE_URL=
ARG APP_ENV=production
ENV VITE_APP_NAME=${VITE_APP_NAME}
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}
ENV APP_ENV=${APP_ENV}
RUN bun run build

# ── Stage 2: Serve ────────────────────────────────────────────────────────────
FROM nginx:stable-alpine AS runner

ARG NGINX_API_UPSTREAM=liouni-master-dev-api-api-1:3000

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/templates/default.conf.template

ENV API_UPSTREAM_URL=${NGINX_API_UPSTREAM}

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
