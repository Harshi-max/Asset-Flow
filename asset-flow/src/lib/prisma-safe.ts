import { PrismaClient } from "@prisma/client";

export function getPrismaClient() {
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query"] : [],
  });
}
