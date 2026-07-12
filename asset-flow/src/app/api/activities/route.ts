import { NextResponse } from "next/server";
import { getPrismaClient } from "@/lib/prisma-safe";

export async function GET(request: Request) {
  const prisma = getPrismaClient();
  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get("page") ?? 1);
  const perPage = Number(searchParams.get("perPage") ?? 8);
  const filter = searchParams.get("filter") ?? "all";

  const where = filter === "all"
    ? {}
    : filter === "asset"
      ? { action: { contains: "asset", mode: "insensitive" } }
      : filter === "booking"
        ? { action: { contains: "booking", mode: "insensitive" } }
        : filter === "allocation"
          ? { action: { contains: "alloc", mode: "insensitive" } }
          : { action: { contains: filter, mode: "insensitive" } };

  const [items, total] = await Promise.all([
    prisma.activityLog.findMany({ where, skip: (page - 1) * perPage, take: perPage, orderBy: { createdAt: "desc" } }),
    prisma.activityLog.count({ where }),
  ]);

  return NextResponse.json({ success: true, data: items, meta: { page, perPage, total } });
}
