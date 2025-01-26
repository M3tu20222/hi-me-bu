import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const path = request.nextUrl.pathname;

  // Redirect to dashboard if trying to access login/register while authenticated
  if (token && (path === "/login" || path === "/register")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Require authentication for protected routes
  if (!token && path !== "/login" && path !== "/register" && path !== "/") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Role-based access control
  if (path.startsWith("/admin") && token?.role !== "Admin") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (
    path.startsWith("/ortak") &&
    token?.role !== "Ortak" &&
    token?.role !== "Admin"
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (
    path.startsWith("/isci") &&
    token?.role !== "İşçi" &&
    token?.role !== "Admin"
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/register",
    "/dashboard/:path*",
    "/admin/:path*",
    "/ortak/:path*",
    "/isci/:path*",
    "/seasons/:path*",
  ],
};
