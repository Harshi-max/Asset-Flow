import { NextResponse } from "next/server";
import { getPrismaClient } from "@/lib/prisma-safe";
import { verifyToken } from "@/lib/auth";

export async function GET(request: Request) {
  const tokenFromHeader = request.headers.get("authorization")?.split(" ")[1];
  const cookieHeader = request.headers.get("cookie") ?? "";
  const cookieMatch = cookieHeader.split(";").map(s => s.trim()).find(s => s.startsWith("auth_token="));
  const tokenFromCookie = cookieMatch ? cookieMatch.split("=").slice(1).join("=") : undefined;
  const token = tokenFromHeader ?? tokenFromCookie;
  if (!token) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

  try {
    const payload = await verifyToken(token);
    const prisma = getPrismaClient();
    const user = await prisma.user.findUnique({ where: { id: String(payload.sub) }, include: { department: true } });
    if (!user) return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: { id: user.id, email: user.email, name: user.name, role: user.role } });
  } catch (e) {
    return NextResponse.json({ success: false, message: "Invalid token" }, { status: 401 });
  }
}
