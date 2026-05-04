# Build stage
FROM node:20-alpine AS builder
WORKDIR /app

# Copy monorepo
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY lib ./lib
COPY artifacts/fazenda-brasil ./artifacts/fazenda-brasil

# Install dependencies
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# Build fazenda-brasil
WORKDIR /app/artifacts/fazenda-brasil
RUN PORT=3000 BASE_PATH=/ pnpm build

# Production stage
FROM node:20-alpine
WORKDIR /app

# Install simple HTTP server
RUN npm install -g serve

# Copy built assets from builder
COPY --from=builder /app/artifacts/fazenda-brasil/dist/public ./dist

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:3000/ || exit 1

# Start server serving production build
CMD ["serve", "-s", "dist", "-l", "3000"]
