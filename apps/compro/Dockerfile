FROM oven/bun:1 AS builder
WORKDIR /app
ENV PATH="/app/node_modules/.bin:${PATH}"

COPY package.json bun.lock* ./
COPY packages ./packages
COPY apps/compro ./apps/compro

RUN bun install

WORKDIR /app/apps/compro
RUN bun run build

# Nginx Stage for serving static frontend Astro Company Profile
FROM nginx:alpine AS runner
COPY --from=builder /app/apps/compro/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]


