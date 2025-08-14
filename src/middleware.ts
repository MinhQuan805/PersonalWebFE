import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = ["/admin", "/admin/articles", "/admin/users", "/admin/products"];
const publicRoutes = ['/admin/auth/login'];

export function middleware(request: NextRequest) {
  const token = request.cookies.get("accessToken")?.value;
  const pathname = request.nextUrl.pathname;

  if (publicRoutes.some((path) => pathname === path)) {
    return NextResponse.next();
  }
  if (protectedRoutes.some((path) => request.nextUrl.pathname.startsWith(path))) {
    if (!token) {
      return NextResponse.redirect(new URL("/admin/auth/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
