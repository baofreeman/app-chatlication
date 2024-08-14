import { NextRequest, NextResponse } from "next/server";

const authPaths = ["/login", "/register"];

export async function middleware(request: NextRequest) {
  try {
    const isAuthenticated = request.cookies.get("is_auth")?.value;
    const path = request.nextUrl.pathname;
    if (isAuthenticated) {
      if (authPaths.includes(path)) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    }
    if (!isAuthenticated && !authPaths.includes(path)) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next();
  } catch (error) {
    console.error("Error occurred while checking authentication:", error);
  }
}

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
