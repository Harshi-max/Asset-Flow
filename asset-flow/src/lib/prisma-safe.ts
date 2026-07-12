import { PrismaClient } from "@prisma/client";

export function getPrismaClient() {
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query"] : [],
  });
}

export function hasModel(prisma: PrismaClient, modelName: string) {
  return Boolean((prisma as any)[modelName]);
}
