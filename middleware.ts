import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const path = request.nextUrl.pathname;

  if (path.startsWith("/admin") && token.role !== "Admin") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (
    path.startsWith("/ortak") &&
    token.role !== "Ortak" &&
    token.role !== "Admin"
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (
    path.startsWith("/isci") &&
    token.role !== "İşçi" &&
    token.role !== "Admin"
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
    "/admin/seasons",
  ],
};
