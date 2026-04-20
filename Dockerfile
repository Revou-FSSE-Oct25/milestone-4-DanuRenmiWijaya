FROM node:22-slim

# Tambahkan OpenSSL
RUN apt-get update -y && apt-get install -y openssl

RUN npm install -g pnpm

WORKDIR /app

# Salin package files
COPY package.json pnpm-lock.yaml ./

# Salin seluruh folder prisma
COPY prisma ./prisma/

# Install dependencies (termasuk devDependencies agar nest build bisa jalan)
RUN pnpm install

# Salin seluruh kode
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build NestJS (menghasilkan folder dist)
RUN pnpm run build

EXPOSE 3000

# Tambahkan .js untuk memastikan node menemukan filenya
CMD ["node", "dist/src/main.js"]
