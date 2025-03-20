import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

/**
 * Singleton Prisma client instance for database access.
 * Reuses the existing Prisma instance if available in development to avoid multiple connections.
 */
export const prisma = globalForPrisma.prisma || new PrismaClient();

// In development, attach prisma to the global object to prevent multiple instances
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
