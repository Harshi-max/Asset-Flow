import { NextResponse } from "next/server";
import { getPrismaClient } from "@/lib/prisma-safe";
import { bookingCreateSchema } from "@/validations/booking";

export async function GET(request: Request) {
  const prisma = getPrismaClient();
  const { searchParams } = new URL(request.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const where: any = {};
  if (from || to) {
    where.AND = [];
    if (from) where.AND.push({ endAt: { gte: new Date(from) } });
    if (to) where.AND.push({ startAt: { lte: new Date(to) } });
  }

  const items = await prisma.booking.findMany({ where, include: { organizer: true }, orderBy: { startAt: 'asc' } });
  return NextResponse.json({ success: true, data: items });
}

export async function POST(request: Request) {
  const prisma = getPrismaClient();
  try {
    const body = await request.json();
    const parsed = bookingCreateSchema.parse(body);

    // basic overlap check
    const overlap = await prisma.booking.findFirst({ where: {
      resourceType: parsed.resourceType,
      resourceId: parsed.resourceId ?? undefined,
      AND: [
        { startAt: { lt: new Date(parsed.endAt) } },
        { endAt: { gt: new Date(parsed.startAt) } }
      ]
    } });

    if (overlap) return NextResponse.json({ success: false, message: "Resource already booked for the requested time" }, { status: 409 });

    const created = await prisma.booking.create({ data: {
      title: parsed.title,
      resourceType: parsed.resourceType,
      resourceId: parsed.resourceId ?? undefined,
      startAt: new Date(parsed.startAt),
      endAt: new Date(parsed.endAt),
      organizerId: parsed.organizerId ?? undefined,
    } });

    return NextResponse.json({ success: true, data: created });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err?.message ?? "Invalid data" }, { status: 400 });
  }
}
