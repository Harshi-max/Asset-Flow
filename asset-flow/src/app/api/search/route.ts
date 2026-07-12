import { NextResponse } from "next/server";
import { getPrismaClient } from "@/lib/prisma-safe";

export async function GET(request: Request) {
  const prisma = getPrismaClient();
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim();

  if (!query) {
    return NextResponse.json({ success: true, data: { assets: [], employees: [], bookings: [], departments: [], maintenance: [], audit: [] } });
  }

  const [assets, employees, bookings, departments, maintenance, audit] = await Promise.all([
    prisma.asset.findMany({ take: 5, where: { OR: [{ name: { contains: query } }, { tag: { contains: query } }] }, orderBy: { createdAt: "desc" } }),
    prisma.user.findMany({ take: 5, where: { OR: [{ name: { contains: query } }, { email: { contains: query } }] }, orderBy: { createdAt: "desc" } }),
    prisma.booking.findMany({ take: 5, where: { title: { contains: query } }, orderBy: { startAt: "asc" } }),
    prisma.department.findMany({ take: 5, where: { name: { contains: query } }, orderBy: { createdAt: "desc" } }),
    prisma.maintenance.findMany({ take: 5, where: { title: { contains: query } }, orderBy: { createdAt: "desc" } }),
    prisma.audit.findMany({ take: 5, where: { action: { contains: query } }, orderBy: { createdAt: "desc" } }),
  ]);

  return NextResponse.json({ success: true, data: { assets, employees, bookings, departments, maintenance, audit } });
}
