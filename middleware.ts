import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const hostname = request.headers.get("host") || "";
  const isProduction = process.env.NODE_ENV === "production";

  // In production, extract domain from hostname
  if (isProduction) {
    // Remove port if present and get the base domain
    const domain = hostname.split(':')[0].split('.').slice(-2).join('.');
    const appDomain = `app.${domain}`;

    // Only redirect /login path from root domain to app subdomain
    if (hostname === domain) {
      if (url.pathname === "/login") {
        return NextResponse.redirect(new URL("/login", `https://${appDomain}`));
      }
      return NextResponse.next();
    }

    // Handle subdomain routing for app subdomain
    if (hostname === appDomain) {
      return NextResponse.rewrite(new URL(`/app${url.pathname}`, request.url));
    }
  } else {
    // In local development, use path-based routing on localhost:3000
    if (hostname === "localhost:3000") {
      if (url.pathname === "/login") {
        return NextResponse.redirect(new URL("/app/login", url));
      }
      if (!url.pathname.startsWith("/app")) {
        return NextResponse.next();
      }
    }
  }

  // Continue with the default behavior
  return NextResponse.next();
}

// Configure the middleware
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
