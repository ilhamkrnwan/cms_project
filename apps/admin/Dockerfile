FROM oven/bun:1 AS builder
WORKDIR /app

# Install dependencies
COPY package.json ./
COPY packages/types/package.json ./packages/types/
COPY apps/admin/package.json ./apps/admin/
RUN bun install

# Copy source
COPY packages/types ./packages/types
COPY apps/admin ./apps/admin

WORKDIR /app/apps/admin
RUN bun run build

# Nginx Stage for serving static frontend
FROM nginx:alpine AS runner
COPY --from=builder /app/apps/admin/.output/public /usr/share/nginx/html
COPY apps/admin/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
