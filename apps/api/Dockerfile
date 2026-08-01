FROM oven/bun:1 AS base
WORKDIR /app

COPY package.json bun.lock* ./
COPY packages ./packages
COPY apps/api ./apps/api

RUN bun install

# Expose API port
EXPOSE 3000

ENV NODE_ENV=production
ENV PORT=3000

WORKDIR /app/apps/api
CMD ["bun", "run", "src/index.ts"]


