# ================================
# Stage 1: Dependencies
# ================================
FROM node:20-alpine AS deps

# Install pnpm globally
RUN npm install -g pnpm

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install all dependencies (including devDependencies for build)
RUN pnpm install --frozen-lockfile

# ================================
# Stage 2: Builder
# ================================
FROM node:20-alpine AS builder

RUN npm install -g pnpm

WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY package.json pnpm-lock.yaml ./

# Copy prisma schema, config, and generate client
COPY prisma ./prisma/
COPY prisma.config.ts ./
RUN DATABASE_URL="mongodb://placeholder:27017/placeholder" pnpm prisma generate

# Copy source code
COPY . .

# Build the application
RUN pnpm build

# ================================
# Stage 3: Development
# ================================
FROM node:20-alpine AS development

RUN npm install -g pnpm

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install all dependencies
RUN pnpm install --frozen-lockfile

# Copy prisma schema and config
COPY prisma ./prisma/
COPY prisma.config.ts ./

# Generate Prisma Client (dummy DATABASE_URL for build, actual URL provided at runtime)
RUN DATABASE_URL="mongodb://placeholder:27017/placeholder" pnpm prisma generate

# Copy all source files
COPY . .

# Expose application port
EXPOSE 3000

# Expose debug port (optional, for VS Code debugging)
EXPOSE 9229

# Start in development mode with hot reload and debugging enabled
# Note: MongoDB doesn't use migrations, so we skip prisma migrate deploy
CMD ["pnpm", "run", "start:debug"]

# ================================
# Stage 4: Production
# ================================
FROM node:20-alpine AS production

# Set NODE_ENV
ENV NODE_ENV=production

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nestjs

WORKDIR /app

# Install pnpm for prisma commands
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install production dependencies only
RUN pnpm install --frozen-lockfile --prod

# Copy prisma schema, config, and generate client
COPY prisma ./prisma/
COPY prisma.config.ts ./
RUN DATABASE_URL="mongodb://placeholder:27017/placeholder" pnpm prisma generate

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist

# Create uploads directory with proper permissions
RUN mkdir -p uploads && chown -R nestjs:nodejs uploads

# Change ownership of app directory
RUN chown -R nestjs:nodejs /app

# Switch to non-root user
USER nestjs

# Expose application port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

# Start the application
# Note: MongoDB doesn't use migrations, so we skip prisma migrate deploy
CMD ["node", "dist/main"]