import { NextResponse } from "next/server";
import { getPrismaClient } from "@/lib/prisma-safe";

export async function GET() {
  const prisma = getPrismaClient();
  const departments = await prisma.department.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json({ success: true, data: departments });
}

export async function POST(request: Request) {
  const prisma = getPrismaClient();
  const body = await request.json();
  const department = await prisma.department.create({
    data: {
      name: body.name,
      headId: body.headId,
      parentId: body.parentId,
      active: body.active ?? true,
    },
  });
  return NextResponse.json({ success: true, data: department });
}
