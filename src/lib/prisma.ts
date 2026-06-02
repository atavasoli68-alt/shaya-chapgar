// @ts-ignore — Prisma types are generated after `npm install` (postinstall: prisma generate)
import pkg from '@prisma/client';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const { PrismaClient } = pkg as any;

declare global {
  // eslint-disable-next-line no-var
  var __prisma: any;
}

const prisma =
  globalThis.__prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalThis.__prisma = prisma;

export { prisma };
export default prisma;
