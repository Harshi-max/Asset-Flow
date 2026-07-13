import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

const publicRoutes = ["/", "/login", "/signup", "/forgot-password", "/api/health", "/api/auth/login", "/api/auth/signup", "/screenshots"];

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (
    publicRoutes.some(
      (route) =>
        pathname === route ||
        pathname.startsWith(route + "/") ||
        pathname.startsWith("/api/health")
    )
  ) {
    return NextResponse.next();
  }

  const token = request.cookies.get("auth_token")?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    await verifyToken(token);
    return NextResponse.next();
  } catch (err) {
    console.error("Proxy token verification failed:", err);
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|_next/data|favicon.ico).*)"],
};
