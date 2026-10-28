import { NextResponse } from "next/server";
import checkUserLogin from "./lib/checkUserLogin";
import checkAdminLogin from "./lib/checkAdminLogin";

export async function proxy(request) {
  const url = request.nextUrl.pathname;

  // Public routes jinko check nahi karna
  if (
    url === "/login" ||
    url === "/admin-login" ||
    url.startsWith("/api") ||
    url.startsWith("/_next") ||
    url.startsWith("/favicon")
  ) {
    return NextResponse.next();
  }

  // Admin routes
  if (url.startsWith("/admin")) {
    const admin = await checkAdminLogin();

    if (!admin) {
      return NextResponse.redirect(new URL("/admin-login", request.url));
    }
  }
  // User routes - sab "/" se start hote hain
  else {
    const user = await checkUserLogin();
    if (!user && url !== "/register") {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/:path*", "/wallet/:path*", "/profile/:path*", "/admin/:path*"],
};
