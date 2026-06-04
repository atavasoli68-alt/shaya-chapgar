// @ts-ignore — Prisma types are generated after `prisma generate`
import pkg from '@prisma/client';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const { PrismaClient } = pkg as any;

const globalForPrisma = globalThis as unknown as { __prisma: any };

export const prisma: any =
  globalForPrisma.__prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    datasources: process.env.DATABASE_URL
      ? { db: { url: process.env.DATABASE_URL } }
      : undefined,
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.__prisma = prisma;
}

export default prisma;
