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
    // Validate dates
    const startMs = Date.parse(parsed.startAt);
    const endMs = Date.parse(parsed.endAt);
    if (isNaN(startMs) || isNaN(endMs)) return NextResponse.json({ success: false, message: "Invalid startAt or endAt date" }, { status: 400 });
    if (startMs >= endMs) return NextResponse.json({ success: false, message: "startAt must be before endAt" }, { status: 400 });

    const startDate = new Date(startMs);
    const endDate = new Date(endMs);

    // basic overlap check
    const overlap = await prisma.booking.findFirst({ where: {
      resourceType: parsed.resourceType,
      resourceId: parsed.resourceId ?? undefined,
      AND: [
        { startAt: { lt: endDate } },
        { endAt: { gt: startDate } }
      ]
    } });

    if (overlap) return NextResponse.json({ success: false, message: "Resource already booked for the requested time" }, { status: 409 });

    // Validate organizer exists if provided
    if (parsed.organizerId) {
      const org = await prisma.user.findUnique({ where: { id: parsed.organizerId } });
      if (!org) return NextResponse.json({ success: false, message: "Organizer not found" }, { status: 400 });
    }

    // If resourceType is an asset, validate asset exists
    if (parsed.resourceId && /asset/i.test(parsed.resourceType)) {
      const asset = await prisma.asset.findUnique({ where: { id: parsed.resourceId } });
      if (!asset) return NextResponse.json({ success: false, message: "Resource asset not found" }, { status: 400 });
    }

    const created = await prisma.booking.create({ data: {
      title: parsed.title,
      resourceType: parsed.resourceType,
      resourceId: parsed.resourceId ?? undefined,
      startAt: startDate,
      endAt: endDate,
      organizerId: parsed.organizerId ?? undefined,
    } });

    // Log activity and notify
    await prisma.activityLog.create({ data: { action: `Booking Created: ${created.title}` } });
    await prisma.notification.create({ data: { message: `Booking request created: ${created.title}` } });

    return NextResponse.json({ success: true, data: created });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err?.message ?? "Invalid data" }, { status: 400 });
  }
}
