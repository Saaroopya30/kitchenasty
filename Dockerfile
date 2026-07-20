FROM mcr.microsoft.com/playwright:v1.58.2-jammy

WORKDIR /app

COPY package*.json ./
COPY packages/admin/package*.json packages/admin/
COPY packages/storefront/package*.json packages/storefront/
COPY packages/server/package*.json packages/server/
COPY packages/shared/package*.json packages/shared/

RUN npm ci

COPY . .

# Generate Prisma client now that the schema is available
RUN npx prisma generate --schema ./prisma/schema.prisma

CMD ["sh", "-c", "npx prisma migrate deploy --schema ./prisma/schema.prisma && npx playwright test"]