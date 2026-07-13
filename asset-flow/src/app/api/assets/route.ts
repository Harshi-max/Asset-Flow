import { NextResponse } from "next/server";
import { getPrismaClient } from "@/lib/prisma-safe";
import { assetCreateSchema } from "@/validations/asset";
import { env } from "@/config/env";
import fs from "fs";
import path from "path";

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
    const contentType = request.headers.get('content-type') || '';
    let parsedBody: any = null;

    if (contentType.includes('multipart/form-data')) {
      const form = await request.formData();
      const toObj: any = {};
      for (const [key, value] of form.entries()) {
        if (key === 'documents') continue; // handle separately
        // collect single values; convert booleans/numbers where sensible
        const val = value as any;
        const s = typeof val === 'string' ? val : String(val?.name ?? val);
        toObj[key] = s;
      }
      // convert purchaseCost to number if present
      if (toObj.purchaseCost) toObj.purchaseCost = Number(toObj.purchaseCost);
      if (toObj.sharedResource) toObj.sharedResource = toObj.sharedResource === 'true' || toObj.sharedResource === true;
      parsedBody = assetCreateSchema.parse(toObj);
      // create asset first
      const created = await prisma.asset.create({ data: parsedBody });
      // handle documents
      const files = form.getAll('documents') as File[];
      if (files && files.length) {
        const uploadDir = path.resolve(process.cwd(), env.UPLOAD_PATH);
        if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
        for (const f of files) {
          try {
            const arrayBuffer = await (f as any).arrayBuffer();
            const buf = Buffer.from(arrayBuffer);
            const filename = `${Date.now()}-${(f as any).name}`.replace(/[^a-zA-Z0-9.\-_%]/g, '_');
            const dest = path.join(uploadDir, filename);
            fs.writeFileSync(dest, buf);
            const url = `/uploads/${filename}`;
            await prisma.assetDocument.create({ data: { assetId: created.id, name: (f as any).name, url, type: (f as any).type ?? 'application/octet-stream' } });
          } catch (e) {
            // continue on file errors
            console.error('file save error', e);
          }
        }
      }

      await prisma.activityLog.create({ data: { action: `Asset Created: ${created.name} (${created.tag})` } });
      await prisma.notification.create({ data: { message: `New asset added: ${created.name}` } });
      return NextResponse.json({ success: true, data: created });
    }

    // fallback: JSON body
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
