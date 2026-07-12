import { NextResponse } from "next/server";
import { getPrismaClient, hasModel } from "@/lib/prisma-safe";

export async function GET() {
  const prisma = getPrismaClient();
  const now = new Date();
  const startOfDay = new Date(now); startOfDay.setHours(0,0,0,0);
  const endOfDay = new Date(now); endOfDay.setHours(23,59,59,999);
  const futureCutoff = new Date(now); futureCutoff.setDate(now.getDate() + 7);

  const hasAllocationModel = hasModel(prisma, "allocation");
  const hasTransferModel = hasModel(prisma, "transferRequest");
  const hasBookingModel = hasModel(prisma, "booking");
  const hasAuditModel = hasModel(prisma, "audit");
  const hasActivityModel = hasModel(prisma, "activityLog");
  const hasCategoryModel = hasModel(prisma, "assetCategory");
  const hasDepartmentModel = hasModel(prisma, "department");

  const [assetsAvailable, assetsAllocated, assetsUnderMaintenance] = await Promise.all([
    prisma.asset.count({ where: { status: { in: ["ACTIVE", "AVAILABLE"] } } }),
    prisma.asset.count({ where: { status: "ALLOCATED" } }),
    prisma.asset.count({ where: { status: "MAINTENANCE" } }),
  ]);

  const pendingTransfers = hasTransferModel ? await prisma.transferRequest.count({ where: { status: "REQUESTED" } }) : 0;
  const upcomingReturns = hasAllocationModel ? await prisma.allocation.count({ where: { status: "ALLOCATED", expectedReturn: { lte: futureCutoff, gte: now } } }) : 0;
  const bookingsToday = hasBookingModel ? await prisma.booking.count({ where: { startAt: { lte: endOfDay }, endAt: { gte: startOfDay } } }) : 0;
  const auditSummary = hasAuditModel ? await prisma.audit.count() : 0;
  const recentActivities = hasActivityModel ? await prisma.activityLog.findMany({ take: 8, orderBy: { createdAt: "desc" } }) : [];
  const assetCategories = hasCategoryModel ? await prisma.assetCategory.findMany({ take: 6, include: { _count: { select: { assets: true } } } }) : [];
  const departmentAllocation = hasDepartmentModel ? await prisma.department.findMany({ take: 6, include: { _count: { select: { assets: true } } } }) : [];

  return NextResponse.json({
    success: true,
    data: {
      metrics: {
        assetsAvailable,
        assetsAllocated,
        assetsUnderMaintenance,
        pendingTransfers,
        upcomingReturns,
        bookingsToday,
        auditSummary,
      },
      recentActivities,
      assetCategories,
      departmentAllocation,
    },
  });
}
