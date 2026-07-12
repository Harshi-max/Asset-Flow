import { NextResponse } from "next/server";
import { getPrismaClient } from "@/lib/prisma-safe";

export async function GET() {
  const prisma = getPrismaClient();
  const items = await prisma.notification.findMany({ take: 10, orderBy: { createdAt: "desc" } });
  return NextResponse.json({ success: true, data: items, unreadCount: items.filter((item) => !item.read).length });
}

export async function PATCH() {
  const prisma = getPrismaClient();
  await prisma.notification.updateMany({ where: { read: false }, data: { read: true } });
  return NextResponse.json({ success: true });
}
