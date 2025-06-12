import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Get the pathname
  const path = request.nextUrl.pathname;

  // Define public paths that don't require authentication
  const publicPaths = ["/", "/forgot-password", "/contact-admin"];
  const isPublicPath = publicPaths.includes(path);

  // Check if the user is authenticated
  const token = request.cookies.get("auth_token")?.value || "";
  const isAuthenticated = !!token;

  // Redirect authenticated users away from public paths
  if (isAuthenticated && isPublicPath) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Redirect unauthenticated users away from protected paths
  if (!isAuthenticated && !isPublicPath) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

// Configure the middleware to run on specific paths
// export const config = {
//   matcher: ["/", "/dashboard/:path*", "/forgot-password", "/contact-admin"],
// };
