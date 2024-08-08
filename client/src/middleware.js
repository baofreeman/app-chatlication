import { NextResponse } from "next/server";

const authPaths = ["/account/register", "/account/login"];

// This function can be marked `async` if using `await` inside
export async function middleware(request) {
  try {
    const isAuthenticated = request.cookies.get("is_auth")?.value;
    const path = request.nextUrl.pathname;
    if (isAuthenticated) {
      if (authPaths.includes(path)) {
        return NextResponse.redirect(new URL("/user/profile", request.url));
      }
    }
    if (!isAuthenticated && !authPaths.includes(path)) {
      return NextResponse.redirect(new URL("/account/login", request.url));
    }
    return NextResponse.next();
  } catch (error) {
    console.error("Error occurred while checking authentication:", error);
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/user/:path*", "/account/login", "/account/register"],
};
