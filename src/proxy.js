import { NextResponse } from "next/server";
import checkUserLogin from "./lib/checkUserLogin";

export async function proxy(request) {
  const url = request.nextUrl.pathname;
  const user = await checkUserLogin();
  if (url.startsWith("/") && !user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  // return NextResponse.next();
}

export const config = {
  matcher: "/",
};
