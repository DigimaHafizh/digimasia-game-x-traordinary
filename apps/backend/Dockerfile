# Stage 1: Build
FROM node:20-alpine AS builder
# Install openssl for Prisma
RUN apk add --no-cache openssl
WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Build step now includes prisma generate via package.json
RUN npm run build

# Stage 2: Production
FROM node:20-alpine AS production
RUN apk add --no-cache openssl
WORKDIR /app

ENV NODE_ENV=production

# Copy package files and install prod deps only
COPY package*.json ./
RUN npm ci --omit=dev

# Copy generated prisma files (standard location)
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY prisma ./prisma
COPY dist ./dist

EXPOSE 3001

CMD ["node", "dist/main"]
