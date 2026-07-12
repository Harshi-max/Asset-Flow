import { NextResponse } from "next/server";
import { getPrismaClient } from "@/lib/prisma-safe";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const prisma = getPrismaClient();
  const page = Number(searchParams.get("page") ?? 1);
  const perPage = Number(searchParams.get("perPage") ?? 10);
  const search = searchParams.get("search") ?? "";

  const users = await prisma.user.findMany({
    where: {
      OR: [
        { name: { contains: search } },
        { email: { contains: search } },
      ],
    },
    skip: (page - 1) * perPage,
    take: perPage,
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ success: true, data: users, meta: { page, perPage } });
}
