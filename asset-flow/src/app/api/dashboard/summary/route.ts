import { NextResponse } from "next/server";
import { getPrismaClient } from "@/lib/prisma-safe";

export async function GET() {
  const prisma = getPrismaClient();
  const now = new Date();
  const startOfDay = new Date(now); startOfDay.setHours(0,0,0,0);
  const endOfDay = new Date(now); endOfDay.setHours(23,59,59,999);
  const futureCutoff = new Date(now); futureCutoff.setDate(now.getDate() + 7);

  const [
    assetsAvailable,
    assetsAllocated,
    assetsUnderMaintenance,
    pendingTransfers,
    upcomingReturns,
    bookingsToday,
    auditSummary,
    recentActivities,
    assetCategories,
    departmentAllocation,
  ] = await Promise.all([
    prisma.asset.count({ where: { status: { in: ["ACTIVE", "AVAILABLE"] } } }),
    prisma.asset.count({ where: { status: "ALLOCATED" } }),
    prisma.asset.count({ where: { status: "MAINTENANCE" } }),
    prisma.transferRequest.count({ where: { status: "REQUESTED" } }),
    prisma.allocation.count({ where: { status: "ALLOCATED", expectedReturn: { lte: futureCutoff, gte: now } } }),
    prisma.booking.count({ where: { startAt: { lte: endOfDay }, endAt: { gte: startOfDay } } }),
    prisma.audit.count(),
    prisma.activityLog.findMany({ take: 8, orderBy: { createdAt: "desc" } }),
    prisma.assetCategory.findMany({ take: 6, include: { _count: { select: { assets: true } } } }),
    prisma.department.findMany({ take: 6, include: { _count: { select: { assets: true } } } }),
  ]);

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
