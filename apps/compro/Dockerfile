FROM oven/bun:1 AS builder
WORKDIR /app

# Install dependencies
COPY package.json ./
COPY packages/types/package.json ./packages/types/
COPY packages/sdk/package.json ./packages/sdk/
COPY apps/compro/package.json ./apps/compro/
RUN bun install

# Copy source
COPY packages/types ./packages/types
COPY packages/sdk ./packages/sdk
COPY apps/compro ./apps/compro

WORKDIR /app/apps/compro
RUN bun run build

# Nginx Stage for serving static frontend Astro Company Profile
FROM nginx:alpine AS runner
COPY --from=builder /app/apps/compro/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
