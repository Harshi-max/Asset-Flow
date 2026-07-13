import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import path from "path";

let cachedPrisma: PrismaClient | null = null;

export function getPrismaClient() {
  if (cachedPrisma) return cachedPrisma;
  
  const dbUrl = process.env.DATABASE_URL || "file:./dev.db";
  const dbPath = dbUrl.startsWith("file:") ? dbUrl.slice(5) : dbUrl;
  const absolutePath = path.resolve(process.cwd(), dbPath);
  const fileUrl = "file:" + absolutePath;
  
  const adapter = new PrismaBetterSqlite3({ url: fileUrl });
  
  cachedPrisma = new PrismaClient({
    adapter,
  });
  return cachedPrisma;
}

export function hasModel(prisma: PrismaClient, modelName: string) {
  return Boolean((prisma as any)[modelName]);
}
