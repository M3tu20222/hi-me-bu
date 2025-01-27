import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const path = request.nextUrl.pathname;

  // Public paths
  if (path === "/login" || path === "/register") {
    if (token) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

  // Protected paths
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Role-based access control
  const role = token.role as string;
  if (
    (path.startsWith("/admin") && role !== "Admin") ||
    (path.startsWith("/ortak") && role !== "Ortak" && role !== "Admin") ||
    (path.startsWith("/isci") &&
      role !== "İşçi" &&
      role !== "Admin" &&
      role !== "Ortak")
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/ortak/:path*",
    "/isci/:path*",
    "/seasons/:path*",
    "/login",
    "/register",
  ],
};
