# ======================
# Base
# ======================
FROM node:20-alpine AS base
WORKDIR /app

# ======================
# Dependencies
# ======================
FROM base AS deps
COPY package.json package-lock.json* ./
RUN npm ci

# ======================
# Builder
# ======================
FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
ENV DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dbname"

RUN npx prisma generate
RUN npm run build

# ======================
# Runner
# ======================
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Install OpenSSL (Required for Prisma)
RUN apk add --no-cache openssl

RUN addgroup -g 1001 -S nodejs \
 && adduser -S nextjs -u 1001

# Next standalone output
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Prisma (ESSENCIAL)
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules

USER nextjs
EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate deploy && node server.js"]
