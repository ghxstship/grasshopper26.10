import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Create Prisma client with error handling
function createPrismaClient() {
  if (!process.env.DATABASE_URL) {
    console.warn('DATABASE_URL is not set - database features will be unavailable');
    // Return a proxy that throws helpful errors
    return new Proxy({} as PrismaClient, {
      get: () => {
        throw new Error('Database is not configured - DATABASE_URL environment variable is missing');
      }
    });
  }

  try {
    return new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    });
  } catch (error) {
    console.error('Failed to initialize Prisma Client:', error);
    throw error;
  }
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
