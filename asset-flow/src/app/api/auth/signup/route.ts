import { NextResponse } from "next/server";
import { hashPassword, signToken } from "@/lib/auth";
import { getPrismaClient } from "@/lib/prisma-safe";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, name, role = "EMPLOYEE" } = body as {
      email: string;
      password: string;
      name?: string;
      role?: string;
    };

    if (!email || !password) {
      return NextResponse.json({ success: false, message: "Email and password are required" }, { status: 400 });
    }

    const missingEnv = [] as string[];
    if (!process.env.DATABASE_URL) missingEnv.push("DATABASE_URL");
    if (!process.env.JWT_SECRET) missingEnv.push("JWT_SECRET");

    if (missingEnv.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: `Signup failed: missing server environment variables (${missingEnv.join(", ")}). Add them in Vercel project settings.`,
        },
        { status: 500 }
      );
    }

    const prisma = getPrismaClient();
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ success: false, message: "User already exists" }, { status: 409 });
    }

    const hashed = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        email,
        name,
        passwordHash: hashed,
        role,
      },
    });

    const token = await signToken({ sub: user.id, role: user.role });
    const response = NextResponse.json({ success: true, data: { id: user.id, email: user.email, role: user.role } });
    response.cookies.set("auth_token", token, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production" });
    return response;
  } catch (error) {
    console.error("Signup error:", error);
    const detail = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, message: `Signup failed: ${detail}` }, { status: 500 });
  }
}
