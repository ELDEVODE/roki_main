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

  // If on the login page and already authenticated, redirect to app
  if (url.pathname === "/app/login") {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL("/app", url.origin));
    }
  }

  // If trying to access app routes without authentication, redirect to login
  if (
    url.pathname.startsWith("/app") &&
    !url.pathname.startsWith("/app/login")
  ) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL("/app/login", url.origin));
    }
  }

  return NextResponse.next();
}

// Configure the middleware to only run on app routes and login
export const config = {
  matcher: ["/app/:path*", "/login"],
};