import { PrismaClient } from '../../prisma/generated/democlient';

// Use a single instance of Prisma Client in development
const globalForPrisma = global as unknown as { demoPrisma: PrismaClient };

export const demoPrisma =
  globalForPrisma.demoPrisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.demoPrisma = demoPrisma; 