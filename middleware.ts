import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const url = request.nextUrl;

  const hostname = request.headers.get("host") || "";

  // Check for Privy authentication token in cookies
  const privyToken = request.cookies.get("privy-token");
  const isAuthenticated = !!privyToken;
  // console.log("Is authenticated:", isAuthenticated);

  console.log("Current hostname:", hostname);

  // Redirect /login to /app/login
  if (url.pathname === "/login") {
    return NextResponse.redirect(new URL("/app/login", url.origin));
  }

  // If on the login page and already authenticated, redirect to demo
  if (url.pathname === "/app/login") {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL("/demo", url.origin));
    }
  }

  // If trying to access app routes without authentication, redirect to login
  if (
    url.pathname.startsWith("/app") &&
    !url.pathname.startsWith("/app/login") &&
    !url.pathname.startsWith("/demo")
  ) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL("/app/login", url.origin));
    }
  }

  // For demo purposes, redirect root to demo
  // if (url.pathname === "/app") {
  //   return NextResponse.redirect(new URL("/demo", url.origin));
  // }

  return NextResponse.next();
}

// Configure the middleware to only run on specific routes
export const config = {
  matcher: ["/", "/app/:path*", "/login", "/demo"],
};