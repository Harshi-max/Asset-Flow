import { NextResponse } from "next/server";
import { getPrismaClient } from "@/lib/prisma-safe";
import { assetUpdateSchema } from "@/validations/asset";

export async function GET(request: Request, { params }: any) {
  const prisma = getPrismaClient();
  const { id } = await params;
  const asset = await prisma.asset.findUnique({ where: { id }, include: { documents: true, history: true, category: true, department: true } });
  if (!asset) return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
  return NextResponse.json({ success: true, data: asset });
}

export async function PUT(request: Request, { params }: any) {
  const prisma = getPrismaClient();
  const { id } = await params;
  try {
    const body = await request.json();
    const parsed = assetUpdateSchema.parse(body);
    const updated = await prisma.asset.update({ where: { id }, data: parsed });
    return NextResponse.json({ success: true, data: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err?.message ?? "Update failed" }, { status: 400 });
  }
}

export async function DELETE(request: Request, { params }: any) {
  const prisma = getPrismaClient();
  const { id } = await params;
  await prisma.asset.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
