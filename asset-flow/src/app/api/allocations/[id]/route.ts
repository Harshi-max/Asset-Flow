import { NextResponse } from "next/server";
import { getPrismaClient } from "@/lib/prisma-safe";

export async function GET(request: Request, { params }: any) {
  const prisma = getPrismaClient();
  const { id } = await params;
  const item = await prisma.allocation.findUnique({ where: { id }, include: { asset: true, holder: true, department: true, history: true } });
  if (!item) return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
  return NextResponse.json({ success: true, data: item });
}

export async function PUT(request: Request, { params }: any) {
  const prisma = getPrismaClient();
  const { id } = await params;
  const body = await request.json();
  // allow return
  if (body.action === "RETURN") {
    const updated = await prisma.allocation.update({ where: { id }, data: { status: "RETURNED", returnedAt: new Date(), updatedAt: new Date() } });
    await prisma.allocationHistory.create({ data: { allocationId: id, action: "RETURNED", notes: body.notes ?? null } });
    await prisma.asset.update({ where: { id: updated.assetId }, data: { status: "ACTIVE" } });
    return NextResponse.json({ success: true, data: updated });
  }

  // general update
  const updated = await prisma.allocation.update({ where: { id }, data: body });
  return NextResponse.json({ success: true, data: updated });
}

export async function DELETE(request: Request, { params }: any) {
  const prisma = getPrismaClient();
  const { id } = await params;
  await prisma.allocationHistory.deleteMany({ where: { allocationId: id } });
  await prisma.allocation.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
