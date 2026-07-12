import { NextResponse } from "next/server";
import { signToken, verifyPassword } from "@/lib/auth";
import { getPrismaClient } from "@/lib/prisma-safe";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body as { email: string; password: string };

    if (!email || !password) {
      return NextResponse.json({ success: false, message: "Email and password are required" }, { status: 400 });
    }

    const prisma = getPrismaClient();
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.passwordHash || !(await verifyPassword(password, user.passwordHash))) {
      return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 });
    }

    const token = signToken({ sub: user.id, role: user.role });
    const response = NextResponse.json({ success: true, data: { user: { id: user.id, email: user.email, role: user.role } } });
    response.cookies.set("auth_token", token, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production" });
    return response;
  } catch (error) {
    return NextResponse.json({ success: false, message: "Login failed" }, { status: 500 });
  }
}
