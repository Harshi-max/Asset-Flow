import { NextResponse } from "next/server";
import { getPrismaClient } from "@/lib/prisma-safe";
import { verifyToken } from "@/lib/auth";
import { isAdmin, canApproveAssets, canApproveBookings, canCompleteMaintenance, canManageEmployees, canManageOrganizations } from "@/lib/rbac";

export async function POST(request: Request) {
  const prisma = getPrismaClient();
  try {
    // auth: accept Bearer token or cookie `auth_token`
    const tokenFromHeader = request.headers.get("authorization")?.split(" ")[1];
    const cookieHeader = request.headers.get("cookie") ?? "";
    const cookieMatch = cookieHeader.split(";").map(s => s.trim()).find(s => s.startsWith("auth_token="));
    const tokenFromCookie = cookieMatch ? cookieMatch.split("=").slice(1).join("=") : undefined;
    const token = tokenFromHeader ?? tokenFromCookie;
    if (!token) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const userPayload = await verifyToken(token).catch(() => null as any);
    if (!userPayload) return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });

    const body = await request.json();
    const { action, id, payload: bodyPayload } = body as { action: string; id?: string; payload?: any };

    let result: any = null;
    let message = "";

    switch (action) {
      case "approveEmployee": {
        if (!id) throw new Error("Missing id");
        if (!canManageEmployees(userPayload.role)) throw new Error("Not authorized");
        result = await prisma.user.update({ where: { id }, data: { isActive: true } });
        message = `Employee ${result.name ?? result.email} approved`;
        await prisma.activityLog.create({ data: { action: `Admin approved employee: ${result.id}` } });
        break;
      }
      case "changeRole": {
        if (!id || !payload?.role) throw new Error("Missing id or role");
        if (!canManageEmployees(userPayload.role)) throw new Error("Not authorized");
        result = await prisma.user.update({ where: { id }, data: { role: bodyPayload.role } });
        message = `Role for ${result.name ?? result.email} changed to ${bodyPayload.role}`;
        await prisma.activityLog.create({ data: { action: `Admin changed role: ${result.id} -> ${bodyPayload.role}` } });
        break;
      }
      case "removeEmployee": {
        if (!id) throw new Error("Missing id");
        if (!canManageEmployees(userPayload.role)) throw new Error("Not authorized");
        const u = await prisma.user.findUnique({ where: { id } });
        result = await prisma.user.delete({ where: { id } });
        message = `Employee ${u?.name ?? u?.email} removed`;
        await prisma.activityLog.create({ data: { action: `Admin removed employee: ${id}` } });
        break;
      }
      case "approveBooking": {
        if (!id) throw new Error("Missing id");
        if (!canApproveBookings(userPayload.role)) throw new Error("Not authorized");
        result = await prisma.booking.update({ where: { id }, data: { status: "APPROVED" } });
        message = `Booking ${result.title} approved`;
        await prisma.activityLog.create({ data: { action: `Approved booking: ${id} by ${userPayload.sub}` } });
        break;
      }
      case "approveAsset": {
        if (!id) throw new Error("Missing id");
        if (!canApproveAssets(userPayload.role)) throw new Error("Not authorized");
        result = await prisma.asset.update({ where: { id }, data: { status: "ACTIVE" } });
        message = `Asset ${result.name} approved`;
        await prisma.activityLog.create({ data: { action: `Approved asset: ${id} by ${userPayload.sub}` } });
        break;
      }
      case "changeAssetStatus": {
        if (!id) throw new Error("Missing id");
        const newStatus = bodyPayload?.status;
        if (!newStatus) throw new Error("Missing status");
        if (!canApproveAssets(userPayload.role)) throw new Error("Not authorized");
        // Validate allowed statuses to avoid Prisma enum errors
        const allowed = new Set(['ACTIVE','ALLOCATED','MAINTENANCE','RESERVED','LOST','RETIRED']);
        if (!allowed.has(newStatus)) throw new Error("Invalid status");
        result = await prisma.asset.update({ where: { id }, data: { status: newStatus } });
        await prisma.assetHistory.create({ data: { assetId: id, action: 'status_change', details: `status -> ${newStatus}` } });
        message = `Asset ${result.name} status changed to ${newStatus}`;
        await prisma.activityLog.create({ data: { action: `Asset status changed: ${id} -> ${newStatus} by ${userPayload.sub}` } });
        break;
      }
      case "completeMaintenance": {
        if (!id) throw new Error("Missing id");
        if (!canCompleteMaintenance(userPayload.role)) throw new Error("Not authorized");
        result = await prisma.maintenanceRequest.update({ where: { id }, data: { status: "COMPLETED", approvalStatus: "APPROVED", resolutionNotes: bodyPayload?.notes ?? null } });
        message = `Maintenance request for asset ${result.assetId} marked completed`;
        await prisma.activityLog.create({ data: { action: `Completed maintenance: ${id} by ${userPayload.sub}` } });
        break;
      }
      case "approveOrganization": {
        if (!id) throw new Error("Missing id");
        if (!canManageOrganizations(userPayload.role)) throw new Error("Not authorized");
        result = await prisma.department.update({ where: { id }, data: { active: true } });
        message = `Organization ${result.name} approved`;
        await prisma.activityLog.create({ data: { action: `Approved organization: ${id} by ${userPayload.sub}` } });
        break;
      }
      case "removeOrganization": {
        if (!id) throw new Error("Missing id");
        if (!canManageOrganizations(userPayload.role)) throw new Error("Not authorized");
        const org = await prisma.department.findUnique({ where: { id } });
        result = await prisma.department.update({ where: { id }, data: { active: false } });
        message = `Organization ${org?.name ?? id} deactivated`;
        await prisma.activityLog.create({ data: { action: `Deactivated organization: ${id} by ${userPayload.sub}` } });
        break;
      }
      default:
        throw new Error("Unknown action");
    }

    // Create a notification for the change
    try {
      await prisma.notification.create({ data: { message } });
    } catch (_) {
      // ignore notification errors
    }

    return NextResponse.json({ success: true, data: result, message });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err?.message ?? String(err) }, { status: 400 });
  }
}
