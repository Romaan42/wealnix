import { NextResponse } from "next/server";

import checkAdminLogin from "./lib/checkAdminLogin";
import checkUserLogin from "./lib/checkUserLogin";

export async function proxy(request) {
  const url = request.nextUrl.pathname;

  const user = await checkUserLogin();
  const admin = await checkAdminLogin();

  if (url.startsWith("/") && !user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (!admin && url.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/admin-login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/dashboard/:path*",
    "/wallet/:path*",
    "/profile/:path*",
    "/admin/:path*",
  ],
};
