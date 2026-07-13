import { NextResponse } from "next/server";
import { getPrismaClient } from "@/lib/prisma-safe";
import { assetCreateSchema } from "@/validations/asset";

export async function GET(request: Request) {
  const prisma = getPrismaClient();
  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get("page") ?? 1);
  const perPage = Number(searchParams.get("perPage") ?? 10);
  const search = searchParams.get("search") ?? "";
  const sort = searchParams.get("sort") ?? "createdAt";
  const direction = (searchParams.get("dir") ?? "desc") as "asc" | "desc";

  const where: any = search ? { OR: [{ name: { contains: search, mode: "insensitive" } }, { tag: { contains: search, mode: "insensitive" } }, { serialNumber: { contains: search, mode: "insensitive" } }] } : {};

  const total = await prisma.asset.count({ where });
  const items = await prisma.asset.findMany({
    where,
    orderBy: { [sort]: direction },
    skip: (page - 1) * perPage,
    take: perPage,
    include: { category: true, department: true },
  });

  return NextResponse.json({ success: true, data: items, meta: { page, perPage, total } });
}

export async function POST(request: Request) {
  const prisma = getPrismaClient();
  try {
    const body = await request.json();
    const parsed = assetCreateSchema.parse(body);
    // Validate foreign keys if present
    if (parsed.categoryId) {
      const cat = await prisma.assetCategory.findUnique({ where: { id: parsed.categoryId } });
      if (!cat) return NextResponse.json({ success: false, message: "Category not found" }, { status: 400 });
    }
    if (parsed.departmentId) {
      const dept = await prisma.department.findUnique({ where: { id: parsed.departmentId } });
      if (!dept) return NextResponse.json({ success: false, message: "Department not found" }, { status: 400 });
    }

    const created = await prisma.asset.create({ data: parsed });
    await prisma.activityLog.create({ data: { action: `Asset Created: ${created.name} (${created.tag})` } });
    await prisma.notification.create({ data: { message: `New asset added: ${created.name}` } });

    return NextResponse.json({ success: true, data: created });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error?.message ?? "Invalid data" }, { status: 400 });
  }
}
