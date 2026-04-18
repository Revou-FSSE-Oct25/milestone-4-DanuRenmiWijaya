FROM node:22-slim

# Tambahkan OpenSSL (untuk memperbaiki prisma:warn libssl)
RUN apt-get update -y && apt-get install -y openssl

RUN npm install -g pnpm

WORKDIR /app

# Salin package files
COPY package.json pnpm-lock.yaml ./

# Salin seluruh folder prisma (PENTING)
COPY prisma ./prisma/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Salin seluruh kode (termasuk src)
COPY . .

# Generate Prisma
RUN npx prisma generate

RUN pnpm run build

EXPOSE 3000

CMD ["node", "dist/main"]