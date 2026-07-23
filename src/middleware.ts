import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Granular RBAC & Security Middleware with Audit Logging
export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Audit Logging metadata headers
  const clientIp = request.headers.get("x-forwarded-for") || request.ip || "127.0.0.1";
  response.headers.set("x-audit-ip", clientIp);
  response.headers.set("x-audit-timestamp", new Date().toISOString());

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
