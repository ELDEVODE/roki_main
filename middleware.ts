import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const hostname = request.headers.get("host") || "";
  const isProduction = process.env.NODE_ENV === "production";

  // Define domains based on environment
  const domain = isProduction
    ? process.env.NEXT_PUBLIC_DOMAIN || "yourdomain.com"
    : "localhost:3000";
  const appDomain = isProduction ? `app.${domain}` : "app.localhost:3001";

  // Only redirect /login path from root domain to app subdomain
  if (hostname === domain || hostname === `localhost:3000`) {
    if (url.pathname === "/login") {
      return NextResponse.redirect(new URL("/login", `https://${appDomain}`));
    }
    return NextResponse.next();
  }

  // Handle subdomain routing for app subdomain
  if (hostname === appDomain) {
    return NextResponse.rewrite(new URL(`/app${url.pathname}`, request.url));
  }

  // Continue with the default behavior
  return NextResponse.next();
}

// Configure the middleware
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
