import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";
import { env } from "@/config/env";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { filename, contentBase64, assetId, type } = body as { filename: string; contentBase64: string; assetId?: string; type?: string };
    if (!filename || !contentBase64) {
      return NextResponse.json({ success: false, message: "Invalid upload" }, { status: 400 });
    }

    const buffer = Buffer.from(contentBase64, "base64");
    const uploadsRoot = path.resolve(process.cwd(), env.UPLOAD_PATH);
    await fs.promises.mkdir(uploadsRoot, { recursive: true });
    const id = randomUUID();
    const ext = path.extname(filename);
    const outName = `${id}${ext}`;
    const outPath = path.join(uploadsRoot, outName);
    await fs.promises.writeFile(outPath, buffer);

    const url = `/uploads/${outName}`;

    return NextResponse.json({ success: true, data: { url, filename, type, assetId } });
  } catch (err) {
    return NextResponse.json({ success: false, message: "Upload failed" }, { status: 500 });
  }
}
