import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

const ADMIN_LOGIN = "/admin/login";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Hanya apply ke route /admin/*
  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  // Skip: login page & API routes
  if (pathname === ADMIN_LOGIN || pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  // Cek cookie token
  const token = request.cookies.get("rahmart_token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL(ADMIN_LOGIN, request.url));
  }

  // Verifikasi token
  const payload = await verifyToken(token);

  if (!payload) {
    // Token invalid/expired → hapus cookie, redirect ke login
    const response = NextResponse.redirect(new URL(ADMIN_LOGIN, request.url));
    response.cookies.set({
      name: "rahmart_token",
      value: "",
      maxAge: 0,
      path: "/",
    });
    return response;
  }

  // Token valid → lanjut
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-user-id", payload.userId);
  requestHeaders.set("x-user-email", payload.email);
  requestHeaders.set("x-user-role", payload.role);

  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
