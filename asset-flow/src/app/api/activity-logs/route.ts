import { NextResponse } from "next/server";
import { getPrismaClient } from "@/lib/prisma-safe";

export async function GET() {
  const prisma = getPrismaClient();

  try {
    const logs = await prisma.activityLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    return NextResponse.json({
      success: true,
      data: logs
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to fetch activity logs" }, { status: 500 });
  }
}
