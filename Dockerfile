# Use a multi-stage build to keep the final image slim and secure

# Stage 1: Build the application
FROM node:22-alpine AS builder

# Set the working directory
WORKDIR /app

COPY package.json ./
COPY client ./client/
COPY frontend ./frontend/
COPY backend ./backend/

RUN corepack enable && corepack prepare pnpm@9.7.0 --activate && pnpm install --frozen-lockfile


RUN pnpm run build --  --prod

RUN pnpm prune --production

RUN corepack disable pnpm && \
    rm -rf /usr/local/share/.cache /root/.npm /root/.pnpm-store

# Stage 2: Create the final slim image
FROM node:22-alpine

ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

WORKDIR /app
VOLUME [ "/logs" ]

COPY --from=builder /app/package.json .
COPY --from=builder /app/backend/node_modules ./node_modules
COPY --from=builder /app/backend/dist ./dist

RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

EXPOSE 3000

CMD ["node", "dist/main.js"]