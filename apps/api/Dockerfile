FROM oven/bun:1 AS base
WORKDIR /app

# Install dependencies
FROM base AS installer
COPY package.json ./
COPY packages/types/package.json ./packages/types/
COPY apps/api/package.json ./apps/api/
RUN bun install

# Copy source files
COPY packages/types ./packages/types
COPY apps/api ./apps/api

# Expose API port
EXPOSE 3000

ENV NODE_ENV=production
ENV PORT=3000

WORKDIR /app/apps/api
CMD ["bun", "run", "src/index.ts"]
