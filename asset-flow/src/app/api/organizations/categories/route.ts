import { NextResponse } from "next/server";
import { getPrismaClient } from "@/lib/prisma-safe";

export async function GET() {
  const prisma = getPrismaClient();
  const categories = await prisma.assetCategory.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json({ success: true, data: categories });
}

export async function POST(request: Request) {
  const prisma = getPrismaClient();
  const body = await request.json();
  const category = await prisma.assetCategory.create({
    data: {
      name: body.name,
      description: body.description,
      dynamicFields: body.dynamicFields ?? [],
      active: body.active ?? true,
    },
  });
  return NextResponse.json({ success: true, data: category });
}
