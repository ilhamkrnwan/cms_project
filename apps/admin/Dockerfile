FROM oven/bun:1 AS builder
WORKDIR /app
ENV PATH="/app/node_modules/.bin:${PATH}"

COPY package.json bun.lock* ./
COPY packages ./packages
COPY apps/admin ./apps/admin

RUN bun install

WORKDIR /app/apps/admin
RUN bun run build

# Nginx Stage for serving static frontend
FROM nginx:alpine AS runner
COPY --from=builder /app/apps/admin/dist /usr/share/nginx/html
COPY apps/admin/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]



