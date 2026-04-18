# Gunakan Node.js 22 yang didukung Prisma terbaru
FROM node:22-slim

# Install pnpm secara global
RUN npm install -g pnpm

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy seluruh source code
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build project NestJS
RUN pnpm run build

# Ekspos port (Railway akan mengisi variabel PORT)
EXPOSE 3000

# Jalankan aplikasi
CMD ["node", "dist/main"]
