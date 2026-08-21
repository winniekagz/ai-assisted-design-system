FROM node:20-alpine AS deps
WORKDIR /app
RUN apk add --no-cache openssl

COPY package.json package-lock.json ./
COPY apps/api/package.json apps/api/package.json
COPY apps/docs/package.json apps/docs/package.json
COPY apps/ai-features/package.json apps/ai-features/package.json
COPY packages/ai/package.json packages/ai/package.json
COPY packages/design-system/package.json packages/design-system/package.json
COPY packages/shared-types/package.json packages/shared-types/package.json
RUN npm ci --workspace=@winniekagendo/componentiq-api --include-workspace-root

FROM node:20-alpine AS build
WORKDIR /app
RUN apk add --no-cache openssl

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/api/node_modules ./apps/api/node_modules
COPY package.json package-lock.json ./
COPY apps/api ./apps/api
COPY packages/shared-types ./packages/shared-types

WORKDIR /app/packages/shared-types
RUN npm run build:lib

WORKDIR /app/apps/api
RUN npx prisma generate
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN apk add --no-cache openssl

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/apps/api ./apps/api
COPY --from=build /app/packages/shared-types ./packages/shared-types

WORKDIR /app/apps/api
EXPOSE 4000
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/apps/api/src/main.js"]
