import { NextResponse } from "next/server";
import { getPrismaClient } from "@/lib/prisma-safe";
import { allocationCreateSchema } from "@/validations/allocation";

export async function GET(request: Request) {
  const prisma = getPrismaClient();
  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get("page") ?? 1);
  const perPage = Number(searchParams.get("perPage") ?? 10);

  const total = await prisma.allocation.count();
  const items = await prisma.allocation.findMany({
    skip: (page - 1) * perPage,
    take: perPage,
    include: { asset: true, holder: true, department: true, history: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ success: true, data: items, meta: { page, perPage, total } });
}

export async function POST(request: Request) {
  const prisma = getPrismaClient();
  try {
    const body = await request.json();
    const parsed = allocationCreateSchema.parse(body);
    const created = await prisma.allocation.create({
      data: {
        assetId: parsed.assetId,
        holderId: parsed.holderId,
        departmentId: parsed.departmentId,
        expectedReturn: parsed.expectedReturn ? new Date(parsed.expectedReturn) : undefined,
      },
    });

    // write history
    await prisma.allocationHistory.create({ data: { allocationId: created.id, action: "ALLOCATED", notes: "Allocated via API" } });

    // update asset status
    await prisma.asset.update({ where: { id: parsed.assetId }, data: { status: "ALLOCATED" } });

    return NextResponse.json({ success: true, data: created });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err?.message ?? "Invalid data" }, { status: 400 });
  }
}
