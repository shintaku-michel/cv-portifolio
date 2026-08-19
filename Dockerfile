# syntax=docker/dockerfile:1

FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:22-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Runtime: só o output do Nitro (.output é self-contained, já inclui as
# dependências de produção resolvidas — não precisa de node_modules nem
# do código-fonte aqui).
FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=8080
ENV HOST=0.0.0.0
RUN addgroup -S nodejs && adduser -S nuxt -G nodejs
COPY --from=build --chown=nuxt:nodejs /app/.output ./.output
USER nuxt
EXPOSE 8080
CMD ["node", ".output/server/index.mjs"]
