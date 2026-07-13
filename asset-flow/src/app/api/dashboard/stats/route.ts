import { NextResponse } from "next/server";
import { getPrismaClient } from "@/lib/prisma-safe";

export async function GET() {
  const prisma = getPrismaClient();

  try {
    const totalAssets = await prisma.asset.count();
    
    // Status counts based on common conventions
    const available = await prisma.asset.count({ where: { status: "ACTIVE" } });
    const allocated = await prisma.asset.count({ where: { status: "ALLOCATED" } });
    const maintenance = await prisma.asset.count({ where: { status: "MAINTENANCE" } });
    const reserved = await prisma.asset.count({ where: { status: "RESERVED" } });
    
    // Lost / Retired
    const lostRetired = await prisma.asset.count({ 
      where: { 
        status: { in: ["LOST", "RETIRED"] } 
      } 
    });

    // Additional Enterprise Metrics
    const totalEmployees = await prisma.user.count();
    const activeEmployees = await prisma.user.count({ where: { isActive: true } });
    const departments = await prisma.department.count();
    const categories = await prisma.assetCategory.count();
    
    // Today's Bookings (assuming today means startAt >= start of day and <= end of day)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const todaysBookings = await prisma.booking.count({
      where: {
        startAt: { gte: today, lt: tomorrow }
      }
    });

    const pendingMaintenance = await prisma.maintenanceRequest.count({
      where: { status: "REQUESTED" }
    });

    return NextResponse.json({
      success: true,
      data: {
        totalAssets,
        available,
        allocated,
        maintenance,
        reserved,
        lostRetired,
        // New Metrics
        totalEmployees,
        activeEmployees,
        departments,
        categories,
        todaysBookings,
        pendingMaintenance,
      }
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Failed to fetch stats" }, { status: 500 });
  }
}
