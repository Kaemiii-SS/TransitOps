import { prisma } from "../config/prisma.js";


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