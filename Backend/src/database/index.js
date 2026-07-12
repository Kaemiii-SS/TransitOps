import { prisma } from "../config/prisma.js";

/**
 * Database connection lifecycle helpers.
 *
 * These wrap Prisma's own connect/disconnect calls so the rest of the
 * app (server bootstrap, graceful shutdown handlers, health checks)
 * has one place to depend on rather than importing PrismaClient directly.
 * No query logic or business rules belong here.
 */

export async function connectDatabase() {
  await prisma.$connect();
}

export async function disconnectDatabase() {
  await prisma.$disconnect();
}

/**
 * Lightweight health check — confirms the database is reachable.
 * Intended for use in a future /health endpoint, not called here.
 */
export async function isDatabaseHealthy() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch {
    return false;
  }
}

export { prisma };