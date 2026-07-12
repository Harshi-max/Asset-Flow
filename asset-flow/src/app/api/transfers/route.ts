import { NextResponse } from "next/server";
import { getPrismaClient } from "@/lib/prisma-safe";
import { transferRequestSchema } from "@/validations/allocation";

export async function POST(request: Request) {
  const prisma = getPrismaClient();
  try {
    const body = await request.json();
    const parsed = transferRequestSchema.parse(body);
    const created = await prisma.transferRequest.create({ data: { assetId: parsed.assetId, toDeptId: parsed.toDeptId } });
    return NextResponse.json({ success: true, data: created });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err?.message ?? "Invalid data" }, { status: 400 });
  }
}

export async function GET(request: Request) {
  const prisma = getPrismaClient();
  const items = await prisma.transferRequest.findMany({ include: { asset: true, requestedBy: true } });
  return NextResponse.json({ success: true, data: items });
}
