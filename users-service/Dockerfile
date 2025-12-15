# Build stage
FROM node:20-alpine AS builder

# Instalar OpenSSL y dependencias necesarias para Prisma
RUN apk add --no-cache openssl libc6-compat

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma/ ./prisma/

# Install dependencies
RUN npm ci

# Generate Prisma Client
RUN npx prisma generate

# Copy ALL source code including test.js
COPY . .

# Production stage
FROM node:20-alpine

# Instalar OpenSSL en la imagen de producción también
RUN apk add --no-cache openssl libc6-compat

WORKDIR /app

# Copy from builder - ahora test.js estará incluido
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/src ./src
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/test.js ./test.js

# Create logs directory
RUN mkdir -p logs

# Set environment
ENV NODE_ENV=production

# Expose port
EXPOSE 3002

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s \
  CMD node -e "require('http').get('http://localhost:3002/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start application with test
#CMD ["node", "test.js"]
CMD ["node", "src/server.js"]