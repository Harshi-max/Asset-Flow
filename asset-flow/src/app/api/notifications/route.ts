import { NextResponse } from "next/server";
import { getPrismaClient } from "@/lib/prisma-safe";

export async function GET() {
  const prisma = getPrismaClient();
  const items = await prisma.notification.findMany({ take: 50, orderBy: { createdAt: "desc" } });
  return NextResponse.json({
    success: true,
    data: items,
    unreadCount: items.filter((item: { read: boolean }) => !item.read).length,
  });
}

export async function PATCH(request: Request) {
  const prisma = getPrismaClient();
  try {
    let body: any = {};
    try { body = await request.json(); } catch (e) { body = {}; }

    if (body && body.id) {
      const updated = await prisma.notification.update({ where: { id: body.id }, data: { read: true } });
      return NextResponse.json({ success: true, data: updated });
    }

    const result = await prisma.notification.updateMany({ where: { read: false }, data: { read: true } });
    return NextResponse.json({ success: true, count: result.count });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err?.message ?? String(err) }, { status: 500 });
  }
}
