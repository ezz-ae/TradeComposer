
# Web container
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* pnpm-lock.yaml* ./
RUN corepack enable && (pnpm -v || true) && npm i -g pnpm && pnpm --version

FROM node:20-alpine AS build
WORKDIR /app
COPY . .
RUN npm i -g pnpm && pnpm install && pnpm --filter web build || npm run build --workspaces=false || true

FROM node:20-alpine AS run
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app .
EXPOSE 3000
CMD ["npm","run","dev"]
