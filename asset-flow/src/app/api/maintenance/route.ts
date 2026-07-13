import { NextResponse } from "next/server";
import { getPrismaClient } from "@/lib/prisma-safe";
import { verifyToken } from "@/lib/auth";

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

    // Determine requester from token if not provided
    const tokenFromHeader = req.headers.get("authorization")?.split(" ")[1];
    const cookieHeader = req.headers.get("cookie") ?? "";
    const cookieMatch = cookieHeader.split(";").map(s => s.trim()).find(s => s.startsWith("auth_token="));
    const tokenFromCookie = cookieMatch ? cookieMatch.split("=").slice(1).join("=") : undefined;
    const token = tokenFromHeader ?? tokenFromCookie;
    let requesterId = requestedById;
    if (!requesterId && token) {
      const payload = await verifyToken(token).catch(() => null as any);
      if (payload?.sub) requesterId = String(payload.sub);
    }

    // Validate asset exists: allow passing either id or tag/serial
    if (!assetId) return NextResponse.json({ success: false, message: "assetId is required" }, { status: 400 });

    let asset = await prisma.asset.findUnique({ where: { id: assetId } });
    if (!asset) {
      // try tag or serialNumber fallback
      asset = await prisma.asset.findFirst({ where: { OR: [{ tag: assetId }, { serialNumber: assetId }] } });
    }
    if (!asset) return NextResponse.json({ success: false, message: "Asset not found" }, { status: 400 });

    if (!requesterId) return NextResponse.json({ success: false, message: "requestedById is required" }, { status: 400 });
    const user = await prisma.user.findUnique({ where: { id: requesterId } });
    if (!user) return NextResponse.json({ success: false, message: "Requesting user not found" }, { status: 400 });

    const item = await prisma.maintenanceRequest.create({
      data: { assetId: asset.id, requestedById: requesterId, priority: priority ?? "MEDIUM", issue, technicianId: technicianId ?? undefined },
    });

    await prisma.activityLog.create({ data: { action: `Maintenance Requested: ${issue} (asset ${asset.tag ?? asset.id})` } });
    await prisma.notification.create({ data: { message: `New maintenance request: ${issue}` } });
    return NextResponse.json({ success: true, data: item });
  } catch (e) {
    return NextResponse.json({ success: false, message: String(e) }, { status: 500 });
  }
}

