import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { getPrismaClient } from "@/lib/prisma-safe";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  if (!token) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const prisma = getPrismaClient();
    const payload = verifyToken(token);
    const user = await prisma.user.findUnique({ where: { id: payload.sub } });
    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: { user: { id: user.id, email: user.email, role: user.role } } });
  } catch {
    return NextResponse.json({ success: false, message: "Invalid token" }, { status: 401 });
  }
}
