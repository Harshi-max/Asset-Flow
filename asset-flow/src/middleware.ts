import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

const publicRoutes = ["/", "/login", "/signup", "/forgot-password", "/api/health"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (publicRoutes.some((route) => pathname === route || pathname.startsWith("/api/health"))) {
    return NextResponse.next();
  }

  const token = request.cookies.get("auth_token")?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    verifyToken(token);
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
