import { NextResponse } from "next/server";
import { getPrismaClient } from "@/lib/prisma-safe";

export async function GET() {
  try {
    const prisma = getPrismaClient();
    const items = await prisma.maintenanceRequest.findMany({
      include: { asset: true, requestedBy: { select: { id: true, name: true, email: true } }, technician: { select: { id: true, name: true } } },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, data: items });
  } catch (e) {
    return NextResponse.json({ success: false, message: String(e) }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const prisma = getPrismaClient();
    const body = await req.json();
    const { assetId, requestedById, priority, issue, technicianId } = body;
    const item = await prisma.maintenanceRequest.create({
      data: { assetId, requestedById, priority: priority ?? "MEDIUM", issue, technicianId: technicianId ?? undefined },
    });
    return NextResponse.json({ success: true, data: item });
  } catch (e) {
    return NextResponse.json({ success: false, message: String(e) }, { status: 500 });
  }
}

